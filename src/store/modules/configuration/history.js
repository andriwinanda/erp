const limit = 10
const state = {
  historyList: [],
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
  addHistoryList(state, value) {
    state.historyList = value
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
}
export default {
  strict: true,
  state,
  mutations,
  namespaced: true
}