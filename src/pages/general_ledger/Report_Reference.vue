<template>
  <div>
    <div>
      <b-notification v-if="!isLoading"
        type="is-success"
        aria-close-label="Close notification"
        class="info-device"
      >Device : {{info.useragent}} | Period : {{info.month}} {{info.year}}</b-notification>
    
      <div class="flat-card">
        <div class="card-content">
          <b-loading :active.sync="isLoading"></b-loading>
          <div class="columns is-multiline is-mobile shortcut">
            <div class="column is-12-mobile">
              <div class="card">
                <div class="card-content" v-if="!isLoading">
                  <p class="title is-5 has-text-centered">Assets</p>
                  <!-- Type -->
                  <b-field class="typeOpt" horizontal label="Type ">
                    <b-select v-model="assettype" placeholder="Select Month">
                      <option value="1">Jan</option>
                      <option value="2">Feb</option>
                      <option value="3">Mar</option>
                      <option value="4">Apr</option>
                      <option value="5">May</option>
                      <option value="6">Jun</option>
                      <option value="7">Jul</option>
                      <option value="8">Aug</option>
                      <option value="9">Sep</option>
                      <option value="10">Oct</option>
                      <option value="11">Nov</option>
                      <option value="12">Dec</option>
                    </b-select>
                    <button class="button is-primary" @click.prevent="loadChart">Submit</button>
                  </b-field>
                  <pie-chart :options="POptions" :chart-data="assets" />
                  <p class="has-text-centered">Assets</p>
                </div>
              </div>
            </div>
            <div class="column is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <p class="title is-5 has-text-centered">Net Profit</p>
                  <bar-chart :options="options" :chart-data="profit" />
                  <p class="has-text-centered">Net Profit</p>
                </div>
              </div>
            </div>
            <div class="column is-12 is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <p class="title is-5 has-text-centered">Assets 12 Month</p>
                  <bar-chart :options="options" :chart-data="assets12" />
                  <p class="has-text-centered">Assets 12</p>
                </div>
              </div>
            </div>
            <!-- Shortcut -->
            <div class="column is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <p class="title is-5 has-text-centered">Financial Report - Statement</p>
                  <div class="columns is-multiline shortcut">
                    <router-link
                      to="report_reference/profit"
                      tag="a"
                      class="column is-4-mobile has-text-centered"
                    >
                      <div class="flat-card padding-card">
                        <b-icon icon="view-dashboard" size="is-medium"></b-icon>
                        <p>Profit & Loss</p>
                      </div>
                    </router-link>
                    <router-link
                      to="report_reference/balance_sheet"
                      tag="a"
                      class="column is-4-mobile has-text-centered"
                    >
                      <div class="flat-card padding-card">
                        <b-icon icon="view-dashboard" size="is-medium"></b-icon>
                        <p>Balance Sheet</p>
                      </div>
                    </router-link>
                    <router-link
                      to="report_reference/cashflow"
                      tag="a"
                      class="column is-4-mobile has-text-centered"
                    >
                      <div class="flat-card padding-card">
                        <b-icon icon="view-dashboard" size="is-medium"></b-icon>
                        <p>Cash Flow</p>
                      </div>
                    </router-link>
                    <router-link
                      to="report_reference/trial_balance"
                      tag="a"
                      class="column is-4-mobile has-text-centered"
                    >
                      <div class="flat-card padding-card">
                        <b-icon icon="view-dashboard" size="is-medium"></b-icon>
                        <p>Trial Balance</p>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <p class="title is-5 has-text-centered">Cash & Bank</p>
                  <horizontal-bar :options="COptions" :chart-data="cashBank" />
                  <p class="has-text-centered">Cash & Bank</p>
                </div>
              </div>
            </div>
            <div class="column is-12 is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <p class="title is-5 has-text-centered">Sales Chart</p>
                  <b-field class="typeOpt" horizontal label="Type ">
                    <b-select v-model="type" placeholder="Select Type">
                      <option value="0">Operational - Income</option>
                      <option value="1">Gross Income</option>
                      <option value="2">Income vs Cost</option>
                    </b-select>
                    <button class="button is-primary" @click.prevent="loadChart">Submit</button>
                  </b-field>
                  <bar-chart :options="options" :chart-data="sales" />
                  <p class="has-text-centered">Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Form Journal -->
  <!-- <formJournal v-bind="journal" v-if="isComponentModalActive" /> -->
  <!-- </div> -->
</template>
<script>
import { mapState } from "vuex";
import HorizontalBar from "@/components/Chart/HorizontalBar.js";
import PieChart from "@/components/Chart/PieChart.js";
import BarChart from "@/components/Chart/BarChart.js";
var numeral = require("numeral");

