// eslint-disable-file
<template>
  <div v-if="status">
    <v-subheader v-if="showDate || isSingleStatus">
      {{ moment(statusData.train.origin.departure).format("dddd[,] LL") }}
    </v-subheader>
    <div v-if="polyline" class="card-img-top">
      <Map :poly-lines="polyline" class="map"></Map>
    </div>
    <v-card class="mb-2">
      <v-card-text v-if="statusData.body" class="text-h6">
        <v-icon>mdi-format-quote-close</v-icon>
        {{ statusData.body }}
      </v-card-text>
      <v-card-text>
        <v-timeline align-top dense class="ma-n5">
          <v-timeline-item color="red darken-3" small>
            <v-row class="pt-1">
              <v-col class="col-2 col-lg-1 px-0">
                <span
                  v-if="statusData.train.origin.isDepartureDelayed"
                  style="text-decoration: line-through"
                  class="me-1"
                >
                  {{
                    moment(statusData.train.origin.departurePlanned).format(
                      "LT"
                    )
                  }}
                </span>
                <strong>
                  {{ departure.format("LT") }}
                </strong>
              </v-col>
              <v-col class="ps-0 text--primary">
                <strong>{{ statusData.train.origin.name }}</strong>
                <div class="text-caption">
                  <span>
                    <img
                      v-if="categories.indexOf(statusData.train.category) > -1"
                      :alt="statusData.train.category"
                      :src="`/img/${statusData.train.category}.svg`"
                      class="product-icon"
                    />
                    <v-icon v-else size="1rem">mdi-train-variant</v-icon>
                    {{ statusData.train.lineName }}
                  </span>
                  <span class="ps-2">
                    <v-icon size="1rem">mdi-map-marker-distance</v-icon>
                    &nbsp;{{ localizeDistance(statusData.train.distance) }}
                    <small>km</small>
                  </span>
                  <span class="ps-2">
                    <v-icon size="1rem">mdi-clock-time-five</v-icon>
                    &nbsp;{{ hoursAndMinutes(statusData.train.duration) }}
                  </span>
                  <v-tooltip top v-if="statusData.business > 0" class="pl-sm-2">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        <i
                          :class="travelReason[statusData.business].icon"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </template>
                    <span>
                      {{ $i18n.get(travelReason[statusData.business].desc) }}
                    </span>
                  </v-tooltip>
                  <br />
                  <span v-if="statusData.event != null" class="pl-sm-2">
                    <i aria-hidden="true" class="fa fa-calendar-day"></i>
                    <router-link
                      :to="{
                        name: 'event',
                        params: { slug: statusData.event.slug },
                      }"
                    >
                      {{ statusData.event.name }}
                    </router-link>
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item v-if="!showLinerun && stopovers" color="grey" small>
            <v-btn small @click="showLinerun = true">
              <template v-if="nextStop != null">
                <span class="d-none d-md-inline">
                  {{ $i18n.get("_.stationboard.next-stop") }}
                </span>
                <strong>{{ nextStop.name }}</strong>
              </template>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </v-timeline-item>
          <v-expand-transition v-if="stopovers">
            <transition-group v-show="showLinerun">
              <v-timeline-item
                color="grey"
                small
                v-for="stop in this.stopovers[this.statusData.train.trip].slice(1, -1)"
                :key="stop.id"
              >
                <v-row class="pt-1">
                  <v-col class="col-2 col-lg-1 px-0">
                    <span
                      v-if="stop.isArrivalDelayed"
                      style="text-decoration: line-through"
                      class="me-1"
                    >
                      {{ moment(stop.arrivalPlanned).format("LT") }}
                    </span>
                    <strong>
                      {{ moment(stop.arrival).format("LT") }}
                    </strong>
                  </v-col>
                  <v-col class="ps-0 text--primary">
                    <strong>{{ stop.name }}</strong>
                  </v-col>
                </v-row>
              </v-timeline-item>
              <v-timeline-item
                hide-dot
                key="interactive-button"
                v-show="showLinerun"
              >
                <v-btn small @click="showLinerun = false">
                  <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
              </v-timeline-item>
            </transition-group>
          </v-expand-transition>

          <v-timeline-item color="red darken-3" small>
            <v-row class="pt-1">
              <v-col class="col-2 col-lg-1 px-0">
                <span
                  v-if="statusData.train.destination.isArrivalDelayed"
                  style="text-decoration: line-through"
                  class="me-1"
                >
                  {{
                    moment(statusData.train.destination.arrivalPlanned).format(
                      "LT"
                    )
                  }}
                </span>
                <strong>
                  {{ arrival.format("LT") }}
                </strong>
              </v-col>
              <v-col class="ps-0 text--primary">
                <strong>{{ statusData.train.destination.name }}</strong>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
      <v-progress-linear :value="percentage"></v-progress-linear>
      <v-card-actions>
        <v-list-item class="grow">
          <router-link
            :to="{
              name: 'profile',
              params: { username: statusData.username },
            }"
          >
            <v-list-item-avatar color="grey darken-3">
              <v-img
                class="elevation-6"
                :alt="$i18n.get('_.settings.picture')"
                :src="statusData.profilePicture"
              ></v-img>
            </v-list-item-avatar>
          </router-link>
          <v-list-item-content>
            <v-list-item-title
              v-if="
                $store.state.authenticated &&
                $store.state.user.id === statusData.user
              "
            >
              {{ $i18n.get("_.user.you") }}
            </v-list-item-title>
            <v-list-item-title v-else>
              {{ statusData.username }}
            </v-list-item-title>
            <router-link
              :to="{
                name: 'singleStatus',
                params: { id: statusData.id, statusData: this.status },
              }"
              tag="v-list-item-subtitle"
            >
              {{ moment(statusData.createdAt).fromNow() }}
            </router-link>
          </v-list-item-content>

          <v-row align="center" justify="end">
            <v-icon
              @click="likeStatus"
              class="mr-1"
              :color="statusData.liked ? 'red' : ''"
            >
              mdi-heart
            </v-icon>
            <span class="subheading mr-2">{{ statusData.likes }}</span>
            <span class="mr-1">·</span>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <!-- ToDo: Change to material Design Icons -->
                <i
                  v-bind="attrs"
                  v-on="on"
                  :class="visibilityIcon.icon"
                  aria-hidden="true"
                  class="fas visibility-icon text-small mr-1"
                ></i>
              </template>
              <span>{{ $i18n.get(visibilityIcon.desc) }}</span>
            </v-tooltip>
            <span class="mr-1">·</span>
            <v-menu offset-y rounded="lg">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  :aria-label="$i18n.get('_.menu.show-more')"
                  class="like-text"
                  @click="fetchUser"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="mr-1"> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-if="shareable" @click="share">
                  <v-icon>mdi-share</v-icon>
                  <span>{{ $i18n.get("_.menu.share") }}</span>
                </v-list-item>
                <v-list-item v-if="!editable && user">
                  <FollowButton :user="user" dropdown="true" />
                </v-list-item>
                <v-list-item v-if="!editable && user">
                  <MuteButton :user="user" dropdown="true" />
                </v-list-item>
                <v-list-item v-if="editable" @click="toggleEditModal">
                  <v-icon>mdi-pencil</v-icon>
                  <span>{{ $i18n.get("_.modals.editStatus-title") }}</span>
                </v-list-item>
                <v-list-item v-if="editable" @click="toggleDeleteModal">
                  <v-icon>mdi-delete</v-icon>
                  <span>{{ $i18n.get("_.modals.delete-confirm") }}</span>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
    <ModalConfirm
      v-if="
        $store.state.authenticated && statusData.user === $store.state.user.id
      "
      ref="deleteModal"
      :abort-text="$i18n.get('_.menu.abort')"
      :confirm-text="$i18n.get('_.modals.delete-confirm')"
      :title-text="$i18n.get('_.modals.deleteStatus-title')"
      confirm-button-color="btn-danger"
      v-on:confirm="deleteStatus"
    ></ModalConfirm>
    <CheckInModal
      v-if="
        $store.state.authenticated && statusData.user === $store.state.user.id
      "
      ref="editModal"
      :status-data="status"
      v-on:updated="updateStatus"
    ></CheckInModal>
  </div>
