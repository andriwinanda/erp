<template>
  <div>
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
            <b-field label="Select Date">
              <b-datepicker
                editable
                :date-parser="dateFormat"
                :date-formatter="dateFormat"
                placeholder="Click to select..."
                icon="calendar-today"
                @input="updateDate"
                :value="filterDate"
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
        <!-- <h4 class="title is-5">Transfer - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <div class="buttons">
              <b-button
                v-if="!showFilter"
                type="is-primary"
                @click.prevent="isFilterShow()"
              >{{showFilter?"Close": "Show"}} Filter</b-button>
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncTransferList()"
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
                  @input="searchTransfer"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Transfer -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitTransfer">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Transfer</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="No" expanded>
                      <b-input v-model="tno" />
                    </b-field>
                    <b-field label="Date" expanded>
                      <b-datepicker
                        editable
                        :date-formatter="dateFormat"
                        placeholder="Click to select..."
                        icon="calendar-today"
                        v-model="tdate"
                      ></b-datepicker>
                    </b-field>
                  </b-field>

                  <b-field grouped group-multiline>
                    <b-field label="From" expanded>
                      <b-select expanded placeholder="Select Account" v-model="cfrom">
                        <option
                          v-for="account in accountList"
                          :value="account.id"
                          :key="account.id"
                        >{{account.name}}</option>
                      </b-select>
                    </b-field>
                    <b-field label="To" expanded>
                      <b-select expanded placeholder="Select Account" v-model="cto">
                        <option
                          v-for="account in accountList"
                          :value="account.id"
                          :key="account.id"
                        >{{account.name}}</option>
                      </b-select>
                    </b-field>
                  </b-field>

                  <b-field grouped group-multiline>
                    <b-field label="Currency" expanded>
                      <b-select expanded placeholder="Select Currency" v-model="ccurrency">
                        <option
                          v-for="currency in currencyList"
                          :value="currency.code"
                          :key="currency.code"
                        >{{currency.code}}</option>
                      </b-select>
                    </b-field>
                    <b-field label="Amount" expanded>
                      <b-input v-model="tamount" />
                    </b-field>
                  </b-field>

                  <b-field label="Note" expanded>
                    <b-input v-model="tnote" type="textarea" expanded />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitTransfer()">Save</button>
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

          <!-- Table Transfer -->
          <div class="column is-12">
            <b-table
              :data="transferList"
              :loading="loading"
              :hoverable="true"
              :is-row-checkable="(row) => row.id !== 3"
            >
              <template slot="empty" v-if="!loading">
                <p
                  class="has-text-grey has-text-centered"
                  style="padding: 10px"
                >No data available in table</p>
              </template>

              <template slot-scope="props">
                <b-table-column label="Code" numeric>{{ props.row.no }}</b-table-column>
                <b-table-column label="Date">{{ props.row.dates }}</b-table-column>
                <b-table-column label="Notes">{{ props.row.notes }}</b-table-column>
                <b-table-column label="Currency">{{ props.row.currency }}</b-table-column>
                <b-table-column label="From Acc">{{ props.row.to }}</b-table-column>
                <b-table-column label="To Acc">{{ props.row.from }}</b-table-column>
                <b-table-column label="Amount" numeric>
                  <numeric :value="props.row.amount" />
                </b-table-column>

                <b-table-column label="Action" style="min-width:140px">
                  <div class="buttons has-addons">
                    <b-tooltip
                      :label="props.row.posted != 0?'Published':'Unpublish'"
                      size="is-small"
                      type="is-dark"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small"
                        :class="props.row.status != 0? 'is-success': 'is-danger'"
                        @click="changeStatus(props.row.id)"
                      >
                        <b-icon size="is-small" icon="power" />
                      </span>
                    </b-tooltip>
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
                        @click.prevent="editTransfer(props.row.id)"
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
                        @click.prevent="deleteTransfer(props.row.id)"
                      >
                        <b-icon size="is-small" icon="delete" />
                      </span>
                    </b-tooltip>
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
                <b-button class="pagination-next" :disabled="page >= (Math.ceil(count/limit))" icon-right="chevron-right" @click="next" />
              </template>
              <ul class="pagination-list">
                <li>
                  <b-button
                    class="pagination-link"
                    type="is-primary "
                    @click="isComponentModalActive=true"
                    icon-left="plus"
                  >Add New</b-button>
                </li>
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
    <!-- Invoice Modal -->
    <b-modal :active.sync="isInvoiceModalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Invoice</p>
        </header>
        <section class="modal-card-body">
          <invoice v-bind="invoice" id="printInvoice" />
        </section>
        <footer class="modal-card-foot">
          <b-button
            @click="print('printInvoice', 'html')"
            type="is-primary"
            icon-left="printer"
          >Print</b-button>
          <button class="button" type="button" @click="isInvoiceModalActive = false">Close</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
