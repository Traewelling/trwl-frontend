import Vue from "vue";
import VueRouter from "vue-router";
import WelcomePage from "@/views/WelcomePage";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard";
import SingleStatus from "@/views/SingleStatus";
import ActiveStatuses from "@/views/ActiveStatuses";
import Profile from "@/views/Profile";
import Event from "@/views/Event";
import Events from "@/views/Events";
import Leaderboard from "@/views/Leaderboard";
import LeaderboardMonth from "@/views/LeaderboardMonth";
import Trip from "@/views/Trip";
import Stationboard from "@/views/Stationboard";
import Statistics from "@/views/Statistics";
import SearchView from "@/views/SearchView";
import LegalNotice from "@/views/LegalNotice";
import PrivacyPolicy from "@/views/PrivacyPolicy";
import Support from "@/views/Support";

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
    name: "dashboard.global",
    path: "/dashboard/global",
    component: Dashboard,
    meta: {
      auth: true,
    },
  },
  {
    name: "singleStatus",
    path: "/status/:id",
    component: SingleStatus,
    props: true,
  },
  {
    name: "statuses.active",
    path: "/statuses/active",
    component: ActiveStatuses,
  },
  {
    name: "profile",
    path: "/@:username",
    component: Profile,
  },
  {
    name: "event",
    path: "/event/:slug",
    component: Event,
  },
  {
    name: "events",
    path: "/events",
    component: Events,
  },
  {
    name: "leaderboard",
    path: "/leaderboard/",
    component: Leaderboard,
  },
  {
    name: "leaderboard.month",
    path: "/leaderboard/:month",
    component: LeaderboardMonth,
  },
  {
    name: "trains.stationboard",
    path: "/trains/stationboard",
    component: Stationboard,
    meta: {
      auth: true,
    },
  },
  {
    name: "trains.trip",
    path: "/trains/trip",
    component: Trip,
    meta: {
      auth: true,
    },
  },
  {
    name: "statistics",
    path: "/statistics",
    component: Statistics,
    meta: {
      auth: true,
    },
  },
  {
    name: "search",
    path: "/search",
    component: SearchView,
    meta: {
      auth: true,
    },
  },
  {
    name: "support",
    path: "/support",
    component: Support,
    meta: {
      auth: true,
    },
  },
  {
    name: "privacy",
    path: "/legal/privacy",
    component: PrivacyPolicy,
  },
  {
    name: "legal",
    path: "/legal",
    component: LegalNotice,
  },
  {
    name: "About",
    path: "/about",
    meta: {
      auth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    name: "Login",
    path: "/login",
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
