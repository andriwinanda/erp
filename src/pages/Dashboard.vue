<template>
  <div>
    <b-notification
      type="is-success"
      aria-close-label="Close notification"
      class="info-device"
    >Device : {{info.useragent}} | Period : {{info.month}} {{info.year}}</b-notification>
    <!-- <b-button style="margin-left: 400px" @click="collapse = !collapse">Click Me</b-button> -->

    <div class="flat-card">
      <div class="card-content">
        <div class="content dashboard">
          <!-- <h4 class="title is-5">Main Dashboard - {{info.com_name}}</h4> -->

          <!-- Shortcut Buttons -->
          <div class="columns is-multiline shortcut">
            <router-link
              v-for="(item, i) in shortcutList"
              :key="i"
              :to="item.path"
              tag="a"
              class="column is-2-desktop is-2-tablet is-4-mobile has-text-centered"
            >
              <div class="flat-card padding-card">
                <b-icon :icon="item.icon" size="is-medium"></b-icon>
                <p>{{item.displayName}}</p>
              </div>
            </router-link>
          </div>

          <div class="columns">
            <!-- Chart -->
            <div class="column is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <bar-chart :options="options" :chart-data="ar_chart" />
                  <p class="has-text-centered">Account Receivable Due</p>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="column is-12-mobile">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Account Receivable Due - List</p>
                </header>
                <b-table class :data="ar_list" :loading="loading" :hoverable="true">
                  <template slot="empty" v-if="!loading">
                    <p
                      class="has-text-grey has-text-centered"
                      style="padding: 10px"
                    >No data available in table</p>
                  </template>

                  <template slot-scope="props">
                    <b-table-column label="Code">{{ props.row.code }}</b-table-column>
                    <b-table-column label="Date" centered>{{ props.row.date }}</b-table-column>
                    <b-table-column label="Customer">{{props.row.customer}}</b-table-column>

                    <b-table-column label="Balance" numeric>{{props.row.amount}}</b-table-column>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
          <div class="columns">
            <!-- Chart -->
            <div class="column is-12-mobile">
              <div class="card">
                <div class="card-content">
                  <bar-chart :options="options" :chart-data="ap_chart" />
                  <p class="has-text-centered">Account Payable Due</p>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="column is-12-mobile">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Account Payable Due - List</p>
                </header>
                <b-table class :data="ap_list" :loading="loading" :hoverable="true">
                  <template slot="empty" v-if="!loading">
                    <p
                      class="has-text-grey has-text-centered"
                      style="padding: 10px"
                    >No data available in table</p>
                  </template>

                  <template slot-scope="props">
                    <b-table-column label="Code">{{ props.row.code }}</b-table-column>
                    <b-table-column label="Date" centered>{{ props.row.date }}</b-table-column>
                    <b-table-column label="Vendor">{{props.row.vendor}}</b-table-column>

                    <b-table-column label="Balance" numeric>{{props.row.amount}}</b-table-column>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
          <div class="columns">
            <!-- Table -->
            <div class="column is-12-mobile">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Post-Dated Checks Issuance - List</p>
                </header>
                <b-table class :data="check_out" :loading="loading" :hoverable="true">
                  <template slot="empty" v-if="!loading">
                    <p
                      class="has-text-grey has-text-centered"
                      style="padding: 10px"
                    >No data available in table</p>
                  </template>

                  <template slot-scope="props">
                    <b-table-column style="min-width:64px" label="Code">{{ props.row.code }}</b-table-column>
                    <b-table-column label="Checkout" centered>{{ props.row.check_no }}</b-table-column>
                    <b-table-column
                      label="Curr"
                      class="is-uppercase"
                      centered
                    >{{props.row.currency}}</b-table-column>
                    <b-table-column centered class="date" label="Date">{{props.row.date}}</b-table-column>
                    <b-table-column centered class="date" label="Due">{{props.row.due}}</b-table-column>

                    <b-table-column label="Balance" numeric>{{props.row.amount}}</b-table-column>
                  </template>
                </b-table>
              </div>
            </div>
            <!-- Table -->
            <div class="column is-12-mobile">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Stock Minimum - List</p>
                </header>
                <b-table
                  class="small-table"
                  :data="min_product"
                  :loading="loading"
                  :hoverable="true"
                >
                  <template slot="empty" v-if="!loading">
                    <p
                      class="has-text-grey has-text-centered"
                      style="padding: 10px"
                    >No data available in table</p>
                  </template>

                  <template slot-scope="props">
                    <b-table-column label="SKU">{{ props.row.sku }}</b-table-column>
                    <b-table-column label="Name" class="is-uppercase">{{ props.row.name }}</b-table-column>
                    <b-table-column label="Qty" centered>{{props.row.qty}}</b-table-column>
                    <b-table-column label="Unit" centered>{{props.row.unit}}</b-table-column>
                    <b-table-column
                      label="Curr"
                      class="is-uppercase"
                      centered
                    >{{props.row.currency}}</b-table-column>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setCompany } from "@/localstorage-helper";
