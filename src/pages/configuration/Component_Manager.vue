<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Component - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncComponentList()"
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
                  @input="searchComponent"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Component -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitComponent">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Component</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Modul Name">
                      <b-input v-model="name" />
                    </b-field>
                    <b-field label="Modul Title">
                      <b-input v-model="title" />
                    </b-field>
                    <b-field label="Status">
                      <b-select placeholder="Select role" v-model="status">
                        <optgroup label="Option">
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </optgroup>
                      </b-select>
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Active">
                      <b-switch true-value="Y" false-value="N" v-model="active">{{ active }}</b-switch>
                    </b-field>
                    <b-field label="Pubish">
                      <b-switch true-value="Y" false-value="N" v-model="publish">{{ publish }}</b-switch>
                    </b-field>
                  </b-field>
                  <div class="label">Role</div>
                  <b-taginput
                    v-model="role"
                    :data="dataTable"
                    autocomplete
                    class="is-capitalized"
                    placeholder="Add Role"
                    @typing="getFilteredMenu"
                  >
                    <template slot-scope="props">
                      <p class="is-capitalized">{{props.option}}</p>
                    </template>
                    <template slot="empty">There are no items</template>
                  </b-taginput>
                  <br />
                  <div class="label">Table List</div>
                  <b-taginput
                    v-model="tableList"
                    :data="dataTable"
                    autocomplete
                    class="is-capitalized"
                    placeholder="Add Menu"
                    @typing="getFilteredMenu"
                  >
                    <template slot-scope="props">
                      <p class="is-capitalized">{{props.option}}</p>
                    </template>
                    <template slot="empty">There are no items</template>
                  </b-taginput>

                  <br />
                  <b-field grouped group-multiline>
                    <b-field label="Limit">
                      <b-input v-model="limit_form" />
                    </b-field>
                    <b-field label="Order">
                      <b-input v-model="order" />
                    </b-field>
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitComponent()">Save</button>
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

          <!-- Table Component -->
          <div class="column is-12">
            <b-table
              :data="componentList"
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
                <b-table-column label="Publish">{{ props.row.publish }}</b-table-column>
                <b-table-column label="Status">{{ props.row.status }}</b-table-column>
                <b-table-column label="Active">{{ props.row.active }}</b-table-column>
                <b-table-column label="Limit">{{ props.row.limit }}</b-table-column>
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
                        @click.prevent="editComponent(props.row.id, props.row.code)"
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
                        @click.prevent="deleteComponent(props.row.id)"
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
      // AddNewComponent
      file_url: "",
      userfile: null,
      // tname: "",
      // cparent: null,
      // tcode: "",

      // Edit Component
      id: null,
      name: "",
      title: "",
      status: "",
      active: false,
      publish: false,
      limit_form: null,
      order: null,
      tableList: [],
      role: []
    };
  },
  methods: {
    /*
     * Load async ComponentList
     */
    loadAsyncComponentList() {
      this.loading = true;
      let bodyRequest = {
        limit_form: this.limit_form,
        offset: this.offset,
        city: this.city
      };
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/component/search", bodyRequest);
      } else {
        ajax = this.axios.post("/component", bodyRequest);
      }
      ajax
        .then(res => {
          let component = res.data.content.result;
          if (component)
            this.$store.commit("component/addComponentList", component);
          else this.$store.commit("component/addComponentList", []);
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
      if (this.userfile) {
        this.file_url = URL.createObjectURL(this.userfile);
      } else {
        this.file_url = "";
      }
    },

    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/component/publish/${id}`).then(res => {
        this.loadAsyncComponentList();
      });
    },
    // Delete Component
    deleteComponent(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this component data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/component/delete/${id}`)
            .then(res => {
              swal("Poof! Your component data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncComponentList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your component data is safe!");
        }
      });
    },
    // Delete Checked Component
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this component data!",
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
            .post("/component/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Component data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncComponentList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your component data is safe!");
        }
      });
    },
    editComponent(id, code) {
      // this.loadMenu();
      this.menu = [];
      this.axios.get(`/component/get/${id}`).then(res => {
        let data = res.data.content;
        this.id= data.id
        this.name= data.name
        this.title= data.title
        this.status= data.status
        this.active= data.aktif
        this.publish= data.publish
        this.limit_form= data.limit
        this.order= data.order
        this.tableList= data.table_name.split(",")
        this.role= data.role.split(",")
        // this.id = id;
        // this.name = data.name;
        // this.desc = data.desc;
        // this.rules = data.rules;
        // this.menu = data.granted_menu.split(",");
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitComponent() {
      let componentData = {
        tname: this.name,
        ttitle: this.title,
        rpublish: this.publish,
        cstatus: this.status,
        raktif: this.active,
        tlimit: this.limit_form,
        torder: this.order
      };
      for (var i = 0; i < this.tableList.length; i++) {
        componentData["ctable[" + i + "]"] = this.tableList[i];
      }
      for (var i = 0; i < this.role.length; i++) {
        componentData["crole[" + i + "]"] = this.role[i];
      }
      let submit;
      if (this.id) {
        componentData.id = this.id;
        submit = this.axios.post(
          `/component/update/${this.id}`,
          urlEncoded(componentData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/component/add", urlEncoded(componentData), {
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
            swal("Success!", "Component submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncComponentList();
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
      this.$store.commit("component/reset");
    },
    modalCloseClicked() {
      this.id = null;
      this.name = "";
      this.title = "";
      this.status = "";
      this.active = false;
      this.publish = false;
      this.limit_form = null;
      this.order = null;
      this.tableList = [];
      this.role = [];
    },
    next() {
      this.$store.commit("component/incrementPage");
      this.loadAsyncComponentList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("component/decrementPage");
        this.loadAsyncComponentList();
      }
    },
    searchComponent: debounce(function(event) {
      this.$store.commit("component/updateSearch", event);
      this.$store.commit("component/reset");
      this.$store.commit("component/filter");
      this.loadAsyncComponentList();
    }, 500),
    getFilteredMenu() {
      this.getFilteredMenu = data.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    }
  },
created() {
    if (!this.componentList.length) this.loadAsyncComponentList();
  },
  computed: {
    ...mapState({
      page: state => state.component.page,
      offset: state => state.component.offset,
      componentList: state => state.component.componentList,
      limit: state => state.component.filter.limit,
      search: state => state.component.filter.search,
      dataTable: state => state.login.dataMenu
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



