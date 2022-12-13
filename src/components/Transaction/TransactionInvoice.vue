<template>
  <div
    style="width:20.5cm; font-family:Arial, Helvetica, sans-serif; font-size:12px; border:0px solid red;"
  >
    <h2 class="has-text-centered is-size-5">
      <u>{{h2title}}</u>
    </h2>
    <br />
    <div class="columns is-mobile">
      <div class="column is-7">
        <div style="border:0px solid #000; float:left;">
          <table class="header">
            <tr>
              <td>From</td>
              <td>:</td>
              <td>{{from}}</td>
            </tr>
            <tr>
              <td>To</td>
              <td>:</td>
              <td>{{to}}</td>
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
          </table>
        </div>
      </div>
      <div class="column is-5">
        <div style="border:0px solid blue; float:right;">
          <h3 class="title is-6 is-marginless">No : TR-0{{pono}}</h3>
          <p>Medan, {{podate}}</p>
          <p>Status: {{stts}}</p>
        </div>
      </div>
    </div>

    <div style="border-bottom:1px dashed #000; padding-bottom: 15px;">
      <div style="width:100%; border:0px solid #000;">
        <h1 class="title is-4">Total : <numeric :currency="currency" :value="amount" /></h1>
        <p style="margin:0; padding:2px 0 0 0;font-size:13px;">
          <b>In words :</b>
          <i>"{{terbilang}}"</i>
        </p>
        <p style="margin:0; padding:5px 0 0 0;">
          <b>Description :</b>
          {{desc || "-"}} / Log : {{log}}
        </p>
      </div>
      <br>

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
            <td class="has-text-centered">(.........................)</td>
            <td class="has-text-centered">(.........................)</td>
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
    "h2title",
    "pono",
    "podate",
    "stts",
    "notes",
    "from",
    "to",
    "amount",
    "terbilang",
    "currency",
    
    "desc",
    "log",
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
<style lang="scss" scoped>
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