<template>
  <v-app-bar color="#C72730" dense dark>
    <v-app-bar-nav-icon
      class="navbar-toggler"
      :aria-label="$i18n.get('_.Toggle navigation')"
      @click="$emit('offCanvas')"
    />
    <router-link tag="v-toolbar-title" :to="{ name: 'base' }">
      {{ $appName }}
    </router-link>
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
        <v-list-item
          v-for="n in 5" :key="n"
        >
          <v-list-item-title>{{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import NotificationsButton from "@/components/buttons/NotificationsButton";
import Notifications from "@/ApiClient/Notifications";

export default {
  name: "NavbarComponent",
  components: {  NotificationsButton },
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

<style scoped></style>
