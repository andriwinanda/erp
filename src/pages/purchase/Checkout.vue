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
              <b-field label="Check No">
                <b-input
                  placeholder="Check Number"
                  type="search"
                  @input="updateCheckno"
                  :value="filterCheckno"
                />
              </b-field>
              <b-field label="Period">
                <b-datepicker
                  placeholder="Click to select..."
                  :date-parser="dateFormat"
                  icon="calendar-today"
                  @input="updateDate"
                  :value="filterDate"
                  range
                ></b-datepicker>
              </b-field>
              <b-field label="Type">
                <b-select placeholder="Select one" @input="updateType" :value="filterType">
                  <option value="purchase">Purchasing</option>
                  <option value="refund">AR-Refund</option>
                </b-select>
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
                  @click="loadAsyncCheckoutList()"
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
                    @input="searchCheckout"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>

            <!-- Table Checkout -->
            <div class="column is-12">
              <b-table
                :data="checkoutList"
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
                  <b-table-column label="Check No">{{ props.row.checkno }}</b-table-column>
                  <b-table-column label="Paymeny">{{ props.row.code }}</b-table-column>
                  <b-table-column label="Currency" class="is-uppercase" centered>{{ props.row.currency }}</b-table-column>
                  <b-table-column label="Bank">{{ props.row.account }}</b-table-column>
                  <b-table-column label="Date">{{ props.row.dates }}</b-table-column>
                  <b-table-column label="Due">{{ props.row.due }}</b-table-column>
                  <b-table-column label="Balance" numeric>
                    <numeric :value="props.row.amount" />
                  </b-table-column>

                  <!-- <b-table-column label="Action" style="min-width:140px">
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
                          @click.prevent="editCheckout(props.row.id)"
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
                          @click.prevent="deleteCheckout(props.row.id)"
                        >
                          <b-icon size="is-small" icon="delete" />
                        </span>
                      </b-tooltip>
                    </div>
                  </b-table-column> -->
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
                  <!-- <li>
                    <b-button
                      tag="router-link"
                      class="pagination-link"
                      type="is-primary "
                      to="/purchase/checkout/add"
                      icon-left="plus"
                    >Add New</b-button>
                  </li> -->
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
  </div>
</template>
<script>
import print from "print-js";
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
import invoice from "@/components/Purchase/AP_PaymentInvoice.vue";
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
      invoice: null
    };
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async CheckoutList
     */
    loadAsyncCheckoutList() {
      this.loading = true;
      let bodyRequest = {
        tno: this.filterCheckno,
        type: this.filterType,
        limit: this.limit,
        offset: this.offset
      };
      if (this.filterDate) {
        bodyRequest.start = this.dateFormat(this.filterDate[0]);
        bodyRequest.end = this.dateFormat(this.filterDate[1]);
      }
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/checkout/search", bodyRequest);
      } else {
        ajax = this.axios.post("/checkout", bodyRequest);
      }
      ajax
        .then(res => {
          let checkout = res.data.content.result
this.count = res.data.content.record;
          console.log(checkout);
          if (checkout)
            this.$store.commit("checkout/addCheckoutList", checkout);
          else this.$store.commit("checkout/addCheckoutList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("checkout/filter");
      this.loadAsyncCheckoutList();
    },
    isFilterShow() {
      this.$store.commit("checkout/isFilterShow", !this.showFilter);
    },
    // Set Dadet for filter
    updateDate(value) {
      this.$store.commit("checkout/updateDate", value);
    },
    // Set Dadet for filter
    updateCheckno(value) {
      this.$store.commit("checkout/updateCheckno", value);
    },
    // Set Dadet for filter
    updateType(value) {
      this.$store.commit("checkout/updateType", value);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/checkout/publish/${id}`).then(res => {
        this.loadAsyncCheckoutList();
      });
    },
    // Show Invoice
    showInvoice(id) {
      this.axios.get(`/checkout/invoice/${id}`).then(res => {
        this.isInvoiceModalActive = true;
        this.invoice = res.data.content
      });
    },
    // Delete Checkout
    deleteCheckout(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/checkout/delete/${id}`)
            .then(res => {
              swal("Poof! Your checkout data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncCheckoutList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your checkout data is safe!");
        }
      });
    },
    // Delete Checked Checkout
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this checkout data!",
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
            .post("/checkout/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Checkout data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncCheckoutList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your checkout data is safe!");
        }
      });
    },
    editCheckout(id) {
      this.$router.push("/purchase/checkout/edit/" + id);
    },

    reset() {
      this.$store.commit("checkout/reset");
    },
    next() {
      this.$store.commit("checkout/incrementPage");
      this.loadAsyncCheckoutList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("checkout/decrementPage");
        this.loadAsyncCheckoutList();
      }
    },
    searchCheckout: debounce(function(event) {
      this.$store.commit("checkout/updateSearch", event);
      this.$store.commit("checkout/reset");
      this.$store.commit("checkout/filter");
      this.loadAsyncCheckoutList();
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
    if (!this.checkoutList.length) this.loadAsyncCheckoutList();
  },
  computed: {
    ...mapState({
      page: state => state.checkout.page,
      offset: state => state.checkout.offset,
      checkoutList: state => state.checkout.checkoutList,
      limit: state => state.checkout.filter.limit,
      showFilter: state => state.checkout.filter.showFilter,
      filterDate: state => state.checkout.filter.date,
      filterCheckno: state => state.checkout.filter.checkno,
      filterType: state => state.checkout.filter.type,
      search: state => state.checkout.filter.search
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



