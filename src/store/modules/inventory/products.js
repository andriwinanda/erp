const limit = 10
const state = {
  productList: [],
  page: 1,
  offset: 0,
  // Filter
  filter: {
    branch: "",
    category: "",
    brand: "2",
    color: "",
    type: "",
    size: "",
    publish: "",
    sku: "",
    limit: limit,
    search: ""
  },
}
const mutations = {
  addProductList(state, value) {
    state.productList = value
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
    state.filter.branch = "",
      state.filter.category = "",
      state.filter.brand = "2",
      state.filter.color = "",
      state.filter.size = "",
      state.filter.publish = "",
      state.filter.sku = "",
      state.filter.limit = limit
  },
  filter(state){
    state.page = 1,
    state.offset = 0
  }
}
export default {
  state,
  mutations,
  namespaced: true,
  strict: true
}