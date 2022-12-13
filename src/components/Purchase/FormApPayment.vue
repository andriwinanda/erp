<template>
  <div>
    <form class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        <hr />
        <b-field grouped group-multiline>
          <b-field label="No" expanded>
            <b-input v-model="no" placeholder="Autogenerate" disabled />
          </b-field>
          <b-field label="Transaction Date" expanded>
            <b-datepicker
              editable
              :date-parser="dateFormat"
              :date-formatter="dateFormat"
              placeholder="Click to select..."
              icon="calendar-today"
              v-model="date"
            ></b-datepicker>
          </b-field>

          <b-field label="Vendor" expanded>
            <b-select expanded placeholder="Select Vendor" v-model="vendor">
              <option v-for="vendor in vendorList" :value="vendor.id" :key="vendor.id">{{vendor.name}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="currency">
              <option v-for="currency in currencyList" :value="currency.name" :key="currency.id">{{currency.code}}</option>
            </b-select>
          </b-field>
          <b-field label="Account" expanded>
            <b-select expanded placeholder="Select Account" v-model="acc">
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="petty cash">Petty Cash</option>
            </b-select>
          </b-field>
          <b-field label="Doc No" expanded>
            <b-input v-model="docno" />
          </b-field>
          <b-field label="Rate" expanded>
            <input class="input" min="1" type="number" v-model="rate" />
          </b-field>
        </b-field>
        <!-- Receipt -->
        <div class="section receipt">
          <b-field grouped group-multiline>
            <b-field label="Check Number" expanded>
              <b-input v-model="check" />
            </b-field>

            <b-field label="Due Date" expanded>
              <b-datepicker
                editable
                :date-parser="dateFormat"
                :date-formatter="dateFormat"
                placeholder="Click to select..."
                icon="calendar-today"
                v-model="duedate"
              ></b-datepicker>
            </b-field>
          </b-field>
          <b-field grouped group-multiline>
            <b-field label="Check Number Acc" expanded>
              <b-input v-model="checkaccno" />
            </b-field>
            <b-field label="Check Name Acc" expanded>
              <b-input v-model="checkaccname" />
            </b-field>
            <b-field label="Check Bank Acc" expanded>
              <b-input v-model="accbank" />
            </b-field>
            <b-field label="Check Account" expanded>
              <b-select expanded placeholder="Select Account" v-model="bank">
                <option v-for="account in accountList" :value="account.id" :key="account.id">{{account.name}}</option>
              </b-select>
            </b-field>
            <b-field label="Check Balance" expanded>
              <b-input v-model="balance" />
            </b-field>

            <b-field label="Late Charges" expanded>
              <b-input v-model="late" />
            </b-field>
          </b-field>

          <b-field class="field">
            <b-switch v-model="post">
              <b>Post - Dated</b>
            </b-switch>
          </b-field>
        </div>
        <br />

        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitApPayment()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
        <hr />
        <!-- Receipt -->
        <div class="section receipt">
          <!-- <small>{{moment(date).format("ddd, DD MMM YYYY")}}</small> -->
          <div class="modal-card-title">
            Review Order
            <span class="is-pulled-right" v-if="no">{{no}}</span>
            <br />
            <small>{{currency.toUpperCase()}}</small>
          </div>
          <br />
          <div style="overflow-x:auto;">
            <table class="receipt-table">
              <tr>
                <th>No</th>
                <th>Code</th>
                <th class="has-text-right">Discount</th>
                <th class="has-text-right">Amount</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in productItem" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.purchase}}</td>
                <td class="has-text-right">
                  <numeric :value="item.discount" />
                </td>
                <td class="has-text-right">
                  <numeric :value="item.amount" />
                </td>
                <td class="has-text-centered">
                  <button
                    style="margin-top: 4px;"
                    class="delete is-small"
                    @click.prevent="deleteProduct(item.id)"
                  ></button>
                </td>
              </tr>
              <tr v-if="!productItem">
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
            <div class="column is-7">
              <b-field label="Grand Total" expanded>
                <p class="title is-4 is-size-5-mobile">
                  <numeric :currency="currencyPrefix" :value="totaltax" />
                </p>
              </b-field>
            </div>
            <div class="column is-5 has-text-right">
              <b-button
                v-if="id"
                icon-left="plus"
                @click.prevent="isAddProductActive = !isAddProductActive"
              >Product</b-button>
              <small v-else>
                <i>Please Save Transaction First to Add a Product</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddProductActive">
              <hr />
              <b-field grouped group-multiline>
                <b-field label="Product">
                  <b-field expanded>
                    <b-input v-model="item" disabled />
                    <p class="control">
                      <button class="button is-primary" @click.prevent="showAddProductModal()">...</button>
                    </p>
                  </b-field>
                </b-field>
                <b-field label="Balance" expanded>
                  <input class="input" type="number" v-model="balance" />
                </b-field>
                <b-field label="Discount" expanded>
                  <input class="input" type="number" v-model="discount" />
                </b-field>
                <b-field label="Amount">
                  <input class="input" type="number" v-model="amount" />
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postProduct()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetProduct()">Reset</b-button>
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
    <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        </header>
        <section class="modal-card-body">
          <add-product v-bind="dataProductModal" @selected="itemSelected"></add-product>
        </section>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { urlEncoded } from "@/function-helper";
import numeric from "@/components/Numeric";
import addProduct from "@/components/Purchase/AddProductPurchase";
export default {
  data() {
    return {
      isLoading: false,
      isAddProductActive: false,
      isComponentModalActive: false,
      dataProductModal: {
        branchList: [],
        categoryList: [],
        manufactureList: [],
        accountList: []
      },
      currencyList: [],
      vendorList: [],
      accountList: [],
      vendor: "",
      no: null,
      date: null,
      currency: "",
      docno: "",
      acc: "",
      rate: "",
      checkaccno: "",
      checkaccname: "",
      accbank: "",
      post: false,
      check: "",
      balance: "",
      bank: "",
      duedate: "",
      late: "",

      // Edit ApPayment
      id: null,
      productItem: [],
      currencyPrefix: "",
      tax: 0,
      total: 0,
      totaltax: 0,
      costs: null,
      p1: null,
      over: null,
      // Add Product
      item: "",
      balance: "",
      discount: "",
      amount: ""
    };
  },
  components: {
    numeric,
    addProduct
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

    editApPayment(id) {
      this.isLoading = true;
      this.axios
        .get(`/ap_payment/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content
          this.no = data.no;
          this.vendor = data.venid;
          this.date = new Date(data.date);
          this.docno = data.docno;
          this.currency = data.currency;
          this.acc = data.acc;
          this.rate = data.rate;
          this.checkaccno = data.checkaccno;
          this.checkaccname = data.checkaccname;
          this.accbank = data.checkaccbank;
          this.check = data.check;
          this.balance = data.balance;
          this.bank = data.bank;
          this.duedate = new Date(data.default.due) || null;
          this.late = data.late;
          this.post = data.status ? "true" : "false";
          this.productItem = data.items;
          console.log(data);
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Modal Action
    submitApPayment() {
      this.isLoading = true;
      let ap_paymentData = {
        tno: this.no,
        cvendor: this.vendor,
        tdate: this.dateFormat(this.date),
        ccurrency: this.currency,
        tdocno: this.docno,
        cacc: this.acc,
        trate: this.rate,
        tcheckaccno: this.checkaccno,
        tcheckaccname: this.checkaccname,
        tccbank: this.accbank,
        tpost: this.post,
        tcheck: this.check,
        tbalancecek: this.balance,
        cbank: this.bank,
        tdue: this.dateFormat(this.duedate),
        tlate: this.late
      };
      let submit;
      if (this.id) {
        submit = this.axios.post(
          `/ap_payment/update/${this.id}`,
          urlEncoded(ap_paymentData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post(
          "/ap_payment/add",
          urlEncoded(ap_paymentData),
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
              this.id = err;
              this.$router.push("/purchase/ap_payment/edit/" + err);
            } else {
             this.goBack()
            }
            swal("Success!", "ApPayment submit successfully!", "success");
            this.loadAsyncApPaymentList();
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
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.dataProductModal.branchList = [];
        let branch = res.data.content.result
        branch.map(el => {
          let elBranch = {};
          elBranch.code = el.code;
          elBranch.name = el.name;
          this.dataProductModal.branchList.push(elBranch);
        });
      });
    },
    // Load Category
    loadCategory() {
      this.axios.get("/category").then(res => {
        this.dataProductModal.categoryList = [];
        let category = res.data.content.result;
        category.map(el => {
          let elCateogory = {};
          elCateogory.code = el.code;
          elCateogory.name = el.name;
          elCateogory.id = el.id;
          this.dataProductModal.categoryList.push(elCateogory);
        });
      });
    },
    // Load manufacture
    loadManufacture() {
      this.manufactureList = [];
      this.axios.get("/manufacture").then(res => {
        this.dataProductModal.manufactureList = [];
        let manufacture = res.data.content.result;
        manufacture.map(el => {
          let manufactureElement = {};
          manufactureElement.id = el.id;
          manufactureElement.name = el.name;
          this.dataProductModal.manufactureList.push(manufactureElement);
        });
      });
    },
    showAddProductModal() {
      this.isComponentModalActive = true;
      this.loadBranch();
      this.loadManufacture();
      this.loadCategory();
    },
    itemSelected(sku) {
      this.item = sku;
      this.isComponentModalActive = false;
    },
    postProduct() {
      this.isLoading = true;
      let dataProduct = {
        titem: this.item,
        tnominal: this.balance,
        tdiscount: this.discount,
        tamount: this.amount
      };
      this.axios
        .post(`/ap_payment/add_item/${this.id}`, urlEncoded(dataProduct))
        .then(res => {
          this.editApPayment(this.id);
          this.resetProduct();
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    deleteProduct(id) {
      this.axios
        .get(`ap_payment/delete_item/${id}`)
        .then(res => {
          this.editApPayment(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetProduct() {
      this.item = "";
      this.qty = "";
      this.amount = "";
      this.tax = "";
    },
    goBack() {
      this.$router.go(-1);
    }
  },
created() {
    this.loadAccount();
    this.loadCurrency();
    this.loadVendor();
    if (this.$route.params.id) {
      this.isLoading = true;
      let id = this.$route.params.id;
      this.id = id;
      setTimeout(() => {
        this.editApPayment(this.id);
      }, 500);
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