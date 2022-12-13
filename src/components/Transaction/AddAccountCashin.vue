<template>
  <div class="column is-12">
    <form @submit.prevent="loadFilter()">
      <b-field grouped group-multiline expanded>
        <b-field label="Classification">
          <b-select placeholder="Select a classification" v-model="cclassification" expanded>
            <option
              v-for="classification in classificationList"
              :value="classification.id"
              :key="classification.id"
            >{{classification.name}}</option>
          </b-select>
        </b-field>
      </b-field>
      <div class="buttons">
        <button class="button is-primary" @click.prevent="loadAsyncAccountList()">Filter</button>
        <button class="button is-primary" @click.prevent="reset()">Reset</button>
      </div>
    </form>
    <br />
    <b-table :data="accountList" :loading="loading" hoverable>
      <template slot="empty" v-if="!loading">
        <p class="has-text-grey has-text-centered" style="padding: 10px">No data available in table</p>
      </template>
      <template slot-scope="props">
        <b-table-column label="Code">{{ props.row.code }}</b-table-column>
        <b-table-column label="Name">{{ props.row.name }}</b-table-column>
        <b-table-column label="Currency">{{ props.row.currency }}</b-table-column>
        <b-table-column label="Action" style="min-width:110px">
          <div class="buttons has-addons">
            <span class="button is-small is-primary" @click.prevent="select( props.row.code)">Select</span>
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
      cclassification: "",
      classificationList: [],
      accountList: [],

      loading: false
    };
  },
created() {
    this.loadAsyncAccountList();
    this.loadClassification();
  },
  methods: {
    loadAsyncAccountList() {
      this.loading = true;
      let ajax;
      if (this.cclassification) {
        let bodyRequest = {
          classification: this.cclassification,
          publish: 1
        };
        ajax = this.axios.post("/account", bodyRequest);
      } else {
        ajax = this.axios.get("/account");
      }
      ajax
        .then(res => {
          let accounts = res.data.content.result
this.count = res.data.content.record
          if (accounts) this.accountList = accounts;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    select(code) {
      this.$emit("selected", code);
    },

    // Load Classification
    loadClassification() {
      this.axios.get("/classification").then(res => {
        this.classificationList = [];
        let classification = res.data.content.result
        classification.map(el => {
          let elBranch = {};
          elBranch.id = el.id;
          elBranch.name = el.name;
          this.classificationList.push(elBranch);
        });
      });
    }
  }
};
</script>