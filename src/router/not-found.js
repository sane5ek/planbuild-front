import store from '../store'
import router from './index'

export default function (to, from, next) {
  store.dispatch('setError', 'Страница не найдена')
  router.push('/')
}
