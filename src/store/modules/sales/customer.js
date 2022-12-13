const limit = 10
const state = {
  customerList: [],
  cityList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    showFilter: false,
    city: null,
    publish: null,
    limit: limit,
    search: ""
  },
}
const mutations = {
  addCustomerList(state, value) {
    state.customerList = value
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
    state.filter.city = null,
    state.filter.publish =  null,
    state.limit =  limit,
    state.filter.search =  ""
  },
  addCityList(state, value){
    state.cityList = value
  },
  updateCity(state, value) {
    state.filter.city = value
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