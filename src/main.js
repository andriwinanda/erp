// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/style.scss'
import Buefy from 'buefy'
import moment from 'moment'
import axios from 'axios'
import myAxios from './axiosBackend.js'
import store from './store/store'
import numeric from "@/components/Numeric";


Vue.use(Buefy)
// Agar bisa menggunakan this.axios di dalam components
Object.defineProperties(Vue.prototype, {
  // Custom header axios
  axios: {
    get() { return myAxios }
  },
  // External Api Without Base Url & Default Header
  exApi: {
    get() { return axios }
  },
  moment: {
    get() { return moment }
  }
})

Vue.config.productionTip = false
Vue.component('numeric' ,numeric)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
