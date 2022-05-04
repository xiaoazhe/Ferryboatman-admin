import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'
import util from '@/libs/util.js'
// 路由数据
import routes from './routes'
import { getIFramePath, getIFrameUrl } from '@/libs/iframe'
import { MENU_FIND_NAV_TREE } from '@/api/modules/menu.js'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      let userName = sessionStorage.getItem('user')
      addDynamicMenuAndRoutes(userName, to, from)
      next()
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName, to, from) {
  // 处理IFrame嵌套页面
  // handleIFrameUrl(to.path)
  // if(store.state.app.menuRouteLoaded) {
  //   // console.log('动态菜单和路由已经存在.')
  //   return
  // }
  MENU_FIND_NAV_TREE({ 'userName': userName })
    .then(res => {
      // 添加动态路由
      console.log(gitMenuList(res));
      console.log('res', res);
      let dynamicRoutes = addDynamicRoutes(res)
      // 处理静态组件绑定路由
      router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
      router.addRoutes(router.options.routes)
      // 保存加载状态
      // store.commit('menuRouteLoaded', true)
      // // 保存菜单树
      // store.commit('setNavTree', res.data)
      //  store.commit('d2admin/menu/asideSet', res)
      store.commit('d2admin/menu/asideSet', gitMenuList(res))

      console.log('4')
    }).then(res => {
      api.user.findPermissions({ 'name': userName }).then(res => {
        // 保存用户权限标识集合
        store.commit('setPerms', res)
      })
    })
    .catch(function (res) {
    })
}

/**
 * 处理IFrame嵌套页面
 */
//  function handleIFrameUrl(path) {
//   // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
//   let url = path
//   let length = store.state.iframe.iframeUrls.length
//   for(let i=0; i<length; i++) {
//     let iframe = store.state.iframe.iframeUrls[i]
//     if(path != null && path.endsWith(iframe.path)) {
//       url = iframe.url
//       store.commit('setIFrameUrl', url)
//       break
//     }
//   }
// }

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].id,
          auth: true
        }
      }
      let path = getIFramePath(menuList[i].url)
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route['path'] = path
        //  route['component'] = resolve => require([`@/views/IFrame/IFrame`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = getIFrameUrl(menuList[i].url)
        let iFrameUrl = { 'path': path, 'url': url }
        //  store.commit('addIFrameUrl', iFrameUrl)
      } else {
        try {
          // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
          // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
          let array = menuList[i].url.split('/')
          let url = ''
          for (let i = 0; i < array.length; i++) {
            url += array[i].substring(0, 1).toUpperCase() + array[i].substring(1) + '/'
          }
          url = url.substring(0, url.length - 1)

          route['component'] = resolve => require([`@/views/${url}`], resolve)
        } catch (e) { }
      }

      // this.$router.addRoutes(routes)
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
    console.log(routes)
    console.log('动态路由加载完成.')
  }
  return routes
}

function gitMenuList(newMenu, targetMenu = []) {
  if (!newMenu) return
  newMenu.forEach((v, i) => {
    const obj = {
      path: v.url,
      title: v.name,
    }
    if (v.icon) obj.icon = v.icon
    if (Object.values(v.children).length > 0) obj.children = gitMenuList(v.children)
    targetMenu.push(obj)
  })
  return targetMenu
}