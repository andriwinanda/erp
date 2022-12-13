<template>
  <div>
    <form class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">{{id?"Edit": "Add New"}} Stock</p>
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
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="ccurrency">
              <option v-for="currency in currencyList" :value="currency.name" :key="currency.id">{{currency.code}}</option>
            </b-select>
          </b-field>

          <b-field label="From Branch/Outlet" expanded>
            <b-select expanded placeholder="Select One" v-model="cfrom">
              <option
                v-for="branch in branchList"
                :value="branch.id"
                :key="branch.id"
              >{{branch.code+" : "+branch.name}}</option>
            </b-select>
          </b-field>

          <b-field label="To Branch/Outlet" expanded>
            <b-select expanded placeholder="Select One" v-model="cto">
              <option
                v-for="branch in branchList"
                :value="branch.id"
                :key="branch.id"
              >{{branch.code+" : "+branch.name}}</option>
            </b-select>
          </b-field>
          <b-field label="Staff" expanded>
            <b-input v-model="tstaff" />
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Note" expanded>
            <b-input v-model="tnote" type="textarea" expanded />
          </b-field>
        </b-field>
        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitStock()">Save</button>
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
                <th>Product</th>
                <th class="has-text-centered">Qty</th>
                <th class="has-text-right">Amount</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in itemList" :key="index">
                <td>{{index+1}}</td>
                <td >{{item.product}}</td>
                <td class="has-text-centered" >{{item.qty}}</td>
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
              <tr v-if="!itemList">
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
                <i>Please Save First to Add an Account</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddAccountActive">
              <hr />
              <b-field grouped group-multiline>
                <b-field label="Product">
                  <b-field>
                    <b-input v-model="product" disabled />
                    <p class="control">
                      <button class="button is-primary" @click.prevent="showAddProductModal()">...</button>
                    </p>
                  </b-field>
                </b-field>
                <b-field label="Qty">
                  <input class="input" type="number" v-model="qty" />
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postItem()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetItem()">Reset</b-button>
              </div>
              <hr />
            </div>
          </div>
        </div>

        <br />
        <b-button @click="goBack" type="is-primary" icon-left="chevron-left">Back</b-button>
      </div>
    </form>
    <!-- Modals Product -->
    <b-modal :active.sync="isComponentProductModalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Stock</p>
        </header>
        <section class="modal-card-body">
          <add-product @selected="productSelected"></add-product>
        </section>
      </div>
    </b-modal>
    <!-- Modals Account -->
    <b-modal :active.sync="isComponentAccountModalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        </header>
        <section class="modal-card-body">
          <add-account @selected="accountSelected"></add-account>
        </section>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { urlEncoded } from "@/function-helper";
import numeric from "@/components/Numeric";
import addAccount from "@/components/Transaction/AddAccountCashin";
import addProduct from "@/components/Purchase/AddProductPurchase";
export default {
  data() {
    return {
      transactionType: "",
      isLoading: false,
      isAddAccountActive: false,
      isComponentProductModalActive: false,
      isComponentAccountModalActive: false,
      dataAccountModal: {
        classificationList: []
      },
      currencyList: [],
      customerList: [],
      branchList: [],
      accountList: [],
      itemList: [],
      tno: null,
      tdate: null,
      ccurrency: "",
      tnote: "",
      tstaff: "",
      cfrom: "",
      cto: "",
      // Edit Stock
      id: null,
      // Item
      qty: null,
      product: null,
    };
  },
  components: {
    numeric,
    addProduct,
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
    // Load Branch
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.branchList = [];
        let branch = res.data.content.result
        branch.map(el => {
          this.branchList.push(el);
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

    editStock(id) {
      this.isLoading = true;
      this.axios.get(`/stock_transfer/get/${id}`)
      .then(res => {
        this.isLoading = false;
        let data = res.data.content
        this.tno = data.no;
        this.tdate = new Date(data.dates);
        this.ccurrency = data.currency;
        this.tnote = data.note;
        this.tstaff = data.staff;
        this.cfrom = data.from;
        this.cto = data.to;
        this.itemList = data.items;
        currencyPrefx(data.currency);
        this.total = data.total;

        console.log(data);
      })
      .catch(err => {
        this.isLoading = false
      });
    },
    // Submit Action
    submitStock() {
      let submit;
      this.isLoading = true;
      let bodyRequest = {
        tno: this.tno,
        tdate: this.dateFormat(this.tdate),
        ccurrency: this.ccurrency,
        cacc: this.cacc,
        tnote: this.tnote,
        tstaff: this.tstaff,
        cfrom: this.cfrom,
        cto: this.cto
      };

      if (this.id) {
        submit = this.axios.post(
          `/stock_transfer/update/${this.id}`,
          urlEncoded(bodyRequest),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post(
          `/stock_transfer/add`,
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
              // this.$router.push("/inventory/stock_transfer/edit/" + err);
            } else {
              this.goBack()
            }
            swal("Success!", "Stock submit successfully!", "success");
            this.loadAsyncStockList();
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
    showAddAccountModal() {
      this.isComponentAccountModalActive = true;
      this.loadClassification();
    },
    showAddProductModal() {
      this.isComponentProductModalActive = true;
      this.loadClassification();
      this.loadCategory();
      this.loadManufacture();
    },
    productSelected(code) {
      this.product = code;
      this.isComponentProductModalActive = false;
    },
    postItem() {
      this.isLoading = true;
      let dataAccount = {
        tqty: this.qty,
        tproduct: this.product
      };
      this.axios
        .post(`/stock_transfer/add_item/${this.id}`, urlEncoded(dataAccount))
        .then(res => {
          this.editStock(this.id);
          this.resetItem();
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    deleteAccount(id) {
      this.axios
        .get(`/stock_transfer/delete_item/${id}`)
        .then(res => {
          this.editStock(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetItem() {
      this.qty = null;
      this.product = null;
    },
    goBack() {
      this.$router.go(-1);
    }
  },
created() {
    this.transactionType = this.$route.name;
    if (this.transactionType === "cashin") {
      this.loadCustomer();
    } else {
      this.loadBranch();
    }
    this.loadAccount();
    this.loadCurrency();
    if (this.$route.params.id) {
      let id = this.$route.params.id;
      this.id = id;
      this.editStock(id);
    }
  }
};
</script>
<style>
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