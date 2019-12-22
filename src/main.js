import i18n from './locales'
import Vue from 'vue'
import App from './App.vue'

import './assets/fonticon/iconfont.css'

Vue.config.productionTip = false;


new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
