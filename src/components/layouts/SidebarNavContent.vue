<template>
  <v-list>
    <template v-for="item in items">
      <router-link
        v-if="item.show"
        tag="v-list-item"
        :to="{ name: item.route, params: item.params }"
        :key="item.title"
        :class="{ 'd-none': item.hide }"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </router-link>
    </template>
    <v-divider />
    <ChangeLanguageButton :navbar="true" />
    <v-list-item v-if="$store.state.authenticated" link @click="$store.dispatch('logout')">
      <v-icon>mdi-logout</v-icon>
      {{ $i18n.get("_.menu.logout") }}
    </v-list-item>
  </v-list>
</template>

<script>
// import ChangeLanguageButton from "@/components/buttons/ChangeLanguageButton";
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import ChangeLanguageButton from "@/components/buttons/ChangeLanguageButton";

export default {
  name: "SidebarNavContent",
  components: { ChangeLanguageButton },
  data() {
    return {
      searchInput: "",
      localizeThousands,
      hoursAndMinutes,
      localizeDistance,
      items: [
        {
          title: this.$i18n.get("_.menu.dashboard"),
          route: "dashboard",
          icon: "mdi-account-group",
          show: this.$store.state.authenticated,
          hide: !this.desktop && !this.dashboard,
        },
        {
          title: this.$i18n.get("_.menu.globaldashboard"),
          route: "dashboard.global",
          icon: "mdi-earth",
          show: this.$store.state.authenticated,
          hide: !this.desktop && this.dashboard,
        },
        {
          title: this.$i18n.get("_.menu.profile"),
          route: "profile",
          params: { username: this.$store.state.user.username },
          icon: "mdi-account",
          show: this.$store.state.authenticated,
        },
        {
          title: this.$i18n.get("_.events"),
          route: "events",
          icon: "mdi-calendar",
          show: true,
        },
        {
          title: this.$i18n.get("_.menu.settings"),
          route: "settings",
          icon: "mdi-cog",
          show: this.$store.state.authenticated,
        },
        { title: "About", icon: "mdi-forum" },
      ],
    };
  },
  // components: { ChangeLanguageButton },
  props: {
    desktop: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dashboard() {
      return this.$route.name === "dashboard";
    },
    isSearchPage() {
      return this.$route.name === "search";
    },
  },
  methods: {
    searchRedirect() {
      if (this.searchInput) {
        this.$router
          .push({ name: "search", query: { query: this.searchInput } })
          .then(() => {
            this.$emit("refresh");
          })
          .catch(() => {
            this.$emit("refresh");
          });
      }
    },
    searchQuery() {
      if (this.isSearchPage) {
        this.searchInput = this.$route.query.query;
      }
    },
  },
  mounted() {
    this.searchQuery();
  },
};
</script>

<style scoped></style>
