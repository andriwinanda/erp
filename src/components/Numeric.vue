<template>
  <vue-numeric :decimal-separator="decimalSeparator||'.'" :currency="currency" separator="." :read-only="readOnly || true" :value="value" />
</template>
 
<script>
import VueNumeric from "vue-numeric";

export default {
  name: "App",

  components: {
    VueNumeric
  },
  props: ['value', 'currency', 'decimalSeparator', 'readOnly']
};
</script>