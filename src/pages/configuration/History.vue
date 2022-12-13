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
                  @click="loadAsyncHistoryList()"
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
                    @input="searchHistory"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>

            <!-- Table History -->
            <div class="column is-12">
              <b-table
                :data="historyList"
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
                  <b-table-column label="ID">{{ props.row.id }}</b-table-column>
                  <b-table-column label="Username">{{ props.row.user }}</b-table-column>
                  <b-table-column label="Date">{{ props.row.date }}</b-table-column>
                  <b-table-column label="Time">{{ props.row.time }}</b-table-column>
                  <b-table-column label="Component">{{props.row.component || "-"}}</b-table-column>
                  <b-table-column label="Activity">{{ props.row.activity }}</b-table-column>
                  <b-table-column label="Field">{{ props.row.field || "-" }}</b-table-column>

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
                          class="is-success button is-small"
                        >
                          <b-icon size="is-small" icon="power" />
                        </span>
                      </b-tooltip>

                      <b-tooltip
                        type="is-dark"
                        label="Voucher"
                        size="is-small"
                        position="is-bottom"
                        animated
                      >
                        <span
                          class="button is-small is-warning"
                          @click.prevent="showVoucher(props.row.id)"
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
                          @click.prevent="editHistory(props.row.id)"
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
                          @click.prevent="deleteHistory(props.row.id)"
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
                      tag="router-link"
                      class="pagination-link"
                      type="is-primary "
                      to="/transaction/history/add"
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
      <b-modal :active.sync="isVoucherModalActive" has-modal-card>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Voucher</p>
          </header>
          <section class="modal-card-body">
            <voucher v-bind="voucher" id="printVoucher" />
          </section>
          <footer class="modal-card-foot">
            <b-button
              @click="print('printVoucher', 'html')"
              type="is-primary"
              icon-left="printer"
            >Print</b-button>
            <button class="button" type="button" @click="isVoucherModalActive=false">Close</button>
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
import voucher from "@/components/Configuration/log_voucher";
export default {
  components: {
    voucher
  },
  data() {
    return {
      activeIndex: 0,
      checkedRows: [],
      history: {
        cityList: []
      },
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      isVoucherModalActive: false,
      voucher: null
    };
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    /*
     * Load async HistoryList
     */
    loadAsyncHistoryList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset
      };
      if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/log/search", bodyRequest);
      } else {
        ajax = this.axios.post("/log", bodyRequest);
      }
      ajax
        .then(res => {
          let history = res.data.content.result;
          this.count = res.data.content.record;
          console.log(history);
          if (history) this.$store.commit("history/addHistoryList", history);
          else this.$store.commit("history/addHistoryList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Set Dadet for filter
    updateDate(value) {
      this.$store.commit("history/updateDate", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("history/filter");
      this.loadAsyncHistoryList();
    },
    isFilterShow() {
      this.$store.commit("history/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/log/confirmation/${id}`).then(res => {
        this.loadAsyncHistoryList();
      });
    },
    // Show Voucher
    showVoucher(id) {
      this.axios.get(`/log/get/${id}`).then(res => {
        this.isVoucherModalActive = true;
        this.voucher = res.data.content;
        console.log(this.voucher);
      });
    },
    // Delete History
    deleteHistory(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this history data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/log/delete/${id}`)
            .then(res => {
              swal("Poof! Your history data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncHistoryList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your history data is safe!");
        }
      });
    },
    // Delete Checked History
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this history data!",
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
            .post("/log/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! History data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncHistoryList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your history data is safe!");
        }
      });
    },
    editHistory(id) {
      this.$router.push("/transaction/history/edit/" + id);
    },

    reset(event) {
      this.$store.commit("history/reset");
    },
    next() {
      this.$store.commit("history/incrementPage");
      this.loadAsyncHistoryList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("history/decrementPage");
        this.loadAsyncHistoryList();
      }
    },
    searchHistory: debounce(function(event) {
      this.$store.commit("history/updateSearch", event);
      this.$store.commit("history/reset");
      this.$store.commit("history/filter");
      this.loadAsyncHistoryList();
    }, 500),
    print() {
      let attachment = document.getElementById("printVoucher");
      printJS({
        printable: "printVoucher",
        type: "html",
        header: null,
        targetStyles: ["*"]
      });
    }
  },
created() {
    if (!this.historyList.length) this.loadAsyncHistoryList();
  },
  computed: {
    ...mapState({
      page: state => state.history.page,
      offset: state => state.history.offset,
      historyList: state => state.history.historyList,
      limit: state => state.history.filter.limit,
      showFilter: state => state.history.filter.showFilter,
      filterDate: state => state.history.filter.date,
      search: state => state.history.filter.search
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



