const limit = 10
const state = {
  accountList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    classification: null,
    publish: null,
    limit: limit,
    search: "",
    showFilter: false
  },
}
const mutations = {
  addAccountList(state, value) {
    state.accountList = value
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
    state.filter.classification = null,
    state.filter.publish =  null,
    state.limit =  limit,
    state.filter.search =  ""
  },
  updateClassification(state, value) {
    state.filter.classification = value
  },
  updatePublish(state, value) {
    state.filter.publish = value
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