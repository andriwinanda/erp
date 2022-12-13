<template>
  <div>
    <div v-if="!isComponentModalActive">
      <!-- Filter Component -->
      <div v-if="showFilter" class="flat-card row" style="margin-bottom: 15px;">
        <button
          class="delete is-pulled-right"
          aria-label="close"
          @click.prevent="isFilterShow()"
          style="margin: 10px;"
        />
        <div class="card-content">
          <form @submit.prevent="loadFilter()">
            <b-field grouped group-multiline expanded>
              <b-field label="Account">
                <b-field expanded>
                  <b-input placeholder="Select Account" :value="account" disabled />
                  <p class="control">
                    <button class="button is-primary" @click.prevent="showAddAccountModal()">...</button>
                  </p>
                </b-field>
              </b-field>
              <b-field label="Start">
                <b-datepicker
                  editable
                  :date-parser="dateFormat"
                  :date-formatter="dateFormat"
                  placeholder="Click to select..."
                  icon="calendar-today"
                  @input="updateStart"
                  :value="start"
                ></b-datepicker>
              </b-field>
              <b-field label="End">
                <b-datepicker
                  editable
                  :date-parser="dateFormat"
                  :date-formatter="dateFormat"
                  placeholder="Click to select..."
                  icon="calendar-today"
                  @input="updateEnd"
                  :value="end"
                ></b-datepicker>
              </b-field>
            </b-field>
            <div class="buttons">
              <button class="button is-primary" @click.prevent="loadFilter()">Filter</button>
              <button class="button is-primary" @click.prevent="reset()">Reset</button>
            </div>
          </form>
        </div>
      </div>

      <div class="flat-card">
        <div class="card-content">
          <div class="columns is-multiline">
            <div class="column is-8">
              <!-- Action Component -->
              <div class="buttons">
                <b-button
                  v-if="!showFilter"
                  type="is-primary"
                  @click.prevent="isFilterShow()"
                >{{showFilter?"Close": "Show"}} Filter</b-button>
                <b-button
                  type="is-primary"
                  icon-left="refresh"
                  @click="loadAsyncLedgerList()"
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
                    :value="search"
                    @input="searchLedger"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>

            <!-- Table Ledger -->
            <div class="column is-12">
              <b-table
                :data="ledgerList.trans"
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
                  <b-table-column label="Currency" centered>{{ props.row.currency }}</b-table-column>
                  <b-table-column label="Notes">{{props.row.notes}}</b-table-column>
                  <b-table-column label="Debit" numeric>
                    <numeric :value="props.row.debit" />
                  </b-table-column>
                  <b-table-column label="Credit" numeric>
                    <numeric :value="props.row.credit" />
                  </b-table-column>

                  <b-table-column label="Action" style="min-width:140px">
                    <div class="buttons has-addons">
                      <b-tooltip
                        type="is-dark"
                        label="Invoice"
                        size="is-small"
                        position="is-bottom"
                        animated
                      >
                        <span
                          class="button is-small is-warning"
                          @click.prevent="showInvoice(props.row.id)"
                        >
                          <b-icon size="is-small" icon="receipt" />
                        </span>
                      </b-tooltip>

                      <b-tooltip
                        type="is-dark"
                        label="Edit"
                        size="is-small"
                        position="is-bottom"
                        animated
                      >
                        <span
                          class="button is-small is-info"
                          @click.prevent="editLedger(props.row.id)"
                        >
                          <b-icon size="is-small" icon="square-edit-outline" />
                        </span>
                      </b-tooltip>

                      <b-tooltip
                        type="is-dark"
                        label="Delete"
                        size="is-small"
                        position="is-bottom"
                        animated
                      >
                        <span
                          class="button is-small is-danger"
                          @click.prevent="deleteLedger(props.row.id)"
                        >
                          <b-icon size="is-small" icon="delete" />
                        </span>
                      </b-tooltip>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
              <br />
              <div class="columns" v-if="ledgerList">
                <div class="column">
                  <table>
                    <tr>
                      <td>Beginning</td>
                      <td>: {{ledgerList.begin}}</td>
                    </tr>
                    <tr>
                      <td>End</td>
                      <td>: {{ledgerList.end}}</td>
                    </tr>
                  </table>
                </div>
                <div class="column">
                  <table>
                    <tr>
                      <td>Debit</td>
                      <td>: {{ledgerList.debit}}</td>
                    </tr>
                    <tr>
                      <td>Credit</td>
                      <td>: {{ledgerList.credit}}</td>
                    </tr>
                  </table>
                </div>
                <div class="column">
                  <table>
                    <tr>
                      <td>Mutation</td>
                      <td>: {{ledgerList.mutation}}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <!-- Pagination Table -->
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
                      @click.prevent="calculate()"
                    >Calculate Ending Balance</b-button>
                  </li>
                  <li>
                    <b-button
                      class="pagination-link"
                      type="is-primary"
                      @click.prevent="$router.push('/general_ledger/ledger/report')"
                    >Report</b-button>
                  </li>
                  <b-dropdown aria-role="list">
                    <button class="button is-primary" slot="trigger">
                      <span>Period End</span>
                      <b-icon icon="menu-down"></b-icon>
                    </button>

                    <b-dropdown-item aria-role="listitem" @click="monthly">Monthly</b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="annual">Annual</b-dropdown-item>
                  
                  </b-dropdown>
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
      <br>
      <br>

      <!-- Modals Account -->
      <b-modal :active.sync="isComponentModalAccount" has-modal-card>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Transaction</p>
          </header>
          <section class="modal-card-body">
            <add-account @selected="itemSelected"></add-account>
          </section>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import print from "print-js";
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import addAccount from "@/components/Transaction/AddAccountCashin";

