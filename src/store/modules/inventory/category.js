const limit = 10
const state = {
  categoryList: [],
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
  addCategoryList(state, value) {
    state.categoryList = value
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
  },
  filter(state) {
    state.page = 1,
    state.offset = 0
  },
}
export default {
  strict: true,
  state,
  mutations,
  namespaced: true
}