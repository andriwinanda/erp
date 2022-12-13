<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Roles - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncRolesList()"
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
                  @input="searchRoles"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Roles -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitRoles">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Roles</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Name">
                      <b-input v-model="name" />
                    </b-field>
                    <b-field label="Role">
                      <b-select placeholder="Select role" v-model="rules">
                        <optgroup label="Option">
                          <option value="1">Read</option>
                          <option value="2">Read/Write</option>
                          <option value="3">Approval</option>
                          <option value="4">Full Control</option>
                        </optgroup>
                      </b-select>
                    </b-field>
                  </b-field>
                  <div class="label">Menu</div>
                  <b-checkbox
                    v-model="menu"
                    v-for="menuItem in menuList"
                    :native-value="menuItem.id"
                    :key="menuItem.id"
                  >{{menuItem.name}}</b-checkbox>
                  <br />
                  <b-field label="Description">
                    <b-input v-model="desc" type="textarea" />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitRoles()">Save</button>
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

          <!-- Table Roles -->
          <div class="column is-12">
            <b-table
              :data="rolesList"
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
                <b-table-column label="Description">{{ props.row.desc }}</b-table-column>
                <b-table-column label="Rules">{{ props.row.rules }}</b-table-column>

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
                        :class="props.row.publish != 0? 'is-success': 'is-danger'"
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
                        @click.prevent="editRoles(props.row.id, props.row.code)"
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
                        @click.prevent="deleteRoles(props.row.id)"
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
      menuList: [],
      checkedRows: [],
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewRoles
      file_url: "",
      userfile: null,
      // tname: "",
      // cparent: null,
      // tcode: "",

      // Edit Roles
      id: null,
      name: "",
      desc: "",
      rules: "",
      menu: []
    };
  },
  methods: {
    /*
     * Load async RolesList
     */
    loadAsyncRolesList() {
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
        ajax = this.axios.post("/roles/search", bodyRequest);
      } else {
        ajax = this.axios.post("/roles", bodyRequest);
      }
      ajax
        .then(res => {
          let roles = res.data.content;
          if (roles) this.$store.commit("roles/addRolesList", roles);
          else this.$store.commit("roles/addRolesList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Load Menu
    loadMenu() {
      this.menuList = [];
      this.axios.get("/adminmenu/get").then(res => {
        this.menuList = res.data.content;
        // menu.map(el => {
        //   let elMenu = {};
        //   elMenu.code = el.code;
        //   elMenu.name = el.name;
        //   this.menuList.push(elMenu);
        // });
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
      this.loading = true;
      this.axios.get(`/roles/publish/${id}`).then(res => {
        this.loadAsyncRolesList();
      });
    },
    // Delete Roles
    deleteRoles(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this roles data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/roles/delete/${id}`)
            .then(res => {
              swal("Poof! Your roles data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncRolesList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your roles data is safe!");
        }
      });
    },
    // Delete Checked Roles
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this roles data!",
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
            .post("/roles/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Roles data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncRolesList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your roles data is safe!");
        }
      });
    },
    editRoles(id, code) {
      this.loadMenu();
      this.menu = [];
      this.axios.get(`/roles/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.name = data.name;
        this.desc = data.desc;
        this.rules = data.rules;
        this.menu = data.granted_menu.split(",");
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitRoles() {
      let rolesData = {
        tname: this.name,
        tdesc: this.desc,
        crules: this.rules
      };
      for (var i = 0; i < this.menu.length; i++) {
        rolesData["cmenu[" + i + "]"] = this.menu[i];
      }
      let submit;
      if (this.id) {
        rolesData.id = this.id;
        submit = this.axios.post(
          `/roles/update/${this.id}`,
          urlEncoded(rolesData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/roles/add", urlEncoded(rolesData), {
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
            swal("Success!", "Roles submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncRolesList();
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
      this.$store.commit("roles/reset");
    },
    modalCloseClicked() {
      this.name = "";
      this.desc = "";
      this.rules = "";
      this.menu = [];
      this.id = null;
    },
    next() {
      this.$store.commit("roles/incrementPage");
      this.loadAsyncRolesList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("roles/decrementPage");
        this.loadAsyncRolesList();
      }
    },
    searchRoles: debounce(function(event) {
      this.$store.commit("roles/updateSearch", event);
      this.$store.commit("roles/reset");
      this.$store.commit("roles/filter");
      this.loadAsyncRolesList();
    }, 500)
  },
created() {
    if (!this.rolesList.length) this.loadAsyncRolesList();
  },
  computed: {
    ...mapState({
      page: state => state.roles.page,
      offset: state => state.roles.offset,
      rolesList: state => state.roles.rolesList,
      limit: state => state.roles.filter.limit,
      search: state => state.roles.filter.search
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



