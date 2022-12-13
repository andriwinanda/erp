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
              <b-field label="Type">
                <b-select placeholder="Select one" v-model="type">
                  <option value="0">Standart</option>
                  <option value="1">Comparation - 2 Columns</option>
                  <option value="2">Comparation - 4 Columns</option>
                  <option value="3">Comparation - 12 Month</option>
                  <option value="4">Year to Date</option>
                  <option value="5">Real vs Budget</option>
                </b-select>
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
              <h1 class="title has-text-centered has-text-info-dark">Balance Sheet</h1>
              <h1
                class="subtitle is-6 has-text-centered has-text-danger-dark"
              >{{moment(start).format('MMMM YYYY')}} - {{moment(end).format('MMMM YYYY')}}</h1>
              <table width="100%">
                <!-- <tr>
                  <td>Biaya Operasional</td>
                </tr>
                <tr v-for="item in reportList.result.biaya_operasional" :key="item.id">
                  <td>{{item.name}} </td>
                  <td>{{item.amount}} </td>
                </tr>-->
                <!-- Harta -->
                <tr>
                  <th class="has-text-info-dark">Asset</th>
                  <td class="numeric">indonesian rupiah</td>
                </tr>

                <!-- Kas -->
                <tr>
                  <td class="child-1 has-text-info-dark">Kas</td>
                </tr>
                <tr v-for="item in reportList.result.kas" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Kas</td>
                  <td class="numeric">{{reportList.summary.kas}}</td>
                </tr>
                <!-- Kas -->

                <!--Bank-->
                <tr>
                  <td class="child-1 has-text-info-dark">Bank</td>
                </tr>
                <tr v-for="item in reportList.result.bank" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Bank</td>
                  <td class="numeric">{{reportList.summary.bank}}</td>
                </tr>
                <!--Bank-->

                <!-- Piutang Usaha -->
                <tr>
                  <td class="child-1 has-text-info-dark">Piutang Usaha</td>
                </tr>
                <tr v-for="item in reportList.result.piutangusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <tr>
                  <td class="child-1 has-text-info-dark">Total Piutang Usaha</td>
                  <td class="numeric">{{reportList.summary.piutangusaha}}</td>
                </tr>
                <!--Piutang Usaha-->

                <!-- Piutang Non Usaha -->
                <tr>
                  <td class="child-1 has-text-info-dark">Piutang Non Usaha</td>
                </tr>
                <tr v-for="item in reportList.result.piutangnonusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <tr>
                  <td class="child-1 has-text-info-dark">Total Piutang Non Usaha</td>
                  <td class="numeric">{{reportList.summary.piutangnonusaha}}</td>
                </tr>
                <!--Piutang Non Usaha-->

                <!-- Persediaan -->
                <tr>
                  <td class="child-1 has-text-info-dark">Persediaan</td>
                </tr>

                <tr v-for="item in reportList.result.persediaan" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <tr>
                  <td class="child-1 has-text-info-dark">Total Persediaan</td>
                  <td class="numeric">{{reportList.summary.persediaan}}</td>
                </tr>
                <!--Persediaan-->

                <!-- Biaya Di Bayar Dimuka -->
                <tr>
                  <td class="child-1 has-text-info-dark">Biaya Dibayar Dimuka</td>
                </tr>

                <tr v-for="item in reportList.result.biayadimuka" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <tr>
                  <td class="child-1 has-text-info-dark">Total Biaya Dibayar Dimuka</td>
                  <td class="numeric">{{reportList.summary.biayadimuka}}</td>
                </tr>
                <!-- Biaya Di Bayar Dimuka -->

                <!-- Investasi -->
                <tr>
                  <td class="child-1 has-text-info-dark">Investasi Jangka Panjang</td>
                </tr>

                <tr v-for="item in reportList.result.investasi" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Investasi Jangka Panjang</td>
                  <td class="numeric">{{reportList.summary.investasi}}</td>
                </tr>
                <!-- Investasi -->

                <!-- Harta Tetap Berwujud -->
                <tr>
                  <td class="child-1 has-text-info-dark">Harta Tetap Berwujud</td>
                </tr>

                <tr v-for="item in reportList.result.hartawujud" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Harta Tetap Berwujud</td>
                  <td class="numeric">{{reportList.summary.hartawujud}}</td>
                </tr>
                <!-- Harta Tetap Berwujud -->

                <!-- Harta Tetap Tak Berwujud -->
                <tr>
                  <td class="child-1 has-text-info-dark">Harta Tetap Tidak Berwujud</td>
                </tr>

                <tr v-for="item in reportList.result.hartatakberwujud" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Harta Tetap Tidak Berwujud</td>
                  <td class="numeric">{{reportList.summary.hartatakberwujud}}</td>
                </tr>
                <!-- Harta Tetap Tak Berwujud -->

                <!-- Harta Lainnya -->
                <tr>
                  <td class="child-1 has-text-info-dark">Harta Lainnya</td>
                </tr>

                <tr v-for="item in reportList.result.hartalain" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Harta Lainnya</td>
                  <td class="numeric">{{reportList.summary.hartalain}}</td>
                </tr>
                <!-- Harta Lainnya -->

                <tr>
                  <th class="has-text-danger-dark">Total Asset</th>
                  <th class="has-text-danger-dark numeric">{{reportList.summary.total_asset}}</th>
                </tr>
                <!-- Asset -->

                <!-- Liabilities -->
                <tr>
                  <th class="has-text-info-dark">Liabilities</th>
                </tr>

                <!-- Hutang Usaha -->
                <tr>
                  <td class="child-1 has-text-info-dark">Hutang Usaha</td>
                </tr>

                <tr v-for="item in reportList.result.hutangusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <tr>
                  <td class="child-1 has-text-info-dark">Total Hutang Usaha</td>
                  <td class="numeric">{{reportList.summary.hutangusaha}}</td>
                </tr>
                <!-- Hutang Usaha -->

                <!-- Pendapatan Terima Dimuka -->
                <tr>
                  <td class="child-1 has-text-info-dark">Pendapatan Terima Dimuka</td>
                </tr>
                <tr v-for="item in reportList.result.pendapatandimuka" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Pendapatan Terima Dimuka</td>
                  <td class="numeric">{{reportList.summary.pendapatandimuka}}</td>
                </tr>
                <!-- Pendapatan Terima Dimuka -->

                <!-- Hutang Jangka Panjang -->
                <tr>
                  <td class="child-1 has-text-info-dark">Hutang Jangka Panjang</td>
                </tr>
                <tr v-for="item in reportList.result.hutangpanjang" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Hutang Jangka Panjang</td>
                  <td class="numeric">{{reportList.summary.hutangpanjang}}</td>
                </tr>
                <!-- Hutang Jangka Panjang -->

                <!-- Hutang Non Usaha -->
                <tr>
                  <td class="child-1 has-text-info-dark">Hutang Non Usaha</td>
                </tr>

                <tr v-for="item in reportList.result.hutangnonusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Hutang Non Usaha</td>
                  <td class="numeric">{{reportList.summary.hutangnonusaha}}</td>
                </tr>
                <!-- Hutang Non Usaha-->

                <!-- Hutang Lain -->
                <tr>
                  <td class="child-1 has-text-info-dark">Hutang Lain</td>
                </tr>

                <tr v-for="item in reportList.result.hutanglain" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Hutang Lain</td>
                  <td class="numeric">{{reportList.summary.hutanglain}}</td>
                </tr>
                <!-- Hutang Lain -->

                <tr>
                  <th class="has-text-info-dark">Total Liabilities</th>
                  <td class="numeric">{{reportList.summary.liabilities}}</td>
                </tr>

                <!-- Liabilities -->

                <tr style="height:10px">
                  <td class="child-1 has-text-info-dark"></td>
                </tr>

                <!-- Equity -->
                <tr>
                  <th class="has-text-info-dark">Equity</th>
                </tr>

                <!-- Capital -->
                <tr>
                  <td class="child-1 has-text-info-dark">Capital</td>
                </tr>

                <tr v-for="item in reportList.result.modal" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <tr>
                  <td class="child-1 has-text-info-dark">Total Capital</td>
                  <td class="numeric">{{reportList.summary.modal}}</td>
                </tr>
                <!-- Equity -->

                <!-- Laba -->
                <tr>
                  <td class="child-1 has-text-info-dark">Earnings</td>
                </tr>

                <tr v-for="item in reportList.result.laba" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <tr>
                  <td class="child-1 has-text-info-dark">Total Earnings</td>
                  <td class="numeric">{{reportList.summary.laba}}</td>
                </tr>
                <!-- Laba -->

                <tr>
                  <th class="has-text-info-dark">Total Equity</th>
                  <td class="numeric">{{reportList.summary.equity}}</td>
                </tr>
                <!-- Modal -->

                <tr>
                  <th class="has-text-danger-dark">Total Liabilities & Equity</th>
                  <td class="numeric">{{reportList.summary.total_libilities_equity}}</td>
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
      type: null,
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
        ccurrency: this.currency,
        ctype: this.type
      };
      // if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post(
          "/report/balancesheet/search",
          urlEncoded(bodyRequest)
        );
      } else {
        ajax = this.axios.post("/report/balancesheet", urlEncoded(bodyRequest));
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
    // Set filter
    updateCurrency(value) {
      this.$store.commit("ledger/reportCurrency", value);
    },
    updateFrom(value) {
      this.$store.commit("ledger/reportFrom", value);
    },
    updateTo(value) {
      this.$store.commit("ledger/reportTo", value);
    },
    updateStart(value) {
      this.$store.commit("ledger/reportStart", value);
    },
    updateEnd(value) {
      this.$store.commit("ledger/reportEnd", value);
    },
    // When Filter Button Clicked
    loadFilter() {
      this.$store.commit("ledger/filter");
      this.loadAsyncLedgerList();
    },
    isFilterShow() {
      this.$store.commit("ledger/isFilterShow", !this.showFilter);
    },
    // Change Status
    changeStatus(id) {
      this.axios.get(`/ledger/confirmation/${id}`).then(res => {
        this.loadAsyncLedgerList();
      });
    },
    showFromModal(val) {
      this.isComponentModalfromAccount = true;
    },
    showToModal(val) {
      this.isComponentModaltoAccount = true;
    },
    itemFromSelected(code) {
      this.updateFrom(code);
      this.isComponentModalfromAccount = false;
    },
    itemToSelected(code) {
      this.updateTo(code);
      this.isComponentModaltoAccount = false;
    },
    //Closing
    calculate() {
      this.axios.get(`/closing/calculate`).then(res => {
        swal(res.data.content, {
          icon: "success"
        });
      });
    },
    monthly() {
      this.axios.get(`/closing/monthly`).then(res => {
        swal(res.data.content, {
          icon: "success"
        });
      });
    },
    annual() {
      this.axios.get(`/closing/annual`).then(res => {
        swal(res.data.content, {
          icon: "success"
        });
      });
    },
    // Delete Ledger
    deleteLedger(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this ledger data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/ledger/delete/${id}`)
            .then(res => {
              swal("Poof! Your ledger data has been deleted!", {
                icon: "success"
              });
              this.loadAsyncLedgerList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your ledger data is safe!");
        }
      });
    },
    // Delete Checked Ledger
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this ledger data!",
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
            .post("/ledger/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Ledger data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncLedgerList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your ledger data is safe!");
        }
      });
    },
    editLedger(id) {
      this.$router.push("/general_ledger/journalgl/edit/" + id);
    },

    reset(event) {
      this.$store.commit("ledger/reset");
    },
    next() {
      this.$store.commit("ledger/incrementPage");
      this.loadAsyncLedgerList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("ledger/decrementPage");
        this.loadAsyncLedgerList();
      }
    },
    searchLedger: debounce(function(event) {
      this.$store.commit("ledger/updateSearch", event);
      this.$store.commit("ledger/reset");
      this.$store.commit("ledger/filter");
      this.loadAsyncLedgerList();
    }, 500),
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



