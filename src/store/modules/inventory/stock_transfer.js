const limit = 10
const state = {
  stockList: [],
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
  addStockList(state, value) {
    state.stockList = value
  },
  incrementPage(state) {
    state.page++
    state.offset += state.filter.limit
  },
  decrementPage(state) {
    state.page--
    state.offset -= state.filter.limit
  },
  updateDate(state, value) {
    state.filter.date = value
  },
  updateSearch(state, value) {
    state.filter.search = value
  },
  reset(state) {
    state.filter.branch = ""
    state.filter.date = null
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