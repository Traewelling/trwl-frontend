<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th v-for="item in stats" :key="item.name" class="text-center">
            <v-icon>{{ item.icon }}</v-icon>
            <span class="d-sr-only">{{ item.name }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="item in stats"
            :key="item.name"
            class="text-center text-small"
          >
            {{ item.content }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";

export default {
  name: "SidebarStats",
  data() {
    return {
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
