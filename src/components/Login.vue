<template>
  <div class="section">
    <b-loading :is-full-page="true" :active.sync="isLoading" />
    <div class="formToken">
      <div class="flat-card">
        <div class="card-content">
          <img style="margin: auto; display: block" width="250" src="../assets/logo.png" alt />
          <br />
          <div class="content">
            <div class="label">Username</div>
            <b-field>
              <b-input autofocus v-model="username" @keyup.enter.native="login" />
            </b-field>
            <div class="label">Password</div>
            <b-field>
              <b-input
                password-reveal
                type="password"
                v-model="password"
                @keyup.enter.native="login"
              />
            </b-field>
            <b-field>
              <b-button class="is-fullwidth" type="is-primary" @click="login">Login</b-button>
            </b-field>
          </div>
        </div>
      </div>
      <!-- <small>*) Harap masukan username aplikasi anda</small> -->
    </div>
  </div>
</template>
<script>
import jwt from "jsonwebtoken";
import { getBaseUrl } from "../localstorage-helper";

export default {
  data() {
    return {
      username: "",
      password: "",
      baseUrl: "",
      isLoading: false
    };
  },
  methods: {
    login() {
      let userLogin = {
        user: this.username,
        pass: this.password
      };
      this.isLoading = true;
      this.axios
        .post(getBaseUrl() + "/login", userLogin)
        .then(res => {
          this.isLoading = false;
          let token = res.data.token;
          this.axios
            .get(getBaseUrl() + "/login/decode_token", {
              headers: {
                "X-Auth-Token": token
              }
            })
            .then(res => {
              let dataLogin = {
                token: token,
                dataUser: res.data.content
              };
              this.$store.dispatch("login/login", dataLogin);
              this.$router.push("/");
              this.axios.defaults.headers.common["X-Auth-Token"] = token;
              this.axios.defaults.baseURL = getBaseUrl();
              this.axios.get("/main").then(res => {
                this.loading = false;
                let com_name = res.data.content.com_name;
                this.$store.commit("login/setCompanyName", com_name);
              });

              // Toast
              this.$buefy.toast.open({
                duration: 1000,
                message: "Login Success",
                type: "is-success",
                position: "is-top"
              });
            });
        })
        .catch(e => {
          this.$buefy.toast.open({
            duration: 1000,
            message: "username/password incorrect",
            type: "is-danger",
            position: "is-top"
          });
          this.isLoading = false;
          console.log(e);
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
  padding-top: 8rem !important;
}
</style>
