import Vue from "vue";
import VueRouter from "vue-router";
import WelcomePage from "@/views/WelcomePage";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Wecome",
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
    path: "/about",
    name: "About",
    meta: {
      auth: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
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
