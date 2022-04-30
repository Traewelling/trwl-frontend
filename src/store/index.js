import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersistence from "vuex-persist";
import Checkin from "@/ApiClient/Checkin";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

//ToDo: Set this into the config file
axios.defaults.baseURL = "https://traewelling.de/api/v1";

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
    authenticated: false,
    locale: null,
    lastStation: null,
  },

  mutations: {
    setUserData(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      this.commit("setAuthenticated", true);
    },
    setLastStation(state, station) {
      state.lastStation = station;
      localStorage.setItem("lastStation", station);
    },
    setUserToken(state, token) {
      state.token = token;
      axios.defaults.headers.common.Authorization = `Bearer ${token.token}`;
      localStorage.setItem("token", JSON.stringify(state.token));
      this.commit("setAuthenticated", true);
    },
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
      localStorage.setItem("authenticated", authenticated);
    },
    clearUserData() {
      this.commit("setAuthenticated", false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload();
    },
    setLocale(state, locale) {
      state.locale = locale;
      localStorage.setItem("locale", locale);
    },
  },
  actions: {
    login({ commit }, credentials) {
      return axios.post("/auth/login", credentials).then(({ data }) => {
        commit("setUserToken", data.data);
        this.dispatch("fetchUserData");
      });
    },
    fetchUserData({ commit }) {
      axios.get("/auth/user").then(({ data }) => {
        commit("setUserData", data.data);
      });
    },
    logout({ commit }) {
      commit("clearUserData");
    },
    fetchLocale({ commit }) {
      const locale = localStorage.getItem("locale");
      if (locale.length !== null && locale.length > 0) {
        commit("setLocale", locale);
      } else {
        commit("setLocale", navigator.language.substr(0, 2));
      }
    },
    fetchLastStation({ commit }) {
      const lastStation = localStorage.getItem("lastStation");
      if (lastStation.length !== null && lastStation.length > 0) {
        commit("setLastStation", lastStation);
      } else {
        Checkin.getHistory()
          .then((data) => {
            commit("setLastStation", data.at(0).name);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
  getters: {
    isLogged: (state) => !!state.user,
  },
  plugins: [vuexLocal.plugin],
});
