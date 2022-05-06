import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import user from './modules/user'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    d2admin: d2admin,
    user: user,
    app: app,
  }
})
