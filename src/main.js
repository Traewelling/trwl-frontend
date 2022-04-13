import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import vuetify from "./plugins/vuetify";
import { Notyf } from "notyf";
import moment from "moment";
import VueMeta from "vue-meta";
import i18n from "@/i18n";

Vue.use(Vuetify);

Vue.prototype.notyf = new Notyf({
  duration: 5000,
  position: { x: "center", y: "top" },
  dismissible: true,
});

Vue.prototype.i18n = i18n;

Vue.prototype.moment = moment;
Vue.prototype.moment.locale(i18n.getLocale().substr(0, 2));

Vue.use(VueMeta, {
  tagIDKeyName: "vmid",
  refreshOnceOnNavigation: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch("logout");
      Vue.prototype.notyf.error("Logged out!");
      return Promise.reject(error);
    }
    if (error.response.status === 406) {
      if (router.currentRoute.name !== "privacy") {
        //we do not need any "privacy policy not accepted" errors on the privacy policy
        router.push({
          name: "privacy",
          query: {
            validFrom: error.response.meta.validFrom,
            acceptedAt: error.response.meta.acceptedAt,
          },
        });
        return Promise.reject(error);
      }
    }
    if (error.response.errors.length > 0) {
      error.response.errors.forEach((error) => {
        Vue.prototype.notyf.error(error);
      });
    } else {
      // Vue.prototype.notyf.error(this.i18n.get("_.messages.exception.general"));
    }
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  created() {
    const userInfo = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const authenticated = localStorage.getItem("authenticated");

    if (!authenticated) {
      this.$store.dispatch("fetchUserData");
    }
    if (userInfo) {
      this.$store.commit("setUserData", JSON.parse(userInfo));
    }
    if (token) {
      this.$store.commit("setUserToken", JSON.parse(token));
    }
    this.$store.dispatch("fetchLocale");
  },
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
