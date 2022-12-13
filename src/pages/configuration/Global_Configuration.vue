<template>
  <div>
    <config />
    <!-- <b-tabs v-model="activeTab" type="is-toggle">
      <b-tab-item label="Primary Details">
        <primary />
      </b-tab-item>

      <b-tab-item label="Bank Details">
        <bank />
      </b-tab-item>

      <b-tab-item label="Site Configuration">
        <site />
      </b-tab-item>

      <b-tab-item label="Management Period">
        <period />
      </b-tab-item>
    </b-tabs> -->
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
// Components
import config from "../../components/Configuration/Global/config";
import primary from "../../components/Configuration/Global/primary";
import bank from "../../components/Configuration/Global/bank";
import site from "../../components/Configuration/Global/site";
import period from "../../components/Configuration/Global/period";

export default {
  data() {
    return {
      activeTab: 0
    };
  },
  components: {
    config,
    primary,
    bank,
    site,
    period
  }
};
</script>
<style scoped>
.tab-content {
  padding: 1rem 0 !important;
  background-color: #bd0000;
}
.padding-card {
  padding: 0.75rem 0.2rem;
  background: linear-gradient(to right, rgb(121, 86, 236), rgb(47, 185, 248));
  box-shadow: none;
  color: white;
}
.shortcut .column {
  padding: 0.75rem 0.25rem;
}
</style>



