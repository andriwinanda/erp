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
              <b-select
                placeholder="Select a city"
                @input="updateCity"
                :value="filterCity"
                expanded
              >
                <option
                  v-for="city in cityList"
                  :key="city.city_id"
                  :value="city.city_id"
                >{{city.city_name}}</option>
              </b-select>
            </b-field>
            <b-field label="Publish">
              <b-select placeholder="Select one" @input="updatePublish" :value="filterPublish">
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
        <!-- <h4 class="title is-5">Customer - Global Permata</h4> -->

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
                @click="loadAsyncCustomerList()"
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
                  @input="searchCustomer"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Modal-->
          <div class="control">
            <b-modal
              :active.sync="isComponentModalActive"
              @close="modalCloseClicked()"
              has-modal-card
            >
              <form @submit.prevent="submitCustomer">
                <div class="modal-card" style="width: auto">
                  <header class="modal-card-head">
                    <p class="modal-card-title">Add New customer</p>
                  </header>
                  <section class="modal-card-body">
                    <b-field grouped group-multiline>
                      <b-field label="First Name" expanded>
                        <b-input v-model="tfname" />
                      </b-field>
                      <b-field label="Last Name" expanded>
                        <b-input v-model="tlname" />
                      </b-field>
                    </b-field>

                    <b-field grouped group-multiline>
                      <b-field label="Phone" expanded>
                        <b-input v-model="tphone" />
                      </b-field>
                      <b-field label="Mobile" expanded>
                        <b-input v-model="tmobile" />
                      </b-field>
                    </b-field>

                    <b-field grouped group-multiline>
                      <b-field label="Email" expanded>
                        <b-input type="email" v-model="temail" />
                      </b-field>
                      <b-field label="customer Type">
                        <b-select expanded placeholder="Select Type" v-model="ctype">
                          <option value="customer">Customer</option>
                          <option value="member">Member</option>
                        </b-select>
                      </b-field>
                    </b-field>

                    <b-field grouped group-multiline>
                      <b-field label="NPWP" expanded>
                        <b-input v-model="tnpwp" />
                      </b-field>
                      <b-field label="FAX" expanded>
                        <b-input v-model="tfax" />
                      </b-field>
                    </b-field>

                    <b-field label="Address">
                      <b-input v-model="taddress" type="textarea" expanded />
                    </b-field>
                    <b-checkbox>Use this address for shiping</b-checkbox>
                    <b-field label="City">
                      <b-select placeholder="Select a city" v-model="ccity" expanded>
                        <option
                          v-for="city in cityList"
                          :value="city.city_id"
                          :key="city.city_id"
                        >{{city.city_name}}</option>
                      </b-select>
                    </b-field>
                    <b-field grouped group-multiline>
                      <b-field label="Zip Code" expanded>
                        <b-input v-model="tzip" />
                      </b-field>
                      <b-field label="Website" expanded>
                        <b-input v-model="twebsite" />
                      </b-field>
                    </b-field>
                  </section>
                  <footer class="modal-card-foot">
                    <button class="button is-primary" @click.prevent="submitCustomer()">Save</button>
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
          </div>

          <!-- Table customer -->
          <div class="column is-12">
            <b-table
              :data="customerList"
              :loading="loading"
              :hoverable="true"
              :checked-rows.sync="checkedRows"
              :is-row-checkable="(row) => row.id !== 3"
              checkable
              :per-page="perPage"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
            >
              <template slot-scope="props">
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Type">{{ props.row.type }}</b-table-column>
                <b-table-column label="Phone">{{ props.row.phone1 }}</b-table-column>
                <b-table-column label="Email">{{ props.row.email }}</b-table-column>
                <b-table-column field="city" label="City">{{ props.row.city }}</b-table-column>

                <b-table-column label="Action">
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
                        @click.prevent="editCustomer(props.row.id)"
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
                        @click.prevent="deleteCustomer(props.row.id)"
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
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";