import invoice from "@/components/Transaction/TransactionInvoice";
export default {
  components: {
    invoice
  },
  data() {
    return {
      currencyList: [],
      accountList: [],
      classificationList: [],
      loading: false,
      isInvoiceModalActive: false,
      isComponentModalActive: false,
      invoice: null,
      // AddNewTransfer
      tno: null,
      tdate: null,
      ccurrency: null,
      tnote: "",
      tamount: null,
      cfrom: null,
      cto: null,

      // Edit Transfer
      id: null
    };
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async TransferList
     */
    loadAsyncTransferList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset
      };
      if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/transfer/search", bodyRequest);
      } else {
        ajax = this.axios.post("/transfer", bodyRequest);
      }
      ajax
        .then(res => {
          let transfer = res.data.content.result
this.count = res.data.content.record
          if (transfer)
            this.$store.commit("transfer/addTransferList", transfer);
          else this.$store.commit("transfer/addTransferList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Load Classification
    loadClassification() {
      this.axios.get("/classification").then(res => {
        this.classificationList = [];
        let classification = res.data.content;
        classification.map(el => {
          this.classificationList.push(el);
        });
      });
    },
    // Load Currency
    loadCurrency() {
      this.axios.get("/currency").then(res => {
        this.currencyList = [];
        let currency = res.data.content.result;
        currency.map(el => {
          this.currencyList.push(el);
        });
      });
    },
    // Load Account
    loadAccount() {
      this.axios.get("/account/get_asset_acc").then(res => {
        this.accountList = [];
        let account = res.data.content.result;
        account.map(el => {
          this.accountList.push(el);
        });
      });
    },
    // Show Invoice
    showInvoice(id) {
      this.axios.get(`/transfer/invoice/${id}`).then(res => {
        this.isInvoiceModalActive = true;
        this.invoice = res.data.content;
        console.log(this.invoice);
      });
    },

    // Set Dadet for filter
    updateDate(value) {
      this.$store.commit("transfer/updateDate", value);
    },

    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("transfer/filter");
      this.loadAsyncTransferList();
    },
    isFilterShow() {
      this.$store.commit("transfer/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/transfer/publish/${id}`).then(res => {
        this.loadAsyncTransferList();
      });
    },
    // Delete Transfer
    deleteTransfer(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this transfer data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/transfer/delete/${id}`)
            .then(res => {
              swal("Poof! Your transfer data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncTransferList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your transfer data is safe!");
        }
      });
    },

    editTransfer(id) {
      this.axios.get(`/transfer/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.tno = data.no;
        this.tdate = new Date(data.dates);
        this.ccurrency = data.currency;
        this.tnote = data.notes;
        this.tamount = data.amount;
        this.cfrom = data.from;
        this.cto = data.to;
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitTransfer() {
      let transferData = {
        tno: this.tno,
        tdate: this.dateFormat(this.tdate),
        ccurrency: this.ccurrency,
        tnote: this.tnote,
        tamount: this.tamount,
        cfrom: this.cfrom,
        cto: this.cto
      };
      // console.log(urlEncoded(transferData))
      let submit;
      if (this.id) {
        transferData.id = this.id;
        submit = this.axios.post(
          `/transfer/update/${this.id}`,
          urlEncoded(transferData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/transfer/add", urlEncoded(transferData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }

      submit
        .then(res => {
          console.log(res);
          // let err = res.data.error;
          // if (err) {
          //   let errMessage = err
          //     .replace(/(<p>)/g, "* ")
          //     .replace(/(<\/p>)/g, "");
          //   swal("Failed!", errMessage, "warning");
          // } else {}
          swal("Success!", "Transfer submit successfully!", "success");
          this.isComponentModalActive = false;
          this.loadAsyncTransferList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset(event) {
      this.$store.commit("transfer/reset");
    },
    modalCloseClicked() {
      this.tno = null;
      this.tdate = null;
      this.ccurrency = null;
      this.tnote = "";
      this.tamount = null;
      this.cfrom = null;
      this.cto = null;
      this.id = null;
    },
    next() {
      this.$store.commit("transfer/incrementPage");
      this.loadAsyncTransferList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("transfer/decrementPage");
        this.loadAsyncTransferList();
      }
    },
    searchTransfer: debounce(function(event) {
      this.$store.commit("transfer/updateSearch", event);
      this.$store.commit("transfer/reset");
      this.$store.commit("transfer/filter");
      this.loadAsyncTransferList();
    }, 500)
  },
created() {
    if (!this.transferList.length) this.loadAsyncTransferList();
    this.loadClassification();
    this.loadCurrency();
    this.loadAccount();
  },
  computed: {
    ...mapState({
      page: state => state.transfer.page,
      offset: state => state.transfer.offset,
      transferList: state => state.transfer.transferList,
      limit: state => state.transfer.filter.limit,
      showFilter: state => state.transfer.filter.showFilter,
      filterDate: state => state.transfer.filter.date,
      search: state => state.transfer.filter.search
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



