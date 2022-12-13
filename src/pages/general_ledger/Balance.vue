<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Balance - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncBalanceList()"
              >Refresh Table</b-button>
            </div>
          </div>
          <div class="column is-4">
            <b-field grouped group-multiline>
              <b-field class="control" expanded>
                <b-input
                  width="100"
                  placeholder="Search..."
                  type="search"
                  @input="searchBalance"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Balance -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitBalance">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Balance</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Code" expanded>
                      <b-input v-model="code" />
                    </b-field>

                    <b-field label="Account" expanded>
                      <b-input v-model="account" />
                    </b-field>
                  </b-field>
                  <b-field label="Balance" expanded>
                    <b-input v-model="balance" />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitBalance()">Save</button>
                  <button
                    class="button is-danger"
                    type="button"
                    @click="isComponentModalActive = false"
                  >Close</button>
                  <button
                    class="button is-warning"
                    type="button"
                    @click.prevent="reset(event)"
                  >Reset</button>
                </footer>
              </div>
            </form>
          </b-modal>

          <!-- Table Balance -->
          <div class="column is-12">
            <b-table
              :data="balanceList"
              :loading="loading"
              :hoverable="true"
              :checked-rows.sync="checkedRows"
              :is-row-checkable="(row) => row.id !== 3"
              checkable
            >
              <template slot="empty" v-if="!loading">
                <p
                  class="has-text-grey has-text-centered"
                  style="padding: 10px"
                >No data available in table</p>
              </template>

              <template slot-scope="props">
                <b-table-column label="Code">{{ props.row.code }}</b-table-column>
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Currency">{{ props.row.currency }}</b-table-column>
                <b-table-column label="Balance" numeric>
                  <numeric :value="props.row.balance" />
                </b-table-column>

                <b-table-column label="Action">
                  <div class="buttons has-addons">
                    <b-button
                      size="is-small"
                      type="is-primary"
                      icon-left="square-edit-outline"
                      @click="editBalance(props.row.id, props.row.code)"
                    >Balance</b-button>
                  </div>
                </b-table-column>
              </template>
            </b-table>
          </div>
          <div class="column is-12">
            <nav class="pagination" role="navigation" aria-label="pagination">
              <template v-if="!search">
                <b-button
                  class="pagination-previous"
                  icon-right="chevron-left"
                  :disabled="page <= 1"
                  @click="previous"
                />
                <b-button
                  class="pagination-next"
                  :disabled="page >= (Math.ceil(count/limit))"
                  icon-right="chevron-right"
                  @click="next"
                />
              </template>
              <ul class="pagination-list">
                <li>
                  <b-button
                    class="pagination-link"
                    type="is-primary"
                    icon-left="delete"
                    @click.prevent="deleteCheked()"
                  >Delete Checked</b-button>
                </li>
                <li>
                  <b-button class="pagination-link" type="is-primary" icon-left="printer">Print</b-button>
                </li>
              </ul>
              <p class="pagination-list has-text-grey is-hidden-mobile">Page {{page}}</p>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import numeric from "@/components/Numeric";
import debounce from "debounce";
import swal from "sweetalert";
export default {
  data() {
    return {
      activeIndex: 0,
      parentList: [],
      checkedRows: [],

      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewBalance
      balance: "",
      account: null,
      code: "",

      // Edit Balance
      id: null
    };
  },
  methods: {
    /*
     * Load async BalanceList
     */
    loadAsyncBalanceList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset,
        city: this.city
      };
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/balance/search", bodyRequest);
      } else {
        ajax = this.axios.post("/balance", bodyRequest);
      }
      ajax
        .then(res => {
          let balance = res.data.content.result;
          this.count = res.data.content.record;
          if (balance) this.$store.commit("balance/addBalanceList", balance);
          else this.$store.commit("balance/addBalanceList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/balance/publish/${id}`).then(res => {
        this.loadAsyncBalanceList();
      });
    },

    editBalance(id, code) {
      this.axios.get(`/balance/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = data.id
        this.code = data.code;
        this.balance = data.balance;
        this.account = data.name;
      });
      this.isComponentModalActive = true;
    },
    // Modal Action
    submitBalance() {
      let balanceData = {
        tbalance: this.balance,
        caccount: this.account,
        tcode: this.code
      };
      // console.log(urlEncoded(balanceData))
      let submit;
      if (this.id) {
        balanceData.id = this.id;
        submit = this.axios.post(
          `/balance/update/${this.id}`,
          urlEncoded(balanceData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/balance/add", urlEncoded(balanceData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }

      submit
        .then(res => {
          console.log(res);
          let err = res.data.error;
          if (err) {
            let errMessage = err
              .replace(/(<p>)/g, "* ")
              .replace(/(<\/p>)/g, "");
            swal("Failed!", errMessage, "warning");
          } else {
            swal("Success!", "Balance submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncBalanceList();
          }
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset(event) {
      this.$store.commit("balance/reset");
    },
    modalCloseClicked() {
      this.balance = "";
      this.account = null;
      this.code = "";
      this.id = null;
    },
    next() {
      this.$store.commit("balance/incrementPage");
      this.loadAsyncBalanceList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("balance/decrementPage");
        this.loadAsyncBalanceList();
      }
    },
    searchBalance: debounce(function(event) {
      this.$store.commit("balance/updateSearch", event);
      this.$store.commit("balance/reset");
      this.$store.commit("balance/filter");
      this.loadAsyncBalanceList();
    }, 500)
  },
  created() {
    if (!this.balanceList.length) this.loadAsyncBalanceList();
  },
  computed: {
    ...mapState({
      page: state => state.balance.page,
      offset: state => state.balance.offset,
      balanceList: state => state.balance.balanceList,
      limit: state => state.balance.filter.limit,
      search: state => state.balance.filter.search
    })
  }
};
</script>
<style>
.padding-card {
  padding: 0.75rem 0.2rem;
  background: linear-gradient(to right, rgb(121, 86, 236), rgb(47, 185, 248));
  box-shadow: none;
  color: white;
}
.shortcut .column {
  padding: 0.75rem 0.25rem;
}
</style>



