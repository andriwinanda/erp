<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Controls - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncControlsList()"
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
                  @input="searchControls"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Controls -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitControls">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Controls</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Description" expanded>
                      <b-input v-model="desc" />
                    </b-field>
                    <b-field label="Account">
                      <b-field expanded>
                        <b-input v-model="acc" disabled />
                        <p class="control">
                          <button
                            class="button is-primary"
                            @click.prevent="showAddAccountModal()"
                          >...</button>
                        </p>
                      </b-field>
                    </b-field>
                  </b-field>
                  <b-field label="Modul">
                    <b-select placeholder="Select a modul" v-model="modul" expanded>
                      <option
                        v-for="modul in modulList"
                        :key="modul.code"
                        :value="modul.id"
                      >{{capitalize(modul.name)}}</option>
                    </b-select>
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitControls()">Save</button>
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

          <!-- Table Controls -->
          <div class="column is-12">
            <b-table
              :data="controlsList"
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
                <b-table-column label="Desc">{{ props.row.desc }}</b-table-column>
                <b-table-column label="Account">{{ props.row.account }}</b-table-column>
                <b-table-column label="Modul">{{ props.row.modul || '-' }}</b-table-column>

                <b-table-column label="Action" style="min-width:110px">
                  <div class="buttons has-addons">
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small is-info"
                        @click.prevent="editControls(props.row.id, props.row.code)"
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
                        @click.prevent="deleteControls(props.row.id)"
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
import addAccount from "../../../src/components/Transaction/AddAccountCashin.vue";
import swal from "sweetalert";
import { capitalizeLetter } from "../../function-helper";

export default {
  data() {
    return {
      activeIndex: 0,
      parentList: [],
      checkedRows: [],
      modulList: [
        {
          code: "admin",
          name: "Admin"
        }
      ],
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      isComponentAccountModalActive: false,
      // AddNewControls
      desc: "",
      modul: null,
      acc: "",
      search: "",

      // Edit Controls
      id: null
    };
  },

  components: {
    addAccount
  },
  methods: {
    capitalize(str) {
      return capitalizeLetter(str);
    },
    // Load Moodul
    loadModul() {
      this.axios.get("/component").then(res => {
        this.modulList = [];
        let modul = res.data.content.result;
        modul.map(el => {
          this.modulList.push(el);
        });
      });
    },
    /*
     * Load async ControlsList
     */
    loadAsyncControlsList() {
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
        ajax = this.axios.post("/controls/search", bodyRequest);
      } else {
        ajax = this.axios.post("/controls", bodyRequest);
      }
      ajax
        .then(res => {
          let controls = res.data.content.result;
          this.count = res.data.content.record;
          if (controls)
            this.$store.commit("controls/addControlsList", controls);
          else this.$store.commit("controls/addControlsList", []);
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
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("controls/filter");
      this.loadAsyncControlsList();
    },
    showAddAccountModal() {
      this.isComponentAccountModalActive = true;
    },
    itemSelected(code) {
      this.acc = code;
      this.isComponentAccountModalActive = false;
    },
    // Delete Controls
    deleteControls(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this controls data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/controls/delete/${id}`)
            .then(res => {
              swal("Poof! Your controls data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncControlsList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your controls data is safe!");
        }
      });
    },
    // Delete Checked Controls
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this controls data!",
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
            .post("/controls/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Controls data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncControlsList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your controls data is safe!");
        }
      });
    },
    editControls(id, code) {
      this.axios.get(`/controls/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.desc = data.desc;
        this.acc = data.acc_code;
        this.modul = data.modul;
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitControls() {
      let controlsData = {
        tdesc: this.desc,
        cmodul: this.modul,
        titem: this.acc
      };
      // console.log(urlEncoded(controlsData))
      let submit;
      if (this.id) {
        controlsData.id = this.id;
        submit = this.axios.post(
          `/controls/update/${this.id}`,
          urlEncoded(controlsData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/controls/add", urlEncoded(controlsData), {
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
            swal("Success!", "Controls submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncControlsList();
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
      this.$store.commit("controls/reset");
    },
    modalCloseClicked() {
      this.file_url = "";
      this.userfile = null;
      this.name = "";
      this.type = null;
      this.code = "";
      this.tbank = "";
      this.id = null;
    },
    next() {
      this.$store.commit("controls/incrementPage");
      this.loadAsyncControlsList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("controls/decrementPage");
        this.loadAsyncControlsList();
      }
    },
    searchControls: debounce(function(event) {
      this.$store.commit("controls/updateSearch", event);
      this.$store.commit("controls/reset");
      this.$store.commit("controls/filter");
      this.loadAsyncControlsList();
    }, 500)
  },
  beforeMount() {
    console.log("Before Create");
    this.cekAuth();
  },
  created() {
    if (!this.controlsList.length) this.loadAsyncControlsList();
    this.loadModul()
  },
  computed: {
    ...mapState({
      page: state => state.controls.page,
      offset: state => state.controls.offset,
      controlsList: state => state.controls.controlsList,
      limit: state => state.controls.filter.limit,
      search: state => state.controls.filter.search
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



