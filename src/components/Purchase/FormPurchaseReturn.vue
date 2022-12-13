<template>
  <div>
    <form class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        <hr />
        <b-field grouped group-multiline>
          <b-field label="No" expanded>
            <b-input v-model="no" type="number" />
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

          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="currency">
              <option v-for="currency in currencyList" :value="currency.name" :key="currency.id">{{currency.code}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="PO">
            <b-field expanded>
              <b-input v-model="po" disabled />
              <p class="control">
                <button class="button is-primary" @click.prevent="showAddPOModal()">...</button>
              </p>
            </b-field>
          </b-field>
          <b-field label="Doc No" expanded>
            <b-input v-model="docno" type="number" />
          </b-field>
          <b-field label="Check Account" expanded>
            <b-select expanded placeholder="Select Account" v-model="acc">
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="petty cash">Petty Cash</option>
            </b-select>
          </b-field>
        </b-field>
        <b-field grouped group-multiline>
          <b-field label="Landed Cost">
            <b-input v-model="costs" />
          </b-field>
          <b-field label="Note" expanded>
            <b-input v-model="note" type="textarea" expanded />
          </b-field>
        </b-field>
        <br />
        <!-- Purchasing Item -->
        <div v-if="id" class="section receipt">
          <table class="receipt-table">
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Qty</th>
              <th class="has-text-right">Unit Price</th>
              <th class="has-text-right">Tax</th>
              <th class="has-text-right">Amount</th>
            </tr>
            <tr v-for="(item, index) in purchaseItem" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.product}}</td>
              <td>{{item.qty}}</td>
              <td class="has-text-right">
                <numeric :value="item.unit_price" />
              </td>
              <td class="has-text-right">
                <numeric :value="item.tax" />
              </td>
              <td class="has-text-right">
                <numeric :value="item.amount" />
              </td>
            </tr>
            <tr v-if="!purchaseItem">
              <td colspan="7" class="has-text-grey has-text-centered">
                <small>
                  <i>No data available</i>
                </small>
              </td>
            </tr>
          </table>
        </div>
        <br />

        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitApCash()">Save</button>
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
                <th>Product</th>
                <th>Qty</th>
                <th class="has-text-right">Unit Price</th>
                <th class="has-text-right">Tax</th>
                <th class="has-text-right">Amount</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in itemList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.product}}</td>
                <td>{{item.qty}}</td>
                <td class="has-text-right">
                  <numeric :value="item.unit_price" />
                </td>
                <td class="has-text-right">
                  <numeric :value="item.tax" />
                </td>
                <td class="has-text-right">
                  <numeric :value="item.amount" />
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
            <div class="column is-7">
              <b-field label="Grand Total" expanded>
                <p class="title is-4 is-size-5-mobile">
                  <numeric :currency="setCurrencyPrefx(currency)" :value="totaltax" />
                </p>
              </b-field>
            </div>
            <div class="column is-5 has-text-right">
              <b-button
                v-if="id"
                icon-left="plus"
                @click.prevent="isAddItemActive = !isAddItemActive"
              >Item</b-button>
              <small v-else>
                <i>Please Save Transaction First to Add a Item</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddItemActive">
              <hr />
              <b-field grouped group-multiline>
                <b-field label="Product" expanded>
                  <b-select expanded placeholder="Select Product" v-model="product">
                    <option
                      v-for="item in productList"
                      :value="item.product_id"
                      :key="item.product_id"
                    >{{item.sku+item.name}}</option>
                  </b-select>
                </b-field>
                <b-field label="Qty" expanded>
                  <b-input type="number" v-model="qty" expanded />
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postItem()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetItem()">Reset</b-button>
              </div>
              <hr />
            </div>

            <div class="column is-12" expanded>
              <b-field grouped group-multiline>
                <b-field label="Tax">
                  <b-input v-model="tax" disabled/>
                </b-field>
                <b-field label="Balance">
                  <b-input v-model="balance" disabled/>
                </b-field>
              </b-field>
            </div>
          </div>
        </div>

        <br />
        <b-button @click="goBack" type="is-primary" icon-left="chevron-left">Back</b-button>
      </div>
    </form>
    <!-- Modals PO -->
    <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{id?"Edit": "Add New"}} Transaction</p>
        </header>
        <section class="modal-card-body">
          <addpo @selected="itemSelected"></addpo>
        </section>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { urlEncoded } from "@/function-helper";
import numeric from "@/components/Numeric";
import addpo from "@/components/Purchase/AddPO";
export default {
  data() {
    return {
      isLoading: false,
      isAddItemActive: false,
      isComponentModalActive: false,
      itemList: [],
      productList: [],
      purchaseItem: [],
      currencyList: [],
      accountList: [],
      grandTotal: 0,
      no: null,
      date: null,
      currency: "",
      acc: "",
      po: "",
      note: "",
      costs: "",
      product: "",
      qty: "",
      tax: "",
      totaltax: "",
      balance: "",

      // Edit
      id: null
    };
  },
  components: {
    numeric,
    addpo
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
    // Load Account
    loadCostType() {
      this.axios.get("/account").then(res => {
        this.CostTypeList = [];
        let account = res.data.content.result
        account.map(el => {
          this.CostTypeList.push(el);
        });
      });
    },
    showAddPOModal() {
      this.isComponentModalActive = true;
    },
    itemSelected(id) {
      this.po = id;
      this.isComponentModalActive = false;
    },
    editApCash(id) {
      this.isLoading = true;
      this.axios
        .get(`/purchase_return/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content
          this.no = data.no;
          this.docno = data.docno;
          this.po = data.po;
          this.date = new Date(data.date);
          this.note = data.note;
          this.currency = data.currency;
          this.acc = data.acc;
          this.itemList = data.items;
          this.productList = data.product;
          this.tax = data.tax;
          this.totaltax = data.totaltax;
          this.balance = data.balance;
          this.costs = data.costs;
          this.purchaseItem = data.purchase_item;
          console.log(data.items);
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Modal Action
    submitApCash() {
      this.isLoading = true;
      let bodyRequest = {
        tno: this.no,
        tdate: this.dateFormat(this.date),
        tdocno: this.docno,
        tpo: this.po,
        tnote: this.note,
        ccurrency: this.currency,
        cacc: this.acc
      };
      let submit;
      if (this.id) {
        submit = this.axios.post(
          `/purchase_return/update/${this.id}`,
          urlEncoded(bodyRequest)
        );
      } else {
        submit = this.axios.post(
          "/purchase_return/add",
          urlEncoded(bodyRequest)
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
              this.$router.push("/purchase/purchase_return/edit/" + err);
            } else {
              this.goBack()
            }
            swal("Success!", "ApCash submit successfully!", "success");
            this.loadAsyncApCashList();
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
    postItem() {
      this.isLoading = true;
      let dataItem = {
        cproduct: this.product,
        treturn: this.qty
      };
      this.axios
        .post(`/purchase_return/add_item/${this.id}`, urlEncoded(dataItem))
        .then(res => {
          this.editApCash(this.id);
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
        .get(`purchase_return/delete_item/${id}`)
        .then(res => {
          this.editApCash(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetItem() {
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
    this.loadCostType();
    this.loadCurrency();
    this.loadAccount();
    if (this.$route.params.id) {
      this.isLoading = true;
      let id = this.$route.params.id;
      this.id = id;
      setTimeout(() => {
        this.editApCash(this.id);
      }, 500);
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