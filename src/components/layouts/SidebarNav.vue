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
          <v-row dense>
            <v-col v-for="item in stats" :key="item.name" class="text-center">
              <v-icon>{{ item.icon }}</v-icon><br>
              <span class="d-sr-only">{{ item.name }}</span>
              {{ item.content }}
            </v-col>
          </v-row>
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
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import SidebarLinkCloud from "@/components/layouts/SidebarLinkCloud";

export default {
  name: "SidebarNav",
  components: { SidebarLinkCloud, SidebarNavContent },
  data() {
    return {//ToDo move this to custom component
      stats: [
        {
          name: this.$i18n.get("_.leaderboard.points"),
          icon: "mdi-language-ruby",
          content: localizeThousands(this.$store.state.user.points),
        },
        {
          name: this.$i18n.get("_.leaderboard.duration"),
          icon: "mdi-clock-time-five",
          content: hoursAndMinutes(this.$store.state.user.trainDuration),
        },
        {
          name: this.$i18n.get("_.leaderboard.distance"),
          icon: "mdi-map-marker-distance",
          content:
            localizeDistance(this.$store.state.user.trainDistance) + "km",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
