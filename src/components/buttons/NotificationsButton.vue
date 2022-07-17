<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="700"
      scrollable
      transition="dialog-top-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-badge
            v-if="notificationsCount > 0"
            :content="notificationsCount"
            color="bg-success"
            overlap
            ><!--ToDo: change back color from bootstrap class when removed -->
            <v-icon>mdi-bell</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell-outline</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dense>
          <v-toolbar-title class="text-h5 grey lighten-2">
            {{ $i18n.get("_.notifications.title") }}
          </v-toolbar-title>
          <v-btn icon @click="readAll">
            <v-icon>mdi-check-all</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon :aria-label="$i18n.get('_.notifications.mark-all-read')">
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0 overflow-x-hidden">
          <Spinner v-if="loading" class="overflow-x-hidden" />
          <v-list three-line v-if="!loading">
            <v-list-item-group
              active-class="pink--text"
              v-model="unreadNotifications"
              multiple
              v-if="notifications && notifications.length"
            >
              <template v-for="(notification, index) in notifications">
                <v-list-item
                  :key="notification.id"
                  v-if="notification && notification.detail"
                  @click="clickMessage(notification)"
                >
                  <template>
                    <v-list-item-icon>
                      <v-icon v-text="icon(notification)" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-wrap"
                        v-html="
                          $i18n.choice(
                            '_.' + notification.detail.message.lead.key,
                            1,
                            notification.detail.message.lead.values
                          )
                        "
                      />

                      <v-list-item-subtitle
                        class="text-wrap"
                        v-if="notification.detail.message.notice.key"
                        v-html="
                          $i18n.choice(
                            '_.' + notification.detail.message.notice.key,
                            1,
                            notification.detail.message.notice.values
                          )
                        "
                      >
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text
                        v-text="createdAt(notification)"
                      ></v-list-item-action-text>

                      <v-btn icon @click.stop="readMessage(notification)">
                        <v-icon
                          v-if="!!notification.readAt"
                          color="grey lighten-1"
                          :aria-label="
                            $i18n.get('_.notifications.mark-as-unread')
                          "
                        >
                          mdi-email-open-outline
                        </v-icon>
                        <v-icon
                          v-else
                          color="yellow darken-3"
                          :aria-label="
                            $i18n.get('_.notifications.mark-as-read')
                          "
                        >
                          mdi-email-outline
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>
                </v-list-item>
                <v-divider
                  class="my-0"
                  v-if="index < notifications.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
            <v-list-item v-else class="text-center grey--text text--darken-1">
              {{ $i18n.get("_.notifications.empty") }}
              <br />
              ¯\_(ツ)_/¯
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Notifications from "@/ApiClient/Notifications";
import Spinner from "../Spinner";
import {
  profileNotifications,
  statusNotifications,
} from "@/ApiClient/APImodels";
import moment from "moment";

export default {
  name: "NotificationsButton",
  components: { Spinner },
  data() {
    return {
      dialog: false,
      loading: true,
      notifications: null,
      notificationsCount: 0,
    };
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.loading = true;
        this.fetchNotifications();
      }
    },
  },
  computed: {
    unreadNotifications() {
      let unreadArray = [];
      this.notifications.forEach((notification, index) => {
        console.log(notification);
        if (!notification.readAt) {
          unreadArray.push(index);
        }
      });
      console.log(unreadArray);
      return unreadArray;
    },
  },
  mounted() {
    this.fetchNotificationsCount();
  },
  methods: {
    fetchNotificationsCount() {
      if (this.$store.state.authenticated === true) {
        Notifications.getCount()
          .then((count) => {
            this.notificationsCount = parseInt(count);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    fetchNotifications() {
      Notifications.fetchNotifications()
        .then((data) => {
          this.notifications = data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    readAll() {
      Notifications.readAll()
        .then((data) => {
          this.notifications = data;
          this.notificationsCount = 0;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    icon(message) {
      if (!message.detail && !message.detail.message.icon) {
        return "mdi-information-outline";
      }
      let icon = message.detail.message.icon;
      icon = icon.replace("fas fa-user-plus", "mdi-account-plus");
      icon = icon.replace("fas fa-heart", "mdi-heart");
      return icon;
    },
    createdAt(message) {
      let diff = moment().diff(moment(message.createdAt));
      let duration = moment.duration(diff);
      return duration.humanize();
    },
    clickMessage(message) {
      if (!message.read) {
        this.readMessage(message);
      }
      this.goToSender(message);
    },
    readMessage(message) {
      Notifications.toggleRead(message.id)
        .then((response) => {
          let index = this.notifications.indexOf(message);
          this.$set(this.notifications, index, response.data);
          if (response.data.read) {
            this.notificationsCount--;
          } else {
            this.notificationsCount++;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    goToSender(message) {
      if (profileNotifications.indexOf(message.type) >= 0) {
        this.$router.push({
          name: "profile",
          params: { username: message.detail.sender.username },
        });
      }
      if (statusNotifications.indexOf(message.type) >= 0) {
        this.$router.push({
          name: "singleStatus",
          params: { id: message.detail.status.id },
        });
      }
      this.dialog = false;
    },
  },
};
</script>
