<template>
  <LayoutBasicNoSidebar>
    <div v-if="loading">
      <Spinner class="mt-5" />
    </div>
    <template v-else>
      <v-row>
        <v-col>
          <span class="text-h4">
            {{ $i18n.get("_.leaderboard.month") }}
            <strong>{{ month.format("MMMM YYYY") }}</strong>
          </span>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="primary"
            :to="{ name: 'leaderboard.month', params: { month: lastMonth } }"
          >
            <v-icon>mdi-chevron-left</v-icon>
            {{ moment(lastMonth).format("MMMM YYYY") }}
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col>
          <v-btn
            v-if="moment(nextMonth).isBefore()"
            :to="{ name: 'leaderboard.month', params: { month: nextMonth } }"
            color="primary"
            class="float-end"
          >
            {{ moment(nextMonth).format("MMMM YYYY") }}
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
      </v-row>
      <v-row v-if="users.length === 0">
        <v-card>
          <v-card-text class="red--text">
            {{ $i18n.get("_.leaderboard.no_data") }}
          </v-card-text>
        </v-card>
      </v-row>
      <v-row v-else>
        <v-col
          v-for="(place, index) in users.slice(0, 3)"
          :key="place"
          md="4"
          :cols="index === 0 ? 12 : 6"
        >
          <v-card>
            <v-card-text>
              <div class="text-overline mb-4">
                {{ $i18n.get("_.leaderboard.rank") }} {{ index + 1 }}
              </div>
              <v-row class="justify-center">
                <v-avatar size="128">
                  <img :alt="place.username" :src="place.profilePicture" />
                </v-avatar>
              </v-row>
              <v-row class="justify-center">
                <router-link
                  :to="{
                    name: 'profile',
                    params: { username: place.username },
                  }"
                  style="font-size: 1.3em"
                >
                  {{ place.username }}
                </router-link>
              </v-row>
              <v-row class="justify-space-around">
                <v-col class="text-center">
                  <v-icon
                    :aria-label="$i18n.get('_.leaderboard.points')"
                    aria-hidden="false"
                  >
                    mdi-language-ruby
                  </v-icon>
                  {{ localizeThousands(place.points) }}
                </v-col>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-col v-bind="attrs" v-on="on" class="text-center">
                      <v-icon
                        :aria-label="$i18n.get('_.leaderboard.duration')"
                        aria-hidden="false"
                      >
                        mdi-clock-time-five
                      </v-icon>
                      {{ hoursAndMinutes(place.trainDuration) }}
                    </v-col>
                  </template>
                  <span>{{ fullTime(place.trainDuration) }}</span>
                </v-tooltip>
                <v-col class="text-center">
                  <v-icon
                    :aria-label="$i18n.get('_.leaderboard.distance')"
                    aria-hidden="false"
                  >
                    mdi-map-marker-distance
                  </v-icon>
                  {{ localizeDistance(place.trainDistance) }}km
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row v-if="users.length > 3" class="justify-center mt-5">
        <v-col md="6">
          <v-card>
            <LeaderboardTable :users="users.slice(3, 100)" avatars offset="4" />
          </v-card>
        </v-col>
      </v-row>
    </template>
  </LayoutBasicNoSidebar>
</template>

<script>
import moment from "moment";
import { LeaderboardUserModel } from "@/ApiClient/APImodels";
import Spinner from "@/components/Spinner";
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import Statistics from "@/ApiClient/Statistics";
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";
import fullTime from "@/helpers/timeHelpers/fullTime";
import LeaderboardTable from "../../components/tables/LeaderboardTable";

export default {
  name: "LeaderboardMonth",
  data() {
    return {
      moment: moment,
      users: [LeaderboardUserModel],
      loading: false,
      metaData: {
        description: undefined,
      },
    };
  },
  metaInfo() {
    return {
      title: this.$i18n.get("_.menu.leaderboard"),
      meta: [
        {
          name: "description",
          content: this.metaData.description,
          vmid: "description",
        },
        {
          name: "DC.Description",
          content: this.metaData.description,
          vmid: "DC.Description",
        },
      ],
    };
  },
  computed: {
    lastMonth() {
      return moment(this.$route.params.month)
        .subtract(1, "months")
        .format("YYYY-MM");
    },
    month() {
      return moment(this.$route.params.month);
    },
    nextMonth() {
      return moment(this.$route.params.month)
        .add(1, "months")
        .format("YYYY-MM");
    },
  },
  components: {
    LeaderboardTable,
    LayoutBasicNoSidebar,
    Spinner,
  },
  methods: {
    localizeDistance,
    localizeThousands,
    hoursAndMinutes,
    fullTime,
    fetchData() {
      this.error = null;
      this.loading = true;
      Statistics.getLeaderBoardMonth(this.$route.params.month)
        .then((data) => {
          this.loading = false;
          this.users = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    updateMetadata() {
      this.metaData.description = this.$i18n.choice(
        "_.description.leaderboard.monthly",
        1,
        {
          month: this.month.format("MMMM"),
          year: this.month.format("YYYY"),
        }
      );
    },
  },
  watch: {
    month() {
      this.fetchData();
    },
  },
  created() {
    this.updateMetadata();
    this.fetchData();
  },
};
</script>

<style scoped></style>
