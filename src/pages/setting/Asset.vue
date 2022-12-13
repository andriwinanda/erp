<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Asset - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncAssetList()"
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
                  @input="searchAsset"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Table Asset -->
          <div class="column is-12">
            <b-table
              :data="assetList"
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
                <b-table-column label="Group">{{ props.row.group }}</b-table-column>
                <b-table-column label="Period">{{ props.row.start+' : '+props.row.end }}</b-table-column>
                <b-table-column label="Purchase Price">{{ props.row.amount }}</b-table-column>
                <b-table-column label="Residual">{{ props.row.residual }}</b-table-column>

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
                        @click.prevent="editAsset(props.row.id, props.row.code)"
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
                        @click.prevent="deleteAsset(props.row.id)"
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

    <!-- Add New Asset -->
    <b-modal :active.sync="isComponentModalActive" @close="modalCloseClicked()" has-modal-card>
      <form @submit.prevent="submitAsset">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">{{id?"Edit": "Add New"}} Asset</p>
          </header>
          <section class="modal-card-body">
            <b-field grouped group-multiline>
              <b-field label="Code" expanded>
                <b-input v-model="code" />
              </b-field>
              <b-field label="Name" expanded>
                <b-input v-model="name" />
              </b-field>
            </b-field>
            <b-field grouped group-multiline>
              <b-field label="Group">
                <b-select placeholder="Select one" @input="getPeriod" v-model="group" expanded>
                  <option
                    v-for="group in groupList"
                    :key="group.code"
                    :value="group.id"
                  >{{group.name}}</option>
                </b-select>
              </b-field>
              <b-field label="Period" expanded>
                <b-input disabled v-model="period" />
              </b-field>
            </b-field>
            <b-field label="Transaction Date" expanded>
            <b-datepicker
              editable
              :date-parser="dateFormat"
              :date-formatter="dateFormat"
              placeholder="Click to select..."
              icon="calendar-today"
              v-model="purchaseDate"
            ></b-datepicker>
          </b-field>
            <b-field grouped group-multiline>
              <b-field label="Purchase Amount" expanded>
                <b-input type="number" v-model="amount" />
              </b-field>
            </b-field>
            <b-field label="Residual Amount">
              <b-field expanded>
                <b-input v-model="residual" type="number" />
                <p class="control">
                  <button class="button is-primary" @click.prevent="calculate()">Calculate</button>
                </p>
              </b-field>
            </b-field>
            <b-field grouped group-multiline>
              <b-field label="Monthly Cost" expanded>
                <b-input type="number" v-model="cost" />
              </b-field>
              <!-- Period*12 -->
              <b-field label="*" expanded>
                <b-input type="number" v-model="annual" />
              </b-field>
            </b-field>
            <b-field label="Accumulation - COA">
              <b-field expanded>
                <b-input v-model="item" disabled />
                <p class="control">
                  <button class="button is-primary" @click.prevent="showAddAccountModal()">...</button>
                </p>
              </b-field>
            </b-field>
            <b-field label="Description" expanded>
              <b-input type="textarea" v-model="desc" />
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-primary" @click.prevent="submitAsset()">Save</button>
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
    <!-- Modals Account -->
    <b-modal :active.sync="isComponentAccountActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        </header>
        <section class="modal-card-body">
          <add-account @selected="itemSelected"></add-account>
        </section>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import addAccount from "@/components/Transaction/AddAccountCashin";
