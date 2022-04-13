import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

new Vue({
  router,
  store,
  created() {
    const userInfo = localStorage.getItem("user");

    if (userInfo) {
      this.$store.commit("setUser", JSON.parse(userInfo));
    }
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response.status === 401) {
            this.$store.dispatch("logout");
          }
          return Promise.reject(error);
        }
    );
  },
  render: (h) => h(App),
}).$mount("#app");
