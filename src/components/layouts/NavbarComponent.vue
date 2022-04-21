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
    <v-toolbar-items class="d-none d-md-block">
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

    <NotificationsButton
      v-if="$store.state.authenticated"
      :toggler="true"
      @click="showNotifications"
    />

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn
      text
      aria-expanded="false"
      aria-haspopup="true"
      class="d-none d-md-block"
      data-mdb-toggle="dropdown"
      role="button"
    >
      {{ $store.state.user.displayName }}
      <v-icon>mdi-menu-down</v-icon>
    </v-btn>

    <div
      aria-labelledby="navbarDropdown"
      class="dropdown-menu dropdown-menu-right"
    >
      <router-link
        :to="{
          name: 'profile',
          params: { username: $store.state.user.username },
        }"
        class="dropdown-item"
      >
        <i aria-hidden="true" class="fas fa-user"></i>
        {{ $i18n.get("_.menu.profile") }}
      </router-link>
      <router-link :to="{ name: 'settings' }" class="dropdown-item">
        <i aria-hidden="true" class="fas fa-cog"></i>
        {{ $i18n.get("_.menu.settings") }}
      </router-link>
      <router-link class="dropdown-item" :to="{ name: 'support' }">
        <i class="fas fa-headset" aria-hidden="true"></i>
        {{ $i18n.get("_.support") }}
      </router-link>
      <div class="dropdown-divider"></div>
      <a
        class="dropdown-item"
        href="#"
        @click.prevent="$store.dispatch('logout')"
      >
        <i aria-hidden="true" class="fas fa-sign-out-alt"></i>
        {{ $i18n.get("_.menu.logout") }}
      </a>
    </div>
    <template
      v-slot:extension
      v-if="$route.name.startsWith('dashboard') && $vuetify.breakpoint.mobile"
    >
      <v-tabs align-with-title grow class="d-md-none">
        <v-tab
          :to="{ name: 'dashboard' }"
          v-text="$i18n.get('_.menu.dashboard')"
        />
        <v-tab
          :to="{ name: 'dashboard.global' }"
          v-text="$i18n.get('_.menu.globaldashboard')"
        />
      </v-tabs>
    </template>
  </v-toolbar>
</template>

<script>
import NotificationsButton from "@/components/buttons/NotificationsButton";

export default {
  name: "NavbarComponent",
  components: { NotificationsButton },
  methods: {
    showNotifications() {
      this.$refs.notifModal.show();
    },
  },
};
</script>

<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0;
  z-index: 6;
}
</style>
