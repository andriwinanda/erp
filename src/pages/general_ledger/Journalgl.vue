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
              <b-field label="Code">
                <b-select placeholder="Select a code" @input="updateCode" :value="code">
                  <option value="aa">AA</option>
                  <option value="bb">BB</option>
                  <option value="cc">CC</option>
                </b-select>
              </b-field>
               <b-field label="No">
                <b-input type="number" @input="updateNo" :value="no" />
              </b-field>
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
                  @click="loadAsyncJournalList()"
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
                    @input="searchJournal"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>

            <!-- Table Journal -->
            <div class="column is-12">
              <b-table
                :data="journalList"
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
                  <b-table-column field="code" label="Code">{{ props.row.code }}</b-table-column>
                  <b-table-column label="Currency" centered>{{ props.row.currency }}</b-table-column>
                  <b-table-column label="Date" centered>{{ props.row.date }}</b-table-column>
                  <b-table-column label="Note">{{ props.row.notes }}</b-table-column>

                  <b-table-column field="balance" label="Balance" numeric>
                    <numeric :value="props.row.balance" />
                  </b-table-column>

                  <b-table-column label="Action" style="min-width:140px">
                    <div class="buttons has-addons">
                      <b-tooltip
                        :label="props.row.posted != 0?'Posted':'Confirmation'"
                        size="is-small"
                        type="is-dark"
                        position="is-bottom"
                        animated
                      >
                        <span v-if="props.row.posted != 0" class="is-success button is-small">
                          <b-icon size="is-small" icon="power" />
                        </span>
                        <span
                          v-else
                          class="is-danger button is-small"
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
                          @click.prevent="editJournal(props.row.id)"
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
                          @click.prevent="deleteJournal(props.row.id)"
                        >
                          <b-icon size="is-small" icon="delete" />
                        </span>
                      </b-tooltip>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
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
                  <b-button class="pagination-next" :disabled="page >= (Math.ceil(count/limit))" icon-right="chevron-right" @click="next" />
                </template>
                <ul class="pagination-list">
                  <li>
                    <b-button
                      tag="router-link"
                      class="pagination-link"
                      type="is-primary "
                      to="/general_ledger/journalgl/add"
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

      <!-- Modal Invoice -->
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

    <!-- Form Journal -->
    <!-- <formJournal v-bind="journal" v-if="isComponentModalActive" /> -->
  </div>
</template>
<script>
import print from "print-js";
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import invoice from "@/components/GL/JournalInvoice.vue";

