<template>
  <v-btn icon @click="$emit('click')">
    <v-badge
      v-if="notificationsCount > 0"
      :content="notificationsCount"
      color="bg-success" <!--ToDo: change back from bootstrap class when removed -->
      overlap
    >
      <v-icon>mdi-bell</v-icon>
    </v-badge>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "NotificationsButton",
  props: {
    notificationsCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>
