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
        <button class="button is-primary" @click.prevent="loadAsyncPOList()">Filter</button>
        <button class="button is-primary" @click.prevent="reset()">Reset</button>
      </div>
    </form>
    <br />
    <b-table :data="productList" :loading="loading" hoverable>
      <template slot="empty" v-if="!loading">
        <p class="has-text-grey has-text-centered" style="padding: 10px">No data available in table</p>
      </template>
      <template slot-scope="props">
        <b-table-column field="code" label="Code">{{ props.row.code }}</b-table-column>
        <b-table-column label="Currency" centered>{{ props.row.currency }}</b-table-column>
        <b-table-column label="Date" centered>{{ props.row.date }}</b-table-column>
        <b-table-column label="Account" centered>{{ props.row.account }}</b-table-column>
        <b-table-column label="Total" numeric>
          <numeric :value="props.row.amount" />
        </b-table-column>

        <b-table-column label="Action" centered>
          <b-button size="is-small" type="is-primary" @click.prevent="select( props.row.id)">Select</b-button>
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
    this.loadAsyncPOList();
    this.loadBranch();
    this.loadCategory();
    this.loadManufacture();
  },
  methods: {
    loadAsyncPOList() {
      this.loading = true;
      this.axios
        .get("/purchase")
        .then(res => {
          let products = res.data.content.result
this.count = res.data.content.record
          if (products) this.productList = products;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    select(id) {
      this.$emit("selected", id);
    },
    // Load Branch
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.branchList = [];
        let branch = res.data.content.result
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