<template>
  <div>
    <form class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        <hr />
        <b-field grouped group-multiline>
          <b-field label="No" expanded>
            <b-input v-model="tno" />
          </b-field>
          <b-field label="Transaction Date" expanded>
            <b-datepicker
              editable
              :date-parser="dateFormat"
              :date-formatter="dateFormat"
              placeholder="Click to select..."
              icon="calendar-today"
              v-model="tdate"
            ></b-datepicker>
          </b-field>

          <!-- If CashIn -->
          <b-field v-if="transactionType==='cashin'" label="Customer" expanded>
            <b-select expanded placeholder="Select Customer" v-model="ccustomer">
              <option v-for="customer in customerList" :value="customer.id" :key="customer.id">{{customer.name}}</option>
            </b-select>
          </b-field>

          <!-- If CashOut -->
          <b-field v-if="transactionType==='cashout'" label="Vendor" expanded>
            <b-select expanded placeholder="Select Vendor" v-model="cvendor">
              <option v-for="vendor in vendorList" :value="vendor.id" :key="vendor.id">{{vendor.name}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="ccurrency">
              <option v-for="currency in currencyList" :value="currency.code" :key="currency.id">{{currency.code}}</option>
            </b-select>
          </b-field>

          <b-field label="Account" expanded>
            <b-select expanded placeholder="Select Account" v-model="cacc">
              <option v-for="account in accountList" :value="account.id" :key="account.id">{{account.name}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Note" expanded>
            <b-input v-model="tnote" type="textarea" expanded />
          </b-field>
          <b-field label="Description" expanded>
            <b-input v-model="tdesc" type="textarea" expanded />
          </b-field>
        </b-field>
        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitCashin()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
        <hr />
        <!-- Receipt -->
        <div class="section receipt">
          <!-- <small>{{moment(tdate).format("ddd, DD MMM YYYY")}}</small> -->
          <div class="modal-card-title">
            {{ccurrency.toUpperCase()}}
            <span class="is-pulled-right" v-if="tno">{{tno}}</span>
          </div>
          <br />
          <div style="overflow-x:auto;">
            <table class="receipt-table">
              <tr>
                <th>No</th>
                <th>Account</th>
                <th class="has-text-right">Balance</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in accountItem" :key="index">
                <td>{{index+1}}</td>
                <td style="min-width: 200px">{{item.account}}</td>
                <td class="has-text-right">
                  <numeric :value="item.amount" />
                </td>
                <td class="has-text-centered">
                  <button
                    style="margin-top: 4px;"
                    class="delete is-small"
                    @click.prevent="deleteAccount(item.id)"
                  ></button>
                </td>
              </tr>
              <tr v-if="!accountItem">
                <td colspan="7" class="has-text-grey has-text-centered">
                  <small>
                    <i>No data available</i>
                  </small>
                </td>
              </tr>
            </table>
          </div>
          <hr />
          <div class="columns is-multiline is-mobile is-v-centered">
            <div class="column is-5 is-offset-7 has-text-right">
              <b-button
                v-if="id"
                icon-left="plus"
                @click.prevent="isAddAccountActive = !isAddAccountActive"
              >Account</b-button>
              <small v-else>
                <i>Please Save Transaction First to Add an Account</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddAccountActive">
              <hr />
              <b-field grouped>
                <b-field label="Account">
                  <b-field expanded>
                    <b-input v-model="titem" disabled />
                    <p class="control">
                      <button class="button is-primary" @click.prevent="showAddAccountModal()">...</button>
                    </p>
                  </b-field>
                </b-field>
                <b-field label="Credit" expanded>
                  <b-input type="number" v-model="tcredit" />
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postAccount()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetAccount()">Reset</b-button>
              </div>
              <hr />
            </div>
          </div>
        </div>

        <br />
        <b-button @click="goBack" type="is-primary" icon-left="chevron-left">Back</b-button>
      </div>
    </form>
    <!-- Modals Account -->
    <b-modal :active.sync="isComponentModalActive" has-modal-card>
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
import { urlEncoded } from "@/function-helper";
import numeric from "@/components/Numeric";
import addAccount from "@/components/Transaction/AddAccountCashin";
export default {
  data() {
    return {
      transactionType: "",
      isLoading: false,
      isAddAccountActive: false,
      isComponentModalActive: false,
      dataAccountModal: {
        classificationList: []
      },
      currencyList: [],
      customerList: [],
      vendorList: [],
      accountList: [],
      ccustomer: "",
      cvendor: "",
      tno: null,
      tdate: null,
      ccurrency: "",
      tnote: "",
      tshipping: null,
      tdocno: "",
      cacc: "",
      tdesc: "",
      // Edit Cashin
      id: null,
      accountItem: [],
      currencyPrefix: "",
      tax: 0,
      total: 0,
      totaltax: 0,
      tcosts: null,
      tp1: null,
      cover: null,
      // Add Account
      titem: "",
      tcredit: 0
    };
  },
  components: {
    numeric,
    addAccount
  },
  methods: {
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },

    // Load Currency
    loadCurrency() {
      this.axios.get("/currency").then(res => {
        this.currencyList = [];
        let currency = res.data.content.result
        currency.map(el => {
          this.currencyList.push(el);
        });
      });
    },
    // Load Customer
    loadCustomer() {
      this.axios.get("/customer").then(res => {
        this.customerList = [];
        let customer = res.data.content.result
        customer.map(el => {
          this.customerList.push(el);
        });
      });
    },
    // Load Vendor
    loadVendor() {
      this.axios.get("/vendor").then(res => {
        this.vendorList = [];
        let vendor = res.data.content.result
        vendor.map(el => {
          this.vendorList.push(el);
        });
      });
    },
    // Load Account
    loadAccount() {
      this.axios.get("/account/get_asset_acc").then(res => {
        this.accountList = [];
        let account = res.data.content.result
        account.map(el => {
          this.accountList.push(el);
        });
      });
    },

    editCashin(id) {
      this.isLoading = true;
      this.axios
        .get(`/${this.transactionType}/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content
          this.tno = data.code;
          this.ccustomer = data.customer;
          this.ccurrency = data.currency;
          this.tdate = new Date(data.dates);
          this.ccustomer = data.customerid;
          this.cvendor = data.vendorid;
          this.cacc = data.account_id;
          this.tnote = data.note;
          this.accountItem = data.items;
          this.currencyPrefix = this.setCurrencyPrefx(data.currency);
          this.total = data.total;

          console.log(data);
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Submit Action
    submitCashin() {
      let submit;
      this.isLoading = true;
      let bodyRequest = {
        tno: this.tno,
        tdate: this.dateFormat(this.tdate),
        ccurrency: this.ccurrency,
        cacc: this.cacc,
        tdesc: this.tdesc,
        tnote: this.tnote
      };

      if (this.transactionType === "cashin") {
        bodyRequest.ccustomer = this.ccustomer;
      } else {
        bodyRequest.cvendor = this.cvendor;
      }

      if (this.id) {
        submit = this.axios.post(
          `/${this.transactionType}/update/${this.id}`,
          urlEncoded(bodyRequest),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post(
          `/${this.transactionType}/add`,
          urlEncoded(bodyRequest),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      }
      submit
        .then(res => {
          this.isLoading = false;
          let err = res.data.error;
          if (Number.isNaN(err)) {
            let errMessage = err
              .replace(/(<p>)/g, "* ")
              .replace(/(<\/p>)/g, "");
            swal("Failed!", errMessage, "warning");
          } else {
            if (!this.id) {
              // this.id = err;
              // this.$router.push("/transaction/cash_in/edit/" + err);
            } else {
              this.goBack();
            }
            swal("Success!", "Cashin submit successfully!", "success");
            this.loadAsyncCashinList();
          }
        })
        .catch(err => {
          this.isLoading = false;
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "error");
        });
    },

    setCurrencyPrefx(value) {
      switch (value) {
        case "idr":
          return "Rp";
        case "usd":
          return "$";
      }
    },
    // Load Branch
    loadClassification() {
      this.axios.get("/classification").then(res => {
        this.dataAccountModal.classificationList = [];
        let classification = res.data.content.result
        classification.map(el => {
          let elBranch = {};
          elBranch.id = el.id;
          elBranch.name = el.name;
          this.dataAccountModal.classificationList.push(elBranch);
        });
      });
    },
    // Load Category
    loadCategory() {
      this.axios.get("/category").then(res => {
        this.dataAccountModal.categoryList = [];
        let category = res.data.content.result;
        category.map(el => {
          let elCateogory = {};
          elCateogory.code = el.code;
          elCateogory.name = el.name;
          elCateogory.id = el.id;
          this.dataAccountModal.categoryList.push(elCateogory);
        });
      });
    },
    // Load manufacture
    loadManufacture() {
      this.manufactureList = [];
      this.axios.get("/manufacture").then(res => {
        this.dataAccountModal.manufactureList = [];
        let manufacture = res.data.content.result;
        manufacture.map(el => {
          let manufactureElement = {};
          manufactureElement.id = el.id;
          manufactureElement.name = el.name;
          this.dataAccountModal.manufactureList.push(manufactureElement);
        });
      });
    },
    showAddAccountModal() {
      this.isComponentModalActive = true;
      this.loadClassification();
    },
    itemSelected(code) {
      this.titem = code;
      this.isComponentModalActive = false;
    },
    postAccount() {
      this.isLoading = true;
      let dataAccount = {
        titem: this.titem,
        tcredit: this.tcredit
      };
      this.axios
        .post(
          `/${this.transactionType}/add_item/${this.id}`,
          urlEncoded(dataAccount)
        )
        .then(res => {
          this.editCashin(this.id);
          this.resetAccount();
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    deleteAccount(id) {
      this.axios
        .get(`/${this.transactionType}/delete_item/${id}`)
        .then(res => {
          this.editCashin(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetAccount() {
      this.titem = "";
      this.tcredit = 0;
    },
    goBack() {
      this.$router.go(-1);
    }
  },
created() {
    this.transactionType = this.$route.name.split("_")[0];
    if (this.transactionType === "cashin") {
      this.loadCustomer();
    } else {
      this.loadVendor();
    }
    this.loadAccount();
    this.loadCurrency();
    if (this.$route.params.id) {
      let id = this.$route.params.id;
      this.id = id;
      this.editCashin(id);
    }
  }
};
</script>
<style lang="scss">
.border-y {
  border-top: 0.5px dashed gainsboro;
  border-bottom: 0.5px dashed gainsboro;
}
.receipt {
  border: 1px dashed grey;
}
.receipt-table {
  width: 100%;
  border-collapse: collapse;
  padding-bottom: 5px;
  margin: 4px 0;
  tr {
    border-bottom: 0.5px solid whitesmoke;
    align-items: center;
    td {
      padding: 4px 8px;
    }
    th {
      padding: 4px 10px;
    }
  }

  .capt {
    font-weight: bold;

    > td:first-child::after {
      content: " :";
    }
  }

  tr:last-child {
    border-bottom: none;
  }
}
</style>