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
            <b-field label="City">
              <b-select placeholder="Select a city" @input="updateCity" :value="city" expanded>
                <option
                  v-for="city in cityList"
                  :key="city.city_id"
                  :value="city.city_id"
                >{{city.city_name}}</option>
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
        <!-- <h4 class="itle is-5">Branch - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                v-if="!showFilter"
                type="is-primary"
                @click.prevent="isFilterShow()"
              >{{showFilter?"Close": "Show"}} Filter</b-button>
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncBranchList()"
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
                  @input="searchBranch"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Branch -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitBranch">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Branch</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Name" expanded>
                      <b-input v-model="name" />
                    </b-field>
                    <b-field label="Email" expanded>
                      <b-input type="email" v-model="email" />
                    </b-field>
                  </b-field>

                  <b-field grouped group-multiline>
                    <b-field label="Phone" expanded>
                      <b-input v-model="phone" />
                    </b-field>
                    <b-field label="Mobile" expanded>
                      <b-input v-model="mobile" />
                    </b-field>
                  </b-field>

                  <b-field grouped group-multiline>
                    <b-field label="Branch Code">
                      <b-input v-model="code" />
                    </b-field>
                    <b-field label="City">
                      <b-select placeholder="Select a city" v-model="city" expanded>
                        <option v-for="city in cityList" :value="city.city_id" :key="city.city_id">{{city.city_name}}</option>
                      </b-select>
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Address" expanded>
                      <b-input v-model="address" type="textarea" expanded />
                    </b-field>
                    <b-field label="Zip Code">
                      <b-input v-model="zip" />
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Sales">
                      <b-field expanded>
                        <b-input v-model="sales" disabled />
                        <p class="control">
                          <button
                            name="sales"
                            class="button is-primary"
                            @click="showAddAccountModal($event)"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                    <b-field label="Stock">
                      <b-field expanded>
                        <b-input v-model="stock" disabled />
                        <p class="control">
                          <button
                            name="stock"
                            class="button is-primary"
                            @click="showAddAccountModal($event)"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Unit Cost">
                      <b-field expanded>
                        <b-input v-model="cost" disabled />
                        <p class="control">
                          <button
                            name="cost"
                            class="button is-primary"
                            @click="showAddAccountModal($event)"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                    <b-field label="AR">
                      <b-field expanded>
                        <b-input v-model="ar" disabled />
                        <p class="control">
                          <button
                            name="ar"
                            class="button is-primary"
                            @click="showAddAccountModal($event)"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Bank">
                      <b-field expanded>
                        <b-input v-model="bank" disabled />
                        <p class="control">
                          <button
                            name="bank"
                            class="button is-primary"
                            @click="showAddAccountModal($event)"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                    <b-field label="Cash">
                      <b-field expanded>
                        <b-input v-model="cash" disabled />
                        <p class="control">
                          <button
                            name="cash"
                            class="button is-primary"
                            @click="showAddAccountModal($event)"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitBranch()">Save</button>
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

          <!-- Modals Account -->
          <b-modal :active.sync="isComponentAccountModalActive" has-modal-card>
            <div class="modal-card" style="width: auto">
              <header class="modal-card-head">
                <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
              </header>
              <section class="modal-card-body">
                <add-account @selected="itemSelected"></add-account>
              </section>
            </div>
          </b-modal>

          <!-- Table Branch -->
          <div class="column is-12">
            <b-table
              :data="branchList"
              :loading="loading"
              :hoverable="rue"
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
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Phone">{{ props.row.phone }}</b-table-column>
                <b-table-column label="Email">{{ props.row.email }}</b-table-column>
                <b-table-column label="City">{{ props.row.city }}</b-table-column>

                <b-table-column label="Action" style="min-width:110px">
                  <div class="buttons has-addons">
                    <b-tooltip
                      label="Primary Status"
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
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small is-info"
                        @click.prevent="editBranch(props.row.id)"
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
                        @click.prevent="deleteBranch(props.row.id)"
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
import addAccount from "../../../src/components/Transaction/AddAccountCashin.vue";
import debounce from "debounce";
import swal from "sweetalert";
export default {
  data() {
    return {
      activeIndex: 0,
      cityList: [],
      checkedRows: [],
      count: 0,
pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      isComponentAccountModalActive: false,
      selectedInput: null,
      // AddNewBranch
      name: "",
      code: "",
      phone: "",
      mobile: "",
      email: " ",
      address: "",
      city: "",
      zip: "",

      // Account
      sales: "",
      stock: "",
      cost: "",
      ar: "",
      bank: "",
      cash: "",

      // Edit Branch
      id: null
    };
  },
  components: {
    addAccount
  },
  methods: {
    /*
     * Load async BranchList
     */
    loadAsyncBranchList() {
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
        ajax = this.axios.post("/branch/search", bodyRequest);
      } else {
        ajax = this.axios.post("/branch", bodyRequest);
      }
      ajax
        .then(res => {
          let branch = res.data.content.result
          if (branch) this.$store.commit("branch/addBranchList", branch);
          else this.$store.commit("branch/addBranchList", []);
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
          this.cityList = res.data.rajaongkir.results;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // Set City for filter
    updateCity(value) {
      this.$store.commit("branch/updateCity", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("branch/filter");
      this.loadAsyncBranchList();
    },
    isFilterShow() {
      this.$store.commit("branch/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/branch/publish/${id}`).then(res => {
        this.loadAsyncBranchList();
      });
    },
    showAddAccountModal(event) {
      event.preventDefault();
      this.selectedInput = event.target.attributes.name.nodeValue;
      this.isComponentAccountModalActive = true;
    },
    itemSelected(code) {
      switch (this.selectedInput) {
        case "sales":
          this.sales = code;
          break;
        case "stock":
          this.stock = code;
          break;
        case "cost":
          this.cost = code;
          break;
        case "ar":
          this.ar = code;
          break;
        case "bank":
          this.bank = code;
          break;
        case "cash":
          this.cash = code;
          break;
      }
      this.isComponentAccountModalActive = false;
    },
    // Delete Branch
    deleteBranch(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this branch data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/branch/delete/${id}`)
            .then(res => {
              swal("Poof! Your branch data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncBranchList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your branch data is safe!");
        }
      });
    },
    // Delete Checked Branch
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this branch data!",
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
            .post("/branch/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Branch data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncBranchList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your branch data is safe!");
        }
      });
    },
    editBranch(id) {
      this.axios.get(`/branch/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.name = data.name;
        this.code = data.code;
        this.phone = data.phone;
        this.mobile = data.mobile;
        this.email = data.email;
        this.address = data.address;
        this.city = data.city;
        this.zip = data.zip;
        this.sales = data.sales_acc;
        this.stock = data.stock_acc;
        this.cost = data.unit_cost_acc;
        this.ar = data.ar_acc;
        this.bank = data.bank_acc;
        this.cash = data.cash_acc;
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitBranch() {
      let branchData = {
        tname: this.name,
        tcode: this.code,
        tphone: this.phone,
        tmobile: this.mobile,
        tmail: this.email,
        taddress: this.address,
        ccity: this.city,
        tzip: this.zip,
        tsalesacc: this.sales,
        tstockacc: this.stock,
        tunitacc: this.cost,
        taracc: this.ar,
        tbankacc: this.bank,
        tcashacc: this.cash
      };
      // console.log(urlEncoded(branchData))
      let submit;
      if (this.id) {
        branchData.id = this.id;
        submit = this.axios.post(
          `/branch/update/${this.id}`,
          urlEncoded(branchData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/branch/add", urlEncoded(branchData), {
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
            swal("Success!", "Branch submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncBranchList();
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
      this.$store.commit("branch/reset");
    },
    modalCloseClicked() {
      this.name = "";
      this.code = "";
      this.phone = "";
      this.mobile = "";
      this.email = " ";
      this.address = "";
      this.city = "";
      this.zip = "";
      this.sales = "";
      this.stock = "";
      this.cost = "";
      this.ar = "";
      this.bank = "";
      this.cash = "";
      this.id = null;
    },
    next() {
      this.$store.commit("branch/incrementPage");
      this.loadAsyncBranchList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("branch/decrementPage");
        this.loadAsyncBranchList();
      }
    },
    searchBranch: debounce(function(event) {
      this.$store.commit("branch/updateSearch", event);
      this.$store.commit("branch/reset");
      this.$store.commit("branch/filter");
      this.loadAsyncBranchList();
    }, 500)
  },
created() {
    if (!this.branchList.length) this.loadAsyncBranchList();
    this.loadCity();
  },
  computed: {
    ...mapState({
      page: state => state.branch.page,
      offset: state => state.branch.offset,
      branchList: state => state.branch.branchList,
      limit: state => state.branch.filter.limit,
      showFilter: state => state.branch.filter.showFilter,
      city: state => state.branch.filter.city,
      search: state => state.branch.filter.search
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



