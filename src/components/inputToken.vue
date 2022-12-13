<template>
  <div class="section">
    <b-loading :is-full-page="true" :active.sync="isLoading" />
    <div class="formToken">
      <div class="flat-card">
        <div class="card-content">
          <img style="margin: auto; display: block" width="250" src="../assets/logo.png" alt />
          <br />
          <div class="content">
            <b-field>
              <b-input
                autofocus
                type="password"
                placeholder="Input Token"
                password-reveal
                v-model="token"
                @keyup.enter.native="sendToken"
              />
            </b-field>
            <b-field>
              <b-button class="is-fullwidth" type="is-primary" @click="sendToken">Send</b-button>
            </b-field>
          </div>
        </div>
      </div>
      <!-- <small>*) Harap masukan token aplikasi anda</small> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // token: "187241",
      token: "",
      isLoading: false
    };
  },
  methods: {
    sendToken() {
      let token = this.token;
      this.isLoading = true;
      this.axios
        .get("http://crmsaas.dswip.com/sales/get_url/" + token)
        .then(res => {
          this.$buefy.toast.open({
            duration: 1000,
            message: "Success",
            type: "is-succes",
            position: "is-top"
          });
          this.isLoading = false;
          console.log(res.data.response);
          let url = res.data.response;
          this.$store.dispatch("login/getUrl", url).then(res => {
            this.$router.push("/login");
          });
        })
        .catch(e => {
          this.$buefy.toast.open({
            duration: 1000,
            message: "Token incorrect",
            type: "is-danger",
            position: "is-top"
          });
          this.isLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.formToken {
  width: 400px;
  margin: auto;
}
.section {
  padding-top: 10rem !important;
}
</style>
