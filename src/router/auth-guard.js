import store from '../store'
import router from './index'

export default function (to, from, next) {
  if (store.getters.token) {
    next()
  } else {
    store.dispatch('setError', 'Войдите чтобы получить доступ к этой странице')
    router.push('/')
  }
}
