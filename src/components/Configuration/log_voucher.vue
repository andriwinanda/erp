<template>
  <div
    style="width:20.5cm; font-family:Arial, Helvetica, sans-serif; font-size:12px; border:0px solid red;"
  >
    <h2 class="has-text-centered is-size-5">
      <u>Log Voucher</u>
    </h2>
    <br />
    <div class="columns is-mobile">
      <div class="column is-7">
        <div style="border:0px solid #000; float:left;">
          <table class="header">
            <tr>
              <td>Log ID</td>
              <td>:</td>
              <td>{{id}}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>:</td>
              <td>{{user}}</td>
            </tr>
            <tr>
              <td>Date Time</td>
              <td>:</td>
              <td>{{date +" - "+time}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="column is-5">
        <div style="border:0px solid blue; float:right;">
          <table class="header">
            <tr>
              <td>Component</td>
              <td>:</td>
              <td>{{component || '-'}}</td>
            </tr>
            <tr>
              <td>Activity</td>
              <td>:</td>
              <td>{{activity || '-'}}</td>
            </tr>
            <tr>
              <td>Field</td>
              <td>:</td>
              <td>{{field || '-'}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div style="border-bottom:1px dashed #000; padding-bottom: 15px;">
      <table style="margin-top:5px;" class="product">
        <tr>
          <th class="has-text-centered">Previous Val</th>
          <th class="has-text-centered">Changed Val</th>
        </tr>

        <!-- Product -->
        <tr>
          <td>{{JSON.parse(pre_val)}}</td>
          <td>{{JSON.parse(desc)}}</td>
        </tr>
      </table>
      <br />

      <div style="clear:both; "></div>
    </div>
  </div>
</template>
<script>
import numeric from "@/components/Numeric";
export default {
  props: [
    "id",
    "user",
    "date",
    "time",
    "component",
    "activity",
    "field",
    "desc",
    "pre_val"
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
  margin-top: 10px;
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
.bold {
  font-weight: bold;
}
table.header tr td {
  padding: 0 5px;
}
</style>