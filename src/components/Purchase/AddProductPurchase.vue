<template>
  <div class="column is-12">
    <form @submit.prevent="loadFilter()">
      <b-field grouped group-multiline expanded>
        <b-field label="Manufacture">
          <b-select placeholder="Select a character" v-model="cmanufacture" expanded>
            <option
              v-for="manufacture in manufactureList"
              :value="manufacture.id.toLowerCase()"
              :key="manufacture.id.toLowerCase()"
            >{{manufacture.name.toUpperCase()}}</option>
          </b-select>
        </b-field>
        <b-field label="Branch">
          <b-select placeholder="Select a branch" v-model="branch" expanded>
            <option
              v-for="branch in branchList"
              :key="branch.id"
              :value="branch.code"
            >{{branch.name.toUpperCase()}}</option>
          </b-select>
        </b-field>
        <b-field label="Category">
          <b-select placeholder="Select a category" v-model="category" expanded>
            <option
              v-for="category in categoryList"
              :key="category.id"
              :value="category.id"
            >{{category.name.toUpperCase()}}</option>
          </b-select>
        </b-field>
      </b-field>
      <div class="buttons">
        <button class="button is-primary" @click.prevent="loadAsyncProductList()">Filter</button>
        <button class="button is-primary" @click.prevent="reset()">Reset</button>
      </div>
    </form>
    <br />
    <b-table :data="productList" :loading="loading" hoverable>
      <template slot="empty" v-if="!loading">
        <p class="has-text-grey has-text-centered" style="padding: 10px">No data available in table</p>
      </template>
      <template slot-scope="props">
        <b-table-column field="branch" label="Branch">{{ props.row.branch }}</b-table-column>
        <b-table-column field="category" label="Category">{{ props.row.category }}</b-table-column>
        <b-table-column field="sku" label="Sku">{{ props.row.sku }}</b-table-column>
        <b-table-column label="Name">{{ props.row.name }}</b-table-column>
        <b-table-column field="model" label="Model">{{ props.row.model }}</b-table-column>
        <b-table-column field="qty" label="Qty">{{ props.row.qty }}</b-table-column>

        <b-table-column label="Action" style="min-width:110px">
          <div class="buttons has-addons">
            <span class="button is-small is-primary" @click.prevent="select( props.row.sku)">Select</span>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cmanufacture: "",
      branch: "",
      category: "",
      productList: [],
      branchList: [],
      manufactureList: [],
      categoryList: [],
      loading: false
    };
  },
created() {
    this.loadBranch();
    this.loadCategory();
    this.loadManufacture();
  },
  methods: {
    loadAsyncProductList() {
      let bodyRequest = {
        cmanufacture: this.cmanufacture,
        category: this.category,
        brand: this.brand
      };
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/product/search", bodyRequest);
      } else {
        ajax = this.axios.post("/product", bodyRequest);
      }
      ajax
        .then(res => {
          let products = res.data.content.result
this.count = res.data.content.record;
          if (products) this.productList = products;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    select(sku) {
      this.$emit("selected", sku);
    },
    // Load Branch
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.branchList = [];
        let branch = res.data.content.result;
        branch.map(el => {
          this.branchList.push(el);
        });
      });
    }, // Load Category
    loadCategory() {
      this.axios.get("/category").then(res => {
        this.categoryList = [];
        let category = res.data.content.result;
        category.map(el => {
          let elCateogory = {};
          elCateogory.code = el.code;
          elCateogory.name = el.name;
          elCateogory.id = el.id;
          this.categoryList.push(elCateogory);
        });
      });
    },
    // Load manufacture
    loadManufacture() {
      this.manufactureList = [];
      this.axios.get("/manufacture").then(res => {
        this.manufactureList = [];
        let manufacture = res.data.content.result;
        manufacture.map(el => {
          let manufactureElement = {};
          manufactureElement.id = el.id;
          manufactureElement.name = el.name;
          this.manufactureList.push(manufactureElement);
        });
      });
    }
  }
};
</script>