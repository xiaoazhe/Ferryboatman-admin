export default {
    state: {
        menuRouteLoaded:false    // 菜单和路由是否已经加载
    },
    getters: {
        collapse(state){// 对应着上面state
            return state.collapse
        }
    },
    mutations: {
        menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
            console.log('32222222222222')
            state.menuRouteLoaded = menuRouteLoaded;
        }
    }
}