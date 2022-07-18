<template>
  <HeroLayout>
    <template v-slot:hero>
      <div class="white--text px-4">
        <p class="text-h4 font-weight-bold">
          <strong>
            {{ event.name }}
            <code>#{{ event.hashtag }}</code>
          </strong>
        </p>
        <v-row class="text-h5 py-1">
          <v-col
            v-if="event.host"
            class="col-auto font-weight-bold ps-sm-2 py-0"
          >
            <v-icon color="white">mdi-account</v-icon>&nbsp;{{ event.host }}
          </v-col>
          <v-col class="col-auto font-weight-bold py-0">
            <v-icon color="white">mdi-map-marker-distance</v-icon>&nbsp;
            {{ localizeDistance(details.trainDistance) }}
            <small class="small font-weight-lighter">km</small>
          </v-col>
          <v-tooltip v-if="details.trainDuration" top>
            <template v-slot:activator="{ on, attrs }">
              <v-col
                v-bind="attrs"
                v-on="on"
                class="col-auto font-weight-bold ps-sm-2 py-0"
              >
                <v-icon color="white">mdi-clock-time-five</v-icon>&nbsp;
                {{ fullTime(details.trainDuration, true) }}
              </v-col>
            </template>
            <span>{{ fullTime(details.trainDuration) }}</span>
          </v-tooltip>

          <v-col
            v-if="event.url"
            class="col-12 font-weight-bold py-0 ps-sm-2 text-nowrap"
          >
            <v-icon color="white">mdi-link</v-icon>&nbsp;
            <a :href="event.url" class="white--text">{{ event.url }}</a>
          </v-col>
        </v-row>
        <v-row v-if="event.station">
          <v-col class="col-12 text-h5 ps-sm-2 py-0 font-weight-bold">
            <v-icon color="white">mdi-bus-stop</v-icon>&nbsp;
            <router-link
              class="white--text"
              :to="{
                name: 'trains.stationboard',
                query: { station: event.station.name },
              }"
            >
              {{ event.station.name }}
            </router-link>
          </v-col>
        </v-row>
      </div>
    </template>
    <Spinner v-if="loading || statusesLoading" class="mt-5" />
    <v-row v-else class="mt-5" align="stretch">
      <v-col
        v-if="statuses.length > 0"
        class="col-md-8 col-lg-7 offset-md-2 offset-0"
      >
        <div v-if="statuses">
          <Status
            v-for="status in statuses"
            v-bind:key="status.id"
            :status="status"
            v-bind:stopovers="stopovers"
          ></Status>
          <div v-if="links && links.next" class="text-center">
            <v-btn
              fab
              dark
              color="primary"
              :aria-label="$i18n.get('_.menu.show-more')"
              class="mt-4"
              @click.prevent="fetchMore"
              :loading="loadingMore"
            >
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </HeroLayout>
</template>

<script>
import Status from "@/components/Status";

import { EventDetails, EventModel, StatusModel } from "@/ApiClient/APImodels";
import HeroLayout from "@/components/layouts/HeroLayout";
import Spinner from "@/components/Spinner";
import Event from "@/ApiClient/Event";
import fullTime from "@/helpers/timeHelpers/fullTime";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import ApiStatus from "@/ApiClient/Status";

export default {
  name: "Event",
  data() {
    return {
      username: this.$route.params.username,
      loading: false,
      loadingMore: false,
      statusesLoading: false,
      stopovers: null,
      event: EventModel,
      details: EventDetails,
      statuses: [StatusModel],
      links: null,
      localizeDistance,
      localizeThousands,
      fullTime,
    };
  },
  metaInfo() {
    return {
      title: this.event.name, //ToDo Add more Meta Tags
    };
  },
  components: {
    Spinner,
    HeroLayout,
    Status,
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.error = null;
      this.loading = true;
      Event.fetchData(this.$route.params.slug)
        .then((data) => {
          this.loading = false;
          this.event = data;
          this.fetchStatuses();
          this.fetchDetails();
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchDetails() {
      Event.fetchDetails(this.$route.params.slug)
        .then((data) => {
          this.details = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchStatuses() {
      this.error = null;
      this.statusesLoading = true;
      Event.fetchStatuses(this.$route.params.slug)
        .then((data) => {
          this.statusesLoading = false;
          this.statuses = data.data;
          this.links = data.links;
          this.fetchStopovers(data.data);
        })
        .catch((error) => {
          this.statusesLoading = false;
          console.error(error);
        });
    },
    fetchStopovers() {
      let tripIds = "";
      this.statuses.forEach((status) => {
        tripIds += status.train.trip + ",";
      });
      ApiStatus.fetchStopovers(tripIds)
        .then((data) => {
          this.stopovers = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchMore() {
      this.loadingMore = true;
      this.fetchMoreData(this.links.next)
        .then((data) => {
          this.loadingMore = false;
          this.statuses = this.statuses.concat(data.data);
          this.links = data.links;
          this.fetchStopovers(data.data);
        })
        .catch((error) => {
          this.loadingMore = false;
          console.error(error);
        });
    },
  },
};
</script>

<style scoped></style>
