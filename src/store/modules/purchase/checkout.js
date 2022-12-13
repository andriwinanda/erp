const limit = 10
const state = {
  checkoutList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    showFilter: true,
    date: null,
    type: null,
    checkno:null,
    limit: limit,
    search: ""
  },
}
const mutations = {
  addCheckoutList(state, value) {
    state.checkoutList = value
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
    state.filter.date = null,
    state.filter.type = null,
    state.filter.checkno = null,
    state.search = ""
  },
  updateDate(state, value) {
    state.filter.date = value
  },
  updateCheckno(state, value) {
    state.filter.checkno = value
  },
  updateType(state, value) {
    state.filter.type = value
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