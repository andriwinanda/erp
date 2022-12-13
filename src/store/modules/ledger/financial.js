const limit = 10
const state = {
  ledgerList: {},
  page: 1,
  offset: 0,
  // Filter
  filter: {
    account: "",
    start: null,
    end: null,
    publish: "",
    limit: limit,
    search: "",
    showFilter: true
  },
  report: {
    reportList: {},
    from: "",
    to: "",
    currency: null,
    start: null,
    end: null,
  }
}
const mutations = {
  addLedgerList(state, value) {
    state.ledgerList = value
  },
  addReportList(state, value) {
    state.report.reportList = value
  },
  incrementPage(state) {
    state.page++
    state.offset += state.filter.limit
  },
  decrementPage(state) {
    state.page--
    state.offset -= state.filter.limit
  },
  updateAcc(state, value) {
    state.filter.account = value
  },
  updateStart(state, value) {
    state.filter.start = value
  },
  updateEnd(state, value) {
    state.filter.end = value
  },
  updateSearch(state, value) {
    state.filter.search = value
  },
  reportFrom(state, value) {
    state.report.from = value
  },
  reportTo(state, value) {
    state.report.to = value
  },
  reportCurrency(state, value) {
    state.report.currency = value
  },
  reportStart(state, value) {
    state.report.start = value
  },
  reportEnd(state, value) {
    state.report.end = value
  },
  reset(state) {
    state.filter.account = "",
      state.filter.start = null,
      state.filter.end = null,
      state.publish = "",
      state.limit = limit,
      state.filter.search = ""
  },
  filter(state) {
    state.page = 1,
      state.offset = 0
  },
  isFilterShow(state, value) {
    state.filter.showFilter = value
  }
}
export default {
  strict: true,
  state,
  mutations,
  namespaced: true
}