<template>
  <LayoutBasic>
    <div class="col-md-8 col-lg-7">
      <Spinner v-if="loading" class="mt-5" />
      <template v-if="hafasTrip != null">
        <v-subheader>
          <img
            v-if="images.includes(hafasTrip.category)"
            :alt="hafasTrip.category"
            :src="`/img/${hafasTrip.category}.svg`"
            class="product-icon pe-1"
          />
          <i v-else aria-hidden="true" class="fa fa-train pe-1"></i>
          {{ this.hafasTrip.lineName }}
          <i aria-hidden="true" class="fas fa-arrow-alt-circle-right px-1"></i>
          {{ this.hafasTrip.destination.name }}
          <a href="#" class="ps-3" @click="showModal(lastStation)">
            <i aria-hidden="true" class="fa fa-fast-forward"></i>
          </a>
        </v-subheader>
        <template v-for="stop in stopovers">
          <v-card
            :key="stop.arrivalPlanned"
            class="my-2"
            @click="showModal(stop)"
          >
            <v-card-text
              class="text--primary"
              :class="{
                'red--text text--darken-4 text-decoration-line-through':
                  stop.cancelled && stop.arrivalPlatformPlanned === null,
              }"
            >
              <v-row>
                <v-col
                  v-if="stop.cancelled && stop.arrivalPlatformPlanned === null"
                  class="col-5 text-decoration-none"
                >
                  {{ $i18n.get("_.stationboard.stop-cancelled") }}
                </v-col>
                <v-col v-else class="col-5 text--secondary">
                  <span
                    v-if="stop.arrivalPlanned"
                    class="d-sm-inline d-md-none ms-4"
                  >
                    {{ $i18n.get("_.stationboard.arr") }}&nbsp;
                    <span :class="delay(stop.arrivalPlanned, stop.arrivalReal)">
                      {{ moment(stop.arrival).format("LT") }}
                    </span>
                    <small
                      v-if="stop.isArrivalDelayed"
                      class="grey--text text--darken-1 text-decoration-line-through"
                    >
                      {{ moment(stop.arrivalPlanned).format("LT") }}
                    </small>
                  </span>
                  <br />
                  <span
                    v-if="stop.departurePlanned"
                    class="d-sm-inline d-md-none ms-4"
                  >
                    {{ $i18n.get("_.stationboard.dep") }}&nbsp;
                    <span
                      :class="delay(stop.departurePlanned, stop.departureReal)"
                    >
                      {{ moment(stop.departure).format("LT") }}
                    </span>
                    <small
                      v-if="stop.isDepartureDelayed"
                      class="grey--text text--darken-1 text-decoration-line-through"
                    >
                      {{ moment(stop.departurePlanned).format("LT") }}
                    </small>
                  </span>
                </v-col>
                <v-col class="col-7">
                  <span class="text-subtitle-2">
                    {{ stop.name }}<br />
                    <span v-if="stop.arrivalPlatformPlanned !== stop.platform">
                      {{ stop.platform }}
                      <span class="text-decoration-line-through text-danger">
                        {{ stop.arrivalPlatformPlanned }}
                      </span>
                    </span>
                    <span v-else>
                      {{ stop.platform }}
                    </span>
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </template>
    </div>
    <CheckInModal
      ref="checkInModal"
      :destination="destination"
      :events="events"
      :train-data="trainData"
    ></CheckInModal>
  </LayoutBasic>
</template>

<script>
import { travelImages } from "@/ApiClient/APImodels";
import moment from "moment";
import CheckInModal from "@/components/modals/CheckInModal";
import LayoutBasic from "@/components/layouts/Basic";
import Spinner from "@/components/Spinner";
import Checkin from "@/ApiClient/Checkin";
import Event from "@/ApiClient/Event";

export default {
  name: "Trip",
  components: { Spinner, LayoutBasic, CheckInModal },
  data() {
    return {
      loading: false,
      images: travelImages,
      hafasTrip: null,
      stopovers: null,
      lastStation: null,
      moment: moment,
      destination: null,
      events: [],
      trainData: {
        tripId: 0,
        lineName: "",
        start: 0,
        destination: 0,
        departure: 0,
        arrival: 0,
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.station = null;
      const query = this.$route.query;
      Checkin.getTrip(query.tripId, query.lineName, query.start)
        .then((data) => {
          this.hafasTrip = data;
          this.stopovers = this.hafasTrip.stopovers.filter((item) => {
            return moment(item.arrivalPlanned).isAfter(
              moment(this.$route.query.departure)
            );
          });
          this.lastStation = this.hafasTrip.stopovers.pop();
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
      Event.active()
        .then((data) => {
          this.events = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showModal(stop) {
      if (!(stop.cancelled && stop.arrivalPlatformPlanned === null)) {
        this.trainData = {
          tripId: this.$route.query.tripId,
          lineName: this.$route.query.lineName,
          start: this.$route.query.start,
          destination: stop.id,
          departure: this.$route.query.departure,
          arrival: stop.arrivalPlanned,
        };
        this.destination = stop.name;
        this.$refs.checkInModal.show();
      }
    },
    delay(planned, current) {
      const delay = moment(current).diff(moment(planned), "seconds");

      if (delay === 0) {
        return "text-success";
      } else if (delay < 600) {
        return "text-warning";
      } else if (delay >= 600) {
        return "text-danger";
      }
    },
  },
};
</script>

<style scoped></style>
