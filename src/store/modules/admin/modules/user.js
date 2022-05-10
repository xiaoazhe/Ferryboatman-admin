export default {
  namespaced: true,
  state: {
    perms: [],
    // 用户信息
    info: {}
  },
  actions: {
    setPerms(state, perms){  // 用户权限标识集合
      console.log('2222222222222222222222222222222222222222222222222222222')
      state.perms = perms;
    },
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch('admin/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      }, { root: true })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch('admin/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
      }, { root: true })
    }
  }
}
