import Vue from 'vue'
import App from './App.vue'
// import VueRouter from 'vue-router'
import router from './router'
import MyRouter from '../myRoute'

// Vue.use(VueRouter)
Vue.use(MyRouter)

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
