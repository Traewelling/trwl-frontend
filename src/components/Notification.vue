<template>
  <a></a>
</template>

<script>
import {
  profileNotifications,
  statusNotifications,
} from "@/ApiClient/APImodels";
import Notifications from "@/ApiClient/Notifications";

export default {
  name: "Notification",
  props: ["data"],
  data() {
    return {
      notification: null,
    };
  },
  computed: {
    readLabel() {
      if (this.read) {
        return this.;
      }
      return this.;
    },
    severity() {
      return this.notification.detail.message.severity;
    },
    read() {
      return !!this.notification.readAt;
    },
    icon() {
      return this.notification.detail.message.icon;
    },
  },
};
</script>

<style scoped>
.unread.notice {
  background-color: #e2effa !important;
}

.unread.warning {
  background-color: #f2c9c5 !important;
}
</style>
