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
              <option
                v-for="currency in currencyList"
                :value="currency.code"
                :key="currency.code"
              >{{currency.code}} - {{currency.name}}</option>
            </b-select>
          </b-field>

          <b-field label="Doc No" expanded>
            <b-input v-model="docno" />
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
          <button class="button is-primary" @click.prevent="submitJournaleditJournal()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
        <hr />
        <!-- Receipt -->
        <div class="section receipt">
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
                <th>Account</th>
                <th class="has-text-right">Debit</th>
                <th class="has-text-right">Credit</th>
                <th class="has-text-centered">Action</th>
              </tr>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.acc_code +" "+item.acc_name}}</td>
                <td class="has-text-right">
                  <numeric :value="item.debit" />
                </td>
                <td class="has-text-right">
                  <numeric :value="item.credit" />
                </td>
                <td class="has-text-centered">
                  <button
                    style="margin-top: 4px;"
                    class="delete is-small"
                    @click.prevent="deleteAccount(item.id)"
                  ></button>
                </td>
              </tr>
              <tr v-if="!items">
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
                  <numeric :currency="currencyPrefix||''" :value="total" />
                </p>
              </b-field>
            </div>
            <div class="column is-5 has-text-right">
              <b-button
                v-if="id"
                icon-left="plus"
                @click.prevent="isAddAccountActive = !isAddAccountActive"
              >Item</b-button>
              <small v-else>
                <i>Please Save Transaction First to Add a Account</i>
              </small>
            </div>

            <div class="column is-12" v-if="isAddAccountActive">
              <hr />
              <b-field grouped group-multiline>
                <b-field label="Account">
                  <b-field expanded>
                    <b-input v-model="item.code" disabled />
                    <p class="control">
                      <button class="button is-primary" @click.prevent="showAddAccountModal()">...</button>
                    </p>
                  </b-field>
                </b-field>
                <b-field label="Debit" expanded>
                  <b-input type="number" v-model="item.debit" />
                </b-field>
                <b-field label="Credit" expanded>
                  <b-input type="number" v-model="item.credit" />
                </b-field>
              </b-field>
              <div class="buttons">
                <b-button type="is-primary" @click.prevent="postAccount()">Post</b-button>
                <b-button type="is-primary" @click.prevent="resetAccount()">Reset</b-button>
              </div>
              <hr />
            </div>

            <div class="column is-12" expanded>
              <b-field grouped group-multiline>
                <b-field label="Debit" expanded>
                  <b-input v-model="debit" disabled />
                </b-field>
                <b-field label="Credit" expanded>
                  <b-input v-model="credit" disabled />
                </b-field>
                <b-field label="Balance" expanded>
                  <b-input v-model="balance" disabled />
                </b-field>
              </b-field>
            </div>
          </div>
        </div>

        <br />
        <b-button @click="goBack" type="is-primary" icon-left="chevron-left">Back</b-button>
      </div>
    </form>
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
export default {
  data() {
    return {
      isLoading: false,
      isAddAccountActive: false,
      isComponentAccountModalActive: false,
      dataAccountModal: {
        branchList: [],
        categoryList: [],
        manufactureList: [],
        accountList: []
      },
      currencyList: [],
      vendorList: [],
      accountList: [],
      no: null,
      date: null,
      currency: "",
      docno: "",
      note: "",
      desc: "",
      items: null,

      id: null,
      // Edit JournaleditJournal
      item: {
        code: "",
        credit: "",
        debit: ""
      },
      total: 0,
      credit: 0,
      debit: 0,
      balance: 0
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
        let currency = res.data.content.result;
        currency.map(el => {
          let currencyObj = {};
          currencyObj.id = el.id;
          currencyObj.code = (el.code).toUpperCase();
          currencyObj.name = (el.name).toUpperCase();
          this.currencyList.push(currencyObj);
        });
      });
    },
    // Load Vendor
    loadVendor() {
      this.axios.get("/vendor").then(res => {
        this.vendorList = [];
        let vendor = res.data.content.result;
        vendor.map(el => {
          this.vendorList.push(el);
        });
      });
    },
    // Load Account
    loadAccount() {
      this.axios.get("/account/get_asset_acc").then(res => {
        this.accountList = [];
        let account = res.data.content.result;
        account.map(el => {
          this.accountList.push(el);
        });
      });
    },

    editJournal(id) {
      this.isLoading = true;
      this.axios
        .get(`/journalgl/get/${id}`)
        .then(res => {
          this.isLoading = false;
          let data = res.data.content;
          this.no = data.no;
          this.date = new Date(data.dates);
          this.currency = data.currency;
          this.docno = data.docno;
          this.note = data.note;
          this.desc = data.desc;
          this.total = data.total;
          this.items = data.items;
          this.debit = data.debit;
          this.credit = data.credit;
          this.balance = data.balance;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    // Modal Action
    submitJournaleditJournal() {
      this.isLoading = true;
      let ap_paymentData = {
        tno: this.no,
        ctype: this.vendor,
        tdate: this.dateFormat(this.date),
        ccurrency: this.currency,
        tdocno: this.docno,
        tnote: this.note,
        tdesc: this.desc
      };
      let submit;
      if (this.id) {
        submit = this.axios.post(
          `/journalgl/update/${this.id}`,
          urlEncoded(ap_paymentData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } else {
        submit = this.axios.post("/journalgl/add", urlEncoded(ap_paymentData), {
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
              this.$router.push("/general_ledger/journalgl/edit/" + err);
            } else {
              this.goBack();
            }
            swal(
              "Success!",
              "JournaleditJournal submit successfully!",
              "success"
            );
            this.loadAsyncJournaleditJournalList();
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
        this.dataAccountModal.branchList = [];
        let branch = res.data.content.result;
        branch.map(el => {
          let elBranch = {};
          elBranch.code = el.code;
          elBranch.name = el.name;
          this.dataAccountModal.branchList.push(elBranch);
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
      this.isComponentAccountModalActive = true;
      this.loadAccount();
    },
    accountSelected(code) {
      this.item.code = code;
      this.isComponentAccountModalActive = false;
    },
    postAccount() {
      this.isLoading = true;
      let dataAccount = {
        titem: this.item.code,
        tdebit: this.item.debit,
        tcredit: this.item.credit
      };
      this.axios
        .post(`/journalgl/add_item/${this.id}`, urlEncoded(dataAccount))
        .then(res => {
          this.editJournal(this.id);
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
        .get(`journalgl/delete_item/${id}`)
        .then(res => {
          this.editJournal(this.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetAccount() {
      this.item.code = "";
      this.item.credit = "";
      this.item.debit = "";
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
        this.editJournal(this.id);
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