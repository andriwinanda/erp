const limit = 10
const state = {
  purchaseList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    showFilter: false,
    vendor: null,
    date: null,
    publish: "",
    limit: limit,
    search: ""
  },
}
const mutations = {
  addPurchaseList(state, value) {
    state.purchaseList = value
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
    state.filter.vendor = null,
    state.filter.date = null
    state.filter.search =  ""
  },
  updateVendor(state, value) {
    state.filter.vendor = value
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