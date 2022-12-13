<template>
  <div
    style="width:20.5cm; font-family:Arial, Helvetica, sans-serif; font-size:12px; border:0px solid red;"
  >
    <h2
      style="font-size:1.4em; font-weight:normal; text-align:center; margin:5px 0px 10px 0px; padding:0 0 0 25px;"
    >JOURNAL VOUCHER</h2>

    <div class="columns is-mobile">
      <div class="column is-8">
        <table class="header">
          <tr>
            <td>Code</td>
            <td>:</td>
            <td>{{type +" - "+ no}}</td>
          </tr>
          <tr>
            <td>Currency</td>
            <td>:</td>
            <td>{{currency}}</td>
          </tr>
          <tr>
            <td>Doc No</td>
            <td>:</td>
            <td>{{docno}}</td>
          </tr>
        </table>
      </div>
      <div class="column is-3">
        <div style="border:0px solid blue; float:right;">
          <table class="header">
            <tr>
              <td>Dates</td>
              <td>:</td>
              <td>{{dates}}</td>
            </tr>
            <tr>
              <td>Note</td>
              <td>:</td>
              <td>{{note}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div style="clear:both; "></div>

    <div style="clear:both; "></div>

    <div style="clear:both; "></div>

    <div style="border-bottom:1px dashed #000; padding-bottom: 15px;">
      <table style="margin-top:5px;" class="product">
        <tr>
          <th class="has-text-centered">No</th>
          <th class="has-text-centered">Code</th>
          <th class="has-text-centered">Account</th>
          <th class="has-text-centered">Debit</th>
          <th class="has-text-centered">Credit</th>
        </tr>

        <!-- Product -->
        <tr v-for="(item, index) in items" :key="index">
          <td>{{index+1}}</td>
          <td class="left">{{item.code}}</td>
          <td>{{item.accout}}</td>
          <td class="right">
            <numeric :value="item.debit" />
          </td>
          <td class="right">
            <numeric :value="item.credit" />
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <b>Total</b>
          </td>
          <td class="right">
            <b>
              <numeric :value="debit" />
            </b>
          </td><td class="right">
            <b>
              <numeric :value="credit" />
            </b>
          </td>
        </tr>
      </table>
      <br />


      <div style="float:right;">
        <table border="0" class="sig">
          <tr>
            <td class="has-text-centered">Approved By :</td>
            <td class="has-text-centered">Review By :</td>
            <td class="has-text-centered">Ordered By:</td>
          </tr>
        </table>
        <br />
        <br />
        <br />
        <br />

        <table border="0" class="sig">
          <tr>
            <td class="has-text-centered">Manager</td>
            <td class="has-text-centered">Accounting</td>
            <td class="has-text-centered">Purchasing</td>
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
    "currency",
    "type",
    "no",
    "docno",
    "dates",
    "note",
    "items",
    "user",
    "credit",
    "debit"
  ],
  components: {
    numeric
  }
};
</script>
<style lang="scss" scoped>
.sig {
  font-size: 12px;
  width: 100%;
  float: right;
  text-align: center;
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

.clear {
  clear: both;
}

table.product {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 5px;
}

table.product,
table.product th {
  border: 1px solid black;
  font-size: 1.05em;
  font-weight: bold;
  padding: 3px 0 3px 3px;
}

table.product,
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
.header tr td {
  padding: 0 5px;
}
</style>