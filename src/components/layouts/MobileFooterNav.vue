<template>
  <v-bottom-navigation
    :value="value"
    color="#C72730"
    class="d-md-none"
    fixed
    grow
  >
    <v-btn :to="{ name: 'dashboard' }">
      <span class="d-sr-only">{{ $i18n.get("_.menu.dashboard") }}</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn :to="{ name: 'leaderboard' }">
      <span class="d-sr-only">{{ $i18n.get("_.menu.leaderboard") }}</span>
      <v-icon>mdi-crown</v-icon>
    </v-btn>
    <v-btn :to="{ name: 'trains.stationboard' }">
      <!--      ToDo: new Translation for this-->
      <span class="d-sr-only">{{
        $i18n.get("_.stationboard.btn-checkin")
      }}</span>
      <v-icon>mdi-ticket-confirmation</v-icon>
    </v-btn>
    <v-btn :to="{ name: 'statuses.active' }">
      <span class="d-sr-only">{{ $i18n.get("_.menu.active") }}</span>
      <v-icon>mdi-map</v-icon>
    </v-btn>
    <v-btn :to="{ name: 'statistics' }">
      <span class="d-sr-only">{{ $i18n.get("_.stats") }}</span>
      <v-icon>mdi-chart-arc</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "MobileFooterNav",
  data: () => ({ value: "" }),
  mounted() {
    this.value = this.$route.name;
  },
};
</script>

<style scoped></style>