export default {
  data() {
    return {
      activeIndex: 0,
      checkedRows: [],
      cityList: [],
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewcustomer
      tfname: "",
      tlname: "",
      ctype: "",
      tphone: "",
      tmobile: "",
      temail: " ",
      tnpwp: "",
      tfax: "",
      taddress: "",
      ccity: "",
      tzip: "",
      twebsite: "",
      cdistrict: "",
      userfile: "",
      // Edit customer
      id: null
    };
  },
  methods: {
    /*
     * Load async CustomerList
     */
    loadAsyncCustomerList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset,
        city: this.filterCity,
        publish: this.filterPublish
      };
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/customer/search", bodyRequest);
      } else {
        ajax = this.axios.post("/customer", bodyRequest);
      }
      ajax
        .then(res => {
          let customer = res.data.content.result;
          this.count = res.data.content.record;
          if (customer)
            this.$store.commit("customer/addCustomerList", customer);
          else this.$store.commit("customer/addCustomerList", []);
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
      this.$store.commit("customer/updateCity", value);
    },
    // Set Update for filter
    updatePublish(value) {
      this.$store.commit("customer/updatePublish", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("customer/filter");
      this.loadAsyncCustomerList();
    },
    isFilterShow() {
      this.$store.commit("customer/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/customer/publish/${id}`).then(res => {
        this.loadAsyncCustomerList();
      });
    },
    // Delete Customer
    deleteCustomer(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this customer data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/customer/delete/${id}`)
            .then(res => {
              swal("Poof! Your customer data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncCustomerList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your customer data is safe!");
        }
      });
    },
    // Delete Checked Customer
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this customer data!",
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
            .post("/customer/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Customer data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncCustomerList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your customer data is safe!");
        }
      });
    },
    editCustomer(id) {
      this.axios.get(`/customer/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.tfname = data.fname;
        this.tlname = data.lname;
        this.tcp = data.cp1;
        this.ctype = data.type;
        this.tphone = data.phone1;
        this.mobile = data.hp;
        this.temail = data.email;
        this.tnpwp = data.npwp;
        this.fax = data.fax;
        this.taddress = data.address;
        this.ccity = data.city;
        this.tzip = data.zip;
        this.twebsite = data.website;
        this.taccname = data.acc_name;
        this.taccno = data.acc_no;
        this.tbank = data.bank;
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitCustomer() {
      let customerData = {
        tfname: this.tfname,
        tlname: this.tlname,
        tcp: this.tcp,
        ctype: this.ctype,
        tphone1: this.tphone,
        tmobile: this.tmobile,
        temail: this.temail,
        tnpwp: this.tnpwp,
        tfax: this.tfax,
        taddress: this.taddress,
        ccity: this.ccity,
        tzip: this.tzip,
        twebsite: this.twebsite,
        taccname: this.taccname,
        taccno: this.taccno,
        tbank: this.tbank
      };
      // console.log(urlEncoded(customerData))
      let submit;
      if (this.id) {
        customerData.id = this.id;
        submit = this.axios.post(
          `/customer/update/${this.id}`,
          urlEncoded(customerData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/customer/add", urlEncoded(customerData), {
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
            swal("Success!", "Customer submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncCustomerList();
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
      this.$store.commit("customer/reset");
    },
    modalCloseClicked() {
      this.tfname = "";
      this.tlname = "";
      this.tcp = "";
      this.ctype = "";
      this.tphone = "";
      this.tmobile = "";
      this.temail = " ";
      this.tnpwp = "";
      this.tfax = "";
      this.taddress = "";
      this.ccity = "";
      this.tzip = "";
      this.twebsite = "";
      this.taccname = "";
      this.taccno = "";
      this.tbank = "";
      this.id = null;
    },
    next() {
      this.$store.commit("customer/incrementPage");
      this.loadAsyncCustomerList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("customer/decrementPage");
        this.loadAsyncCustomerList();
      }
    },
    searchCustomer: debounce(function(event) {
      this.$store.commit("customer/updateSearch", event);
      this.$store.commit("customer/reset");
      this.$store.commit("customer/filter");
      this.loadAsyncCustomerList();
    }, 500)
  },
  created() {
    if (!this.customerList.length) this.loadAsyncCustomerList();
    this.loadCity();
  },
  computed: {
    ...mapState({
      page: state => state.customer.page,
      offset: state => state.customer.offset,
      customerList: state => state.customer.customerList,
      limit: state => state.customer.filter.limit,
      showFilter: state => state.customer.filter.showFilter,
      filterCity: state => state.customer.filter.city,
      filterPublish: state => state.customer.filter.publish,
      search: state => state.customer.filter.search
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






