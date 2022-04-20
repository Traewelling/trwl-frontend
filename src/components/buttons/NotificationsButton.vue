<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" scrollable>
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
        <v-card-title class="text-h5 grey lighten-2">
          {{ $i18n.get("_.notifications.title") }}
        </v-card-title>

        <v-card-text class="p-0">
          <Spinner v-if="loading" />
          <v-list three-line>
            <v-list-item-group
              active-class="pink--text"
              multiple
              v-if="notifications"
            >
              <template>
                <Notification
                  v-for="data in notifications"
                  v-bind:key="data.id"
                  :data="data"
                  v-on:close="dialog = false"
                  v-on:decrease="$emit('decrease')"
                  v-on:increase="$emit('increase')"
                />
                <v-divider
                  v-if="index < notifications.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> I accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Notification from "@/components/Notification";
import Notifications from "@/ApiClient/Notifications";
import Spinner from "../Spinner";

export default {
  name: "NotificationsButton",
  components: { Spinner, Notification },
  props: {
    notificationsCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialog: false,
      loading: true,
      notifications: null,
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
  methods: {
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
          this.$emit("reset");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
