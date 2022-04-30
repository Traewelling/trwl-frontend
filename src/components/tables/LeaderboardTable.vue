<template>
  <v-simple-table fixed-header>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">{{ $i18n.get("_.leaderboard.rank") }}</th>
          <th class="text-left">{{ $i18n.get("_.leaderboard.user") }}</th>
          <th class="text-left">{{ $i18n.get("_.leaderboard.duration") }}</th>
          <th class="text-left">{{ $i18n.get("_.leaderboard.distance") }}</th>
          <th class="text-left">{{ $i18n.get("_.leaderboard.averagespeed") }}</th>
          <th class="text-left">{{ $i18n.get("_.leaderboard.points") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in users" :key="row.id">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link
              :to="{ name: 'profile', params: { username: row.username } }"
            >
              {{ row.username }}
            </router-link>
          </td>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <td v-bind="attrs" v-on="on">
                {{ hoursAndMinutes(row.trainDuration) }}
              </td>
            </template>
            <span>{{ fullTime(row.trainDuration) }}</span>
          </v-tooltip>
          <td>{{ localizeDistance(row.trainDistance) }} <small>km</small></td>
          <td>
            {{ localizeDistance(row.trainSpeed.toFixed(0)) }}
            <small>km/h</small>
          </td>
          <td>{{ localizeThousands(row.points) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";
import fullTime from "@/helpers/timeHelpers/fullTime";

export default {
  name: "LeaderboardTable",
  props: {
    describedBy: null,
    users: null, //Idk, it doesn't want the model...
  },
  methods: {
    localizeThousands,
    localizeDistance,
    hoursAndMinutes,
    fullTime,
  },
};
</script>

<style scoped></style>
