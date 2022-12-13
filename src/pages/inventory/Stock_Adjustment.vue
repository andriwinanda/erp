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
                  @click="loadAsyncStockList()"
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
                    @input="searchStock"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>

            <!-- Table Stock -->
            <div class="column is-12">
              <b-table
                :data="stockList"
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
                  <b-table-column label="Code">{{ props.row.no }}</b-table-column>
                  <b-table-column label="Branch" centered>{{ props.row.branch }}</b-table-column>
                  <b-table-column label="Date">{{ props.row.date }}</b-table-column>
                  <b-table-column label="Currency">{{ props.row.currency }}</b-table-column>
                  <b-table-column label="Description">{{props.row.description}}</b-table-column>
                  <b-table-column label="Staff">{{props.row.staff}}</b-table-column>

                  <b-table-column label="Action" style="min-width:140px">
                    <div class="buttons has-addons">
                      <b-tooltip
                        :label="props.row.posted != 0?'Posted':'Confirmation'"
                        size="is-small"
                        type="is-dark"
                        position="is-bottom"
                        animated
                      >
                        <span
                          :class="props.row.posted != 0 ? 'is-success' : 'is-danger'"
                          @click.prevent="changeStatus(props.row.id)"
                          class="is-success button is-small"
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
                          @click.prevent="editStock(props.row.id)"
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
                          @click.prevent="deleteStock(props.row.id)"
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
                      to="/inventory/stock_adjustment/add"
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

      <!-- Modal -->
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
            <button class="button" type="button" @click="isInvoiceModalActive =false">Close</button>
          </footer>
        </div>
      </b-modal>
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
</template>
<script>
import print from "print-js";
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
import invoice from "@/components/Inventory/stock_adjustmentInvoice";
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
      isInvoiceModalActive: false,
      isComponentModalActive: false,
      isInvoiceModalActive: false,
      invoice: null
    };
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async StockList
     */
    loadAsyncStockList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset
      };
      if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/stock_adjustment/search", bodyRequest);
      } else {
        ajax = this.axios.post("/stock_adjustment", bodyRequest);
      }
      ajax
        .then(res => {
          let stock_adjustment = res.data.content.result
this.count = res.data.content.record;
          console.log(stock_adjustment);
          if (stock_adjustment)
            this.$store.commit(
              "stock_adjustment/addStockList",
              stock_adjustment
            );
          else this.$store.commit("stock_adjustment/addStockList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },

    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("stock_adjustment/filter");
      this.loadAsyncStockList();
    },
    isFilterShow() {
      this.$store.commit("stock_adjustment/isFilterShow", !this.showFilter);
    },
    // Set Dadet for filter
    updateDate(value) {
      this.$store.commit("stock_adjustment/updateDate", value);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/stock_adjustment/confirmation/${id}`).then(res => {
        this.loadAsyncStockList();
      });
    },
    // Show Invoice
    showInvoice(id) {
      this.axios.get(`/stock_adjustment/invoice/${id}`).then(res => {
        this.isInvoiceModalActive = true;
        this.invoice = res.data.content
        console.log(this.invoice);
      });
    },
    // Delete Stock
    deleteStock(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this stock_adjustment data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/stock_adjustment/delete/${id}`)
            .then(res => {
              swal("Poof! Your stock_adjustment data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncStockList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your stock_adjustment data is safe!");
        }
      });
    },
    // Delete Checked Stock
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this stock_adjustment data!",
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
            .post("/stock_adjustment/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Stock data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncStockList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your stock_adjustment data is safe!");
        }
      });
    },
    editStock(id) {
      this.$router.push("/inventory/stock_adjustment/edit/" + id);
    },

    reset(event) {
      this.$store.commit("stock_adjustment/reset");
    },
    modalCloseClicked() {
      this.stock_adjustment.cvendor = "";
      this.stock_adjustment.tno = null;
      this.stock_adjustment.tdate = null;
      this.stock_adjustment.ccurrency = "";
      this.stock_adjustment.tnote = "";
      this.stock_adjustment.tshipping = null;
      this.stock_adjustment.tdocno = "";
      this.stock_adjustment.cacc = "";
      this.stock_adjustment.tdesc = "";
      this.stock_adjustment.id = null;
    },
    next() {
      this.$store.commit("stock_adjustment/incrementPage");
      this.loadAsyncStockList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("stock_adjustment/decrementPage");
        this.loadAsyncStockList();
      }
    },
    searchStock: debounce(function(event) {
      this.$store.commit("stock_adjustment/updateSearch", event);
      this.$store.commit("stock_adjustment/reset");
      this.$store.commit("stock_adjustment/filter");
      this.loadAsyncStockList();
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
    if (!this.stockList.length) this.loadAsyncStockList();
  },
  computed: {
    ...mapState({
      page: state => state.stock_adjustment.page,
      offset: state => state.stock_adjustment.offset,
      stockList: state => state.stock_adjustment.stockList,
      limit: state => state.stock_adjustment.filter.limit,
      filterDate: state => state.stock_adjustment.filter.date,
      showFilter: state => state.stock_adjustment.filter.showFilter,
      search: state => state.stock_adjustment.filter.search
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



