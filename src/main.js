import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.http.options.root = 'http://127.0.0.1:8000/api'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
