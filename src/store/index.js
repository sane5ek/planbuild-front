import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import plan from './plan'
import search from './search'
import request from './request'
import main from './main'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: [
    user, shared, plan, search, request, main
  ]
})
