<template>
  <table
    class="table table-striped table-hover table-sm mb-0"
    aria-describedby="describedBy"
  >
    <tbody>
      <tr
        v-for="row in users"
        v-bind:key="row.id"
        style="vertical-align: middle"
      >
        <td>
          <div class="image-box pe-0 d-lg-flex" style="width: 4em; height: 4em">
            <router-link
              :to="{ name: 'profile', params: { username: row.username } }"
            >
              <img
                :src="row.profilePicture"
                style="height: 4em"
                :alt="
                  $i18n.choice('_.user.profile-picture', 1, {
                    username: row.username,
                  })
                "
              />
            </router-link>
          </div>
        </td>
        <td>
          <router-link
            :to="{ name: 'profile', params: { username: row.username } }"
          >
            {{ row.displayName }}<br />
            <small>@{{ row.username }}</small>
          </router-link>
        </td>
        <td class="px-1">
          <span class="font-weight-bold">
            <i aria-hidden="true" class="fa fa-route d-inline"></i>
            <span class="sr-only-focusable">{{
              $i18n.get("_.leaderboard.distance")
            }}</span>
            {{ row.trainDistance / 1000 }}
          </span>
          <span class="small font-weight-lighter">km</span>
        </td>
        <td class="px-1">
          <span class="font-weight-bold ps-sm-2">
            <i aria-hidden="true" class="fa fa-stopwatch d-inline"></i>
            <span class="sr-only-focusable">{{
              $i18n.get("_.leaderboard.duration")
            }}</span>
            {{ hoursAndMinutes(row.trainDuration) }}
          </span>
          <span class="small font-weight-ligheer">min</span>
        </td>
        <td class="px-1">
          <span class="font-weight-bold ps-sm-2">
            <i aria-hidden="true" class="fa fa-dice-d20 d-inline"></i>
            <span class="sr-only-focusable">{{
              $i18n.get("_.leaderboard.points")
            }}</span>
            {{ localizeThousands(row.points) }}
          </span>
          <span class="small font-weight-lighter">{{
            $i18n.get("_.profile.points-abbr")
          }}</span>
        </td>
        <td class="pe-0 text-end" v-if="followers">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <button
                type="submit"
                class="btn btn-sm btn-danger"
                v-bind="attrs"
                v-on="on"
                @click="removeFollower(row)"
              >
                <i class="fas fa-user-minus" aria-hidden="true"></i>
              </button>
            </template>
            <span>{{ $i18n.get("_.settings.follower.delete") }}</span>
          </v-tooltip>
        </td>
        <td class="pe-0" v-if="request">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <button
                type="submit"
                class="btn btn-sm btn-danger"
                v-bind="attrs"
                v-on="on"
                @click="rejectFollowRequest(row)"
              >
                <i class="fas fa-user-times" aria-hidden="true"></i>
              </button>
            </template>
            <span>{{ $i18n.get("_.settings.request.delete") }}</span>
          </v-tooltip>
        </td>
        <td class="ps-0" v-if="request">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <button
                type="submit"
                class="btn btn-sm btn-danger"
                v-bind="attrs"
                v-on="on"
                @click="approveFollowRequest(row)"
              >
                <i class="fas fa-user-check" aria-hidden="true"></i>
              </button>
            </template>
            <span>{{ $i18n.get("_.settings.request.accept") }}</span>
          </v-tooltip>
        </td>
        <td class="px-0 text-end">
          <MuteButton :user="row"></MuteButton>
        </td>
        <td>
          <FollowButton :user="row"></FollowButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import MuteButton from "@/components/buttons/MuteButton";
import FollowButton from "@/components/buttons/FollowButton";
import User from "@/ApiClient/User";

export default {
  name: "FollowTable",
  components: { FollowButton, MuteButton },
  props: {
    describedBy: null,
    users: null,
    followers: {
      type: Boolean,
      default: false,
    },
    request: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    removeFollower(user) {
      User.removeFollower(user.id)
        .then(() => {
          const index = this.users.indexOf(user);
          this.users.splice(index, 1);
          this.notyf.success(
            this.$i18n.get("_.settings.follower.delete-success")
          );
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
    rejectFollowRequest(user) {
      User.rejectFollowRequest(user.id)
        .then(() => {
          const index = this.users.indexOf(user);
          this.users.splice(index, 1);
          this.notyf.success(
            this.$i18n.get("_.settings.request.reject-success")
          );
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
    approveFollowRequest(user) {
      User.approveFollowRequest(user.id)
        .then(() => {
          const index = this.users.indexOf(user);
          this.users.splice(index, 1);
          this.notyf.success(
            this.$i18n.get("_.settings.request.accept-success")
          );
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
  },
};
</script>

<style scoped></style>
