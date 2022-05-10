import Vue from 'vue'
import Vuex from 'vuex'

import admin from './modules/admin'
import user from './modules/user'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    admin: admin,
    user: user,
    app: app,
  }
})
