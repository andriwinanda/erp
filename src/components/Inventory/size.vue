<template>
  <div>
    
        <!-- <h4 class="title is-5">Size - Attribute</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncSizeList()"
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
                  @input="searchSize"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Size -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitSize">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Size</p>
                </header>
                <section class="modal-card-body">
                  <b-field label="Desc" expanded>
                    <b-input v-model="desc" />
                  </b-field>
                  <b-field label="Name" expanded>
                    <b-input v-model="name" />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitSize()">Save</button>
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

          <!-- Table Size -->
          <div class="column is-12">
            <b-table
              :data="sizeList"
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
                <b-table-column label="Desc">{{ props.row.desc }}</b-table-column>
              
                <b-table-column label="Action">
                  <div class="buttons has-addons has-text-centered">
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span class="button is-small is-info" @click.prevent="editSize(props.row.id)">
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
                        @click.prevent="deleteSize(props.row.id)"
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
      total: 0,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewSize
      desc: "",
      userfile: null,
      name: "",

      // Edit Size
      id: null
    };
  },
  methods: {
    /*
     * Load async SizeList
     */
    loadAsyncSizeList() {
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
        ajax = this.axios.post("/size/search", bodyRequest);
      } else {
        ajax = this.axios.post("/size", bodyRequest);
      }
      ajax
        .then(res => {
          let size = res.data.content.result
this.count = res.data.content.record;
          if (size) this.$store.commit("size/addSizeList", size);
          else this.$store.commit("size/addSizeList", []);
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
        this.desc = URL.createObjectURL(this.userfile);
      } else {
        this.desc = "";
      }
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("size/filter");
      this.loadAsyncSizeList();
    },
    isFilterShow() {
      this.$store.commit("size/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/size/publish/${id}`).then(res => {
        this.loadAsyncSizeList();
      });
    },
    // Delete Size
    deleteSize(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this size data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/size/delete/${id}`)
            .then(res => {
              swal("Poof! Your size data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncSizeList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your size data is safe!");
        }
      });
    },
    // Delete Checked Size
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this size data!",
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
            .post("/size/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlendescd"
              }
            })
            .then(res => {
              swal("Poof! Size data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncSizeList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your size data is safe!");
        }
      });
    },
    editSize(id) {
      this.axios.get(`/size/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.name = data.name;
        this.desc = data.desc;
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitSize() {
      let sizeData = {
        tdesc: this.desc,
        tname: this.name
      };
      let submit;
      if (this.id) {
        sizeData.id = this.id;
        submit = this.axios.post(
          `/size/update/${this.id}`,
          urlEncoded(sizeData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlendescd"
            }
          }
        );
      } else {
        submit = this.axios.post("/size/add", urlEncoded(sizeData), {
          headers: {
            "Content-Type": "application/x-www-form-urlendescd"
          }
        });
      }
      submit
        .then(res => {
          console.log(res);
          let err = res.data.error;
          swal("Success!", "Size submit successfully!", "success");
          this.isComponentModalActive = false;
          this.loadAsyncSizeList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset(event) {
      this.$store.commit("size/reset");
    },
    modalCloseClicked() {
      this.desc = "",
        this.userfile = null,
        this.name = "",
        this.id = null;
    },
    next() {
      this.$store.commit("size/incrementPage");
      this.loadAsyncSizeList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("size/decrementPage");
        this.loadAsyncSizeList();
      }
    },
    searchSize: debounce(function(event) {
      this.$store.commit("size/updateSearch", event);
      this.$store.commit("size/reset");
      this.$store.commit("size/filter");
      this.loadAsyncSizeList();
    }, 500)
  },
created() {
    if (!this.sizeList.length) this.loadAsyncSizeList();
  },
  computed: {
    ...mapState({
      page: state => state.size.page,
      offset: state => state.size.offset,
      sizeList: state => state.size.sizeList,
      limit: state => state.size.filter.limit,
      showFilter: state => state.size.filter.showFilter,
      search: state => state.size.filter.search
    })
  }
};
</script>
<style>
.padding-card {
  padding: 0.75rem 0.2rem;
  background: linear-gradient(to right, rgb(121, 86, 236), rgb(47, 185, 248));
  box-shadow: none;
  size: white;
}
.shortcut .column {
  padding: 0.75rem 0.25rem;
}
</style>



