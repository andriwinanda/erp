import axios from 'axios'
import store from './store/store'
import router from './router'
import swal from 'sweetalert';
import { getToken, getBaseUrl } from './localstorage-helper'

let myAxios = axios.create();
let url = getBaseUrl()

if (getToken()) {
  myAxios.defaults.headers.common["X-Auth-Token"] = getToken();
}
if (url) {
  myAxios.defaults.baseURL = url
}

myAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error) {
    if (!error.response || error.response.status === 500) {
      swal("Connection Lost!", "Please check your network connection!", "warning");
    }
    else if (error.response.status === 401) {
      axios
        .get(getBaseUrl() + "/login/decode_token", {
          headers: {
            "X-Auth-Token": getToken()
          }
        }).then(() => {
          swal("Access Denied!", "You do not have permission for this action!", "warning");
        }).catch(err => {
          // console.log(token)
          // console.log(err.response.status)
          if (err.response.status === 401) {
            store.dispatch("login/logout")
            router.push('/login')
          }
        })

    }
  }
  return Promise.reject(error)
})

export default myAxios