<template>
  <div
    style="width:20.5cm; font-family:Arial, Helvetica, sans-serif; font-size:12px; border:0px solid red;"
  >
    <h2 class="has-text-centered is-size-5">
      <u>{{invoiceType}}</u>
    </h2>
    <br />
    <div class="columns is-mobile">
      <div class="column is-7">
        <div style="border:0px solid #000; float:left;">
          <table class="header">
            <tr v-if="this.$route.name ==='cashin'">
              <td>Received by</td>
              <td>:</td>
              <td>{{customer}}</td>
            </tr>
            <tr v-else>
              <td>Paid to</td>
              <td>:</td>
              <td>{{vendor}}</td>
            </tr>
            <tr>
              <td>Currency</td>
              <td>:</td>
              <td>{{currency}}</td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>:</td>
              <td>{{notes}}</td>
            </tr>
            <tr>
              <td>Account</td>
              <td>:</td>
              <td>{{acc}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="column is-5">
        <div style="border:0px solid blue; float:right;">
          <h3 class="title is-6 is-marginless">No : CIN-00{{pono}}</h3>
          <p>Medan, {{podate}}</p>
        </div>
      </div>
    </div>

    <div style="border-bottom:1px dashed #000; padding-bottom: 15px;">
      <table style="margin-top:5px;" class="product">
        <tr>
          <th class="has-text-centered">No</th>
          <th class="has-text-centered">Code</th>
          <th class="has-text-centered">Account</th>
          <th class="has-text-centered">Total Amount ({{currency}})</th>
        </tr>

        <!-- Product -->
        <tr v-for="(item, index) in items" :key="index">
          <td>{{index+1}}</td>
          <td>{{(item.account)}}</td>
          <td class="left">{{(item.account)}}</td>
          <td class="right">
            <numeric :value="item.amount" />
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <b>Total</b>
          </td>
          <td class="right">
            <b>
              <numeric :value="amount" />
            </b>
          </td>
        </tr>
      </table>
      <br />

      <div style="float:left; width:100%; border:0px solid #000;">
        <p style="margin:0; padding:2px 0 0 0;font-size:13px;">
          <b>In words :</b>
          <i>"{{terbilang}}"</i>
        </p>
        <p style="margin:0; padding:5px 0 0 0;">
          <b>Description :</b>
          {{desc || "-"}} / Log : {{log}}
        </p>
      </div>

      <div style="float:right;">
        <table border="0" class="sig">
          <tr>
            <td class="has-text-centered">Approved By :</td>
            <td class="has-text-centered">Review By :</td>
            <td class="has-text-centered">Paid By:</td>
            <td class="has-text-centered">Received By:</td>
          </tr>
          <br />
          <br />
          <br />
          <br />
          <tr>
            <td class="has-text-centered">Manager</td>
            <td class="has-text-centered">Accounting</td>
            <td class="has-text-centered">({{vendor || customer}})</td>
            <td class="has-text-centered">({{user || '.........................'}})</td>
          </tr>
        </table>

        <br />
      </div>

      <div style="clear:both; "></div>
    </div>
  </div>
</template>
<script>
import numeric from "@/components/Numeric";
export default {
  props: [
    "invoiceName",
    "customer",
    "vendor",
    "pono",
    "podate",
    "notes",
    "account",
    "amount",
    "terbilang",
    "currency",
    "acc",
    "items",
    "cost",
    "over",
    "p1",
    "p2",
    "desc",
    "log",
    "user"
  ],
  components: {
    numeric
  },
  computed: {
    invoiceType() {
      switch (this.$route.name) {
        case "cashin":
          return "CASH IN";
        case "cashout":
          return "CASH OUT";
      }
    }
  }
};
</script>
<style scoped>
.sig {
  font-size: 12px;
  width: 100%;
  float: right;
  text-align: center;
  margin-top: 10px
}
.sig td {
  width: 155px;
}
body {
  font-family: Tahoma, Geneva, sans-serif;
}
#logotext {
  margin-top: 2px;
}
p {
  margin: 0;
  padding: 0;
  font-size: 1.05em;
}
#pono {
  font-size: 1.4em;
  padding: 0;
  margin: 0 5px 10px 0;
  text-align: left;
}
.clear {
  clear: both;
}

table.product {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 5px;
}

table.product th {
  border: 1px solid black;
  font-size: 1.05em;
  font-weight: bold;
  padding: 3px 15px;
}

table.product td {
  border: 1px solid black;
  font-size: 1.05em;
  font-weight: normal;
  padding: 3px 0 3px 0;
  text-align: center;
}

table.product td.left {
  text-align: left;
  padding: 3px 5px 3px 10px;
}
table.product td.right {
  text-align: right;
  padding: 3px 10px 3px 5px;
}
table.header tr td {
  padding: 0 5px;
}
</style>