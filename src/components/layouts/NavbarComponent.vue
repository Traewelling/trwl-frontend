<template>
  <v-toolbar color="#C72730" dense dark class="fixed-bar">
    <v-app-bar-nav-icon
      class="navbar-toggler d-md-none"
      :aria-label="$i18n.get('_.Toggle navigation')"
      @click="$emit('offCanvas')"
    />
    <router-link tag="v-toolbar-title" :to="{ name: 'index' }" class="me-4">
      {{ $appName }}
    </router-link>
    <v-toolbar-items>
      <v-btn
        v-if="$store.state.authenticated"
        text
        :to="{ name: 'dashboard' }"
        v-text="$i18n.get('_.menu.dashboard')"
      />
      <v-btn
        v-if="$store.state.authenticated"
        text
        :to="{ name: 'leaderboard' }"
        v-text="$i18n.get('_.menu.leaderboard')"
      />
      <v-btn
        text
        :to="{ name: 'statuses.active' }"
        v-text="$i18n.get('_.menu.active')"
      />
      <v-btn
        v-if="$store.state.authenticated"
        text
        :to="{ name: 'statistics' }"
        v-text="$i18n.get('_.stats')"
      />
      <v-btn
        v-if="!$store.state.authenticated"
        text
        :to="{ name: 'about' }"
        v-text="$i18n.get('_.menu.about')"
      />
      <v-btn
        v-if="!$store.state.authenticated"
        text
        :to="{ name: 'blog' }"
        v-text="$i18n.get('_.menu.blog')"
      />
    </v-toolbar-items>
    <v-spacer />

    <v-btn icon>
      <NotificationsButton
        v-if="$store.state.authenticated"
        :notifications-count="notificationsCount"
        :toggler="true"
        @click="showNotifications"
      />
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="n in 5" :key="n">
          <v-list-item-title>{{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import NotificationsButton from "@/components/buttons/NotificationsButton";
import Notifications from "@/ApiClient/Notifications";

export default {
  name: "NavbarComponent",
  components: { NotificationsButton },
  data() {
    return {
      notificationsCount: 0,
    };
  },
  methods: {
    showNotifications() {
      this.$refs.notifModal.show();
    },
    fetchNotificationsCount() {
      if (this.$store.state.authenticated === true) {
        Notifications.getCount()
          .then((count) => {
            this.notificationsCount = parseInt(count);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
  mounted() {
    this.fetchNotificationsCount();
  },
};
</script>

<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0em;
  z-index: 999;
}
</style>
