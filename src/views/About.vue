<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{ this.i18n.get("_.messages.exception.general") }}</h2>
    <v-btn @click="test" text>Test User</v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    test() {
      this.$store.dispatch("fetchUserData");
    },
  },
};
</script>
