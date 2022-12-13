const limit = 10
const state = {
  cashoutList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    showFilter: false,
    date: null,
    limit: limit,
    search: ""
  },
}
const mutations = {
  addCashoutList(state, value) {
    state.cashoutList = value
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
    state.filter.date = null,
    state.limit =  limit,
    state.filter.search =  ""
  },
  adddateList(state, value){
    state.dateList = value
  },
  updateDate(state, value) {
    state.filter.date = value
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