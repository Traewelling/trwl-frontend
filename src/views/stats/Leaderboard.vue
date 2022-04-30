<template>
  <LayoutBasic>
    <div class="col-md-9 col-lg-9">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>{{
            $i18n.get("_.menu.leaderboard")
          }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            text
            color="primary"
            :to="{ name: 'leaderboard.month', params: { month: month } }"
          >
            {{ $i18n.get("_.leaderboard.month.title") }}
          </v-btn>
        </v-toolbar>
        <v-divider class="my-0" />
        <v-card-text class="p-0">
          <v-tabs v-model="tab" background-color="transparent" grow>
            <template v-for="item in tabs">
              <v-tab :key="item" v-if="item.show">
                {{ item.title }}
              </v-tab>
            </template>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in tabs" :key="item">
              <LeaderboardTable v-if="!item.loading" :users="item.data" />
              <Spinner v-else />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-divider class="my-0" />
        <v-card-actions>
          <v-icon>mdi-help-circle-outline</v-icon>
          {{ $i18n.get("_.leaderboard.notice") }}
        </v-card-actions>
      </v-card>
    </div>
  </LayoutBasic>
</template>
<script>
import moment from "moment";
import LeaderboardTable from "@/components/tables/LeaderboardTable";
import LayoutBasic from "@/components/layouts/Basic";
import Spinner from "@/components/Spinner";
import Statistics from "@/ApiClient/Statistics";

export default {
  name: "Leaderboard",
  data() {
    return {
      month: moment().format("YYYY-MM"),
      users: null,
      distance: null,
      tab: null,
      tabs: {
        top: {
          title: this.$i18n.get("_.leaderboard.top"),
          data: [],
          show: true,
          loading: false,
        },
        distance: {
          title: this.$i18n.get("_.leaderboard.distance"),
          data: [],
          show: true,
          loading: false,
        },
        friends: {
          title: this.$i18n.get("_.leaderboard.friends"),
          data: [],
          show: this.$store.state.authenticated,
          loading: false,
        },
      },
    };
  },
  metaInfo() {
    return {
      title: this.$i18n.get("_.menu.leaderboard"),
      meta: [
        {
          name: "description",
          content: this.$i18n.get("_.description.leaderboard.main"),
          vmid: "description",
        },
        {
          name: "DC.Description",
          content: this.$i18n.get("_.description.leaderboard.main"),
          vmid: "DC.Description",
        },
      ],
    };
  },
  components: {
    Spinner,
    LayoutBasic,
    LeaderboardTable,
  },
  computed: {
    topCnt: function () {
      if (this.users && this.users.length) {
        return this.users.length;
      }
      return 0;
    },
    loading: function () {
      return (
        this.tabs.distance.loading &&
        this.tabs.friends.loading &&
        this.tabs.top.loading
      );
    },
  },
  methods: {
    fetchData() {
      this.error = null;
      this.tabs.top.loading = true;
      this.tabs.distance.loading = true;
      Statistics.getLeaderBoard()
        .then((data) => {
          this.tabs.top.loading = false;
          this.tabs.top.data = data;
        })
        .catch((error) => {
          this.tabs.top.loading = false;
          console.error(error);
        });
      Statistics.getLeaderBoardDistance()
        .then((data) => {
          this.tabs.distance.loading = false;
          this.tabs.distance.data = data;
        })
        .catch((error) => {
          this.tabs.distance.loading = false;
          console.error(error);
        });
      if (this.$store.state.authenticated) {
        this.tabs.friends.loading = true;
        Statistics.getLeaderBoardFriends()
          .then((data) => {
            this.tabs.friends.loading = false;
            this.tabs.friends.data = data;
            if (!Object.keys(this.friends).length) {
              this.tabs.friends.show = false;
            }
          })
          .catch((error) => {
            this.tabs.friends.loading = false;
            console.error(error);
          });
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped lang="scss">
#leaderboard {
  #top20 a:hover,
  #top20k a:hover,
  #top20f a:hover {
    text-decoration: underline;
  }
}
</style>
