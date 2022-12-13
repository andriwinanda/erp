<template>
  <div>
    <div>
      <!-- Filter Component -->
      <div class="flat-card row" style="margin-bottom: 15px;">
        <div class="card-content">
          <form @submit.prevent="loadFilter()">
            <b-field grouped group-multiline expanded>
              <b-field label="Currency" expanded>
                <b-select expanded placeholder="Select Currency" v-model="currency">
                  <option
                    v-for="currency in currencyList"
                    :value="currency.code"
                    :key="currency.name"
                  >{{currency.code}}</option>
                </b-select>
              </b-field>
              <b-field label="Start">
                <b-datepicker
                  :date-parser="dateFormat"
                  :date-formatter="dateFormat"
                  type="month"
                  placeholder="Click to select..."
                  icon="calendar-today"
                  v-model="start"
                ></b-datepicker>
              </b-field>
              <b-field label="End">
                <b-datepicker
                  :date-parser="dateFormat"
                  :date-formatter="dateFormat"
                  placeholder="Click to select..."
                  v-model="end"
                  icon="calendar-today"
                  type="month"
                ></b-datepicker>
              </b-field>
            </b-field>
            <div class="buttons">
              <button class="button is-primary" @click.prevent="loadAsyncLedgerList()">Post</button>
              <button class="button is-primary" @click.prevent="reset()">Reset</button>
              <b-button @click="$router.back()" type="is-warning" icon-left="chevron-left">Back</b-button>
            </div>
          </form>
        </div>
      </div>

      <div class="flat-card" v-if="reportList">
        <div class="card-content" style="padding: 2rem 5rem;">
          <br />
          <div class="columns is-multiline">
            <!-- Table Ledger -->
            <div class="column is-12" id="printArea">
              <h1 class="title has-text-centered has-text-info-dark">Trial Balance</h1>
              <h1
                class="subtitle is-6 has-text-centered has-text-danger-dark"
              >{{moment(start).format('MMMM YYYY')}} - {{moment(end).format('MMMM YYYY')}}</h1>
              <table class="table is-bordered" width="100%">
                <!-- <tr>
                  <td>Biaya Operasional</td>
                </tr>
                <tr v-for="item in reportList.result.biaya_operasional" :key="item.id">
                  <td>{{item.name}} </td>
                  <td>{{item.amount}} </td>
                </tr>-->
                <!-- Pendapatan -->
                <tr>
                  <th
                    rowspan="2"
                    style="vertical-align : middle;text-align:center;"
                    class="has-text-info-dark"
                  >Chart of Account</th>
                  <th
                    colspan="2"
                    style="vertical-align : middle;text-align:center;"
                    class="has-text-centered has-text-info-dark"
                  >Begining Balance</th>
                  <th
                    colspan="2"
                    style="vertical-align : middle;text-align:center;"
                    class="has-text-centered has-text-info-dark"
                  >This Month Activity</th>
                  <th
                    colspan="2"
                    style="vertical-align : middle;text-align:center;"
                    class="has-text-centered has-text-info-dark"
                  >Ending Balance</th>
                </tr>

                <!--Pendapatan Usaha-->
                <tr>
                  <th class="has-text-centered has-text-info-dark">Debit</th>
                  <th class="has-text-centered has-text-info-dark">Credit</th>
                  <th class="has-text-centered has-text-info-dark">Debit</th>
                  <th class="has-text-centered has-text-info-dark">Credit</th>
                  <th class="has-text-centered has-text-info-dark">Debit</th>
                  <th class="has-text-centered has-text-info-dark">Credit</th>
                </tr>
                <tr v-for="item in reportList.result" :key="item.id">
                  <td class="has-text-info-dark">{{item.code}} {{item.name}}</td>
                  <td class="numeric">
                    <numeric :value="item.begin_debit" />
                  </td>
                  <td class="numeric">
                    <numeric :value="item.begin_credit" />
                  </td>
                  <td class="numeric">
                    <numeric :value="item.trans_debit" />
                  </td>
                  <td class="numeric">
                    <numeric :value="item.trans_credit" />
                  </td>
                  <td class="numeric">
                    <numeric :value="item.end_debit" />
                  </td>
                  <td class="numeric">
                    <numeric :value="item.end_credit" />
                  </td>
                </tr>
                <tr>
                  <th class="has-text-info-dark">Total</th>
                  <th class="numeric">
                    <numeric :value="reportList.summary.begin_debit" />
                  </th>
                  <th class="numeric">
                    <numeric :value="reportList.summary.begin_credit" />
                  </th>
                  <th class="numeric">
                    <numeric :value="reportList.summary.trans_debit" />
                  </th>
                  <th class="numeric">
                    <numeric :value="reportList.summary.trans_credit" />
                  </th>
                  <th class="numeric">
                    <numeric :value="reportList.summary.end_debit" />
                  </th>
                  <th class="numeric">
                    <numeric :value="reportList.summary.end_credit" />
                  </th>
                </tr>
              </table>
            </div>
            <div class="column is-12">
              <br />
              <b-button type="is-primary" icon-left="printer" @click="print()">Print</b-button>
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  </div>
</template>
<script>
import print from "print-js";
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import addAccount from "@/components/Transaction/AddAccountCashin";

import swal from "sweetalert";
export default {
  data() {
    return {
      currencyList: [],
      start: null,
      end: null,
      currency: null,
      loading: false,
      reportList: null
    };
  },
  components: {
    addAccount
  },
  methods: {
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
    dateFormat(value) {
      return this.moment(value).format("MM/YYYY");
    },
    /*
     * Load async LedgerList
     */
    loadAsyncLedgerList() {
      this.loading = true;
      let bodyRequest = {
        csmonth: this.moment(this.start).format("M"),
        cemonth: this.moment(this.end).format("M"),
        tsyear: this.moment(this.start).format("YYYY"),
        teyear: this.moment(this.end).format("YYYY"),
        ccurrency: this.currency
      };
      // if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post(
          "/report/trialbalance/search",
          urlEncoded(bodyRequest)
        );
      } else {
        ajax = this.axios.post("/report/trialbalance", urlEncoded(bodyRequest));
      }
      ajax
        .then(res => {
          this.loading = false;
          this.reportList = res.data.content;
          console.log(this.reportList);
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },

    print() {
      let attachment = document.getElementById("printArea");
      printJS({
        printable: "printArea",
        type: "html",
        header: null,
        targetStyles: ["*"]
      });
    }
  },
  created() {
    this.loadCurrency();
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
.numeric {
  text-align: right !important;
  padding-right: 0.5rem;
  border-bottom: 1px dashed black;
}
tr th {
  text-align: left;
}
.child-1 {
  padding-left: 2rem;
}
.child-2 {
  padding-left: 4rem;
}
</style>