import swal from "sweetalert";
export default {
  data() {
    return {
      activeIndex: 0,
      checkedRows: [],
      ledger: {
        cityList: []
      },
      // start: null,
      // end: null,
      // account: null,
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      isComponentModalAccount: false,
      isInvoiceModalActive: false
    };
  },
  components: {
    addAccount
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async LedgerList
     */
    loadAsyncLedgerList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset,
        taccount: this.account,
        tstart: this.dateFormat(this.start),
        tend: this.dateFormat(this.end)
      };
      // if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/ledger/search", urlEncoded(bodyRequest));
      } else {
        ajax = this.axios.post("/ledger", urlEncoded(bodyRequest));
      }
      ajax
        .then(res => {
          this.loading = false;
          let ledger = res.data.content;
          this.count = res.data.content;
          console.log(ledger);
          if (ledger) this.$store.commit("ledger/addLedgerList", ledger);
          else this.$store.commit("ledger/addLedgerList", {});
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Set filter
    updateAcc(value) {
      this.$store.commit("ledger/updateAcc", value);
    },
    updateStart(value) {
      this.$store.commit("ledger/updateStart", value);
    },
    updateEnd(value) {
      this.$store.commit("ledger/updateEnd", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("ledger/filter");
      this.loadAsyncLedgerList();
    },
    isFilterShow() {
      this.$store.commit("ledger/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/ledger/confirmation/${id}`).then(res => {
        this.loadAsyncLedgerList();
      });
    },
    showAddAccountModal() {
      this.isComponentModalAccount = true;
    },
    itemSelected(code) {
      this.updateAcc(code);
      this.isComponentModalAccount = false;
    },
    //Closing
    calculate() {
      this.axios.get(`/closing/calculate`).then(res => {
        swal(res.data.content, {
          icon: "success"
        });
      });
    },
    monthly() {
      this.axios.get(`/closing/monthly`).then(res => {
        swal(res.data.content, {
          icon: "success"
        });
      });
    },
    annual() {
      this.axios.get(`/closing/annual`).then(res => {
        swal(res.data.content, {
          icon: "success"
        });
      });
    },
    // Delete Ledger
    deleteLedger(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this ledger data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/ledger/delete/${id}`)
            .then(res => {
              swal("Poof! Your ledger data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncLedgerList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your ledger data is safe!");
        }
      });
    },
    // Delete Checked Ledger
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this ledger data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          let bodyRequest = {};
          this.checkedRows.map((el, index) => {
            bodyRequest[`cek[${index}]`] = el.id;
          });
          console.log(bodyRequest);
          this.axios
            .post("/ledger/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Ledger data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncLedgerList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your ledger data is safe!");
        }
      });
    },
    editLedger(id) {
      this.$router.push("/general_ledger/journalgl/edit/" + id);
    },

    reset(event) {
      this.$store.commit("ledger/reset");
    },
    next() {
      this.$store.commit("ledger/incrementPage");
      this.loadAsyncLedgerList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("ledger/decrementPage");
        this.loadAsyncLedgerList();
      }
    },
    searchLedger: debounce(function(event) {
      this.$store.commit("ledger/updateSearch", event);
      this.$store.commit("ledger/reset");
      this.$store.commit("ledger/filter");
      this.loadAsyncLedgerList();
    }, 500),
    print() {
      let attachment = document.getElementById("printInvoice");
      printJS({
        printable: "printInvoice",
        type: "html",
        header: null,
        targetStyles: ["*"]
      });
    }
  },
created() {
    if (!this.ledgerList) this.loadAsyncLedgerList();
  },
  computed: {
    ...mapState({
      page: state => state.ledger.page,
      offset: state => state.ledger.offset,
      ledgerList: state => state.ledger.ledgerList,
      limit: state => state.ledger.filter.limit,
      showFilter: state => state.ledger.filter.showFilter,
      account: state => state.ledger.filter.account,
      start: state => state.ledger.filter.start,
      end: state => state.ledger.filter.end,
      search: state => state.ledger.filter.search
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



