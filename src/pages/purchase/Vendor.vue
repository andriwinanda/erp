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
              <b-select placeholder="Select a city" @input="updateCity" :value="filterCity" expanded>
                <option
                  v-for="city in cityList"
                  :key="city.city_id"
                  :value="city.city_id"
                >{{city.city_name}}</option>
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
        <!-- <h4 class="title is-5">Vendor - Global Permata</h4> -->

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
                @click="loadAsyncVendorList()"
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
                  @input="searchVendor"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Vendor -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitVendor">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Vendor</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Name" expanded>
                      <b-input v-model="name" />
                    </b-field>
                    <b-field label="Contact Person" expanded>
                      <b-input v-model="cp" />
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
                    <b-field label="Email" expanded>
                      <b-input type="email" v-model="email" />
                    </b-field>
                    <b-field label="Vendor Type">
                      <b-select expanded placeholder="Select Type" v-model="type">
                        <option value="personal">Personal</option>
                        <option value="company">Company</option>
                      </b-select>
                    </b-field>
                  </b-field>

                  <b-field grouped group-multiline>
                    <b-field label="NPWP" expanded>
                      <b-input v-model="npwp" />
                    </b-field>
                    <b-field label="FAX" expanded>
                      <b-input v-model="fax" />
                    </b-field>
                  </b-field>

                  <b-field label="Address">
                    <b-input v-model="address" type="textarea" expanded />
                  </b-field>
                  <b-checkbox>Use this address for shiping</b-checkbox>
                  <b-field label="City">
                    <b-select placeholder="Select a city" v-model="city" expanded>
                      <option v-for="city in cityList" :value="city.city_id" :key="city.city_id" >{{city.city_name}}</option>
                    </b-select>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Zip Code" expanded>
                      <b-input v-model="zip" />
                    </b-field>
                    <b-field label="Website" expanded>
                      <b-input v-model="website" />
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Acc Name" expanded>
                      <b-input v-model="accname" />
                    </b-field>
                    <b-field label="Acc No" expanded>
                      <b-input v-model="accno" />
                    </b-field>
                  </b-field>
                  <b-field label="Bank Details">
                    <b-input v-model="bank" type="textarea" expanded />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitVendor()">Save</button>
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

          <!-- Table Vendor -->
          <div class="column is-12">
            <b-table
              :data="vendorList"
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
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Type">{{ props.row.type }}</b-table-column>
                <b-table-column label="Phone">{{ props.row.phone1 }}</b-table-column>
                <b-table-column label="Email">{{ props.row.email }}</b-table-column>

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
                        @click.prevent="editVendor(props.row.id)"
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
                        @click.prevent="deleteVendor(props.row.id)"
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
      // filter: {
      //   city: null,
      //   publish: null
      // },
      // AddNewVendor
      name: "",
      cp: "",
      type: "",
      phone: "",
      mobile: "",
      email: " ",
      npwp: "",
      fax: "",
      address: "",
      city: "",
      zip: "",
      website: "",
      accname: "",
      accno: "",
      bank: "",
      // Edit Vendor
      id: null
    };
  },
  methods: {
    /*
     * Load async VendorList
     */
    loadAsyncVendorList() {
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
        ajax = this.axios.post("/vendor/search", bodyRequest);
      } else {
        ajax = this.axios.post("/vendor", bodyRequest);
      }
      ajax
        .then(res => {
          let vendor = res.data.content.result
this.count = res.data.content.record
          if (vendor) this.$store.commit("vendor/addVendorList", vendor);
          else this.$store.commit("vendor/addVendorList", []);
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
      this.$store.commit("vendor/updateCity", value);
    },
    // Set Update for filter
    updatePublish(value) {
      this.$store.commit("vendor/updatePublish", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("vendor/filter");
      this.loadAsyncVendorList();
    },
    isFilterShow() {
      this.$store.commit("vendor/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/vendor/publish/${id}`).then(res => {
        this.loadAsyncVendorList();
      });
    },
    // Delete Vendor
    deleteVendor(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this vendor data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/vendor/delete/${id}`)
            .then(res => {
              swal("Poof! Your vendor data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncVendorList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your vendor data is safe!");
        }
      });
    },
    // Delete Checked Vendor
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this vendor data!",
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
            .post("/vendor/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Vendor data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncVendorList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your vendor data is safe!");
        }
      });
    },
    editVendor(id) {
      this.axios.get(`/vendor/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.name = data.name;
        this.cp = data.cp1;
        this.type = data.type;
        this.phone = data.phone1;
        this.mobile = data.hp;
        this.email = data.email;
        this.npwp = data.npwp;
        this.fax = data.fax;
        this.address = data.address;
        this.city = data.city;
        this.zip = data.zip;
        this.website = data.website;
        this.accname = data.acc_name;
        this.accno = data.acc_no;
        this.bank = data.bank;
        console.log(data);
        this.isComponentModalActive = true;
        console.log(res)
      });
    },
    // Modal Action
    submitVendor() {
      let vendorData = {
        tname: this.name,
        tcp: this.cp,
        ctype: this.type,
        tphone: this.phone,
        tmobile: this.mobile,
        temail: this.email,
        tnpwp: this.npwp,
        tfax: this.fax,
        taddress: this.address,
        ccity: this.city,
        tzip: this.zip,
        twebsite: this.website,
        taccname: this.accname,
        taccno: this.accno,
        tbank: this.bank
      };
      // console.log(urlEncoded(vendorData))
      let submit;
      if (this.id) {
        vendorData.id = this.id;
        submit = this.axios.post(
          `/vendor/update/${this.id}`,
          urlEncoded(vendorData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/vendor/add", urlEncoded(vendorData), {
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
            swal("Success!", "Vendor submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncVendorList();
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
      this.$store.commit("vendor/reset");
    },
    modalCloseClicked() {
      this.name = "";
      this.cp = "";
      this.type = "";
      this.phone = "";
      this.mobile = "";
      this.email = " ";
      this.npwp = "";
      this.fax = "";
      this.address = "";
      this.city = "";
      this.zip = "";
      this.website = "";
      this.accname = "";
      this.accno = "";
      this.bank = "";
      this.id = null;
    },
    next() {
      this.$store.commit("vendor/incrementPage");
      this.loadAsyncVendorList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("vendor/decrementPage");
        this.loadAsyncVendorList();
      }
    },
    searchVendor: debounce(function(event) {
      this.$store.commit("vendor/updateSearch", event);
      this.$store.commit("vendor/reset");
      this.$store.commit("vendor/filter");
      this.loadAsyncVendorList();
    }, 500)
  },
created() {
    if (!this.vendorList.length) this.loadAsyncVendorList();
    this.loadCity();
  },
  computed: {
    ...mapState({
      page: state => state.vendor.page,
      offset: state => state.vendor.offset,
      vendorList: state => state.vendor.vendorList,
      limit: state => state.vendor.filter.limit,
      showFilter: state => state.vendor.filter.showFilter,
      filterCity: state => state.vendor.filter.city,
      filterPublish: state => state.vendor.filter.publish,
      search: state => state.vendor.filter.search
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



