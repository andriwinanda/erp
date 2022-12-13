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

      <div class="flat-card" v-if="cashflowList">
        <div class="card-content">
          <br />
          <div class="columns is-multiline">
            <!-- <div class="column is-8">
              <div class="buttons">
                <b-button
                  type="is-primary"
                  icon-left="refresh"
                  @click="loadAsyncLedgerList()"
                >Refresh Table</b-button>
              </div>
            </div>
            <div class="column is-4">
              <b-field grouped group-multiline>
                <b-field class="control" expanded>
                  <b-input
                    width="100"
                    placeholder="Search..."
                    type="search"
                    :value="search"
                    @input="searchLedger"
                    icon="magnify"
                  />
                </b-field>
              </b-field>
            </div>-->

            <!-- Table Ledger -->
            <div class="column is-12" id="printArea">
              <h1 class="title has-text-centered has-text-info-dark">Cash Flow</h1>
              <h1
                class="subtitle is-6 has-text-centered has-text-danger-dark"
              >{{moment(start).format('MMMM YYYY')}} - {{moment(end).format('MMMM YYYY')}}</h1>
              <table width="100%">
                <!-- <tr>
                  <td>Biaya Operasional</td>
                </tr>
                <tr v-for="item in cashflowList.result.biaya_operasional" :key="item.id">
                  <td>{{item.name}} </td>
                  <td>{{item.amount}} </td>
                </tr>-->

                <!-- Aktifitas Operasional -->
                <tr>
                  <th class="has-text-info-dark">Operating Activities</th>
                </tr>

                <!-- Piutang Usaha -->
                <tr>
                  <td class="has-text-info-dark">Piutang Usaha</td>
                </tr>
                <tr v-for="item in cashflowList.result.piutangusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Piutang Usaha Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Piutang Usaha -->

                <!-- Piutang Non Usaha -->

                <tr>
                  <td class="has-text-info-dark">Piutang Non Usaha</td>
                </tr>

                <tr v-for="item in cashflowList.result.piutangnonusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Piutang Non Usaha Total:</td>
                  <td class="numeric">0</td>
                  <td></td>
                  <td></td>
                </tr>
                <!-- Piutang Non Usaha -->

                <!-- Persediaan -->
                <tr>
                  <td class="has-text-info-dark">Persediaan</td>
                </tr>


                <tr v-for="item in cashflowList.result.persediaan" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Persediaan Total:</td>
                </tr>
                <!-- Persediaan -->

                <!-- Hutang Usaha -->
                <tr>
                  <td class="has-text-info-dark">Hutang Usaha</td>
                </tr>


                <tr v-for="item in cashflowList.result.hutangusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Hutang Usaha Total :</td>
                  <td class="numeric">0</td>
                  <td></td>
                  <td></td>
                </tr>
                <!-- Hutang Usaha -->

                <!-- Pendapatan Terima DiMuka -->
                <tr>
                  <td class="has-text-info-dark">Pendapatan Terima DiMuka</td>
                </tr>

                <tr v-for="item in cashflowList.result.pendapatanmuka" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Pendapatan Terima DiMuka Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Pendapatan Terima DiMuka -->

                <!-- Pendapatan Usaha -->
                <tr>
                  <td class="has-text-info-dark">Pendapatan Usaha</td>
                </tr>

                <tr v-for="item in cashflowList.result.pendapatanusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Pendapatan Usaha Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Pendapatan Usaha -->

                <!-- Pendapatan Usaha Lainnya -->
                <tr>
                  <td class="has-text-info-dark">Pendapatan Usaha Lainnya</td>
                </tr>

                <tr v-for="item in cashflowList.result.pendapatanusahalain" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Pendapatan Usaha Lainnya Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Pendapatan Usaha Lainnya -->

                <!-- Biaya Usaha -->
                <tr>
                  <td class="has-text-info-dark">Biaya Usaha</td>
                </tr>

                <tr v-for="item in cashflowList.result.biayausaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Biaya Usaha Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Biaya Usaha -->

                <!-- Biaya Usaha Lainnya -->
                <tr>
                  <td class="has-text-info-dark">Biaya Usaha Lainnya</td>
                </tr>

                <tr v-for="item in cashflowList.result.biayausahalain" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Biaya Usaha Lainnya Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Biaya Usaha Lain -->

                <!-- Biaya Operasional -->
                <tr>
                  <td class="has-text-info-dark">Biaya Operasional</td>
                </tr>

               
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Biaya Operasional Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Biaya Operasional -->

                <tr>
                  <th class="has-text-info-dark">Operating Activities Total :</th>
                  <td class="has-text-info-dark numeric">{{cashflowList.summary.total_operating}}</td>
                </tr>
                <!-- Aktifitas Operasional -->

                <!-- Aktifitas Investment -->
                <tr>
                  <th class="has-text-info-dark">Investing Activities</th>
                </tr>

                <!-- Biaya Dibayar Dimuka -->
                <tr>
                  <td class="has-text-info-dark">Biaya Dibayar Dimuka</td>
                </tr>

                <tr v-for="item in cashflowList.result.biayadimuka" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Biaya Dibayar Dimuka Total:</td>
                  <td class="numeric">0</td>
                  <td></td>
                  <td></td>
                </tr>
                <!-- Biaya Dibayar Dimuka -->

                <!-- Investasi Jangka Panjang -->
                <tr>
                  <td class="has-text-info-dark">Investasi Jangka Panjang</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.investasipanjang" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Investasi Jangka Panjang Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Investasi Jangka Panjang -->

                <!-- Harta Tetap Berwujud -->
                <tr>
                  <td class="has-text-info-dark">Harta Tetap Berwujud</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.hartaberwujud" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Harta Tetap Berwujud Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Harta Tetap Berwujud -->

                <!-- Harta Tetap Tidak Berwujud -->
                <tr>
                  <td class="has-text-info-dark">Harta Tetap Tidak Berwujud</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.hartatakberwujud" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Harta Tetap Tidak Berwujud Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Harta Tetap Tidak Berwujud -->

                <!-- Harta Lainnya -->
                <tr>
                  <td class="has-text-info-dark">Harta Lainnya</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.hartalain" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Harta Lainnya Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Harta Lainnya -->

                <!-- Biaya Non Operasional -->
                <tr>
                  <td class="has-text-info-dark">Biaya Non Operasional</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.biayanonoperasional" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Biaya Non Operasional Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Biaya Non Operasional -->

                <tr>
                  <th class="has-text-info-dark">Investing Activities Total :</th>
                  <td class="has-text-info-dark numeric">{{cashflowList.summary.total_investing}}</td>
                </tr>
                <!-- Aktifitas Investment -->

                <!-- Aktifitas Financial -->
                <tr>
                  <th class="has-text-info-dark">Financing Activities</th>
                </tr>

                <!-- Hutang Jangka Panjang -->
                <tr>
                  <td class="has-text-info-dark">Hutang Jangka Panjang</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.hutangjangkapanjang" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Hutang Jangka Panjang Total :</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Hutang Jangka Panjang -->

                <!-- Hutang Non Usaha -->
                <tr>
                  <td class="has-text-info-dark">Hutang Non Usaha</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.hutangnonusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Hutang Non Usaha Total :</td>
                  <td class="numeric">0</td>
                </tr>

                <!-- Hutang Non Usaha -->

                <!-- Hutang Lainnya -->
                <tr>
                  <td class="has-text-info-dark">Hutang Lainnya</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.hutanglain" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Hutang Lainnya Total :</td>
                  <td class="numeric">0</td>
                </tr>

                <!-- Hutang Lainnya -->

                <!-- Modal -->
                <tr>
                  <td class="has-text-info-dark">Modal</td>
                </tr>
                
                <tr v-for="item in cashflowList.result.modal" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>

                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Modal Total :</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Modal -->

                <!-- Laba -->
                <tr>
                  <td class="has-text-info-dark">Laba</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.laba" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Laba Total :</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Laba -->

                <!-- Pendapatan Luar Usaha -->
                <tr>
                  <td class="has-text-info-dark">Pendapatan Luar Usaha</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.pendapatanluarusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Pendapatan Luar Usaha Total :</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Pendapatan Luar Usaha -->

                <!-- Pengeluaran Luar Usaha -->
                <tr>
                  <td class="has-text-info-dark">Pengeluaran Luar Usaha</td>
                </tr>

                
                <tr v-for="item in cashflowList.result.pengeluaranluarusaha" :key="item.id">
                  <td class="child-2">{{item.code}} {{item.name}}</td>
                  <td class="child-1 numeric">{{item.amount}}</td>
                </tr>
                <!-- Loop -->
                <!-- Loop -->

                <tr>
                  <td class="has-text-info-dark">Pengeluaran Luar Usaha Total:</td>
                  <td class="numeric">0</td>
                </tr>
                <!-- Pengeluaran Luar Usaha -->

                <tr>
                  <th class="has-text-info-dark">Total Financing Activities Total :</th>
                  <td class="has-text-info-dark numeric">{{cashflowList.summary.total_financing}}</td>
                </tr>
                <!-- Aktifitas Financial -->

                <tr>
                  <th class="has-text-info-dark">Total Keluar/Masuk Kas:</th>
                  <th class="has-text-info-dark numeric">{{cashflowList.summary.total_cashflow}}</th>
                </tr>
                <tr>
                  <th class="has-text-info-dark">Saldo Awal:</th>
                  <th class="has-text-info-dark numeric">0</th>
                </tr>

                <tr>
                  <th class="has-text-info-dark">Saldo Akhir:</th>
                  <th class="has-text-info-dark numeric">0</th>
                </tr>
              </table>
            </div>
            <div class="column is-12">
              <b-button type="is-primary" icon-left="printer" @click="print()">Print</b-button>
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
      cashflowList: null
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
        start: this.dateFormat(this.start),
        end: this.dateFormat(this.end),
        currency: this.currency
      };
      // if (this.filterDate) bodyRequest.date = this.dateFormat(this.filterDate);
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post(
          "/report/cashflow/search",
          urlEncoded(bodyRequest)
        );
      } else {
        ajax = this.axios.post("/report/cashflow", urlEncoded(bodyRequest));
      }
      ajax
        .then(res => {
          this.loading = false;
          this.cashflowList = res.data.content;
          console.log(this.cashflowList);
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
/* .numeric::before {
  content: "Rp. ";
} */
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