import debounce from "debounce";
import swal from "sweetalert";
export default {
  components: {
    addAccount
  },
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
      isComponentAccountActive: false,
      isComponentModalActive: false,
      // AddNewAsset
      code: null,
      name: "",
      group: null,
      purchaseDate: null,
      amount: 0,
      residual: 0,
      item: null,
      desc: "",

      // Edit Asset
      id: null,
      period: null,
      annual: null,
      cost: 0,
      groupList: []
    };
  },
  methods: {
    /*
     * Load async AssetList
     */
    loadAsyncAssetList() {
      this.loading = true;
      let bodyRequest = {
        limit: this.limit,
        offset: this.offset
      };
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/asset/search", bodyRequest);
      } else {
        ajax = this.axios.post("/asset", bodyRequest);
      }
      ajax
        .then(res => {
          let asset = res.data.content.result;
          this.count = res.data.content.record;
          if (asset) this.$store.commit("asset/addAssetList", asset);
          else this.$store.commit("asset/addAssetList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("asset/filter");
      this.loadAsyncAssetList();
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/asset/publish/${id}`).then(res => {
        this.loadAsyncAssetList();
      });
    },
    // Delete Asset
    deleteAsset(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this asset data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/asset/delete/${id}`)
            .then(res => {
              swal("Poof! Your asset data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncAssetList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your asset data is safe!");
        }
      });
    },
    // Delete Checked Asset
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this asset data!",
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
            .post("/asset/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Asset data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncAssetList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your asset data is safe!");
        }
      });
    },
    editAsset(id, code) {
      this.loadGroup();
      this.axios.get(`/asset/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.code = data.code;
        this.name = data.name;
        this.group = data.group_id;
        this.purchaseDate = new Date(data.purchase);
        this.amount = data.amount;
        this.residual = data.residual;
        this.item = data.account_code;
        this.desc = data.description;
        this.cost = data.monthly_cost;
        this.isComponentModalActive = true;
        this.getPeriod(data.group_id)
      });
    },
    getPeriod(value){
      this.axios
          .get(`asset/get_period_group/${value}/json`)
          .then(res => {
            this.period = res.data.content.period;
            this.annual = this.period*12
          });
    },
    calculate(){
      this.axios
          .get(`asset/calculate/${this.group}/${this.amount}/${this.residual}/json`)
          .then(res => {
            this.cost = res.data.content.monthlycost
          });
    },
    // Modal Action
    submitAsset() {
      let assetData = {
        tcode: this.code,
        tname: this.name,
        cgroup: this.group,
        tdate: this.dateFormat(this.purchaseDate),
        tamount: this.amount,
        tresidual: this.residual,
        titem: this.item,
        tdesc: this.desc
      };
      // console.log(urlEncoded(assetData))
      let submit;
      if (this.id) {
        assetData.id = this.id;
        submit = this.axios.post(
          `/asset/update/${this.id}`,
          urlEncoded(assetData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/asset/add", urlEncoded(assetData), {
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
            swal("Success!", "Asset submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncAssetList();
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
      this.$store.commit("asset/reset");
    },
    modalCloseClicked() {
      this.id = null;
      this.code = null;
      this.name = null;
      this.group = null;
      this.purchaseDate = null;
      this.amount = null;
      this.residual = null;
      this.item = null;
      this.desc = null;
      this.cost = null;
    },
    showAddAccountModal() {
      this.isComponentAccountActive = true;
    },
    itemSelected(code) {
      this.item = code;
      this.isComponentAccountActive = false;
    },
    loadGroup() {
      this.axios.get(`/groupasset`).then(res => {
        this.groupList = res.data.content.result;
      });
    },
    next() {
      this.$store.commit("asset/incrementPage");
      this.loadAsyncAssetList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("asset/decrementPage");
        this.loadAsyncAssetList();
      }
    },
    searchAsset: debounce(function(event) {
      this.$store.commit("asset/updateSearch", event);
      this.$store.commit("asset/reset");
      this.$store.commit("asset/filter");
      this.loadAsyncAssetList();
    }, 500)
  },
  created() {
    if (!this.assetList.length) this.loadAsyncAssetList();
  },
  computed: {
    ...mapState({
      page: state => state.asset.page,
      offset: state => state.asset.offset,
      assetList: state => state.asset.assetList,
      limit: state => state.asset.filter.limit,
      search: state => state.asset.filter.search
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



