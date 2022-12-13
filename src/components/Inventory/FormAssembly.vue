<template>
  <div>
    <form class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">{{id?"Edit": "Add New"}} Assembly</p>
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
          <b-field label="Qty" expanded>
            <b-input v-model="qty" />
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
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
          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="currency">
              <option
                v-for="currency in currencyList"
                :value="currency.code"
                :key="currency.id"
              >{{currency.code}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Account" expanded>
            <b-select expanded placeholder="Select Account" v-model="account">
              <option
                v-for="account in accountList"
                :value="account.id"
                :key="account.id"
              >{{account.code}} : {{account.name}}</option>
            </b-select>
          </b-field>

          <b-field label="Project" expanded>
            <b-input v-model="project" />
          </b-field>

          <b-field label="Doc no" expanded>
            <b-input v-model="docno" />
          </b-field>
          <b-field label="Cost" expanded>
            <b-input v-model="cost" />
          </b-field>
          <b-field label="Total" expanded>
            <b-input v-model="total" />
          </b-field>
        </b-field>
        <b-field grouped group-multiline>
          <b-field label="Tax" expanded>
            <b-select expanded placeholder="Select Account" v-model="tax">
              <option value="0">.</option>
              <option value="1">PPN24</option>
              <option value="2">PPH21</option>
            </b-select>
          </b-field>
          <b-field label="Tax Amount" expanded>
            <b-input v-model="taxamount" disabled />
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Note" expanded>
            <b-input v-model="note" type="textarea" expanded />
          </b-field>
        </b-field>
        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitAssembly()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
        <hr />
        <!-- Receipt -->
        <div class="section receipt">
          <!-- <small>{{moment(tdate).format("ddd, DD MMM YYYY")}}</small> -->
          <div class="modal-card-title">
            {{currency.toUpperCase()}}
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
                <td class="is-capitalized">{{item.name}}</td>
                <td class="has-text-centered">{{item.qty}}</td>
                <td class="has-text-right">
                  <numeric :value="item.price" />
                </td>
                <td class="has-text-centered">
                  <button
                    style="margin-top: 4px;"
                    class="delete is-small"
                    @click.prevent="deleteItem(item.id)"
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
                @click.prevent="isAddItemActive = !isAddItemActive"
              >Item</b-button>
              <small v-else>
                <i>Please Save First to Add an Account</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddItemActive">
              <hr />
              <b-field grouped group-multiline>
                <b-field label="Product">
                  <b-field>
                    <b-input v-model="item.product" disabled />
                    <p class="control">
                      <button class="button is-primary" @click.prevent="showAddItemModal()">...</button>
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

        <!-- Item Cost -->
        <div class="section receipt">
          <!-- <small>{{moment(tdate).format("ddd, DD MMM YYYY")}}</small> -->
          <div class="modal-card-title">Item Cost</div>
          <br />
          <div style="overflow-x:auto;">
            <table class="receipt-table">
              <tr>
                <th>No</th>
                <th>Note</th>
                <th class="has-text-right">Amount</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in costList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.notes}}</td>
                <td class="has-text-right">
                  <numeric :value="item.amount" />
                </td>
                <td class="has-text-centered">
                  <button
                    style="margin-top: 4px;"
                    class="delete is-small"
                    @click.prevent="deleteCost(item.id)"
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
                @click.prevent="isAddCostActive = !isAddCostActive"
              >Item Cost</b-button>
              <small v-else>
                <i>Please Save First to Add an Cost</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddCostActive">
              <hr />
              <b-field label="Note" expanded>
                <b-input v-model="cost.notes" type="textarea" expanded />
              </b-field>
              <b-field grouped group-multiline>
                <b-field label="Amount">
                  <input class="input" type="number" v-model="cost.amount" />
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postCost()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetCost()">Reset</b-button>
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
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Assembly</p>
        </header>
        <section class="modal-card-body">
          <add-product @selected="productSelected"></add-product>
        </section>
      </div>
    </b-modal>
    <!-- Modals Item -->
    <b-modal :active.sync="isComponentItemModalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Assembly</p>
        </header>
        <section class="modal-card-body">
          <add-product @selected="itemSelected"></add-product>
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
      isAddItemActive: false,
      isAddCostActive: false,
      isComponentItemModalActive: false,
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
      costList: [],
      product: null,
      tdate: null,
      currency: "",
      note: "",
      qty: "",
      account: "",
      project: "",
      docno: "",
      cost: 0,
      total: 0,
      tax: 0,
      taxamount: 0,
      // Edit Assembly
      id: null,
      // Item
      item: {
        qty: null,
        product: null
      },
      cost: {
        notes: "",
        amount: 0
      }
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
        let currency = res.data.content.result;
        currency.map(el => {
          this.currencyList.push(el);
        });
      });
    },
    // Load Customer
    loadCustomer() {
      this.axios.get("/customer").then(res => {
        this.customerList = [];
        let customer = res.data.content.result;
        customer.map(el => {
          this.customerList.push(el);
        });
      });
    },
    // Load Branch
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.branchList = [];
        let branch = res.data.content.result;
        branch.map(el => {
          this.branchList.push(el);
        });
      });
    },
    // Load Account
    loadAccount() {
      this.axios.get("/account/get_asset_acc").then(res => {
        this.accountList = [];
        let account = res.data.content;
        account.map(el => {
          this.accountList.push(el);
        });
      });
    },

    editAssembly(id) {
      this.isLoading = true;
      this.axios
        .get(`/assembly/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content;
          this.tdate = new Date(data.dates);
          this.product = null;
          this.currency = data.currency;
          this.note = data.note;
          this.qty = data.qty;
          this.account = data.account;
          this.project = data.project;
          this.docno = data.docno;
          this.cost = data.cost;
          this.total = data.total;
          this.tax = data.tax;
          this.taxamount = data.tax;
          this.itemList = data.items;
          this.costList = data.itemcost;
          currencyPrefx(data.currency);
          this.total = data.total;

          console.log(data);
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Submit Action
    submitAssembly() {
      let submit;
      this.isLoading = true;
      let bodyRequest = {
        tproduct: this.product,
        tdate: this.dateFormat(this.tdate),
        tnote: this.note,
        tproject: this.project,
        ccurrency: IDR,
        ctax: this.tax,
        tdocno: this.docno,
        cacc: this.account,
        tqty: this.qty
      };

      if (this.id) {
        submit = this.axios.post(
          `/assembly/update/${this.id}`,
          urlEncoded(bodyRequest),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post(`/assembly/add`, urlEncoded(bodyRequest), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
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
              // this.$router.push("/inventory/assembly/edit/" + err);
            } else {
              this.goBack();
            }
            swal("Success!", "Assembly submit successfully!", "success");
            this.loadAsyncAssemblyList();
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
    showAddItemModal() {
      this.isComponentItemModalActive = true;
      this.loadClassification();
      this.loadCategory();
      this.loadManufacture();
    },
    productSelected(code) {
      this.product = code;
      this.isComponentProductModalActive = false;
    },
    itemSelected(code) {
      this.item.product = code;
      this.isComponentItemModalActive = false;
    },
    postCost() {
      this.isLoading = true;
      let dataAccount = {
        tnotes: this.cost.notes,
        tamount: this.cost.amount
      };
      this.axios
        .post(`/assembly/add_item/${this.id}`, urlEncoded(dataAccount))
        .then(res => {
          this.editAssembly(this.id);
          this.resetCost();
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    postItem() {
      this.isLoading = true;
      let dataAccount = {
        tqty: this.item.qty,
        tproduct: this.item.product
      };
      this.axios
        .post(`/assembly/add_item/${this.id}`, urlEncoded(dataAccount))
        .then(res => {
          this.editAssembly(this.id);
          this.resetItem();
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    deleteItem(id) {
      this.axios
        .get(`/assembly/delete_item/${id}`)
        .then(res => {
          this.editAssembly(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteCost(id) {
      this.axios
        .get(`/assembly/delete_cost/${id}`)
        .then(res => {
          this.editAssembly(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetItem() {
      this.item.qty = null;
      this.item.product = null;
    },
    resetCost() {
      this.cost.notes = null;
      this.cost.amount = null;
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
      this.editAssembly(id);
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