<template>
  <div>
    <!-- <h4 class="title is-5">Color - Attribute</h4> -->

    <div class="columns is-multiline">
      <div class="column is-8">
        <!-- Add New Modal-->
        <div class="buttons">
          <b-button
            type="is-primary"
            icon-left="refresh"
            @click="loadAsyncColorList()"
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
              @input="searchColor"
              :value="search"
              icon="magnify"
            />
          </b-field>
        </b-field>
      </div>

      <!-- Add New Color -->
      <b-modal :active.sync="isComponentModalActive" @close="modalCloseClicked()" has-modal-card>
        <form @submit.prevent="submitColor">
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">{{id?"Edit": "Add New"}} Color</p>
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
              <button class="button is-primary" @click.prevent="submitColor()">Save</button>
              <button
                class="button is-danger"
                type="button"
                @click="isComponentModalActive = false"
              >Close</button>
              <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
            </footer>
          </div>
        </form>
      </b-modal>

      <!-- Table Color -->
      <div class="column is-12">
        <b-table
          :data="colorList"
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
                  <span class="button is-small is-info" @click.prevent="editColor(props.row.id)">
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
                    @click.prevent="deleteColor(props.row.id)"
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
      checkedRows: [],
      total: 0,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      perPage: 100,
      isComponentModalActive: false,
      // AddNewColor
      desc: "",
      userfile: null,
      name: "",

      // Edit Color
      id: null
    };
  },
  methods: {
    /*
     * Load async ColorList
     */
    loadAsyncColorList() {
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
        ajax = this.axios.post("/color/search", bodyRequest);
      } else {
        ajax = this.axios.post("/color", bodyRequest);
      }
      ajax
        .then(res => {
          let color = res.data.content.result;
          this.count = res.data.content.record;
          if (color) this.$store.commit("color/addColorList", color);
          else this.$store.commit("color/addColorList", []);
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
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/color/publish/${id}`).then(res => {
        this.loadAsyncColorList();
      });
    },
    // Delete Color
    deleteColor(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this color data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/color/delete/${id}`)
            .then(res => {
              swal("Poof! Your color data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncColorList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your color data is safe!");
        }
      });
    },
    // Delete Checked Color
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this color data!",
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
            .post("/color/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlendescd"
              }
            })
            .then(res => {
              swal("Poof! Color data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncColorList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your color data is safe!");
        }
      });
    },
    editColor(id) {
      this.axios.get(`/color/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.name = data.name;
        this.desc = data.desc;
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitColor() {
      let colorData = {
        tdesc: this.desc,
        tname: this.name
      };
      let submit;
      if (this.id) {
        colorData.id = this.id;
        submit = this.axios.post(
          `/color/update/${this.id}`,
          urlEncoded(colorData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlendescd"
            }
          }
        );
      } else {
        submit = this.axios.post("/color/add", urlEncoded(colorData), {
          headers: {
            "Content-Type": "application/x-www-form-urlendescd"
          }
        });
      }
      submit
        .then(res => {
          console.log(res);
          let err = res.data.error;
          swal("Success!", "Color submit successfully!", "success");
          this.isComponentModalActive = false;
          this.loadAsyncColorList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset(event) {
      this.$store.commit("color/reset");
    },
    modalCloseClicked() {
      (this.desc = ""),
        (this.userfile = null),
        (this.name = ""),
        (this.id = null);
    },
    next() {
      this.$store.commit("color/incrementPage");
      this.loadAsyncColorList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("color/decrementPage");
        this.loadAsyncColorList();
      }
    },
    searchColor: debounce(function(event) {
      this.$store.commit("color/updateSearch", event);
      this.$store.commit("color/reset");
      this.$store.commit("color/filter");
      this.loadAsyncColorList();
    }, 500)
  },
  created() {
    if (!this.colorList.length) this.loadAsyncColorList();
  },
  computed: {
    ...mapState({
      page: state => state.color.page,
      offset: state => state.color.offset,
      colorList: state => state.color.colorList,
      limit: state => state.color.filter.limit,
      search: state => state.color.filter.search
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



