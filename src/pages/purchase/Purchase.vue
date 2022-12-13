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
              <b-field label="Vendor">
                <b-select placeholder="Select a vendor" @input="updateVendor" :value="filterVendor">
                  <option
                    v-for="vendor in vendorList"
                    :key="vendor.id"
                    :value="vendor.id"
                  >{{vendor.name}}</option>
                </b-select>
              </b-field>
              <b-field label="Select Date">
                <b-datepicker
                  editable
                  :date-parser="dateFormat"
                  :date-formatter="dateFormat"
                  placeholder="Click to select..."
                  icon="calendar-today"
                   @input="updateDate" :value="filterDate"
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
                  @click="loadAsyncPurchaseList()"
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
                    @input="searchPurchase"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>

            <!-- Table Purchase -->
            <div class="column is-12">
              <b-table
                :data="purchaseList"
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
                  <b-table-column label="Account" centered>{{ props.row.account }}</b-table-column>
                  <b-table-column label="Total" numeric>
                    <numeric :value="props.row.amount" />
                  </b-table-column>
                  <b-table-column
                    field="status"
                    label="Status"
                    centered
                  >{{ props.row.trans_status }}</b-table-column>
                  <b-table-column field="balance" label="Balance" numeric>
                    <numeric :value="props.row.balance" />
                  </b-table-column>

                  <b-table-column label="Action" style="min-width:140px">
                    <div class="buttons has-addons">
                      <b-tooltip
                        :label="props.row.status != 0?'Posted':'Confirmation'"
                        size="is-small"
                        type="is-dark"
                        position="is-bottom"
                        animated
                      >
                        <span v-if="props.row.status != 0" class="is-success button is-small">
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
                          @click.prevent="editPurchase(props.row.id)"
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
                          @click.prevent="deletePurchase(props.row.id)"
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
                      to="/purchase/purchase_order/add"
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

    <!-- Form Purchase -->
    <formPurchase v-bind="purchase" v-if="isComponentModalActive" />
  </div>
</template>
<script>
import print from "print-js";
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
import invoice from "@/components/Purchase/PurchaseInvoice.vue";
import formPurchase from "@/components/Purchase/FormPurchase.vue";
export default {
  components: {
    invoice,
    formPurchase
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
      vendorList: [],
      filter: {
        vendor: null,
        date: null
      }
    };
  },
  methods: {

    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async PurchaseList
     */
    loadAsyncPurchaseList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset,
        vendor: this.filterVendor,
      };
      if(this.filterDate)  bodyRequest.date = this.dateFormat(this.filterDate)
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/purchase/search", bodyRequest);
      } else {
        ajax = this.axios.post("/purchase", bodyRequest);
      }
      ajax
        .then(res => {
          let purchase = res.data.content.result
this.count = res.data.content.record
          if (purchase)
            this.$store.commit("purchase/addPurchaseList", purchase);
          else this.$store.commit("purchase/addPurchaseList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    
    // Load Vendor
    loadVendor() {
      this.axios.get("/vendor").then(res => {
        this.vendorList = [];
        let vendor = res.data.content.result
        vendor.map(el => {
          this.vendorList.push(el);
        });
      });
    },
   
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("purchase/filter");
      this.loadAsyncPurchaseList();
    },
    isFilterShow() {
      this.$store.commit("purchase/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/purchase/confirmation/${id}`).then(res => {
        this.loadAsyncPurchaseList();
      });
    },
    // Show Invoice
    showInvoice(id) {
      this.axios.get(`/purchase/get/${id}`).then(res => {
        this.isInvoiceModalActive = true;
        this.invoice = res.data.content
        console.log(this.invoice);
      });
    },
    // Set Vendor for filter
    updateVendor(value) {
      this.$store.commit("purchase/updateVendor", value);
    },
    // Set Dadet for filter
    updateDate(value) {
      this.$store.commit("purchase/updateDate", value);
    },
    // Delete Purchase
    deletePurchase(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this purchase data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/purchase/delete/${id}`)
            .then(res => {
              swal("Poof! Your purchase data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncPurchaseList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your purchase data is safe!");
        }
      });
    },
    // Delete Checked Purchase
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this purchase data!",
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
            .post("/purchase/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Purchase data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncPurchaseList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your purchase data is safe!");
        }
      });
    },
    editPurchase(id) {
      this.$router.push("/purchase/purchase_order/edit/" + id);
    },
    
    reset(event) {
      this.$store.commit("purchase/reset");
    },
    modalCloseClicked() {
      this.purchase.cvendor = "";
      this.purchase.tno = null;
      this.purchase.tdate = null;
      this.purchase.ccurrency = "";
      this.purchase.tnote = "";
      this.purchase.tshipping = null;
      this.purchase.tdocno = "";
      this.purchase.cacc = "";
      this.purchase.tdesc = "";
      this.purchase.id = null;
    },
    next() {
      this.$store.commit("purchase/incrementPage");
      this.loadAsyncPurchaseList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("purchase/decrementPage");
        this.loadAsyncPurchaseList();
      }
    },
    searchPurchase: debounce(function(event) {
      this.$store.commit("purchase/updateSearch", event);
      this.$store.commit("purchase/reset");
      this.$store.commit("purchase/filter");
      this.loadAsyncPurchaseList();
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
    if (!this.purchaseList.length) this.loadAsyncPurchaseList();
    this.loadVendor();
  },
  computed: {
    ...mapState({
      page: state => state.purchase.page,
      offset: state => state.purchase.offset,
      purchaseList: state => state.purchase.purchaseList,
      limit: state => state.purchase.filter.limit,
      showFilter: state => state.purchase.filter.showFilter,
      filterVendor: state => state.purchase.filter.vendor,
      filterDate: state => state.purchase.filter.date,
      search: state => state.purchase.filter.search
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



