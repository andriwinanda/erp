const limit = 10
const state = {
  colorList: [],
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
  addColorList(state, value) {
    state.colorList = value
  },
  incrementPage(state) {
    state.page++
    state.offset += state.filter.limit
  },
  decrementPage(state) {
    state.page--
    state.offset -= state.filter.limit
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
  isFilterShow(state, value){
    state.filter.showFilter = value
  }
}
export default {
  strict: true,
  state,
  mutations,
  namespaced: true
}