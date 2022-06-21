<template>
  <div>
    <v-dialog
      v-model="dialog"
      :fullscreen="this.$vuetify.breakpoint.mobile"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="hide">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ this.lineName }}
            <v-icon>mdi-arrow-right-bold-circle</v-icon>
            {{ this.dest }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <form id="checkinForm" method="POST">
            <div class="form-group">
              <label class="col-form-label" for="message-text">
                {{ $i18n.get("_.stationboard.label-message") }}
              </label>
              <textarea
                id="message-text"
                v-model="status.body"
                class="form-control"
              ></textarea>
            </div>

            <div class="mt-2">
              <div
                v-if="!edit && $store.state.user.twitterUrl != null"
                class="btn-group"
              >
                <input
                  id="tweet_check"
                  v-model="status.tweet"
                  autocomplete="off"
                  class="btn-check"
                  type="checkbox"
                />
                <label
                  class="btn btn-sm btn-outline-twitter"
                  for="tweet_check"
                >
                  <i
                    :title="$i18n.get('stationboard.check-tweet')"
                    aria-hidden="true"
                    class="fab fa-twitter"
                  ></i>
                  <span class="visually-hidden-focusable">{{
                      $i18n.get("_.stationboard.check-tweet")
                    }}</span>
                </label>
              </div>
              <div
                v-if="!edit && $store.state.user.mastodonUrl != null"
                class="btn-group"
              >
                <input
                  id="toot_check"
                  v-model="status.toot"
                  autocomplete="off"
                  class="btn-check"
                  type="checkbox"
                />
                <label
                  class="btn btn-sm btn-outline-mastodon"
                  for="toot_check"
                >
                  <i
                    :title="$i18n.get('stationboard.check-toot')"
                    aria-hidden="true"
                    class="fab fa-mastodon"
                  ></i>
                  <span class="visually-hidden-focusable">{{
                      $i18n.get("_.stationboard.check-toot")
                    }}</span>
                </label>
              </div>

              <div class="float-end">
                <FADropdown
                  v-model="status.business"
                  :dropdown-content="travelReason"
                  :pre-select="status.business"
                ></FADropdown>
                <!-- @todo Add features from PR#463 (Use default visibility) -->
                <FADropdown
                  v-model="status.visibility"
                  :dropdown-content="visibility"
                  :pre-select="status.visibility"
                ></FADropdown>
              </div>
            </div>
            <div
              v-if="events && events.length > 0"
              class="row w-100 mx-0 mb-0"
            >
              {{ $i18n.get("_.events.on-my-way-dropdown") }} <br />
              <div
                v-if="events.length === 1"
                class="custom-control custom-checkbox mt-2"
              >
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="event_check"
                  v-model="eventCheck"
                />
                <label class="custom-control-label" for="event_check">
                  {{ this.events[0].name }}
                </label>
              </div>
              <div v-else class="form-group">
                <select
                  class="form-control"
                  id="event-dropdown"
                  name="event"
                  v-model="selectedEvent"
                >
                  <option value="0" selected>
                    {{ $i18n.get("_.events.no-event-dropdown") }}
                  </option>
                  <option
                    v-for="event in events"
                    :value="event.id"
                    :key="event.name"
                  >
                    {{ event.name }}
                  </option>
                </select>
              </div>
            </div>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="hide">
            {{ $i18n.get("_.menu.abort") }}
          </v-btn>
          <v-btn v-if="edit" color="blue" @click="editCheckin">
            {{ $i18n.get("_.modals.edit-confirm") }}
          </v-btn>
          <v-btn v-else color="blue" @click="submitCheckin">
            {{ $i18n.get("_.stationboard.btn-checkin") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ModalConfirm
      ref="conflict"
      :abort-text="$i18n.get('_.menu.abort')"
      :confirm-text="$i18n.get('_.stationboard.btn-checkin')"
      :title-text="$i18n.get('_.generic.error')"
      confirm-button-color="blue"
      header-class="red white--text"
      v-on:abort="$router.push({ name: 'dashboard' })"
      v-on:confirm="forceCheckin"
    >
      <p v-if="this.error.id">
        {{
          $i18n.choice("_.controller.transport.overlapping-checkin", 1, {
            linename: this.error.line,
          })
        }}&nbsp;
        <router-link
          :to="{ name: 'singleStatus', params: { id: this.error.id } }"
          @click="$refs.conflict.hide"
        >
          {{ this.error.id }}
        </router-link>
      </p>
      <p>{{ $i18n.get("_.checkin.conflict.question") }}</p>
    </ModalConfirm>
  </div>
</template>

<script>
import FADropdown from "@/components/buttons/FADropdown";
import { travelReason, visibility } from "@/ApiClient/APImodels";
import Checkin from "@/ApiClient/Checkin";
import ModalConfirm from "@/components/modals/ModalConfirm";

export default {
  name: "CheckInModal",
  components: { ModalConfirm, FADropdown },
  data() {
    return {
      dialog: false,
      notifications: null,
      status: {
        body: "",
        business: 0,
        visibility: 0,
        eventId: null,
        tweet: false,
        toot: false,
        force: false,
      },
      error: {
        id: null,
        line: null,
      },
      travelReason: travelReason,
      visibility: visibility,
      result: null,
      selectedEvent: 0,
      eventCheck: false,
    };
  },
  props: {
    destination: null,
    statusData: {
      type: Object,
    },
    trainData: {
      type: Object,
    },
    events: {
      type: Array,
    },
  },
  watch: {
    eventCheck() {
      if (this.eventCheck === true && this.events) {
        this.selectedEvent = this.events[0].id;
      } else {
        this.selectedEvent = 0;
      }
    },
  },
  mounted() {
    if (this.edit) {
      this.status.body = this.$props.statusData.body;
      this.status.business = this.$props.statusData.business;
      this.status.visibility = this.$props.statusData.visibility;
    }
  },
  computed: {
    edit() {
      return !!this.$props.statusData;
    },
    dest() {
      if (this.edit) {
        return this.$props.statusData.train.destination.name;
      }
      return this.$props.destination;
    },
    lineName() {
      if (this.edit) {
        return this.$props.statusData.train.lineName;
      }
      return this.$props.trainData.lineName;
    },
  },
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    forceCheckin() {
      this.status.force = true;
      this.submitCheckin();
    },
    submitCheckin() {
      const formData = {};
      if (this.selectedEvent > 0) {
        this.status.eventId = this.selectedEvent;
      }
      Object.assign(formData, this.status);
      Object.assign(formData, this.$props.trainData);
      Checkin.checkIn(formData)
        .then((data) => {
          this.$store.commit("setLastStation", this.destination);
          this.$router.push({ name: "dashboard", params: { checkin: data } });
          this.hide();
        })
        .catch((error) => {
          if (error.status === 409 && this.error.id === null) {
            this.error.id = error.errors[0].status_id;
            this.error.line = error.errors[0].lineName;
            this.hide();
            this.$refs.conflict.show();
          } else {
            this.$router.push({ name: "dashboard" });
          }
          console.error(error);
        });
    },
    editCheckin() {
      const formData = {};
      Object.assign(formData, this.status);
      Checkin.editCheckin(this.statusData.id, formData)
        .then((data) => {
          this.result = data;
          this.notyf.success(this.$i18n.get("_.settings.saved"));
          this.$emit("updated");
          this.hide();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped></style>
