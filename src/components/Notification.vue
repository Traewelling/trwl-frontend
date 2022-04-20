<template>
  <v-list-item v-if="notification" @click="clickMessage">
    <template v-slot:default="{ read }">
      <v-list-item-icon>
        <v-icon v-text="icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title
          v-html="
            $i18n.choice(i18nKey, 1, notification.detail.message.lead.values)
          "
        />

        <!-- v-list-item-subtitle
          class="text--primary"
          v-text="item.headline"
        ></v-list-item-subtitle -->

        <v-list-item-subtitle
          v-if="notification.detail.message.notice.key"
          v-html="
            $i18n.choice(
              i18nNoticeKey,
              1,
              notification.detail.message.notice.values
            )
          "
        >
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text
          v-text="moment(notification.createdAt).format('LLL')"
        ></v-list-item-action-text>

        <v-btn icon @click.stop="readMessage">
          <v-icon v-if="!read" color="grey lighten-1">
            mdi-email-outline
          </v-icon>
          <v-icon v-else color="yellow darken-3" @click.stop="readMessage">
            mdi-email-open-outline
          </v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-list-item>
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
        return this.$i18n.get("_.notifications.mark-as-unread");
      }
      return this.$i18n.get("_.notifications.mark-as-read");
    },
    i18nKey() {
      return "_." + this.notification.detail.message.lead.key;
    },
    i18nNoticeKey() {
      return "_." + this.notification.detail.message.notice.key;
    },
    severity() {
      return this.notification.detail.message.severity;
    },
    read() {
      return this.notification.readAt;
    },
    icon() {
      return this.notification.detail.message.icon;
    },
  },
  mounted() {
    this.notification = this.$props.data;
  },
  watch: {
    data() {
      this.notification = this.$props.data;
    },
  },
  methods: {
    clickMessage() {
      if (!this.read) {
        this.readMessage();
      }
      this.goToSender();
    },
    readMessage() {
      Notifications.toggleRead(this.notification.id)
        .then((data) => {
          this.notification = data;
          if (this.read) {
            this.$emit("decrease");
          } else {
            this.$emit("increase");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    goToSender() {
      if (profileNotifications.indexOf(this.notification.type) >= 0) {
        this.$router.push({
          name: "profile",
          params: { username: this.notification.detail.sender.username },
        });
      }
      if (statusNotifications.indexOf(this.notification.type) >= 0) {
        this.$router.push({
          name: "singleStatus",
          params: { id: this.notification.detail.status.id },
        });
      }
      this.$emit("close");
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
