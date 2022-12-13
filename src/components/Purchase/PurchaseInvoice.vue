<template>
  <div
    style="width:20.5cm; font-family:Arial, Helvetica, sans-serif; font-size:12px; border:0px solid red;"
  >
    <div class="columns is-mobile">
      <div class="column is-2">
        <img
          id="logo"
          align="middle"
          width="120"
          height="100"
          :src="'http://sys.delica.co.id/images/property/'+logo"
        />
      </div>
      <div class="column is-7">
        <div style="border:0px solid #000; float:left;">
          <!-- Name -->
          <h2 class="title is-7 is-marginless">{{p_name}}</h2>
          <!-- Address -->
          <p id="logotext">{{paddress}} {{p_zip? '- '+p_zip: ""}}</p>
          <p>Tel: {{p_phone1}} {{p_website? '- Website : '+p_website: ""}} {{p_email? '- Email : '+p_email: ""}}</p>
        </div>
      </div>
      <div class="column is-3">
        <div style="border:0px solid blue; float:right;">
          <h3 class="title is-6 is-marginless">No : PO-{{no}}</h3>
          <p>{{ moment(date).format("dddd, DD MMMM YYYY") }}</p>
          <br />
          <p>To,</p>
          <p>
            <b>{{vendor}}</b>
          </p>
          <p>{{address}}</p>
          <p>{{phone}}</p>
        </div>
      </div>
    </div>

    <div style="clear:both; "></div>

    <h2
      style="font-size:1.4em; font-weight:normal; text-align:center; margin:5px 0px 10px 0px; padding:0 0 0 25px;"
    >PURCHASE ORDER</h2>
    <div style="clear:both; "></div>

    <div style="clear:both; "></div>

    <div style="border-bottom:1px dashed #000; padding-bottom: 15px;">
      <table style="margin-top:5px;" class="product">
        <tr>
          <th class="has-text-centered">No</th>
          <th class="has-text-centered">Product</th>
          <th class="has-text-centered">Qty</th>
          <th class="has-text-centered">Price ({{currency}})</th>
          <th class="has-text-centered">Tax ({{currency}})</th>
          <th class="has-text-centered">Total Amount ({{currency}})</th>
        </tr>

        <!-- Product -->
        <tr v-for="(item, index) in items" :key="index">
          <td>{{index+1}}</td>
          <td class="left">{{item.product}}</td>
          <td>{{item.qty}}</td>
          <td class="right"><numeric :value="item.price"/></td>
          <td class="right"><numeric :value="item.tax"/></td>
          <td class="right"><numeric :value="item.amount"/></td>
        </tr>

        <tr>
          <td colspan="5" class="left has-text-right">Landed Cost</td>
          <td class="right"><numeric :value="cost"/></td>
        </tr>
        <tr>
          <td colspan="5" class="left has-text-right">Credit / Debit</td>
          <td class="right"><numeric :value="over"/></td>
        </tr>
        <tr>
          <td colspan="5" class="left has-text-right">Down Payment</td>
          <td class="right"><numeric :value="p1"/></td>
        </tr>
        <tr>
          <td colspan="5"><b>Total</b></td>
          <td class="right"><b><numeric :value="p2"/></b></td>
        </tr>
      </table>
      <br>

      <div style="float:left; width:7.5cm; border:0px solid #000;">
        <p style="margin:0; padding:2px 0 0 0; font-style:italic; font-size:13px;">In words : {{terbilang}}</p>
        <p style="margin:0; padding:5px 0 0 0;">Description : {{desc || "-"}} / Log : {{log}}</p>
      </div>

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
            <td class="has-text-centered">
              Purchasing
              <br />({{user}})
            </td>
          </tr>
        </table>

        <br />
      </div>

      <div style="clear:both; "></div>
    </div>
  </div>
</template>
<script>
import numeric from "@/components/Numeric"
export default {
  props: [
    "logo",
    "paddress",
    "p_zip",
    "p_name",
    "p_phone1",
    "p_npwp",
    "p_email",
    "p_website",
    "no",
    "vendor",
    "currency",
    "date",
    "address",
    "phone",
    "items",
    "cost",
    "over",
    "p1",
    "p2",
    "terbilang",
    "desc",
    "log",
    "user"
  ],
  components: {
    numeric
  },
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
</style>