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

          <b-field label="Vendor" expanded>
            <b-select expanded placeholder="Select Vendor" v-model="cvendor">
              <option v-for="vendor in vendorList" :value="vendor.id" :key="vendor.id">{{vendor.name}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="ccurrency">
              <option v-for="currency in currencyList" :value="currency.name" :key="currency.id">{{currency.code}}</option>
            </b-select>
          </b-field>

          <b-field label="Shiping Date" expanded>
            <b-datepicker
              editable
              :date-formatter="dateFormat"
              placeholder="Click to select..."
              icon="calendar-today"
              v-model="tshipping"
            ></b-datepicker>
          </b-field>
          <b-field label="Account" expanded>
            <b-select expanded placeholder="Select Account" v-model="cacc">
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="petty cash">Petty Cash</option>
            </b-select>
          </b-field>
          <b-field label="Doc No" expanded>
            <b-input v-model="tdocno" />
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
          <button class="button is-primary" @click.prevent="submitPurchase()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
        <hr />
        <!-- Receipt -->
        <div class="section receipt">
          <!-- <small>{{moment(tdate).format("ddd, DD MMM YYYY")}}</small> -->
          <div class="modal-card-title">
            Review Order
            <span class="is-pulled-right" v-if="tno">{{tno}}</span>
            <br />
            <small>{{ccurrency.toUpperCase()}}</small>
          </div>
          <br />
          <div style="overflow-x:auto;">
            <table class="receipt-table">
              <tr>
                <th>No</th>
                <th>Product</th>
                <th class="has-text-centered">Qty</th>
                <th class="has-text-right">Unit Price</th>
                <th class="has-text-right">Tax</th>
                <th class="has-text-right">Amount</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in productItem" :key="index">
                <td>{{index+1}}</td>
                <td style="min-width: 200px">{{item.product}}</td>
                <td class="has-text-centered">x{{item.qty}}</td>
                <td class="has-text-right">
                  <numeric :value="item.price" />
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
                    <b-input v-model="titem" disabled />
                    <p class="control">
                      <button class="button is-primary" @click.prevent="showAddProductModal()">...</button>
                    </p>
                  </b-field>
                </b-field>
                <b-field label="Qty" expanded>
                  <input class="input" type="number" v-model="tqty" />
                </b-field>
                <b-field label="Unit Price" expanded>
                  <b-input v-model="tamount" />
                </b-field>
                <b-field label="Tax">
                  <b-select expanded placeholder="Select One" v-model="ctax">
                    <option value="1">PPN</option>
                    <option value="0">PPH</option>
                  </b-select>
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postProduct()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetProduct()">Reset</b-button>
              </div>
              <hr />
            </div>

            <div class="column is-12" expanded>
              <b-field grouped group-multiline>
                <b-field label="Landed Cost" expanded>
                  <b-input v-model="tcosts" />
                </b-field>
                <b-field label="Credit/Debit" expanded>
                  <b-select expanded placeholder="Select One" v-model="cover">
                    <option value="1">Credit</option>
                    <option value="0">Debit</option>
                  </b-select>
                </b-field>
                <b-field label="Down Payment" expanded>
                  <b-input v-model="tp1" />
                </b-field>
              </b-field>
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
          <add-product @selected="itemSelected"></add-product>
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
        manufactureList: []
      },
      currencyList: [],
      vendorList: [],
      accountList: [],
      cvendor: "",
      tno: null,
      tdate: null,
      ccurrency: "",
      tnote: "",
      tshipping: null,
      tdocno: "",
      cacc: "",
      tdesc: "",
      // Edit Purchase
      id: null,
      productItem: [],
      currencyPrefix: "",
      tax: 0,
      total: 0,
      totaltax: 0,
      tcosts: null,
      tp1: null,
      cover: null,
      // Add Product
      titem: "",
      tqty: "",
      tamount: "",
      ctax: ""
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
      this.axios.get("/payment").then(res => {
        this.accountList = [];
        let account = res.data.content.result
        account.map(el => {
          this.accountList.push(el);
        });
      });
    },

    editPurchase(id) {
      this.isLoading = true;
      this.axios
        .get(`/purchase/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content
          this.tno = data.no;
          this.cvendor = data.vendor;
          this.tdate = new Date(data.date);
          this.tshipping = new Date(data.shipping);
          this.tdesc = data.desc;
          this.tdocno = data.docno;
          this.ccurrency = data.currency;
          this.cacc = data.acc;
          this.tnote = data.note;
          this.productItem = data.items;
          this.currencyPrefix = this.setCurrencyPrefx(data.currency);
          this.tax = data.tax;
          this.total = data.total;
          this.totaltax = data.totaltax;
          this.cover = data.over;
          this.tp1 = data.p1;
          this.tcosts = data.costs;

          console.log(data);
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Modal Action
    submitPurchase() {
      this.isLoading = true;
      let purchaseData = {
        id: this.id,
        tno: this.tno,
        cvendor: this.cvendor,
        tdate: this.dateFormat(this.tdate),
        tshipping: this.dateFormat(this.tshipping),
        tdesc: this.tdesc,
        tdocno: this.tdocno,
        ccurrency: this.ccurrency,
        tacc: this.acc,
        tnote: this.tnote
      };
      // console.log(purchaseData);
      // console.log(urlEncoded(purchaseData))
      let submit;
      if (this.id) {
        purchaseData.id = this.id;
        purchaseData.tcosts = this.tcosts;
        purchaseData.tp1 = this.tp1;
        purchaseData.cover = this.cover;
        submit = this.axios.post(
          `/purchase/update/${this.id}`,
          urlEncoded(purchaseData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/purchase/add", urlEncoded(purchaseData), {
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
              this.id = err;
              this.$router.push("/purchase/purchase_order/edit/" + err);
            } else {
              this.goBack()
            }
            swal("Success!", "Purchase submit successfully!", "success");
            this.loadAsyncPurchaseList();
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

    showAddProductModal() {
      this.isComponentModalActive = true;
      this.loadBranch();
      this.loadManufacture();
      this.loadCategory();
    },
    itemSelected(sku) {
      this.titem = sku;
      this.isComponentModalActive = false;
    },
    postProduct() {
      this.isLoading = true;
      let dataProduct = {
        titem: this.titem,
        tqty: this.tqty,
        tamount: this.tamount,
        ctax: this.ctax
      };
      this.axios
        .post(`/purchase/add_item/${this.id}`, urlEncoded(dataProduct))
        .then(res => {
          this.editPurchase(this.id);
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
        .get(`purchase/delete_item/${id}`)
        .then(res => {
          this.editPurchase(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetProduct() {
      this.titem = "";
      this.tqty = "";
      this.tamount = "";
      this.ctax = "";
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
      let id = this.$route.params.id;
      this.id = id;
      this.editPurchase(id);
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