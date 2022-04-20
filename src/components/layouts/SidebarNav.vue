<template>
  <v-container>
    <v-card elevation="12" max-width="256px">
      <v-navigation-drawer floating permanent>
        <template v-slot:prepend v-if="$store.state.authenticated">
          <router-link
            tag="v-list-item"
            :to="{
              name: 'profile',
              params: { username: $store.state.user.username },
            }"
            two-line
          >
            <v-list-item-avatar>
              <img
                :alt="$i18n.get('_.settings.picture')"
                :src="$store.state.user.profilePicture"
                class="rounded-circle me-2"
                height="32"
                width="32"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="$store.state.user.displayName" />
              <v-list-item-subtitle v-text="`@` + $store.state.user.username" />
            </v-list-item-content>
          </router-link>
          <SidebarStats />
          <v-divider />
        </template>
        <SidebarNavContent :desktop="true" />
      </v-navigation-drawer>
    </v-card>
    <SidebarLinkCloud />
  </v-container>
</template>

<script>
import SidebarNavContent from "./SidebarNavContent";
import SidebarLinkCloud from "@/components/layouts/SidebarLinkCloud";
import SidebarStats from "./SidebarStats";

export default {
  name: "SidebarNav",
  components: { SidebarStats, SidebarLinkCloud, SidebarNavContent },
};
</script>

<style scoped>
.text-small {
  font-size: 0.75rem;
}
</style>
