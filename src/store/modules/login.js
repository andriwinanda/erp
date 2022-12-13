import { getBaseUrl, setBaseUrl, removeBaseUrl, setCompany, getCompany, removeCompany, setToken, getToken, removeToken, getDataUser, setDataUser, removeDataUser, getDataMenu, setDataMenu, removeDataMenu } from '@/localstorage-helper'
import myAxios from '@/axiosBackend';

const LOGIN = "LOGIN"
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGOUT = "LOGOUT"
const POST_TOKEN = "POST_TOKEN"
const TOKEN_VERIFIED = "TOKEN_VERIFIED"
const RESET = "RESET"

const state = {
  hasBaseUrl: !!(getBaseUrl()),
  isLoggedIn: !!(getToken()),
  menu: null,
  dataMenu: getDataMenu() || null,
  dataUser: getDataUser() || null,
  company: getCompany() || null
}

const mutations = {
  [LOGIN](state) {
    state.pending = true
  },
  [LOGIN_SUCCESS](state) {
    state.isLoggedIn = true
    state.pending = false
  },
  [LOGOUT](state) {
    state.isLoggedIn = false
  },
  [POST_TOKEN](state) {
    state.pending = true
  },
  [TOKEN_VERIFIED](state) {
    state.pending = false
    state.hasBaseUrl = true
  },
  [RESET](state) {
    state.hasBaseUrl = false
    state.isLoggedIn = false
  },
  setDataMenu(state, dataMenu) {
    state.dataMenu = dataMenu
    state.dataMenu.push('global_configuration', 'web_admin', 'component_manager', 'role', 'history')
    setDataMenu(JSON.stringify(state.dataMenu))
  },
  setCompanyName(state, name) {
    state.company = name
    setCompany(name)
  }
}
const actions = {
  getUrl({ commit }, url) {
    commit(POST_TOKEN) // show spinner
    setBaseUrl(url)
    commit(TOKEN_VERIFIED)
  },
  reset({ commit, state }) {
    removeBaseUrl()
    removeToken()
    removeDataUser()
    removeCompany()
    removeDataMenu()
    state.dataMenu = null
    state.dataUser = null
    commit(RESET)
  },
  login({ commit, state }, DATA_LOGIN) {
    commit(LOGIN) // show spinner
    state.dataUser = DATA_LOGIN.dataUser
    setToken(DATA_LOGIN.token)
    setDataUser(JSON.stringify(DATA_LOGIN.dataUser))
    commit(LOGIN_SUCCESS)
  },
  logout({ commit, state }) {
    removeToken()
    removeDataUser()
    removeDataMenu()
    removeCompany()
    state.dataMenu = null
    state.dataUser = null
    commit(LOGOUT)
    delete myAxios.defaults.headers['X-Auth-Token']


  },
  getMenuFromAjax({ commit }) {
    myAxios.get(`/adminmenu/get_child`)
      .then(res => {
        let ajaxMenu = res.data.content
        commit("setDataMenu", ajaxMenu.map(el => el.modul))
      })
      .catch(err => {
        console.log(err)
      });
  }
}

export default {
  namespaced: true,
  strict: true,
  state,
  mutations,
  actions
}