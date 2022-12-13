<template>
  <div
    style="width:20.5cm; font-family:Arial, Helvetica, sans-serif; font-size:12px; border:0px solid red;"
  >
    <div class="columns is-mobile">

      <div class="column is-7">
       <h3 class="title is-6 is-marginless">No : {{no}}</h3>
          <p>Date : {{podate}}</p>
      </div>
      <div class="column is-3">
        <div style="border:0px solid blue; float:right;">
          <p>Branch : {{branch}}</p>
          <p>Staff : {{staff}}</p>
        </div>
      </div>
    </div>

    <div style="clear:both; "></div>

    <h2
      style="font-size:1.4em; font-weight:normal; text-align:center; margin:5px 0px 10px 0px; padding:0 0 0 25px;"
    >{{invoiceName()}}</h2>
    <div style="clear:both; "></div>

    <div style="clear:both; "></div>

    <div style="border-bottom:1px dashed #000; padding-bottom: 15px;">
      <table style="margin-top:5px;" class="product">
        <tr>
          <th class="has-text-centered">No</th>
          <th class="has-text-centered">Product</th>
          <th class="has-text-centered">Qty</th>
          <th class="has-text-centered">Amount</th>
        </tr>

        <!-- Product -->
        <tr v-for="(item, index) in items" :key="index">
          <td>{{index+1}}</td>
          <td class="left">{{item.product}}</td>
          <td>{{item.qty}}</td>
          <td class="right"><numeric :value="item.amount"/></td>
        </tr>

        <tr>
          <td colspan="3"><b>Total</b></td>
          <td class="right"><b><numeric :value="p2"/></b></td>
        </tr>
      </table>
      <br>

      <div style="float:left; width:7.5cm; border:0px solid #000;">
        <p style="margin:0; padding:2px 0 0 0; font-style:italic; font-size:13px;">In words : {{terbilang}}</p>
        <p style="margin:0; padding:5px 0 0 0;">Description : {{desc || "-"}} / Log : {{log}}</p>
      </div>



      <div style="clear:both; "></div>
    </div>
  </div>
</template>
<script>
import numeric from "@/components/Numeric"
export default {
  props: [
    "no",
    "branch",
    "podate",
    "items",
    "log",
    "user",
    "staff"
  ],
  components: {
    numeric
  },
  methods:{
    invoiceName() {
      switch(this.$route.name){
        case'stock_adjustment': return 'STOCK ADJUSTMENT'
        case'stock_transfer': return 'STOCK TRANSFER'
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