<template>
  <LayoutBasicNoSidebar>
    <v-col class="col-md-9 col-lg-9">
      <v-card>
        <v-app-bar flat>
          <router-link
            :to="{ name: 'settings' }"
            class="black--text text-decoration-none"
          >
            <v-icon>mdi-arrow-left</v-icon>&nbsp;
            {{ $i18n.get("_.menu.settings") }}
          </router-link>
        </v-app-bar>
        <v-card-text class="pa-0">
          <v-tabs>
            <v-tab>
              {{ $i18n.get("_.menu.settings.myFollower") }}
            </v-tab>
            <v-tab>
              {{ $i18n.get("_.menu.settings.follower-requests") }}
            </v-tab>
            <v-tab>
              {{ $i18n.get("_.menu.settings.followings") }}
            </v-tab>
            <v-tab-item>
              <spinner v-if="followersLoading"></spinner>
              <FollowTable
                v-else-if="followers.length > 0"
                :users="followers"
                :followers="true"
              ></FollowTable>
              <p v-else class="mt-3 pa-3 font-weight-bold red--text">
                <v-icon color="red">mdi-account-off</v-icon>
                {{ $i18n.get("_.settings.follower.no-follower") }}
              </p>
              <div
                v-if="
                  followersLinks && followersLinks.next && !followersLoading
                "
                class="text-center"
              >
                <v-btn
                  fab
                  dark
                  color="primary"
                  :aria-label="$i18n.get('_.menu.show-more')"
                  class="my-1"
                  @click="fetchMoreFollowers"
                  :loading="loadingMore"
                >
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item>
              <spinner v-if="followRequestsLoading"></spinner>
              <FollowTable
                v-else-if="followRequests.length > 0"
                :users="followRequests"
                request="true"
              ></FollowTable>
              <p v-else class="mt-3 font-weight-bold red--text pa-3">
                <v-icon color="red">mdi-account-off</v-icon>
                {{ $i18n.get("_.settings.follower.no-requests") }}
              </p>
              <div
                v-if="
                  followRequestsLinks &&
                  followRequestsLinks.next &&
                  !followRequestsLoading
                "
                class="text-center"
              >
                <v-btn
                  fab
                  dark
                  color="primary"
                  :aria-label="$i18n.get('_.menu.show-more')"
                  class="my-1"
                  @click="fetchMoreFollowRequests"
                >
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item>
              <spinner v-if="followingsLoading"></spinner>
              <FollowTable
                v-else-if="followings.length > 0"
                :users="followings"
              ></FollowTable>
              <p v-else class="mt-3 pa-3 font-weight-bold red--text">
                <v-icon color="red">mdi-account-off</v-icon>
                {{ $i18n.get("_.settings.follower.no-followings") }}
              </p>
              <div
                v-if="
                  followingsLinks && followingsLinks.next && !followingsLoading
                "
                class="text-center"
              >
                <v-btn
                  fab
                  dark
                  color="primary"
                  :aria-label="$i18n.get('_.menu.show-more')"
                  class="my-1"
                  @click="fetchMoreFollowings"
                >
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </div>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
    </v-col>
  </LayoutBasicNoSidebar>
</template>

<script>
import Spinner from "@/components/Spinner";
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import Settings from "@/ApiClient/Settings";
import FollowTable from "@/components/tables/FollowTable";

export default {
  name: "Followers",
  data() {
    return {
      followers: [],
      followRequests: [],
      followings: [],
      followersLoading: true,
      followRequestsLoading: true,
      followingsLoading: true,
      followersLinks: null,
      followRequestsLinks: null,
      followingsLinks: null,
    };
  },
  metaInfo() {
    return {
      title: this.$i18n.get("_.menu.settings.myFollower"),
    };
  },
  components: {
    FollowTable,
    LayoutBasicNoSidebar,
    Spinner,
  },
  methods: {
    fetchData() {
      Settings.getFollowers()
        .then((data) => {
          this.followersLoading = false;
          this.followers = data.data;
          this.followersLinks = data.links;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
          this.followersLoading = false;
        });

      Settings.getFollowings()
        .then((data) => {
          this.followingsLoading = false;
          this.followings = data.data;
          this.followingsLinks = data.links;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
          this.followingsLoading = false;
        });

      Settings.getFollowRequests()
        .then((data) => {
          this.followRequestsLoading = false;
          this.followRequests = data.data;
          this.followRequestsLinks = data.links;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
          this.followRequestsLoading = false;
        });
    },
    fetchMoreFollowers() {
      this.followersLoading = true;
      this.fetchMoreData(this.followersLinks.next)
        .then((data) => {
          this.followers = this.followers.concat(data.data);
          this.followersLinks = data.links;
          this.followersLoading = false;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
          this.followersLoading = false;
        });
    },
    fetchMoreFollowings() {
      this.followingsLoading = true;
      this.fetchMoreData(this.followingsLinks.next)
        .then((data) => {
          this.followings = this.followings.concat(data.data);
          this.followingsLinks = data.links;
          this.followingsLoading = false;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
          this.followingsLoading = false;
        });
    },
    fetchMoreFollowRequests() {
      this.followRequestsLoading = true;
      this.fetchMoreData(this.followRequestsLinks.next)
        .then((data) => {
          this.followRequests = this.followRequests.concat(data.data);
          this.followRequestsLinks = data.links;
          this.followRequestsLoading = false;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
          this.followRequestsLoading = false;
        });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
