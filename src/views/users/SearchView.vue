<template>
  <LayoutBasic>
    <div class="col-md-8">
      <template v-if="users">
        <div v-for="user in users" :key="user.id" class="card status mt-3">
          <div class="card-body row">
            <div class="col-2 image-box search-image-box d-lg-flex">
              <router-link
                :to="{ name: 'profile', params: { username: user.username } }"
              >
                <img
                  :alt="$i18n.get('_.settings.picture')"
                  :src="user.profilePicture"
                />
              </router-link>
            </div>

            <div class="col ps-0">
              <span class="float-end mt-3">
                <FollowButton :user="user"></FollowButton>
              </span>

              <router-link
                :to="{ name: 'profile', params: { username: user.username } }"
                style="font-size: calc(1.26rem + 0.12vw)"
              >
                {{ user.displayName }}
                <i
                  v-if="user.privateProfile"
                  aria-hidden="true"
                  class="fas fa-user-lock"
                ></i>
                <small class="grey--text text--darken-1"
                  >@ {{ user.username }}</small
                >
              </router-link>
              <br />
              <span style="font-size: 0.875em">
                <span class="font-weight-bold">
                  <i aria-hidden="true" class="fa fa-route d-inline"></i>
                  <span class="sr-only-focusable">{{
                    $i18n.get("_.leaderboard.distance")
                  }}</span>
                  {{ user.trainDistance / 1000 }}
                </span>
                <span class="small font-weight-lighter">km</span>
                <span class="font-weight-bold ps-sm-2">
                  <i aria-hidden="true" class="fa fa-stopwatch d-inline"></i>
                  <span class="sr-only-focusable">{{
                    $i18n.get("_.leaderboard.duration")
                  }}</span>
                  {{ hoursAndMinutes(user.trainDuration) }}
                </span>
                <span class="small font-weight-ligheer">min</span>
                <span class="font-weight-bold ps-sm-2">
                  <i aria-hidden="true" class="fa fa-dice-d20 d-inline"></i>
                  <span class="sr-only-focusable">{{
                    $i18n.get("_.leaderboard.points")
                  }}</span>
                  {{ localizeThousands(user.points) }}
                </span>
                <span class="small font-weight-lighter">{{
                  $i18n.get("_.profile.points-abbr")
                }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
      <Spinner v-if="loading" class="mt-5" />
      <div v-else-if="users.length === 0">
        <div class="alert my-3 alert-danger" role="alert">
          {{ $i18n.get("_.user.no-user") }}
        </div>
      </div>
      <div v-if="links && links.next" class="text-center">
        <v-btn
          fab
          dark
          color="primary"
          :aria-label="$i18n.get('_.menu.show-more')"
          class="mt-4"
          @click="fetchMore"
        >
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </div>
    </div>
  </LayoutBasic>
</template>

<script>
import LayoutBasic from "@/components/layouts/Basic";
import FollowButton from "@/components/buttons/FollowButton";
import Spinner from "@/components/Spinner";
import User from "@/ApiClient/User";
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";

export default {
  name: "SearchView",
  data() {
    return {
      errors: null,
      loading: false,
      links: null,
      users: [],
      hoursAndMinutes,
      localizeThousands,
    };
  },
  components: { Spinner, FollowButton, LayoutBasic },
  methods: {
    fetchData(query = this.$route.query.query) {
      this.loading = true;
      User.search(query)
        .then((data) => {
          this.users = data.data;
          this.links = data.links;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchMore() {
      this.loading = true;
      this.error = null;
      this.fetchMoreData(this.links.next).then((data) => {
        this.loading = false;
        this.users = this.users.concat(data.data);
        this.links = data.links;
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.query.query);
    next();
  },
};
</script>

<style scoped lang="scss">
@import "/src/sass/variables";

.navbar.navbar-dark form .md-form input:focus:not([readonly]) {
  border-color: $blueCounterColor;
}

.stationSearchButton {
  border: 1px solid #bdbdbd;
}
</style>