import swal from "sweetalert";
export default {
  components: {
    invoice 
  },
  data() {
    return {
      activeIndex: 0,
      checkedRows: [],
      count: 0,
pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      isInvoiceModalActive: false,
      invoice: null,
      // AddNewJournal
      journal: {
        cityList: [],
        currencyList: [],
        vendorList: [],
        accountList: [],
        cvendor: "",
        tno: null,
        tdate: null,
        ccurrency: "",
        tnote: "",
        tshipping: null,
        tdocno: "",
        cacc: "",
        tdesc: "",
        // Edit Journal
        id: null
      }
    };
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async JournalList
     */
    loadAsyncJournalList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset,
        code: this.filterCode,
        no: this.filterNo
      };
      if(this.filterDate) bodyRequest.date = this.filterDate,
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/journalgl/search", bodyRequest);
      } else {
        ajax = this.axios.get("/journalgl", bodyRequest);
      }
      ajax
        .then(res => {
          let journal = res.data.content.result
          this.count = res.data.content.record
          if (journal) this.$store.commit("journal/addJournalList", journal);
          else this.$store.commit("journal/addJournalList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Load City
    loadCity() {
      // External Api (Read main.js)
      this.exApi
        .get(
          "http://153.92.4.83/rongkir/starter/city?key=eb7f7529d68f6a2933b5a042ffeeac9d"
        )
        .then(res => {
          this.journal.cityList = res.data.rajaongkir.results;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // Load Currency
    loadCurrency() {
      this.axios.get("/currency").then(res => {
        this.journal.currencyList = [];
        let currency = res.data.content.result
        currency.map(el => {
          this.journal.currencyList.push(el);
        });
      });
    },
    // Load Vendor
    loadVendor() {
      this.axios.get("/vendor").then(res => {
        this.journal.vendorList = [];
        let vendor = res.data.content.result
        vendor.map(el => {
          this.journal.vendorList.push(el);
        });
      });
    },
    // Load Account
    loadAccount() {
      this.axios.get("/payment").then(res => {
        this.journal.accountList = [];
        let account = res.data.content.result
        account.map(el => {
          this.journal.accountList.push(el);
        });
      });
    },
    // Set City for filter
    updateCity(value) {
      this.$store.commit("journal/updateCity", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("journal/filter");
      this.loadAsyncJournalList();
    },
    isFilterShow() {
      this.$store.commit("journal/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/journalgl/confirmation/${id}`).then(res => {
        this.loadAsyncJournalList();
      });
    },
    // Show Invoice
    showInvoice(id) {
      this.axios.get(`/journalgl/get/${id}`).then(res => {
        this.isInvoiceModalActive = true;
        this.invoice = res.data.content
        console.log(this.invoice);
      });
    },
    // Delete Journal
    deleteJournal(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this journal data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/journalgl/delete/${id}`)
            .then(res => {
              swal("Poof! Your journal data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncJournalList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your journal data is safe!");
        }
      });
    },
    // Delete Checked Journal
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this journal data!",
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
            .post("/journalgl/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Journal data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncJournalList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your journal data is safe!");
        }
      });
    },
    editJournal(id) {
      this.$router.push("/general_ledger/journalgl/edit/" + id);
    },
    // Modal Action
    submitJournal() {
      let journalData = {
        id: this.journal.no,
        tno: this.journal.no,
        cvendor: this.journal.cvendor,
        // tdate : this.date,
        // tshipping : this.shipping,
        tdesc: this.journal.desc,
        tdocno: this.journal.docno,
        ccurrency: this.journal.currency,
        tacc: this.journal.acc,
        tnote: this.journal.note
      };
      // console.log(urlEncoded(journalData))
      let submit;
      if (this.id) {
        journalData.id = this.id;
        submit = this.axios.post(
          `/journalgl/update/${this.id}`,
          urlEncoded(journalData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/journalgl/add", urlEncoded(journalData), {
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
            swal("Success!", "Journal submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncJournalList();
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
      this.$store.commit("journal/reset");
    },
    modalCloseClicked() {
      this.journal.cvendor = "";
      this.journal.tno = null;
      this.journal.tdate = null;
      this.journal.ccurrency = "";
      this.journal.tnote = "";
      this.journal.tshipping = null;
      this.journal.tdocno = "";
      this.journal.cacc = "";
      this.journal.tdesc = "";
      this.journal.id = null;
    },
    next() {
      this.$store.commit("journal/incrementPage");
      this.loadAsyncJournalList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("journal/decrementPage");
        this.loadAsyncJournalList();
      }
    },
    searchJournal: debounce(function(event) {
      this.$store.commit("journal/updateSearch", event);
      this.$store.commit("journal/reset");
      this.$store.commit("journal/filter");
      this.loadAsyncJournalList();
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
    if (!this.journalList.length) this.loadAsyncJournalList();
    this.loadCity();
  },
  computed: {
    ...mapState({
      page: state => state.journal.page,
      offset: state => state.journal.offset,
      journalList: state => state.journal.journalList,
      limit: state => state.journal.filter.limit,
      showFilter: state => state.journal.filter.showFilter,
      filterCode: state => state.journal.filter.code,
      filterDate: state => state.journal.filter.date,
      filterNo: state => state.journal.filter.no,
      search: state => state.journal.filter.search
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



