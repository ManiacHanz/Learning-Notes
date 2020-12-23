import Vue from 'vue'
import App from './App.vue'

import './style.less'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

// if (module.hot) {
// 	module.hot.accept('./main.js', function() {
// 		console.log('....hot replacement...')
// 	})
// }
