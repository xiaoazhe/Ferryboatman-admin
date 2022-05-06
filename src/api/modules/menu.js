import { request } from '@/api/service.js'

// 查找导航菜单树
export function MENU_FIND_NAV_TREE(params) {
  // 接口请求
  return request({
    url: '/menu/findNavTree',
    method: 'get',
    params
  })
}
// 查找导航菜单树
export function FIND_MENU_TREE() {
  // 接口请求
  return request({
    url: '/menu/findMenuTree',
    method: 'get'
  })
}
// 删除
export function MENU_DELETE(data) {
  // 接口请求
  return request({
    url: '/menu/delete',
    method: 'post',
    data
  })
}
 // 保存
export function MENU_SAVE(data) {
  // 接口请求
  return request({
    url: '/menu/save',
    method: 'post',
    data
  })
}