</template>

<script>
import moment from "moment";
import Map from "@/components/Map";
import { StatusModel, travelReason, visibility } from "@/ApiClient/APImodels";
import ModalConfirm from "@/components/modals/ModalConfirm";
import CheckInModal from "@/components/modals/CheckInModal";
import FollowButton from "@/components/buttons/FollowButton";
import MuteButton from "@/components/buttons/MuteButton";
import User from "@/ApiClient/User";
import Status from "@/ApiClient/Status";
import hoursAndMinutes from "@/helpers/timeHelpers/hoursAndMinutes";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";

export default {
  name: "Status.vue",
  data() {
    return {
      showLinerun: false,
      hoursAndMinutes,
      localizeDistance,
      isSingleStatus: false,
      categories: ["bus", "suburban", "subway", "tram"],
      loading: false,
      error: false,
      now: moment(),
      travelReason: travelReason,
      statusResponse: null,
      user: null,
    };
  },
  components: {
    MuteButton,
    FollowButton,
    CheckInModal,
    Map,
    ModalConfirm,
  },
  props: {
    status: StatusModel,
    showDate: {
      type: Boolean,
      default: false,
    },
    likes: null,
    polyline: null, //ToDo Typedef
    stopovers: null, //ToDo Typedef
  },
  computed: {
    editable() {
      return (
        this.$store.state.authenticated &&
        this.$store.state.user.id === this.statusData.user
      );
    },
    shareable() {
      return navigator.share;
    },
    statusData() {
      if (!this.statusResponse) {
        return this.$props.status;
      }
      return this.statusResponse;
    },
    departure() {
      return moment(this.statusData.train.origin.departure);
    },
    arrival() {
      return moment(this.statusData.train.destination.arrival);
    },
    percentage() {
      const start = moment(this.statusData.train.origin.departure);
      const end = moment(this.statusData.train.destination.arrival);
      let percent;
      if (this.now > start && this.now < end) {
        percent = 100 * ((this.now - start) / (end - start));
      } else if (this.now >= end) {
        percent = 100;
      }
      return percent;
    },
    showStopOvers() {
      return (
        this.departure.isBefore() &&
        this.arrival.isAfter() &&
        this.nextStop() !== null
      );
    },
    nextStop() {
      if (
        this.stopovers != null &&
        this.percentage < 100 &&
        this.percentage > 0
      ) {
        let stopOvers = this.stopovers[this.statusData.train.trip];
        if (stopOvers && stopOvers.length > 0) {
          let future = stopOvers.filter((stopover) => {
            return moment(stopover.arrival).isAfter(this.now);
          });
          return future[0];
        }
      }
      return null;
    },
    visibilityIcon() {
      return visibility[this.statusData.visibility] ?? visibility[0];
    },
  },
  methods: {
    startRefresh() {
      setInterval(() => (this.now = moment()), 1000);
    },
    fetchUser() {
      User.getByUsername(this.status.username)
        .then((data) => {
          this.user = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    likeStatus() {
      if (!this.$store.state.authenticated) {
        return;
      }
      if (this.statusData.liked === false) {
        Status.like(this.statusData.id)
          .then(() => {
            this.statusData.liked = true;
            this.statusData.likes += 1;
            this.likes.push(this.$store.state.user);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        Status.dislike(this.statusData.id)
          .then(() => {
            this.statusData.liked = false;
            this.statusData.likes -= 1;
            let index = this.likes.indexOf(this.$store.state.user);
            if (index !== -1) {
              this.likes.splice(index);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    deleteStatus() {
      Status.delete(this.statusData.id)
        .then(() => {
          this.status = null;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateStatus() {
      this.statusResponse = this.$refs.editModal.result;
    },
    toggleDeleteModal() {
      this.$refs.deleteModal.show();
    },
    toggleEditModal() {
      this.$refs.editModal.show();
    },
    share() {
      const shareData = {
        title: this.$i18n.get("_.menu.share"),
        text: this.$i18n.choice("_.description.status", 1, {
          username: this.statusData.username,
          origin: this.statusData.train.origin.name,
          destination: this.statusData.train.destination.name,
          date: moment(this.statusData.train.origin.departure).format("LLL"),
          lineName: this.statusData.train.lineName,
        }),
        url:
          window.location.origin +
          this.$router.resolve({
            name: "singleStatus",
            params: { id: this.statusData.id },
          }).href,
      };

      if (navigator.share) {
        navigator.share(shareData);
      }
    },
  },
  created() {
    this.startRefresh();
  },
};
</script>

<style scoped lang="scss">
@import "/src/sass/variables";

.v-timeline::before {
  top: 50px;
  height: calc(100% - 100px);
}

.map {
  width: 100%;
  overflow: hidden;

  &.large {
    height: 280px;
  }
  .progress {
    height: 0.3rem;
    // background: lighten(rgb(192, 57, 43), 50%);
    background: $grey;
    border-radius: 0;

    .progress-bar {
      background: rgb(192, 57, 43);
    }
  }

  .profile-image {
    height: 2em;
    border-radius: 50%;
  }

  img {
    max-width: 100%;
  }

  .list-inline {
    margin-bottom: 0;

    .like {
      color: #f5a530;
      cursor: pointer;
    }

    .list-inline-item:not(:last-child) {
      margin-right: 0.5rem;

      &::after {
        content: "|";
        margin-left: 0.5rem;
        color: $grey;
      }
    }
  }

  .like-text {
    line-height: 2em;
  }

  .visibility-icon {
    color: #b3b3b3 !important;
  }
}
</style>
