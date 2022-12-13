<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-tabs v-model="activeTab">
          <b-tab-item label="Color">
            <color />
          </b-tab-item>

          <b-tab-item label="Size">
            <size />
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
// Components
import color from "../../components/Inventory/color";
import size from "../../components/Inventory/size";
export default {
  data() {
    return {
      activeTab: 0
    };
  },
  components: {
    color,
    size
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
</style>



