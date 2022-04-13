import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import vuetify from "./plugins/vuetify";

Vue.use(Vuetify);

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
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(error);
        if (error.response.status === 401) {
          this.$store.dispatch("logout");
        }
        return Promise.reject(error);
      }
    );
  },
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
