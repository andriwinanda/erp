<template>
  <div>
    <!-- <b-button style="margin-left: 400px" @click="collapse = !collapse">Click Me</b-button> -->

    <div class="flat-card">
      <div class="card-content">
        <div class="content">
          <!-- <h4 class="title is-5">Vendor - Global Permata</h4> -->

          <div class="columns is-multiline">
            <!-- Filter -->
            <div class="column is-12">
              <div class="label">Filter</div>
              <b-field grouped group-multiline>
                <b-select v-model="defaultSortOrder" expanded>
                  <option value="asc">Default sort direction: ASC</option>
                  <option value="desc">Default sort direction: DESC</option>
                </b-select>
                <b-select v-model="perPage" expanded>
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="15">15 per page</option>
                  <option value="20">20 per page</option>
                </b-select>
                <b-field class="control">
                  <div class="buttons">
                    <span class="button is-success" @click="filter">Filter</span>
                    <span class="button is-danger">Reset</span>
                  </div>
                </b-field>

                <!-- Add New -->
                <div class="control">
                  <b-modal :active.sync="isComponentModalActive" has-modal-card>
                    <Modal v-bind="formProps"></Modal>
                  </b-modal>
                  <b-button
                    class="is-pulled-right"
                    type="is-info "
                    @click="isComponentModalActive=true"
                    icon-left="plus"
                  >Add New</b-button>
                </div>
              </b-field>
            </div>
            <div class="column is-12">
              <b-field grouped group-multiline>
                <b-field class="control" expanded>
                  <div class="buttons">
                    <b-button type="is-danger" icon-left="delete">Delete Checked</b-button>

                    <!-- Print Button -->
                    <b-dropdown aria-role="list">
                      <button class="button is-info" slot="trigger">
                        <b-icon icon="printer" size="is-small"></b-icon>
                        <span>Print</span>
                        <b-icon icon="menu-down"></b-icon>
                      </button>

                      <b-dropdown-item aria-role="listitem">Table</b-dropdown-item>
                      <b-dropdown-item aria-role="listitem">Report</b-dropdown-item>
                      <b-dropdown-item aria-role="listitem">Payable Card</b-dropdown-item>
                    </b-dropdown>
                  </div>
                </b-field>

                <b-field class="control is-pulled-right" expanded>
                  <b-input width="100" placeholder="Search..." type="search" icon="magnify"></b-input>
                </b-field>
              </b-field>
            </div>

            <!-- Table -->
            <div class="column is-12">
              <b-table
                :data="data"
                :loading="loading"
                paginated
                :hoverable="true"
                :checked-rows.sync="checkedRows"
                :is-row-checkable="(row) => row.id !== 3"
                checkable
                backend-pagination
                :total="total"
                :per-page="perPage"
                @page-change="onPageChange"
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page"
                backend-sorting
                :default-sort-direction="defaultSortOrder"
                :default-sort="[sortField, sortOrder]"
                @sort="onSort"
              >
                <template slot-scope="props">
                  <b-table-column
                    field="original_title"
                    label="Title"
                    
                  >{{ props.row.original_title }}</b-table-column>

                  <b-table-column field="vote_average" label="Rate" numeric >
                    <span
                      class="tag"
                      :class="type(props.row.vote_average)"
                    >{{ props.row.vote_average }}</span>
                  </b-table-column>

                  <b-table-column
                    field="release_date"
                    label="Release"
                    
                    centered
                  >{{ props.row.release_date ? new Date(props.row.release_date).toLocaleDateString() : '' }}</b-table-column>
                  <b-table-column label="Action">
                    <div class="buttons has-addons">
                      <b-tooltip
                        label="Primary Status"
                        size="is-small"
                        type="is-dark"
                        position="is-bottom"
                        animated
                      >
                        <span class="button is-small is-danger">
                          <b-icon size="is-small" icon="power"/>
                        </span>
                      </b-tooltip>
                      <b-tooltip
                        type="is-dark"
                        label="Edit"
                        size="is-small"
                        position="is-bottom"
                        animated
                      >
                        <span class="button is-small is-info">
                          <b-icon size="is-small" icon="square-edit-outline"/>
                        </span>
                      </b-tooltip>
                      <b-tooltip
                        type="is-dark"
                        label="Delete"
                        size="is-small"
                        position="is-bottom"
                        animated
                      >
                        <span class="button is-small is-danger">
                          <b-icon size="is-small" icon="delete"/>
                        </span>
                      </b-tooltip>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
;
export default {
   
  data() {
    return {
      activeIndex: 0,
      data: [],
      checkedRows: [],
      count: 0,
pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      page: 1,
      perPage: 20,
      isComponentModalActive: false,
      formProps: {
        email: "evan@you.com",
        password: "testing"
      }
    };
  },
  methods: {
    /*
     * Load async data
     */
    loadAsyncData() {
      const params = [
        "api_key=bb6f51bef07465653c3e553d6ab161a8",
        "language=en-US",
        "include_adult=false",
        "include_video=false",
        `sort_by=${this.sortField}.${this.sortOrder}`,
        `page=${this.page}`
      ].join("&");

      this.loading = true;
      this.axios
        .get(`https://api.themoviedb.org/3/discover/movie?${params}`)
        .then(({ data }) => {
          // api.themoviedb.org manage max 1000 pages
          this.data = [];
          let currentTotal = data.total_results;
          if (data.total_results / this.perPage > 1000) {
            currentTotal = this.perPage * 1000;
          }
          this.total = currentTotal;
          data.results.forEach(item => {
            item.release_date = item.release_date.replace(/-/g, "/");
            this.data.push(item);
          });
          this.loading = false;
        })
        .catch(error => {
          this.data = [];
          this.total = 0;
          this.loading = false;
          throw error;
        });
    },
    loadFilter() {
      this.loadAsyncData();
    },
    /*
     * Handle page-change event
     */
    onPageChange(page) {
      this.page = page;
      this.loadAsyncData();
    },
    /*
     * Handle sort event
     */
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.loadAsyncData();
    },

    /*
     * Type style in relation to the value
     */
    type(value) {
      const number = parseFloat(value);
      if (number < 6) {
        return "is-danger";
      } else if (number >= 6 && number < 8) {
        return "is-warning";
      } else if (number >= 8) {
        return "is-success";
      }
    }
  },
  mounted() {
    this.loadAsyncData();
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



