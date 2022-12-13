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
        <!-- <h4 class="title is-5">Tax - Global Permata</h4> -->

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
                @click="loadAsyncTaxList()"
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
                  @input="searchTax"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Tax -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitTax">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Tax</p>
                </header>
                <section class="modal-card-body">
                  <b-field label="Code" expanded>
                    <b-input v-model="code" />
                  </b-field>
                  <b-field label="Name" expanded>
                    <b-input v-model="name" />
                  </b-field>
                  <b-field label="Value (%)" expanded>
                    <b-input v-model="value" />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitTax()">Save</button>
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

          <!-- Table Tax -->
          <div class="column is-12">
            <b-table
              :data="taxList"
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
                <b-table-column label="Code">{{ props.row.code }}</b-table-column>
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Value (%)">{{ props.row.value }}</b-table-column>

                <b-table-column label="Action">
                  <div class="buttons has-addons has-text-centered">
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span class="button is-small is-info" @click.prevent="editTax(props.row.id)">
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
                        @click.prevent="deleteTax(props.row.id)"
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
import debounce from "debounce";
import swal from "sweetalert";
export default {
  data() {
    return {
      activeIndex: 0,
      parentList: [],
      checkedRows: [],
      count: 0,
pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewTax
      code: "",
      userfile: null,
      name: "",
      value: "",

      // Edit Tax
      id: null
    };
  },
  methods: {
    /*
     * Load async TaxList
     */
    loadAsyncTaxList() {
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
        ajax = this.axios.post("/tax/search", bodyRequest);
      } else {
        ajax = this.axios.post("/tax", bodyRequest);
      }
      ajax
        .then(res => {
          let tax = res.data.content.result
this.count = res.data.content.record
          if (tax) this.$store.commit("tax/addTaxList", tax);
          else this.$store.commit("tax/addTaxList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Preview File
    previewFiles() {
      let files = this.$refs.myFiles.files;
      this.userfile = files[0];
      console.log(this.userfile);
      if (this.userfile) {
        this.code = URL.createObjectURL(this.userfile);
      } else {
        this.code = "";
      }
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("tax/filter");
      this.loadAsyncTaxList();
    },
    isFilterShow() {
      this.$store.commit("tax/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/tax/publish/${id}`).then(res => {
        this.loadAsyncTaxList();
      });
    },
    // Delete Tax
    deleteTax(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this tax data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/tax/delete/${id}`)
            .then(res => {
              swal("Poof! Your tax data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncTaxList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your tax data is safe!");
        }
      });
    },
    // Delete Checked Tax
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this tax data!",
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
            .post("/tax/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Tax data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncTaxList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your tax data is safe!");
        }
      });
    },
    editTax(id) {
      this.axios.get(`/tax/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.name = data.name;
        this.code = data.code;
        this.value = (data.value * 100);
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitTax() {
      let taxData = {
        tcode: this.code,
        tname: this.name,
        tvalue: this.value
      };
      let submit;
      if (this.id) {
        taxData.id = this.id;
        submit = this.axios.post(
          `/tax/update/${this.id}`,
          urlEncoded(taxData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/tax/add", urlEncoded(taxData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }
      submit
        .then(res => {
          console.log(res);
          let err = res.data.error;
          swal("Success!", "Tax submit successfully!", "success");
          this.isComponentModalActive = false;
          this.loadAsyncTaxList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset(event) {
      this.$store.commit("tax/reset");
    },
    modalCloseClicked() {
      (this.code = ""),
        (this.userfile = null),
        (this.name = ""),
        (this.value = ""),
        (this.id = null);
    },
    next() {
      this.$store.commit("tax/incrementPage");
      this.loadAsyncTaxList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("tax/decrementPage");
        this.loadAsyncTaxList();
      }
    },
    searchTax: debounce(function(event) {
      this.$store.commit("tax/updateSearch", event);
      this.$store.commit("tax/reset");
      this.$store.commit("tax/filter");
      this.loadAsyncTaxList();
    }, 500)
  },
created() {
    if (!this.taxList.length) this.loadAsyncTaxList();
  },
  computed: {
    ...mapState({
      page: state => state.tax.page,
      offset: state => state.tax.offset,
      taxList: state => state.tax.taxList,
      limit: state => state.tax.filter.limit,
      showFilter: state => state.tax.filter.showFilter,
      search: state => state.tax.filter.search
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



