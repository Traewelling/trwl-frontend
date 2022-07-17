<template>
  <v-btn
    v-if="userData.id === $store.state.user.id"
    :text="dropdown"
    color="blue"
    dark
    @click="$router.push({ name: 'settings' })"
  >
    {{ $i18n.get("_.profile.settings") }}
  </v-btn>
  <v-btn
    v-else-if="userData.privateProfile && userData.followPending"
    :text="dropdown"
    disabled
    color="blue"
    dark
    :class="{
      'btn btn-sm btn-primary disabled': !dropdown,
      'dropdown-item': dropdown,
    }"
  >
    <v-icon v-if="dropdown">mdi-account-clock</v-icon>
    {{ $i18n.get("_.profile.follow_req.pending") }}
  </v-btn>
  <v-btn
    v-else-if="userData.privateProfile && !userData.following"
    :text="dropdown"
    :class="{ 'btn btn-sm btn-primary': !dropdown, 'dropdown-item': dropdown }"
    color="blue"
    dark
    @click.prevent="follow"
  >
    <v-icon v-if="dropdown">mdi-account-plus</v-icon>
    {{ $i18n.get("_.profile.follow_req") }}
  </v-btn>
  <v-btn
    v-else-if="!userData.following"
    :text="dropdown"
    :class="{ 'btn btn-sm btn-primary': !dropdown, 'dropdown-item': dropdown }"
    color="blue"
    dark
    @click.prevent="follow"
  >
    <v-icon v-if="dropdown">mdi-account-plus</v-icon>
    {{ $i18n.get("_.profile.follow") }}
  </v-btn>
  <v-btn
    v-else
    :text="dropdown"
    :class="{ 'btn btn-sm btn-danger': !dropdown, 'dropdown-item': dropdown }"
    color="error"
    @click.prevent="unfollow"
  >
    <v-icon v-if="dropdown">mdi-account-minus</v-icon>
    {{ $i18n.get("_.profile.unfollow") }}
  </v-btn>
</template>

<script>
import { ProfileModel } from "@/ApiClient/APImodels";
import User from "@/ApiClient/User";

export default {
  name: "FollowButton",
  data() {
    return {
      userData: ProfileModel,
    };
  },
  props: ["user", "dropdown"],
  mounted() {
    this.userData = this.$props.user;
  },
  watch: {
    user() {
      this.userData = this.$props.user;
    },
  },
  methods: {
    follow() {
      User.follow(this.user.id)
        .then((data) => {
          this.userData = data;
          this.$emit("updateUser", this.userData);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    unfollow() {
      User.unfollow(this.user.id)
        .then((data) => {
          this.userData = data;
          this.$emit("updateUser", this.userData);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped></style>