import swal from "sweetalert";
export default {
  components: {
    HorizontalBar,
    PieChart,
    BarChart
  },
  data() {
    return {
      isLoading: false,
      info: null,
      type: 0,
      assettype: 1,
      assets: {},
      profit: {},
      assets12: {},
      cashBank: {},
      sales: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: "label",
          label: "mylabel",
          callbacks: {
            label: function(tooltipItem, data) {
              return tooltipItem.yLabel
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
          }
        }
      },
      COptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: "label",
          label: "mylabel",
          callbacks: {
            label: function(tooltipItem, data) {
              return tooltipItem.xLabel
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
          }
        }
      },
      POptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            // this callback is used to create the tooltip label
            label: function(tooltipItem, data) {
              // get the data label and data value to display
              // convert the data value to local string so it uses a comma seperated number
              var dataLabel = data.labels[tooltipItem.index];
              var value =
                ": " +
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

              // make this isn't a multi-line label (e.g. [["label 1 - line 1, "line 2, ], [etc...]])
              if (Chart.helpers.isArray(dataLabel)) {
                // show value on first line of multiline label
                // need to clone because we are changing the value
                dataLabel = dataLabel.slice();
                dataLabel[0] += value;
              } else {
                dataLabel += value;
              }

              // return the text to display on the tooltip
              return dataLabel;
            }
          }
        }
      }
    };
  },
  methods: {
    loadChart() {
      this.isLoading = true;
      let bodyRequest = {
        cassettype: this.assettype,
        ctype: this.type
      };
      this.axios.post(`/report_reference`, bodyRequest).then(res => {
        let data = res.data.content;
        // Assets
        this.assets = {};
        let asset_labels = [];
        let asset_value = [];
        data.asset.map(el => {
          asset_labels.push(el.label);
          asset_value.push(el.y);
        });
        this.assets.labels = asset_labels;
        let asset_datasets = [
          {
            label: "Value",
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 206, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(148, 255, 99)",
              "rgb(255, 99, 255)",
              "rgb(38, 71, 255)",
              "rgb(134, 0, 128)"
            ],
            data: asset_value
          }
        ];
        this.assets.datasets = asset_datasets;
        // Net Profit
        this.profit = {};
        let profit_labels = [];
        let profit_value = [];
        data.operating.map(el => {
          profit_labels.push(el.label);
          profit_value.push(el.y);
        });
        this.profit.labels = profit_labels;
        let profit_datasets = [
          {
            label: "Value",
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 206, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(148, 255, 99)",
              "rgb(255, 99, 255)",
              "rgb(38, 71, 255)",
              "rgb(134, 0, 128)"
            ],
            data: profit_value
          }
        ];
        this.profit.datasets = profit_datasets;
        // Assets 12
        this.assets12 = {};
        let assets12_labels = [];
        let assets12_value = [];
        data.asset12.map(el => {
          assets12_labels.push(el.label);
          assets12_value.push(el.y);
        });
        this.assets12.labels = assets12_labels;
        let assets12_datasets = [
          {
            label: "Value",
            backgroundColor: [
              "rgb(255, 206, 86)",
              "rgb(148, 255, 99)",
              "rgb(255, 99, 255)",
              "rgb(255, 159, 64)",
              "rgb(38, 71, 255)",
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(134, 0, 128)"
            ],
            data: assets12_value
          }
        ];
        this.assets12.datasets = assets12_datasets;
        // Cash Bank
        this.cashBank = {};
        let cb_labels = [];
        let cb_value = [];
        data.cashbank.map(el => {
          cb_labels.push(el.label);
          cb_value.push(el.y);
        });
        this.cashBank.labels = cb_labels.reverse();

        let cb_datasets = [
          {
            label: "Value",
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 206, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(148, 255, 99)",
              "rgb(255, 99, 255)",
              "rgb(38, 71, 255)",
              "rgb(134, 0, 128)"
            ],
            data: cb_value.reverse()
          }
        ];
        this.cashBank.datasets = cb_datasets;

        // Income
        this.sales = {};
        this.sales.datasets = [];
        let sales_labels = [];
        let sales_value = [];
        data.income12.map(el => {
          sales_labels.push(el.label);
          sales_value.push(el.y);
        });
        this.sales.labels = sales_labels;
        let income_datasets = {
          label: "Income",
          backgroundColor: ["rgb(75, 192, 192)"],
          data: sales_value
        };

        this.sales.datasets.push(income_datasets);
        // Outcome
        let out_value = [];
        data.outcome12.map(el => {
          out_value.push(el.y);
        });
        let out_datasets = {
          label: "Outcome",
          backgroundColor: ["#C24642"],
          data: out_value
        };
        if (this.type == 2) this.sales.datasets.push(out_datasets);
        this.isLoading = false;
      });
    },
    loadInfo() {
      this.isLoading = true;
      this.axios
        .get("/main")
        .then(res => {
          this.loading = false;
          let data = res.data.content;
          let info_user = {};
          info_user.useragent = data.useragent;
          info_user.month = data.month;
          info_user.year = data.year;
          info_user.com_name = data.com_name;
          this.info = info_user;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  },
  created() {
    this.loadChart();
    this.loadInfo();
  }
};
</script>
<style>
.padding-card {
  padding: 0.75rem 0.2rem;
  box-shadow: none;
  color: white;
}
.shortcut .column {
  padding: 0.75rem 0.25rem;
  color: rgb(134, 0, 128);
}
.typeOpt {
  width: 5rem;
}
.typeOpt .field-label {
  text-align: left;
}
</style>


