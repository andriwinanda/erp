<template>
  <div class="main-content">
    <template v-if="$store.state.login.isLoggedIn">
      <Navbar />
      <section class="section">
        <div class="columns">
          <div class="column sidebar is-3-desktop is-hidden-touch">
            <Sidebar />
          </div>
          <div class="column">
            <div class="columns">
              <div class="column" style="padding-bottom: 0">
                <!-- <span
                  class="title is-size-4-desktop is-size-5-mobile has-text-grey"
                >{{this.$store.state.activePage}}</span>-->
                <!-- <p
                  class="is-size-5 has-text-primary has-text-weight-semibold is-capitalized"
                >{{$route.name? (($route.name).replace("_", " ") + " - ") : ""}}{{company}}</p>-->
                <p
                  class="is-size-5 has-text-primary has-text-weight-semibold is-capitalized"
                >{{displayName? displayName+ " ": ""}} {{company}}</p>
              </div>
            </div>
            <router-view />
          </div>
        </div>
      </section>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { getCompany } from "@/localstorage-helper";
import "./router/routeMap.js";
import { getMenuMap } from "./router/routeMap.js";
import mapState from "vuex";

export default {
  name: "App",
  components: { Sidebar, Navbar },
  data() {
    return {
      // displayName: getCompany()
    };
  },
  computed: {
    displayName(){
      // let routes = getMenuMap()
      // let name = this.$route.name
      // if (!routes[name].displayName) return "-"
      // else return routes[name].displayName
      return "|"
    },
    company() {
      return this.$store.state.login.company;
    }
  
  }
};
</script>

<style lang="scss" scoped>
.section {
  padding-top: 1.5rem !important;
}
.sidebar {
  width: 270px !important;
}

.main-content {
  background: #f0f0f0;
  min-height: 100vh;
}
.header {
  margin-bottom: 10px;
}
.info-device {
  font-size: 11pt;
}
</style>
