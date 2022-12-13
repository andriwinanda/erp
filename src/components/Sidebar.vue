<template>
  <div class="columns is-narrow-mobile">
    <div class="column is-12 is-sidebar-menu">
      <aside class="menu mySidebar flat-card">
        <div class="header">
          <article class="media">
            <figure class="media-left">
              <p class="image is-48x48">
                <img
                  class="is-rounded profile-pict"
                  src="https://www.sejasa.com/assets/icons/profile_pic-9f51819994c099de0ac9fee7b3f9bb341d7181d5af9eb33ec4fc7fc98b9bbb95.png"
                />
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p class="has-text-justified has-text-white">
                  <small>Welcome,</small>
                  <br />
                  <strong class="has-text-white">{{capitalize(username)}}</strong>
                </p>
              </div>
            </div>
          </article>
          <br />
          <BulmaAccordion
            v-if="menu"
            :initial-open-item="activeParent"
            :icon="'caret'"
            :caretAnimation="{ duration: '.6s', timerFunc: 'ease-in-out'}"
            :slide="{
        duration: '.5s',
        timerFunc: 'ease'}"
          >
            <p class="menu-label">General</p>
            <ul class="menu-list">
              <li v-for="(item, index) in menu" :key="index">
                <template v-if="!item.children">
                  <a :class="{'is-active' : isActive(item.path)}" @click="selectMenu(item)">
                    <b-icon class="icon" size="is-small" icon="view-dashboard" />
                    {{item.displayName}}
                  </a>
                </template>
                <template v-else>
                  <BulmaAccordionItem class="accordion-menu">
                    <p class="judul-menu" slot="title">
                      <b-icon class="icon" size="is-small" icon="view-dashboard" />
                      {{item.displayName}}
                    </p>

                    <div slot="content">
                      <ul class="no-margin-right">
                        <!-- Generate First Child here -->
                        <li v-for="child in item.children" :key="child.name">
                          <a
                            :class="{'is-active' : isActive(child.path)}"
                            @click="selectMenu(child)"
                          >
                            <b-icon class="icon" size="is-small" icon="account-box" />
                            {{child.displayName}}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </BulmaAccordionItem>
                </template>
              </li>
            </ul>
          </BulmaAccordion>
        </div>
        <footer class="sidebar-footer">
          <b-dropdown aria-role="list" class="is-fullwidth is-up">
            <b-button
              size="is-small"
              class="is-primary logout is-fullwidth"
              icon-right="logout"
              slot="trigger"
            >Logout</b-button>

            <b-dropdown-item aria-role="listitem" @click="logout()">Logout</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="reset()">Logout & Reset</b-dropdown-item>
          </b-dropdown>
        </footer>
      </aside>
    </div>
  </div>
</template>
<script>
import { BulmaAccordion, BulmaAccordionItem } from "vue-bulma-accordion";
import { mapState } from "vuex";
import { getMenuMap } from "../router/routeMap.js";
import swal from "sweetalert";
import { getBaseUrl, getToken, getDataUser } from "../localstorage-helper";
import { capitalizeLetter } from "../function-helper";

export default {
  data() {
    return {
      active: "",
      // activePage: "",
      itemNameToUrutanParent: {}
    };
  },
  computed: {
    ...mapState({
      username: state => state.login.dataUser.username
    }),
    activeParent() {
      if (this.menu) {
        // this.$store.state.activePage = this.menu[this.$route.name].displayName;
        // let routeName = this.$route.name
        // console.log(this.menu.product)
        return this.itemNameToUrutanParent[this.$route.name];
      }
    },
    displayName() {
      return getDataUser().username;
    },

    menu() {
      let menu = {};
      if (!this.$store.state.login.dataMenu) return (menu = null);
      let petaMenu = getMenuMap();
      let i = 1;
      let urutanDropdown = {};

      // Maping menu dari getMenuMap()
      for (let item in petaMenu) {
        if (this.$store.state.login.dataMenu.indexOf(item) !== -1) {
          let menuItem = petaMenu[item];
          let parent = menuItem.parent;

          if (parent) {
            if (!(parent in menu)) {
              menu[parent] = petaMenu[parent];
            }
            if (!menu[parent].children) {
              menu[parent].children = menu[parent].children || {};
              // Inisialisasi urutan pada parent
              urutanDropdown[parent] = i++;
            }
            menu[parent].children[item] = menuItem;

            this.itemNameToUrutanParent[item] = urutanDropdown[parent];
          } else {
            menu[item] = menuItem;
          }
        }
      }
      return menu;
    }
  },
  methods: {
    isActive(path) {
      return this.active === path;
    },
    selectMenu(menu) {
      let path = menu.path;
      if (path) {
        this.$store.state.showSidebar = !this.$store.state.showSidebar;

        this.$router.push(path);
        this.active = this.$route.path;
      } else {
        console.log("Path tidak ditemukan untuk " + menu.name);
      }
    },
    logout() {
      this.axios.get("/login/logout").then(res => {
        this.$store
          .dispatch("login/logout")
          .then(res => {
            this.$router.push("/login");
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    reset() {
      this.axios
        .get("/login/logout")
        .then(res => {
          this.$store.dispatch("login/reset").then(res => {
            this.$router.push("/get_url");
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    capitalize(str) {
      return capitalizeLetter(str);
    }
  },
created() {
    if (!this.$store.state.login.dataMenu) {
      this.$store.dispatch("login/getMenuFromAjax");
    }
  },
  mounted() {
    // Keep in active
    this.active = this.$route.path;
  },
  components: {
    BulmaAccordion,
    BulmaAccordionItem
  }
};
</script>



<style scoped>
.no-margin-right {
  margin-right: 0;
}
.profile-pict {
  clip: rect(0px,60px,60px,0px);
  max-height: 52px;
  max-width: 52px;
  min-height: 52px;
  min-width: 52px;
}
.menu {
  text-align: left;
  padding: 2em 1em 2em 1em;
  font-size: 11pt;
  border-radius: 10px !important;
  min-height: 85vh;
  justify-content: space-between;
  flex-direction: column;
  display: flex;
}
.menu-label {
  color: #e7e7e7;
}
ul li a {
  color: white;
  padding-left: 1rem;
}
.icon {
  padding-right: 15px;
}
.judul-menu {
  padding: 0 !important;
}
.konten-menu {
  padding: 0 !important;
}
.sidebar-footer {
  justify-content: flex-end;
  display: flex;
  padding: 0 0.75rem;
  margin-top: 2rem;
}
.logout {
  background-color: #e7e7e70c;
}
.dropdown,
.dropdown-trigger {
  width: 100% !important;
}
.logout:hover {
  background-color: #ffffff23;
}
</style>

