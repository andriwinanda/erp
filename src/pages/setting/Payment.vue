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
        <!-- <h4 class="title is-5">Payment - Global Permata</h4> -->

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
                @click="loadAsyncPaymentList()"
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
                  @input="searchPayment"
                  :value="search"
                  icon="magnify"
                />
              </b-field>
            </b-field>
          </div>

          <!-- Add New Payment -->
          <b-modal
            :active.sync="isComponentModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitPayment">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{id?"Edit": "Add New"}} Payment</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="Name" expanded>
                      <b-input v-model="name" />
                    </b-field>
                    <b-field label="Order" expanded>
                      <b-input v-model="order" type="number" />
                    </b-field>
                  </b-field>

                  <b-field label="Account" expanded>
                    <b-field grouped group-multiline>
                      <b-input v-model="acc_name" expanded placeholder="Acc Name" />
                      <b-input v-model="acc_no" expanded placeholder="Acc No" />
                    </b-field>
                  </b-field>
                  <div class="field">
                    <b-switch v-model="pos" true-value="1" false-value="0">POS</b-switch>
                  </div>

                  <!-- Upload File -->
                  <b-field label="Upload Image">
                    <div class="file has-name is-fullwidth">
                      <label class="file-label">
                        <input
                          type="file"
                          accept="image/*"
                          id="file"
                          ref="myFiles"
                          class="file-input"
                          @change="previewFiles"
                        />
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-upload"></i>
                          </span>
                          <span class="file-label">Choose a file…</span>
                        </span>
                        <span class="file-name" v-if="userfile">{{userfile.name || file_url}}</span>
                        <span class="file-name" v-else>No image choosen</span>
                      </label>
                    </div>
                  </b-field>
                  <img v-if="file_url" class="image" :src="file_url" style="max-height: 150px" />
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitPayment()">Save</button>
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

          <!-- Table Payment -->
          <div class="column is-12">
            <b-table
              :data="paymentList"
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
                <b-table-column label="Image">
                  <img width="50" :src="props.row.image" alt />
                </b-table-column>
                <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Account">{{ props.row.acc_name }}</b-table-column>

                <b-table-column label="Action">
                  <div class="buttons has-addons has-text-centered">
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small is-info"
                        @click.prevent="editPayment(props.row.id)"
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
                        @click.prevent="deletePayment(props.row.id)"
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
      // AddNewPayment
      file_url: "",
      userfile: null,
      name: "",
      order: "",
      acc_no: "",
      acc_name: "",
      pos: 0,

      // Edit Payment
      id: null
    };
  },
  methods: {
    /*
     * Load async PaymentList
     */
    loadAsyncPaymentList() {
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
        ajax = this.axios.post("/payment/search", bodyRequest);
      } else {
        ajax = this.axios.post("/payment", bodyRequest);
      }
      ajax
        .then(res => {
          let payment = res.data.content.result
this.count = res.data.content.record
          if (payment) this.$store.commit("payment/addPaymentList", payment);
          else this.$store.commit("payment/addPaymentList", []);
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
      this.$store.commit("payment/filter");
      this.loadAsyncPaymentList();
    },
    isFilterShow() {
      this.$store.commit("payment/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.loading = true;
      this.axios.get(`/payment/publish/${id}`).then(res => {
        this.loadAsyncPaymentList();
      });
    },
    // Delete Payment
    deletePayment(id) {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this payment data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/payment/delete/${id}`)
            .then(res => {
              swal("Poof! Your payment data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncPaymentList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your payment data is safe!");
        }
      });
    },
    // Delete Checked Payment
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this payment data!",
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
            .post("/payment/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Payment data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncPaymentList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your payment data is safe!");
        }
      });
    },
    editPayment(id) {
      this.axios.get(`/payment/get/${id}`).then(res => {
        let data = res.data.content
        this.id = id;
        this.name = data.name;
        this.file_url = data.image;
        this.order = data.order;
        this.acc_no = data.acc_no;
        this.acc_name = data.name;
        this.pos = data.pos;
        console.log(data);
        this.isComponentModalActive = true;
      });
    },
    // Modal Action
    submitPayment() {
     
      let paymentData = new FormData();
      paymentData.append("userfile", this.userfile);
      paymentData.append("tname", this.name);
      paymentData.append("torder", this.order);
      paymentData.append("tpos", this.pos);
      paymentData.append("tacc", this.acc);
      let submit;
      if (this.id) {
        paymentData.id = this.id;
        submit = this.axios.post(
          `/payment/update/${this.id}`, paymentData
        );
      } else {
        submit = this.axios.post("/payment/add", urlEncoded(paymentData), {
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
            swal("Success!", "Payment submit successfully!", "success");
            this.isComponentModalActive = false;
            this.loadAsyncPaymentList();
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
      this.$store.commit("payment/reset");
    },
    modalCloseClicked() {
      this.acc_no = "",
      this.acc_name = "",
      this.file_url = "";
      this.userfile = null;
      this.name = "";
      this.order = "";
      this.pos = 0;
      this.id = null;
    },
    next() {
      this.$store.commit("payment/incrementPage");
      this.loadAsyncPaymentList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("payment/decrementPage");
        this.loadAsyncPaymentList();
      }
    },
    searchPayment: debounce(function(event) {
      this.$store.commit("payment/updateSearch", event);
      this.$store.commit("payment/reset");
      this.$store.commit("payment/filter");
      this.loadAsyncPaymentList();
    }, 500)
  },
created() {
    if (!this.paymentList.length) this.loadAsyncPaymentList();
  },
  computed: {
    ...mapState({
      page: state => state.payment.page,
      offset: state => state.payment.offset,
      paymentList: state => state.payment.paymentList,
      limit: state => state.payment.filter.limit,
      showFilter: state => state.payment.filter.showFilter,
      search: state => state.payment.filter.search
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



