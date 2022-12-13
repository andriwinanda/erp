const limit = 10
const state = {
  journalList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    date: null,
    code: null,
    no: null,
    publish: "",
    limit: limit,
    search: "",
    showFilter: false
  },
}
const mutations = {
  addJournalList(state, value) {
    state.journalList = value
  },
  incrementPage(state) {
    state.page++
    state.offset += state.filter.limit
  },
  decrementPage(state) {
    state.page--
    state.offset -= state.filter.limit
  },
  updateCode(state, value) {
    state.filter.code = value
  },
  updateDate(state, value) {
    state.filter.date = value
  },
  updateNo(state, value) {
    state.filter.no = value
  },
  updateSearch(state, value) {
    state.filter.search = value
  },
  reset(state) {
    this.filter.date = null,
    this.filter.code = null,
    this.filter.no = null,
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