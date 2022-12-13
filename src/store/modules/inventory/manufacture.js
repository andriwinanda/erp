const limit = 10
const state = {
  manufactureList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    showFilter: false,
    publish: "",
    limit: limit,
    search: ""
  },
}
const mutations = {
  addManufactureList(state, value) {
    state.manufactureList = value
  },
  incrementPage(state) {
    state.page++
    state.offset += state.filter.limit
  },
  decrementPage(state) {
    state.page--
    state.offset -= state.filter.limit
  },
  updateSku(state, value) {
    state.filter.sku = value
  },
  updateSearch(state, value) {
    state.filter.search = value
  },
  reset(state) {
    state.filter.branch = "",
    state.filter.city = null,
    state.publish =  "",
    state.limit =  limit,
    state.filter.search =  ""
  }
}
export default {
  strict: true,
  state,
  mutations,
  namespaced: true
}