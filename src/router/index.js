import Vue from "vue";
import VueRouter from "vue-router";
import WelcomePage from "@/views/WelcomePage";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard";
import SingleStatus from "@/views/SingleStatus";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: WelcomePage,
    meta: {
      auth: false,
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "dashboard",
    meta: {
      auth: true,
    },
    props: true,
  },
  {
    path: "/status/:id",
    component: SingleStatus,
    props: true,
    name: "singleStatus",
  },
  {
    path: "/about",
    name: "About",
    meta: {
      auth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      auth: false,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authenticated = localStorage.getItem("authenticated");
  const loggedIn = authenticated === "true";
  if (to.matched.some((record) => record.meta.auth === true) && !loggedIn) {
    next("/login");
    return;
  } else if (
    loggedIn &&
    to.matched.some((record) => record.meta.auth === false)
  ) {
    next("/dashboard");
    return;
  }
  next();
});

export default router;
