<template>
  <div>
    <div v-if="showFilter" class="flat-card row" style="margin-bottom: 15px;">
      <button
        class="delete is-pulled-right"
        aria-label="close"
        @click.prevent="isFilterShow()"
        style="margin: 10px;"
      />
      <div class="card-content">
        <form @submit.prevent="loadFilter()">
          <b-field grouped group-multiline expanded>
            <b-field label="City">
              <b-select placeholder="Select a city" @input="updateCity" :value="city" expanded>
                <option
                  v-for="city in cityList"
                  :key="city.city_id"
                  :value="city.city_id"
                >{{city.city_name}}</option>
              </b-select>
            </b-field>
          </b-field>
          <div class="buttons">
            <button class="button is-primary" @click.prevent="loadFilter()">Filter</button>
            <button class="button is-primary" @click.prevent="reset()">Reset</button>
          </div>
        </form>
      </div>
    </div>

    <div class="flat-card">
      <div class="card-content">
        <!-- <h4 class="title is-5">Bank - Global Permata</h4> -->

        <div class="columns is-multiline">
          <div class="column is-8">
            <!-- Add New Modal-->
            <div class="buttons">
              <b-button
                v-if="!showFilter"
                type="is-primary"
                @click.prevent="isFilterShow()"
              >{{showFilter?"Close": "Show"}} Filter</b-button>
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncBankList()"
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
                  @input="searchBank"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Bank -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitBank">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Bank</p>
                </header>
                <section class="modal-card-body">
                  <b-field label="Account Name" expanded>
                    <b-input v-model="acc_name" />
                  </b-field>
                  <b-field label="Account No" expanded>
                    <b-input v-model="acc_no" />
                  </b-field>
                  <b-field label="Account Bank">
                    <b-input v-model="acc_bank" type="textarea" expanded />
                  </b-field>
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitBank()">Save</button>
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

          <!-- Table Bank -->
          <div class="column is-12">
            <b-table
              :data="bankList"
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
                <b-table-column label="Currency">{{ props.row.currency }}</b-table-column>
                <b-table-column label="Name">{{ props.row.acc_name }}</b-table-column>
                <b-table-column label="Account">{{ props.row.acc_bank+"-"+props.row.acc_no }}</b-table-column>

                <b-table-column label="Action">
                  <div class="buttons has-addons has-text-centered">
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span class="button is-small is-info" @click.prevent="editBank(props.row.id)">
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
                        @click.prevent="deleteBank(props.row.id)"
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
      // AddNewBank
      acc_no: "",
      acc_name: "",
      acc_bank: "",

      // Edit Bank
      id: null
    };
  },
  methods: {
    /*
     * Load async BankList
     */
    loadAsyncBankList() {
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
        ajax = this.axios.post("/bank/search", bodyRequest);
      } else {
        ajax = this.axios.post("/bank", bodyRequest);
      }
      ajax
        .then(res => {
          let bank = res.data.content.result
          if (bank) this.$store.commit("bank/addBankList", bank);
          else this.$store.commit("bank/addBankList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("bank/filter");
      this.loadAsyncBankList();
    },
    isFilterShow() {
      this.$store.commit("bank/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/bank/publish/${id}`).then(res => {
        this.loadAsyncBankList();
      });
    },
    // Delete Bank
    deleteBank(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this bank data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/bank/delete/${id}`)
            .then(res => {
              swal("Poof! Your bank data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncBankList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your bank data is safe!");
        }
      });
    },
    // Delete Checked Bank
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this bank data!",
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
            .post("/bank/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Bank data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncBankList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your bank data is safe!");
        }
      });
    },
    editBank(id) {
      this.axios.get(`/bank/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.acc_name = data.acc_name;
        this.acc_no = data.acc_no;
        this.acc_bank = data.acc_bank;
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitBank() {
      let bankData = {
        tno: this.acc_no,
        tname: this.acc_name,
        tbank: this.acc_bank
      };
      let submit;
      if (this.id) {
        bankData.id = this.id;
        submit = this.axios.post(
          `/bank/update/${this.id}`,
          urlEncoded(bankData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/bank/add", urlEncoded(bankData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }
      submit
        .then(res => {
          console.log(res);
          let err = res.data.error;
          swal("Success!", "Bank submit successfully!", "success");
          this.isComponentModalActive = false;
          this.loadAsyncBankList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset(event) {
      this.$store.commit("bank/reset");
    },
    modalCloseClicked() {
      this.acc_no = "";
      this.acc_name = "";
      this.acc_bank = "";
      this.id = null;
    },
    next() {
      this.$store.commit("bank/incrementPage");
      this.loadAsyncBankList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("bank/decrementPage");
        this.loadAsyncBankList();
      }
    },
    searchBank: debounce(function(event) {
      this.$store.commit("bank/updateSearch", event);
      this.$store.commit("bank/reset");
      this.$store.commit("bank/filter");
      this.loadAsyncBankList();
    }, 500)
  },
created() {
    if (!this.bankList.length) this.loadAsyncBankList();
  },
  computed: {
    ...mapState({
      page: state => state.bank.page,
      offset: state => state.bank.offset,
      bankList: state => state.bank.bankList,
      limit: state => state.bank.filter.limit,
      showFilter: state => state.bank.filter.showFilter,
      search: state => state.bank.filter.search
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



