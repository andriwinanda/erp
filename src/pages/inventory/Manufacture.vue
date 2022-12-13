<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Manufacture - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                  type="is-primary"
                  icon-left="refresh"
                  @click="loadAsyncManufactureList()"
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
                  @input="searchManufacture"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Manufacture -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitManufacture">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Manufacture</p>
                </header>
                <section class="modal-card-body">
                  <b-field label="Name" expanded>
                    <b-input v-model="name" />
                  </b-field>
                  <b-field label="Order" expanded>
                    <b-input v-model="order" type="number"/>
                  </b-field>

                  <!-- Upload File -->
                  <b-field label="Upload Image">
                    <div class="file has-name is-fullwidth">
                      <label class="file-label">
                        <input
                          type="file"
                          accept="image/*"
                          id="file"
                          ref="myFiles"
                          class="file-input"
                          @change="previewFiles"
                        />
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-upload"></i>
                          </span>
                          <span class="file-label">Choose a file…</span>
                        </span>
                        <span class="file-name" v-if="userfile">{{userfile.name || file_url}}</span>
                        <span class="file-name" v-else>No image choosen</span>
                      </label>
                    </div>
                  </b-field>
                  <img v-if="file_url" class="image" :src="file_url" style="max-height: 150px" />
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitManufacture()">Save</button>
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

          <!-- Table Manufacture -->
          <div class="column is-12">
            <b-table
              :data="manufactureList"
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
                <b-table-column label="Name" >{{ props.row.name }}</b-table-column>
                <b-table-column label="Order" >{{ props.row.orders }}</b-table-column>

                <b-table-column label="Action">
                  <div class="buttons has-addons has-text-centered">
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small is-info"
                        @click.prevent="editManufacture(props.row.id)"
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
                        @click.prevent="deleteManufacture(props.row.id)"
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
      // AddNewManufacture
      file_url: "",
      userfile: null,
      name: "",
      order: "",

      // Edit Manufacture
      id: null
    };
  },
  methods: {
    
    /*
     * Load async ManufactureList
     */
    loadAsyncManufactureList() {
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
        ajax = this.axios.post("/manufacture/search", bodyRequest);
      } else {
        ajax = this.axios.post("/manufacture", bodyRequest);
      }
      ajax
        .then(res => {
          let manufacture = res.data.content.result
this.count = res.data.content.record
          if (manufacture)
            this.$store.commit("manufacture/addManufactureList", manufacture);
          else this.$store.commit("manufacture/addManufactureList", []);
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
        this.file_url = URL.createObjectURL(this.userfile);
      } else {
        this.file_url = "";
      }
    },
    // Change Status
    changeStatus(id) {
      this.loading = true
      this.axios.get(`/manufacture/publish/${id}`).then(res => { 
        this.loadAsyncManufactureList();
      });
    },
    // Delete Manufacture
    deleteManufacture(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this manufacture data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/manufacture/delete/${id}`)
            .then(res => {
              swal("Poof! Your manufacture data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncManufactureList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your manufacture data is safe!");
        }
      });
    },
    // Delete Checked Manufacture
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this manufacture data!",
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
            .post("/manufacture/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Manufacture data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncManufactureList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your manufacture data is safe!");
        }
      });
    },
    editManufacture(id) {
      this.axios.get(`/manufacture/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.name = data.name;
        this.file_url = data.image,
        this.order = data.order,
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitManufacture() {
      let manufactureData = new FormData();
      manufactureData.append("userfile", this.userfile);
      manufactureData.append("tname", this.name);
      manufactureData.append("torder", this.order);

      let submit;
      if (this.id) {
        manufactureData.id = this.id;
        submit = this.axios.post(
          `/manufacture/update/${this.id}`,
          manufactureData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/manufacture/add", urlEncoded(manufactureData), {
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
            swal("Success!", "Manufacture submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncManufactureList();
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
      this.$store.commit("manufacture/reset");
    },
    modalCloseClicked() {
      this.file_url= "",
      this.userfile= null,
      this.name= "",
      this.order= "",
      this.id = null;
    },
    next() {
      this.$store.commit("manufacture/incrementPage");
      this.loadAsyncManufactureList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("manufacture/decrementPage");
        this.loadAsyncManufactureList();
      }
    },
    searchManufacture: debounce(function(event) {
      this.$store.commit("manufacture/updateSearch", event);
      this.$store.commit("manufacture/reset");
      this.$store.commit("manufacture/filter");
      this.loadAsyncManufactureList();
    }, 500)
  },
created() {
    if (!this.manufactureList.length) this.loadAsyncManufactureList();
  },
  computed: {
    ...mapState({
      page: state => state.manufacture.page,
      offset: state => state.manufacture.offset,
      manufactureList: state => state.manufacture.manufactureList,
      limit: state => state.manufacture.filter.limit,
      search: state => state.manufacture.filter.search
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



