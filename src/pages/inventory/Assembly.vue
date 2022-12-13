<template>
  <div>
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
            <b-field label="Classification">
              <b-select placeholder="Select a classification" @input="updateClassification" :value="filterClassification" expanded>
                <option
                  v-for="classification in classificationList"
                  :key="classification.id"
                  :value="classification.id"
                >{{classification.name}}</option>
              </b-select>
            </b-field>
            <b-field label="Publish">
              <b-select placeholder="Select one" @input="updatePublish" :value="filterPublish" >
                <option value="1">Publish</option>
                <option value="0">Unpublish</option>
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
                @click="loadAsyncAssemblyList()"
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
                  @input="searchAssembly"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Table Assembly -->
          <div class="column is-12">
            <b-table
              :data="assemblyList"
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
                <b-table-column label="Code">{{ props.row.docno }}</b-table-column>
                <b-table-column class="is-uppercase" label="Currency">{{ props.row.currency }}</b-table-column>
                <b-table-column label="Branch">{{ props.row.branch }}</b-table-column>
                <b-table-column label="Date">{{ props.row.dates }}</b-table-column>
                <b-table-column label="Project">{{ props.row.project }}</b-table-column>
                <b-table-column class="is-capitalized" label="Product">{{ props.row.product }}</b-table-column>
                <b-table-column label="Action" style="min-width:140px">
                  <div class="buttons has-addons">
                    <b-tooltip
                      :label="props.row.status != 0?'Posted':'Confirmation'"
                      size="is-small"
                      type="is-dark"
                      position="is-bottom"
                      animated
                    >
                      <span
                        :class="props.row.status != 0 ? 'is-success' : 'is-danger'"
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
                        @click.prevent="editAssembly(props.row.id)"
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
                        @click.prevent="editAssembly(props.row.id)"
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
                        @click.prevent="deleteAssembly(props.row.id)"
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
                    class="pagination-link"
                    type="is-primary "
                    @click="isComponentModalActive = true"
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
    <b-modal :active.sync="isComponentModalActive" @close="modalCloseClicked()" has-modal-card>
      <form @submit.prevent="submitAssembly">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">{{id?"Edit": "Add New"}} Assembly</p>
          </header>
          <section class="modal-card-body">
            <b-field grouped group-multiline>
              <b-field label="Classification">
                <b-select
                  @input="setCode()"
                  placeholder="Select a classification"
                  v-model="classification"
                  expanded
                >
                  <option v-for="classification in classificationList" :value="classification.id" :key="classification.id">{{classification.name}}</option>
                </b-select>
              </b-field>
              <b-field label="Currency" expanded>
                <b-select expanded placeholder="Select Currency" v-model="currency">
                  <option v-for="currency in currencyList" :value="currency.code" :key="currency.code">{{currency.code}} - {{currency.name}}</option>
                </b-select>
              </b-field>
            </b-field>
            <b-field grouped group-multiline>
              <b-field label="Code" expanded>
                <b-input v-model="code" placeholder="Autogenerate" disabled />
              </b-field>
              <b-field label="No" expanded>
                <b-input v-model="no" />
              </b-field>
            </b-field>
            <b-field grouped group-multiline>
              <b-field label="Name" expanded>
                <b-input v-model="name" />
              </b-field>
              <b-field label="Alias" expanded>
                <b-input v-model="alias" />
              </b-field>
            </b-field>
            <div class="block has-text-right">
              <b-checkbox v-model="active">active</b-checkbox>
              <b-checkbox v-model="bank">Bank / Cash</b-checkbox>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-primary" @click.prevent="submitAssembly()">Save</button>
            <button
              class="button is-danger"
              type="button"
              @click="isComponentModalActive = false"
            >Close</button>
            <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
          </footer>
        </div>
      </form>
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
import invoice from "@/components/Transaction/CashInOutInvoice";
export default {
  components: {
    invoice
  },
  data() {
    return {
      activeIndex: 0,
      checkedRows: [],
      classificationList: [],
      currencyList: [],
      count: 0,
pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      isInvoiceModalActive: false,
      id: null,
      classification: "",
      code: "",
      no: "",
      name: "",
      alias: "",
      currency: "",
      active: false,
      bank: false
    };
  },
  methods: {
    /*
     * Load async AssemblyList
     */
    loadAsyncAssemblyList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset,
        classification: this.filterClassification,
      };
      if(this.filterPublish) bodyRequest.publish = this.filterPublish
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/assembly/search", bodyRequest);
      } else {
        ajax = this.axios.post("/assembly", bodyRequest);
      }
      ajax
        .then(res => {
          let assembly = res.data.content.result
this.count = res.data.content.record
          if (assembly) this.$store.commit("assembly/addAssemblyList", assembly);
          else this.$store.commit("assembly/addAssemblyList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Load Currency
    loadCurrency() {
      this.axios.get("/currency").then(res => {
        this.currencyList = [];
        let currency = res.data.content.result
        currency.map(el => {
          this.currencyList.push(el);
        });
      });
    },

    // Load Classification
    loadClassification() {
      this.axios.get("/classification").then(res => {
        this.classificationList = [];
        let classification = res.data.content.result
        classification.map(el => {
          let classification = {};
          classification.id = el.id;
          classification.name = el.name;
          classification.code = el.no;
          this.classificationList.push(classification);
        });
      });
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("assembly/filter");
      this.loadAsyncAssemblyList();
    },
    isFilterShow() {
      this.$store.commit("assembly/isFilterShow", !this.showFilter);
    },

    // Set Update for filter
    updateClassification(value) {
      this.$store.commit("assembly/updateClassification", value);
    },
    // Set Update for filter
    updatePublish(value) {
      this.$store.commit("assembly/updatePublish", value);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/assembly/confirmation/${id}`).then(res => {
        this.loadAsyncAssemblyList();
      });
    },
    setCode() {
      var found = null
      found = this.classificationList.find((element) => {
        let selected = element.id == this.classification;
        return selected;
      });
      this.code = found.code;
    },

    // Delete Assembly
    deleteAssembly(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this assembly data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/assembly/delete/${id}`)
            .then(res => {
              swal("Poof! Your assembly data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncAssemblyList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your assembly data is safe!");
        }
      });
    },
    // Delete Checked Assembly
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this assembly data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          let bodyRequest = {};
          this.checkedRows.map((el, index) => {
            bodyRequest[`cek[${index}]`] = el.id;
          });
          this.axios
            .post("/assembly/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Assembly data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncAssemblyList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your assembly data is safe!");
        }
      });
    },
    editAssembly(id) {
      this.$router.push(`assembly/edit/${id}`)
    },
    // Modal Action
    submitAssembly() {
      this.isLoading = true;
      let bodyRequest = {
        cclassification: this.classification,
        tcode: this.code,
        tno: this.no,
        tname: this.name,
        talias: this.alias,
        ccurrency: this.currency,
        tactive: this.active ? 1 : 0,
        tbank: this.bank ? 1 : 0
      };
      let submit;
      if (this.id) {
        submit = this.axios.post(
          `/assembly/update/${this.id}`,
          urlEncoded(bodyRequest)
        );
      } else {
        submit = this.axios.post("/assembly/add", urlEncoded(bodyRequest));
      }
      submit
        .then(res => {
          this.isLoading = false;
          let err = res.data.error;
          if (Number.isNaN(err)) {
            let errMessage = err
              .replace(/(<p>)/g, "* ")
              .replace(/(<\/p>)/g, "");
            swal("Failed!", errMessage, "warning");
          } else {
            this.isComponentModalActive = false
            swal("Success!", "Submit successfully!", "success");
            this.loadAsyncAssemblyList()
          }
        })
        .catch(err => {
          this.isLoading = false;
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "error");
        });
    },

    reset(event) {
      this.$store.commit("assembly/reset");
    },
    modalCloseClicked() {
      this.id = null;
      this.classification = "";
      this.code = "";
      this.no = "";
      this.name = "";
      this.alias = "";
      this.currency = "";
      this.active = false;
      this.bank = false;
    },
    next() {
      this.$store.commit("assembly/incrementPage");
      this.loadAsyncAssemblyList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("assembly/decrementPage");
        this.loadAsyncAssemblyList();
      }
    },
    searchAssembly: debounce(function(event) {
      this.$store.commit("assembly/updateSearch", event);
      this.$store.commit("assembly/reset");
      this.$store.commit("assembly/filter");
      this.loadAsyncAssemblyList();
    }, 500)
  },
created() {
    if (!this.assemblyList.length) this.loadAsyncAssemblyList();
    this.loadClassification(); 
    this.loadCurrency();
  },
  computed: {
    ...mapState({
      page: state => state.assembly.page,
      offset: state => state.assembly.offset,
      assemblyList: state => state.assembly.assemblyList,
      limit: state => state.assembly.filter.limit,
      showFilter: state => state.assembly.filter.showFilter,
      filterClassification: state => state.assembly.filter.classification,
      filterPublish: state => state.assembly.filter.publish,
      search: state => state.assembly.filter.search
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