import BarChart from "@/components/Chart/BarChart.js";
import mapState from "vuex";

export default {
  components: {
    BarChart
  },
  data() {
    return {
      loading: false,
      info: {},
      min_product: [],
      check_out: [],
      ar_list: [],
      ap_list: [],
      ar_chart: [],
      ap_chart: [],
      shortcutList: {
        purchase: {
          displayName: "Purchase",
          icon: "view-dashboard",
          path: "/purchase/purchase_order"
        },
        inventory: {
          displayName: "Inventory",
          icon: "view-dashboard",
          path: "/inventory/product"
        },
        stock_transfer: {
          displayName: "Inventory Transfer",
          icon: "view-dashboard",
          path: "/inventory/stock_transfer"
        },
        sales: {
          displayName: "Sales",
          icon: "view-dashboard",
          path: "/sales/sales"
        },
        transfer: {
          displayName: "Fund Transfer",
          path: "/transaction/transfer",
          icon: "view-dashboard"
        },
        report_reference: {
          displayName: "Financial Report",
          path: "/general_ledger/report_reference",
          icon: "view-dashboard"
        }
      },
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
      }
    };
  },
  methods: {
    /*
     * Load async data
     */
    loadAsyncData() {
      this.loading = true;
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
          // this.$store.dispatch("login/setCompanyName", data.com_name);
          this.info = info_user;
          this.min_product = data.min_product;
          this.check_out = data.check_out;
          this.ar_list = data.ar_list;
          this.ap_list = data.ap_list;
          //AR Chart
          this.ar_chart = {};
          let ar_labels = [];
          let ar_value = [];
          data.ar_chart.map(el => {
            ar_labels.push(el.label);
            ar_value.push(el.y);
          });
          this.ar_chart.labels = ar_labels;
          let ar_datasets = [
            {
              label: "AR - Value",
              backgroundColor: "#f83e3e",
              data: ar_value
            }
          ];
          this.ar_chart.datasets = ar_datasets;
          //AP Chart
          this.ap_chart = {};
          let ap_labels = [];
          let ap_value = [];
          data.ap_chart.map(el => {
            ap_labels.push(el.label);
            ap_value.push(el.y);
          });
          this.ap_chart.labels = ap_labels;
          let ap_datasets = [
            {
              label: "AP - Value",
              backgroundColor: "#00bb41",
              data: ap_value
            }
          ];
          this.ap_chart.datasets = ap_datasets;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  },

  computed: {
    // ...mapState({
    //   company: state => state.login.company
    // })
  },
  mounted() {
    this.loadAsyncData();
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
}
.content table td {
  font-size: 0.8rem !important;
}
.date {
  min-width: 90px;
}
.dashboard .table-wrapper {
  max-height: 425px;
  min-height: 425px;
  overflow: auto;
}
</style>



