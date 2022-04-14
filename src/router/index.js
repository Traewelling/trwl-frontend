import Vue from "vue";
import VueRouter from "vue-router";
import WelcomePage from "@/views/WelcomePage";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/statuses/Dashboard";
import SingleStatus from "@/views/statuses/SingleStatus";
import ActiveStatuses from "@/views/statuses/ActiveStatuses";
import Profile from "@/views/users/Profile";
import Event from "@/views/Event";
import Events from "@/views/Events";
import Leaderboard from "@/views/stats/Leaderboard";
import LeaderboardMonth from "@/views/stats/LeaderboardMonth";
import Trip from "@/views/checkin/Trip";
import Stationboard from "@/views/checkin/Stationboard";
import Statistics from "@/views/stats/Statistics";
import SearchView from "@/views/users/SearchView";
import LegalNotice from "@/views/static/LegalNotice";
import PrivacyPolicy from "@/views/static/PrivacyPolicy";
import Support from "@/views/settings/Support";
import Settings from "@/views/settings/Settings";
import Followers from "@/views/settings/Followers";

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
    name: "about",
    path: "/about",
    meta: {
      auth: false,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/static/About.vue"),
  },
  {
    name: "settings",
    path: "/settings",
    component: Settings,
    meta: {
      auth: true,
    },
  },
  {
    name: "followers",
    path: "/settings/followers",
    component: Followers,
    meta: {
      auth: true,
    },
  },
  {
    name: "Login",
    path: "/login",
    component: Login,
    meta: {
      auth: false,
    },
  },
  {
    name: "blog",
    path: "/blog",
    beforeEnter() {
      location.href = "https://blog.traewelling.de";
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
    next("/");
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
