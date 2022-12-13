<template>
  <div>
    <!-- <nav class="navbar is-dark">
      <div class="navbar-brand">

        <a v-show="this.$route.path != '/'" class="navbar-item" @click="goBack()">
          <b-icon icon="chevron-left" />Back
        </a>
        <a class="navbar-item">Global Permata Sistem</a>
        <div class="navbar-burger burger" @click="showSidebar = !showSidebar">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <p class="navbar-item">{{time}}</p>
        </div>
      </div>
    </nav>-->
    <nav class="navbar is-transparent">
      <div class="navbar-brand">
        <div class="navbar-burger burger" @click="showSidebar()">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <a class="navbar-item">
          <img src="../assets/logo.png" />
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <!-- <p class="navbar-item">{{time}}</p> -->

          <!-- Notification -->
          <b-dropdown v-model="navigation" position="is-bottom-left" aria-role="menu">
            <a class="navbar-item" slot="trigger" role="button">
              <b-icon icon="bell"></b-icon>
            </a>

            <div class="column">
              <small>
                <b-icon icon="bell" size="is-small"></b-icon>Notification
              </small>
              <hr class="dropdown-divider" />
              <b-dropdown-item custom aria-role="menuitem">Andri Winanda has logged in</b-dropdown-item>
            </div>
          </b-dropdown>

          <!-- Account -->
          <b-dropdown v-model="navigation" position="is-bottom-left" aria-role="menu">
            <a class="navbar-item" slot="trigger" role="button">
              <b-icon icon="account"></b-icon>
              <b-icon icon="menu-down" size="is-small"></b-icon>
            </a>

            <b-dropdown-item custom aria-role="menuitem">
              <small>Welcome,</small>
              <br />
              <strong>{{capitalize(username)}}</strong>
            </b-dropdown-item>
            <hr class="dropdown-divider" />

            <b-dropdown-item aria-role="menuitem" @click="logout()">
              <b-icon icon="logout" size="is-small"></b-icon>Logout
            </b-dropdown-item>
            <b-dropdown-item aria-role="menuitem" @click="reset()">
              <b-icon icon="logout" size="is-small"></b-icon>Logout & Reset
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>
    <!-- SideBar -->
    <div v-if="this.$store.state.showSidebar" class="column is-hidden-desktop">
      <Sidebar class="sidebar" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { capitalizeLetter } from "../function-helper";
import Sidebar from "./Sidebar";
export default {
  data() {
    return {
      navigation: "home",
      time: null,
      timeIntervalId: null
    };
  },
  components: { Sidebar },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    logout() {
      this.$store.dispatch("login/logout").then(() => {
        this.$router.push("/login");
      });
    },
    reset() {
      this.$store.dispatch("login/reset").then(() => {
        this.$router.push("/get_url");
      });
    },
    showSidebar() {
      this.$store.state.showSidebar = !this.$store.state.showSidebar;
    },
    capitalize(str) {
      return capitalizeLetter(str);
    }
  },
  created() {
    this.timeIntervalId = setInterval(() => {
      this.time = this.moment().format("dddd, YYYY MMM DD hh:mm:ss a");
    }, 1000);
  },
  computed: {
    ...mapState({
      username: state => state.login.dataUser.username
    })
  },
  destroyed() {
    clearInterval(this.timeIntervalId);
  }
};
</script>
<style>
$jarak: 15px;

.navbar-brand {
  padding-left: $jarak;
}
.navbar-menu {
  padding-right: $jarak;
}
.burger {
  margin-left: 0 !important;
}

@media only screen and (max-width: 768px) {
  .navbar-brand,
  .navbar-menu {
    padding: 0 !important;
  }
}
</style>


