<template>
  <HeroLayout>
    <template v-if="!loading" v-slot:hero>
      <v-avatar class="float-end" size="30%">
        <img
          :alt="$i18n.get('_.settings.picture')"
          :src="user.profilePicture"
        />
      </v-avatar>
      <div class="white--text px-4">
        <span class="text-h4 font-weight-bold">
          <span>
            {{ user.displayName }}
            <v-icon color="white" class="text-h4" v-if="user.privateProfile">
              mdi-account-lock
            </v-icon>
          </span>
          <br />
          <span class="font-weight-light text-h5">@{{ user.username }}</span>
          <FollowButton
            class="mx-2"
            :user="user"
            v-on:updateUser="updateUser"
          ></FollowButton>
          <MuteButton
            class="ms-2"
            v-if="!user.privateProfile"
            :user="user"
            v-on:updateUser="updateUser"
          ></MuteButton>
        </span>
        <br />
        <span class="text-h5">
          <span class="font-weight-bold">
            <v-icon color="white">mdi-map-marker-distance</v-icon>&nbsp;
            {{ localizeDistance(user.trainDistance) }}
          </span>
          <span class="small font-weight-lighter">km</span>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="font-weight-bold ps-sm-2">
                <v-icon color="white">mdi-clock-time-five</v-icon>&nbsp;
                {{ fullTime(user.trainDuration, true) }}
              </span>
            </template>
            <span>{{ fullTime(user.trainDuration) }}</span>
          </v-tooltip>

          <span class="font-weight-bold ps-sm-2">
            <v-icon color="white">mdi-language-ruby</v-icon>&nbsp;
            {{ localizeThousands(user.points) }}
          </span>
          <span class="small font-weight-lighter">
            {{ $i18n.get("_.profile.points-abbr") }}
          </span>
          <span v-if="user.twitterUrl" class="font-weight-bold ps-sm-2">
            <a :href="user.twitterUrl" rel="me" target="_blank">
              <v-icon color="white">mdi-twitter</v-icon>
            </a>
          </span>
          <span v-if="user.mastodonUrl" class="font-weight-bold ps-sm-2">
            <a :href="user.mastodonUrl" rel="me" target="_blank">
              <v-icon color="white">mdi-mastodon</v-icon>
            </a>
          </span>
        </span>
      </div>
    </template>
    <Spinner v-if="loading || statusesLoading" class="mt-5" />

    <v-row v-if="!statusesLoading && !loading" class="mt-5" align="stretch">
      <v-col
        v-if="user.muted"
        class="col-md-8 col-lg-7 text-center mb-5 offset-md-2"
      >
        <p class="text-h4 font-weight-bold">
          {{ $i18n.get("_.user.muted.heading") }}
        </p>
        <p class="text-h6">
          {{
            $i18n.choice("_.user.muted.text", 1, { username: user.username })
          }}
        </p>
        <MuteButton
          :user="user"
          bigButton="true"
          v-on:updateUser="updateUser"
        ></MuteButton>
      </v-col>
      <v-col
        v-else-if="user.userInvisibleToMe"
        class="col-md-8 col-lg-7 text-center mb-5 offset-md-2"
      >
        <p class="text-h4 font-weight-bold">
          {{ $i18n.get("_.profile.private-profile-text") }}
        </p>
        <p class="text-h6">
          {{
            $i18n.choice("_.profile.private-profile-information-text", 1, {
              username: user.username,
              request: $i18n.get("_.profile.follow_req"),
            })
          }}
        </p>
      </v-col>
      <v-col
        v-else-if="statuses.length > 0"
        class="col-md-8 col-lg-7 offset-md-2 offset-0"
      >
        <p class="text-h4">
          {{ $i18n.get("_.profile.last-journeys-of") }}
          {{ user.displayName }}:
        </p>

        <div v-if="statuses">
          <Status
            v-for="status in statuses"
            v-bind:key="status.id"
            :show-date="showDate(status, statuses)"
            :status="status"
          />
        </div>
        <div class="mt-5">
          <div v-if="links && links.next" class="text-center">
            <v-btn
              fab
              dark
              color="primary"
              :aria-label="$i18n.get('_.menu.show-more')"
              class="mt-4"
              :loading="loadingMore"
              @click="fetchMore"
            >
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col v-else class="col-md-8 col-lg-7 d-flex justify-center">
        <span class="text-h3 red--text text--darken-3">
          {{ $i18n.choice("_.profile.no-statuses", 1, { username: username }) }}
        </span>
      </v-col>
    </v-row>
  </HeroLayout>
</template>

<script>
import moment from "moment";
import Status from "@/components/Status";
import { ProfileModel, StatusModel } from "@/ApiClient/APImodels";
import HeroLayout from "@/components/layouts/HeroLayout";
import Spinner from "@/components/Spinner";
import FollowButton from "@/components/buttons/FollowButton";
import MuteButton from "@/components/buttons/MuteButton";
import User from "@/ApiClient/User";
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import fullTime from "@/helpers/timeHelpers/fullTime";

export default {
  name: "ProfilePage",
  data() {
    return {
      username: this.$route.params.username,
      loading: false,
      loadingMore: false,
      statusesLoading: false,
      user: ProfileModel,
      statuses: [StatusModel],
      description: undefined,
      robots: "noindex",
      links: null,
      localizeDistance,
      localizeThousands,
      fullTime,
    };
  },
  metaInfo() {
    return {
      title: this.user.displayName,
      meta: [
        { name: "robots", content: this.robots, vmid: "robots" },
        { name: "description", content: this.description, vmid: "description" },
        {
          name: "DC.Description",
          content: this.description,
          vmid: "DC.Description",
        },
      ],
    };
  },
  components: {
    MuteButton,
    FollowButton,
    Spinner,
    HeroLayout,
    Status,
  },
  created() {
    this.fetchData();
  },
  methods: {
    updateUser(user) {
      if (!user.userInvisibleToMe) {
        this.fetchStatuses();
      } else {
        this.statuses = [];
      }
      this.user = user;
    },
    showDate(item, statuses) {
      let index = statuses.indexOf(item);
      if (index === -1 || index === 0) {
        return true;
      }
      return (
        moment(item.train.origin.departure).date() !==
        moment(statuses[index - 1].train.origin.departure).date()
      );
    },
    updateMetadata() {
      this.description = this.$i18n.choice("_.description.profile", 1, {
        username: this.user.username,
        kmAmount: this.localizeDistance(this.user.trainDistance),
        hourAmount: this.fullTime(this.duration),
      });
      if (this.user.preventIndex) {
        this.robots = "noindex";
      }
    },
    fetchData() {
      this.loading = true;
      User.getByUsername(this.$route.params.username)
        .then((data) => {
          this.loading = false;
          this.user = data;
          this.updateMetadata();
          if (!this.user.userInvisibleToMe) {
            this.fetchStatuses();
          }
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchStatuses() {
      this.statusesLoading = true;
      User.getStatusesForUser(this.$route.params.username)
        .then((data) => {
          this.statusesLoading = false;
          this.statuses = data.data;
          this.links = data.links;
        })
        .catch((error) => {
          this.statusesLoading = false;
          console.error(error);
        });
    },
    fetchMore() {
      this.loadingMore = true;
      this.fetchMoreData(this.links.next)
        .then((data) => {
          this.loadingMore = false;
          this.statuses = this.statuses.concat(data.data);
          this.links = data.links;
        })
        .catch(() => {
          this.loadingMore = false;
        });
    },
  },
};
</script>

<style scoped></style>
