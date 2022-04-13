import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

//ToDo: Set this into the config file
axios.defaults.baseURL = "http://localhost:8000/api/v1";

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
    authenticated: false,
  },

  mutations: {
    setUserData(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      this.commit("setAuthenticated", true);
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
  },
  getters: {
    isLogged: (state) => !!state.user,
  },
});
