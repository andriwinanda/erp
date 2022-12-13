<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Classification - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncClassificationList()"
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
                  @input="searchClassification"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Classification -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitClassification">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Classification</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Code" expanded>
                      <b-input v-model="code" />
                    </b-field>
                    <b-field label="Type">
                      <b-select placeholder="Select a type" v-model="type" expanded>
                        <option
                          v-for="type in typeList"
                          :key="type.code"
                          :value="type.code"
                        >{{type.name}}</option>
                      </b-select>
                    </b-field>
                  </b-field>
                  <b-field label="Name" expanded>
                    <b-input v-model="name" />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitClassification()">Save</button>
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

          <!-- Table Classification -->
          <div class="column is-12">
            <b-table
              :data="classificationList"
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
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Type">{{ props.row.type }}</b-table-column>

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
                        @click.prevent="editClassification(props.row.id, props.row.code)"
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
                        @click.prevent="deleteClassification(props.row.id)"
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
      parentList: [],
      checkedRows: [],
      typeList: [
        {
          code: "harta",
          name: "Harta"
        },
        {
          code: "modal",
          name: "Modal"
        },
        {
          code: "kewajiban",
          name: "Kewajiban"
        },
        {
          code: "pendapatan",
          name: "Pendapatan"
        },
        {
          code: "biaya",
          name: "Biaya"
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
      // AddNewClassification
      name: "",
      type: null,
      code: "",

      // Edit Classification
      id: null
    };
  },
  methods: {
    /*
     * Load async ClassificationList
     */
    loadAsyncClassificationList() {
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
        ajax = this.axios.post("/classification/search", bodyRequest);
      } else {
        ajax = this.axios.post("/classification", bodyRequest);
      }
      ajax
        .then(res => {
          let classification = res.data.content.result;
          this.count = res.data.content.record;
          if (classification)
            this.$store.commit(
              "classification/addClassificationList",
              classification
            );
          else this.$store.commit("classification/addClassificationList", []);
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
      this.$store.commit("classification/filter");
      this.loadAsyncClassificationList();
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/classification/publish/${id}`).then(res => {
        this.loadAsyncClassificationList();
      });
    },
    // Delete Classification
    deleteClassification(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this classification data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/classification/delete/${id}`)
            .then(res => {
              swal("Poof! Your classification data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncClassificationList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your classification data is safe!");
        }
      });
    },
    // Delete Checked Classification
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this classification data!",
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
            .post("/classification/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Classification data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncClassificationList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your classification data is safe!");
        }
      });
    },
    editClassification(id, code) {
      this.axios.get(`/classification/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.name = data.name;
        this.type = data.type;
        this.code = data.no;
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitClassification() {
      let classificationData = {
        tname: this.name,
        ctype: this.type,
        tcode: this.code
      };
      // console.log(urlEncoded(classificationData))
      let submit;
      if (this.id) {
        classificationData.id = this.id;
        submit = this.axios.post(
          `/classification/update/${this.id}`,
          urlEncoded(classificationData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post(
          "/classification/add",
          urlEncoded(classificationData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
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
            swal("Success!", "Classification submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncClassificationList();
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
      this.$store.commit("classification/reset");
    },
    modalCloseClicked() {
      this.name = "";
      this.type = null;
      this.code = "";
      this.id = null;
    },
    next() {
      this.$store.commit("classification/incrementPage");
      this.loadAsyncClassificationList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("classification/decrementPage");
        this.loadAsyncClassificationList();
      }
    },
    searchClassification: debounce(function(event) {
      this.$store.commit("classification/updateSearch", event);
      this.$store.commit("classification/reset");
      this.$store.commit("classification/filter");
      this.loadAsyncClassificationList();
    }, 500)
  },
  created() {
    if (!this.classificationList.length) this.loadAsyncClassificationList();
  },
  computed: {
    ...mapState({
      page: state => state.classification.page,
      offset: state => state.classification.offset,
      classificationList: state => state.classification.classificationList,
      limit: state => state.classification.filter.limit,
      search: state => state.classification.filter.search
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



