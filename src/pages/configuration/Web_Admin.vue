<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Admin - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncAdminList()"
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
                  @input="searchAdmin"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Admin -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitAdmin">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Admin</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Name">
                      <b-input v-model="name" />
                    </b-field>
                    <b-field label="Phone">
                      <b-input v-model="phone" />
                    </b-field>
                    <b-field label="Roles" expanded>
                      <b-select expanded placeholder="Select One" v-model="role">
                        <option
                          v-for="role in roleList"
                          :value="role.name"
                          :key="role.id"
                        >{{role.name}}</option>
                      </b-select>
                    </b-field>
                    <b-field grouped group-multiline>
                      <b-field label="Email">
                        <b-input v-model="email" type="email" />
                      </b-field>
                      <b-field label="Username">
                        <b-input v-model="username" />
                      </b-field>
                      <b-field label="Password">
                        <b-input v-model="password" type="password" password-reveal />
                      </b-field>
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Status" class="field">
                      <b-switch v-model="status">{{ status }}</b-switch>
                    </b-field>
                    <b-field label="Branch" expanded>
                      <b-select expanded placeholder="Select One" v-model="branch">
                        <option
                          v-for="branch in branchList"
                          :value="branch.id"
                          :key="branch.id"
                        >{{branch.code+" : "+branch.name}}</option>
                      </b-select>
                    </b-field>
                  </b-field>
                  <b-field label="address">
                    <b-input v-model="address" type="textarea" />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitAdmin()">Save</button>
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

          <!-- Table Admin -->
          <div class="column is-12">
            <b-table
              :data="adminList"
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
                <b-table-column label="Username">{{ props.row.username }}</b-table-column>
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Email">{{ props.row.email }}</b-table-column>
                <b-table-column label="Role">{{ props.row.role }}</b-table-column>

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
                        @click.prevent="editAdmin(props.row.id, props.row.code)"
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
                        @click.prevent="deleteAdmin(props.row.id)"
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
      branchList: [],
      roleList: [],
      checkedRows: [],
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewAdmin
      file_url: "",
      userfile: null,
      // tname: "",
      // cparent: null,
      // tcode: "",

      // Edit Admin
      id: null,
      name: "",
      username: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      city: "",
      mail: "",
      role: "",
      status: ""
    };
  },
  methods: {
    /*
     * Load async AdminList
     */
    loadAsyncAdminList() {
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
        ajax = this.axios.post("/admin/search", bodyRequest);
      } else {
        ajax = this.axios.post("/admin", bodyRequest);
      }
      ajax
        .then(res => {
          let admin = res.data.content.result;
          if (admin) this.$store.commit("admin/addAdminList", admin);
          else this.$store.commit("admin/addAdminList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // Load Branch
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.branchList = [];
        let branch = res.data.content.result;
        branch.map(el => {
          let elBranch = {};
          elBranch.code = el.code;
          elBranch.name = el.name;
          this.branchList.push(elBranch);
        });
      });
    },
    // Load Branch
    loadRoles() {
      this.roleList = []
      this.axios.get("/roles").then(res => {
        this.roleList = res.data.content;
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
      this.axios.get(`/admin/publish/${id}`).then(res => {
        this.loadAsyncAdminList();
      });
    },
    // Delete Admin
    deleteAdmin(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this admin data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/admin/delete/${id}`)
            .then(res => {
              swal("Poof! Your admin data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncAdminList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your admin data is safe!");
        }
      });
    },
    // Delete Checked Admin
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this admin data!",
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
            .post("/admin/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Admin data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncAdminList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your admin data is safe!");
        }
      });
    },
    editAdmin(id, code) {
      this.loadRoles()
      this.loadBranch();
      this.axios.get(`/admin/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.name = data.name;
        this.username = data.username;
        this.email = data.email;
        this.address = data.address;
        this.phone = data.phone;
        this.city = data.city;
        this.role = data.role;
        this.status = data.status;
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitAdmin() {
      let adminData = {
        tusername: this.username,
        tpassword: this.password,
        tname: this.name,
        taddress: this.address,
        tphone: this.phone,
        ccity: this.city,
        tmail: this.email,
        crole: this.role,
        cbranch: this.branch,
        rstatus: this.status
      };
      // console.log(urlEncoded(adminData))
      let submit;
      if (this.id) {
        adminData.id = this.id;
        submit = this.axios.post(
          `/admin/update/${this.id}`,
          urlEncoded(adminData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/admin/add", urlEncoded(adminData), {
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
            swal("Success!", "Admin submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncAdminList();
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
      this.$store.commit("admin/reset");
    },
    modalCloseClicked() {
      (this.file_url = ""),
        (this.userfile = null),
        (this.tname = ""),
        (this.cparent = null),
        (this.tcode = ""),
        (this.tbank = "");
      this.id = null;
    },
    next() {
      this.$store.commit("admin/incrementPage");
      this.loadAsyncAdminList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("admin/decrementPage");
        this.loadAsyncAdminList();
      }
    },
    searchAdmin: debounce(function(event) {
      this.$store.commit("admin/updateSearch", event);
      this.$store.commit("admin/reset");
      this.$store.commit("admin/filter");
      this.loadAsyncAdminList();
    }, 500)
  },
created() {
    if (!this.adminList.length) this.loadAsyncAdminList();
    this.loadParent();
  },
  computed: {
    ...mapState({
      page: state => state.admin.page,
      offset: state => state.admin.offset,
      adminList: state => state.admin.adminList,
      limit: state => state.admin.filter.limit,
      search: state => state.admin.filter.search
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



