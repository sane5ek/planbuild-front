import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import NotFound from './not-found'
import Home from '@/components/Home'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import Requests from '@/components/Interaction/Requests'
import Search from '@/components/Interaction/Search'
import Cells from '@/components/Settings/Cells'
import User from '@/components/Settings/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      component: Home,
      name: 'home'
    },
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
    {
      path: '/register',
      component: Register,
      name: 'register'
    },
    {
      path: '/requests',
      component: Requests,
      name: 'requests',
      beforeEnter: AuthGuard
    },
    {
      path: '/search',
      component: Search,
      name: 'search',
      beforeEnter: AuthGuard
    },
    {
      path: '/cells',
      component: Cells,
      name: 'cells',
      beforeEnter: AuthGuard
    },
    {
      path: '/user',
      component: User,
      name: 'user',
      beforeEnter: AuthGuard
    },
    {
      path: '*',
      beforeEnter: NotFound
    }
  ],
  mode: 'history'
})
