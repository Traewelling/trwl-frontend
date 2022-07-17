<template>
  <v-tooltip top v-if="userData.muted" :disabled="showText">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="blue"
        :text="dropdown"
        dark
        v-bind="attrs"
        v-on="on"
        @click.prevent="unmute"
      >
        <v-icon>mdi-eye</v-icon>
        <span v-if="showText" class="text-wrap">{{ $i18n.get("_.user.unmute-tooltip") }}</span>
      </v-btn>
    </template>
    <span>{{ $i18n.get("_.user.unmute-tooltip") }}</span>
  </v-tooltip>
  <v-tooltip v-else top :disabled="showText">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :text="dropdown"
        color="blue"
        dark
        v-bind="attrs"
        v-on="on"
        @click.prevent="mute"
      >
        <v-icon>mdi-eye-off</v-icon>
        <span v-if="showText" class="text-caption">{{ $i18n.get("_.user.mute-tooltip") }}</span>
      </v-btn>
    </template>
    <span>{{ $i18n.get("_.user.mute-tooltip") }}</span>
  </v-tooltip>
</template>

<script>
import { ProfileModel } from "@/ApiClient/APImodels";
import User from "@/ApiClient/User";

export default {
  name: "MuteButton",
  data() {
    return {
      userData: ProfileModel,
    };
  },
  props: ["user", "bigButton", "dropdown"],
  mounted() {
    this.userData = this.$props.user;
  },
  watch: {
    user() {
      this.userData = this.$props.user;
    },
  },
  computed: {
    showButton() {
      return this.userData.id !== this.$store.state.user.id;
    },
    showText() {
      return this.$props.bigButton || this.$props.dropdown;
    },
  },
  methods: {
    mute() {
      User.mute(this.user.id)
        .then((data) => {
          this.userData = data;
          this.$emit("updateUser", this.userData);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    unmute() {
      User.unmute(this.user.id)
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
