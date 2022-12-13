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

          <b-field label="Currency" expanded>
            <b-select expanded placeholder="Select Currency" v-model="currency">
              <option v-for="currency in currencyList" :value="currency.name" :key="currency.name">{{currency.code}}</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Check Account" expanded>
            <b-select expanded placeholder="Select Account" v-model="acc">
              <option v-for="account in accountList" :value="account.id" :key="account.id">{{account.name}}</option>
            </b-select>
          </b-field>
          <b-field label="Note" expanded>
            <b-input v-model="note" type="textarea" expanded />
          </b-field>
          <b-field label="Description" expanded>
            <b-input v-model="desc" type="textarea" expanded />
          </b-field>
        </b-field>
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
                <th>Code</th>
                <th>Note</th>
                <th class="has-text-right">Amount</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in itemList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.account}}</td>
                <td>{{item.note}}</td>
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
                  <numeric :currency="setCurrencyPrefx(currency)" :value="grandTotal" />
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
                <b-field label="Cost Type" expanded>
                  <b-select expanded placeholder="Select Account" v-model="costType">
                    <option v-for="account in CostTypeList" :value="account.id" :key="account.id">{{account.name}}</option>
                  </b-select>
                </b-field>
                <b-field label="Receiver" expanded>
                  <b-input v-model="receiver" expanded />
                </b-field>
                <b-field label="Amount">
                  <input class="input" type="number" v-model="amount" />
                </b-field>
              </b-field>
              <b-field label="Note" expanded>
                <b-input v-model="notes" type="textarea" expanded />
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
  </div>
</template>
<script>
import { urlEncoded } from "@/function-helper";
import numeric from "@/components/Numeric";
export default {
  data() {
    return {
      isLoading: false,
      isAddItemActive: false,
      isComponentModalActive: false,
      itemList: [],
      currencyList: [],
      accountList: [],
      CostTypeList: [],
      grandTotal: 0,
      vendor: "",
      no: null,
      date: null,
      currency: "",
      acc: "",
      note: "",
      notes: "",
      desc: "",
      checkaccno: "",
      checkaccname: "",
      accbank: "",
      post: false,
      check: "",
      balance: "",
      bank: "",
      duedate: "",
      late: "",

      // Edit ApCash
      id: null,
      // Add Item
      costType: null,
      receiver: "",
      amount: null
    };
  },
  components: {
    numeric
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

    editApCash(id) {
      this.isLoading = true;
      this.axios
        .get(`/apc/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content
          this.no = data.code;
          this.grandTotal = data.amount;
          this.date = new Date(data.date);
          this.note = data.notes;
          this.currency = data.currency;
          this.acc = data.acc;
          this.itemList = data.items;
          console.log(data.items);
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Modal Action
    submitApCash() {
      this.isLoading = true;
      let ap_cashData = {
        tno: this.no,
        cvendor: this.vendor,
        tdate: this.dateFormat(this.date),
        ccurrency: this.currency,
        tnote: this.note,
        cacc: this.acc,
        tdesc: this.desc,
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
          `/apc/update/${this.id}`,
          urlEncoded(ap_cashData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/apc/add", urlEncoded(ap_cashData), {
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
              this.$router.push("/purchase/apc/edit/" + err);
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
        ccost: this.costType,
        tstaff: this.receiver,
        tamount: this.amount,
        tnotes: this.notes
      };
      this.axios
        .post(`/apc/add_item/${this.id}`, urlEncoded(dataItem))
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
        .get(`apc/delete_item/${id}`)
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