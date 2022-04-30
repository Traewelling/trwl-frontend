<template>
  <div v-if="status">
    <h5 v-if="showDate || isSingleStatus" class="mt-4">
      {{ moment(statusData.train.origin.departure).format("dddd[,] LL") }}
    </h5>
    <div class="card status mt-3">
      <div v-if="polyline" class="card-img-top">
        <Map
          :poly-lines="polyline"
          class="map embed-responsive embed-responsive-16by9"
        ></Map>
      </div>

      <div class="card-body row py-1 ps-2 pe-3">
        <div class="col-2 image-box pe-0 d-none d-lg-flex">
          <router-link
            :to="{ name: 'profile', params: { username: statusData.username } }"
          >
            <img :alt="statusData.username" :src="statusData.profilePicture" />
          </router-link>
        </div>

        <div class="col ps-0">
          <ul class="timeline">
            <li>
              <i aria-hidden="true" class="trwl-bulletpoint"></i>
              <span class="text-trwl float-end">
                <small
                  v-if="statusData.train.origin.isDepartureDelayed"
                  class="text-muted"
                  style="text-decoration: line-through"
                  >{{
                    moment(statusData.train.origin.departurePlanned).format(
                      "LT"
                    )
                  }}
                </small>
                &nbsp; {{ departure.format("LT") }}
              </span>
              <router-link
                :to="{
                  name: 'trains.stationboard',
                  query: { station: statusData.train.origin.name },
                }"
                class="text-trwl clearfix"
                >{{ statusData.train.origin.name }}
              </router-link>
              <p class="train-status text-muted">
                <span>
                  <img
                    v-if="categories.indexOf(statusData.train.category) > -1"
                    :alt="statusData.train.category"
                    :src="`/img/${statusData.train.category}.svg`"
                    class="product-icon"
                  />
                  <i v-else aria-hidden="true" class="fa fa-train d-inline"></i>
                  {{ statusData.train.lineName }}
                </span>
                <span class="ps-2">
                  <i aria-hidden="true" class="fa fa-route d-inline"></i>
                  &nbsp;{{ localizeDistance(statusData.train.distance)
                  }}<small>km</small>
                </span>
                <span class="ps-2"
                  ><i aria-hidden="true" class="fa fa-stopwatch d-inline"></i>
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
                  <span>{{
                    $i18n.get(travelReason[statusData.business].desc)
                  }}</span>
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
              </p>
              <p v-if="statusData.body" class="status-body">
                <i aria-hidden="true" class="fas fa-quote-right"></i>
                {{ statusData.body }}
              </p>
              <div v-if="nextStop != null">
                <p class="text-muted font-italic">
                  {{ $i18n.get("_.stationboard.next-stop") }}
                  <router-link
                    :to="{
                      name: 'trains.stationboard',
                      query: { station: nextStop.name },
                    }"
                    class="text-trwl clearfix"
                  >
                    {{ nextStop.name }}
                  </router-link>
                </p>
              </div>
            </li>
            <li>
              <i aria-hidden="true" class="trwl-bulletpoint"></i>
              <span class="text-trwl float-end">
                <small
                  v-if="statusData.train.destination.isArrivalDelayed"
                  class="text-muted"
                  style="text-decoration: line-through"
                  >{{
                    moment(statusData.train.destination.arrivalPlanned).format(
                      "LT"
                    )
                  }}
                </small>
                &nbsp; {{ arrival.format("LT") }}
              </span>
              <router-link
                :to="{
                  name: 'trains.stationboard',
                  query: { station: statusData.train.destination.name },
                }"
                class="text-trwl clearfix"
              >
                {{ statusData.train.destination.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          v-bind:style="{ width: percentage + '%' }"
        ></div>
      </div>
      <div class="card-footer text-muted">
        <span class="float-end like-text small">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <i
                v-bind="attrs"
                v-on="on"
                :class="visibilityIcon.icon"
                aria-hidden="true"
                class="fas visibility-icon text-small"
              ></i>
            </template>
            <span>{{ $i18n.get(visibilityIcon.desc) }}</span>
          </v-tooltip>
          <router-link
            :to="{ name: 'profile', params: { username: statusData.username } }"
          >
            <span
              v-if="
                $store.state.authenticated &&
                $store.state.user.id === statusData.user
              "
              >{{ $i18n.get("_.user.you") }}</span
            >
            <span v-else>{{ statusData.username }}</span> </router-link
          >,
          <router-link
            :to="{
              name: 'singleStatus',
              params: { id: statusData.id, statusData: this.status },
            }"
          >
            {{ moment(statusData.createdAt).fromNow() }}
          </router-link>
        </span>
        <ul class="list-inline">
          <li class="list-inline-item d-lg-none me-1">
            <router-link
              :to="{
                name: 'profile',
                params: { username: statusData.username },
              }"
            >
              <img
                :alt="$i18n.get('_.settings.picture')"
                :src="statusData.profilePicture"
                class="profile-image"
              />
            </router-link>
          </li>
          <li
            v-if="$store.state.authenticated"
            class="list-inline-item like-text me-1"
            tabindex="0"
            v-on:click="likeStatus"
          >
            <i
              aria-hidden="true"
              class="like fa-star small"
              v-bind:class="{ fas: statusData.liked, far: !statusData.liked }"
            ></i>
            <span v-if="statusData.likes" class="pl-1">{{
              statusData.likes
            }}</span>
          </li>
          <v-menu offset-y rounded="xl">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :aria-label="$i18n.get('_.menu.show-more')"
                class="like-text"
                @click="fetchUser"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
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
        </ul>
      </div>

      <div
        v-for="like in likes"
        v-bind:key="like.id"
        class="card-footer text-muted clearfix"
      >
        <ul class="list-inline">
          <li class="list-inline-item">
            <router-link
              :to="{ name: 'profile', params: { username: like.username } }"
            >
              <img
                :alt="$i18n.get('_.settings.picture')"
                :src="like.profilePicture"
                class="profile-image"
              />
            </router-link>
          </li>
          <li class="list-inline-item like-text">
            <router-link
              :to="{ name: 'profile', params: { username: like.username } }"
            >
              {{ like.username }}
            </router-link>
            <span v-if="like.id === statusData.user">{{
              $i18n.get("_.user.liked-own-status")
            }}</span>
            <span v-else>{{ $i18n.get("_.user.liked-status") }}</span>
          </li>
        </ul>
      </div>
    </div>
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
      return visibility[this.statusData.visibility];
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

.status {
  .map {
    width: 100%;
    overflow: hidden;

    &.large {
      height: 280px;
    }
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
