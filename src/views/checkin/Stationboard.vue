<template>
  <LayoutBasic>
    <div class="col-md-8 col-lg-7">
      <StationForm
        :hideTimepicker="!this.$route.query.station"
        :next="times.next"
        :now="times.now"
        :prev="times.prev"
        v-on:refresh="fetchData"
      ></StationForm>

      <template v-if="this.$route.query.station">
        <v-subheader>
          <span class="pe-1">
            <a
              :aria-label="$i18n.get('_.modals.setHome-title')"
              href="#"
              v-on:click.prevent="toggleSetHomeModal"
            >
              <i aria-hidden="true" class="fa fa-home"></i>
            </a>
          </span>
          <span v-if="station" id="stationTableHeader">
            {{ station.name }}
            <small>
              <i aria-hidden="true" class="far fa-clock fa-sm"></i>
              {{ moment(this.times.now).format("LT") }} ({{
                moment(this.times.now).format("L")
              }})
            </small>
          </span>
        </v-subheader>
        <Spinner v-if="loading" class="mt-5" />
        <div
          v-else-if="!departures || Object.keys(departures).length === 0"
          class="card-body text-center red--text text--darken-4 text-bold"
        >
          {{ $i18n.get("_.stationboard.no-departures") }}
        </div>
        <template v-else v-for="(departure, index) in departures">
          <v-subheader
            :key="index"
            v-if="
              index > 0 &&
              index < Object.keys(departures).length &&
              moment(departures[index - 1].when).isBefore(requestTime) &&
              moment(departure.when).isAfter(requestTime)
            "
          >
            {{
              $i18n.choice("_.request-time", 1, {
                time: requestTime.format("LT"),
              })
            }}
          </v-subheader>
          <v-card
            class="mx-auto mt-2"
            :key="index"
            v-else
            v-on:click="goToTrip(departure)"
          >
            <v-card-text>
              <v-row>
                <v-col
                  class="text-h5 col-4 col-md-3 col-lg-2 d-flex"
                  :class="{
                    'text-decoration-line-through red--text text--darken-4':
                      departure.cancelled,
                  }"
                >
                  <v-row class="text-center" no-gutters>
                    <v-col class="pa-0 align-self-center">
                      <img
                        v-if="images.includes(departure.line.product)"
                        :alt="departure.line.product"
                        :src="`/img/${departure.line.product}.svg`"
                        class="product-icon"
                      />
                      <i v-else aria-hidden="true" class="fa fa-train"></i>
                    </v-col>
                    <v-col class="pa-0 align-self-center">
                      <span v-if="departure.line.name" class="ps-1">
                        {{ departure.line.name }}
                      </span>
                      <span v-else class="ps-1 align-self-center">
                        {{ departure.line.fahrtNr }}
                      </span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider vertical />
                <v-col class="text-subtitle-1">
                  <span
                    :class="{
                      'text-decoration-line-through red--text text--darken-4':
                        departure.cancelled,
                    }"
                    class="text-wrap text--primary text-h6"
                  >
                    {{ departure.direction }}
                  </span>
                  <br />
                  <span
                    v-if="departure.cancelled"
                    class="red--text text--darken-4"
                  >
                    {{ $i18n.get("_.stationboard.stop-cancelled") }}
                  </span>
                  <span v-else>
                    <span
                      :class="{
                        'text-success': departure.delay === 0,
                        'text-warning':
                          departure.delay && departure.delay < 600,
                        'red--text text--darken-4': departure.delay >= 600,
                      }"
                    >
                      <span>{{ moment(departure.when).format("LT") }}</span>
                    </span>
                    <small
                      v-if="departure.delay"
                      class="grey--text text--darken-1 text-decoration-line-through"
                    >
                      {{ moment(departure.plannedWhen).format("LT") }}
                    </small>
                    <span v-if="departure.platform">
                      | {{ departure.platform
                      }}<!-- ToDo: i18n -->
                    </span>
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </template>
    </div>
    <ModalConfirm
      v-if="!loading && station !== null"
      ref="confirmHomeModal"
      :abort-text="$i18n.get('_.menu.abort')"
      :body-text="
        $i18n.choice('_.modals.setHome-body', 1, {
          stationName: this.station.name,
        })
      "
      :confirm-text="$i18n.get('_.modals.edit-confirm')"
      :title-text="$i18n.get('_.modals.setHome-title')"
      confirm-button-color="btn-success"
      v-on:confirm="setHome"
    ></ModalConfirm>
  </LayoutBasic>
</template>

<script>
import StationForm from "@/components/StationForm";
import ModalConfirm from "@/components/modals/ModalConfirm";
import moment from "moment";
import { travelImages } from "@/ApiClient/APImodels";
import LayoutBasic from "@/components/layouts/Basic";
import Spinner from "@/components/Spinner";
import Checkin from "@/ApiClient/Checkin";

export default {
  name: "Stationboard",
  components: {
    Spinner,
    LayoutBasic,
    StationForm,
    ModalConfirm,
  },
  data() {
    return {
      station: null,
      departures: null,
      requestTime: null,
      times: {
        now: 0,
        prev: 0,
        next: 0,
      },
      loading: false,
      images: travelImages,
      moment: moment,
    };
  },
  mounted() {
    if (this.$route.query.station) {
      this.fetchData();
    }
    this.requestTime = moment();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.station = null;

      Checkin.getDepartures(
        this.$route.query.station,
        this.$route.query.when,
        this.$route.query.travelType
      )
        .then((data) => {
          this.station = data.meta.station;
          this.times = data.meta.times;
          this.departures = data.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    goToTrip(departure) {
      if (departure.cancelled) {
        return;
      }
      this.$router.push({
        name: "trains.trip",
        query: {
          tripId: departure.tripId,
          lineName: departure.line.name ?? departure.line.fahrtNr,
          start: departure.station.id,
          departure: departure.plannedWhen,
        },
      });
    },
    toggleSetHomeModal() {
      this.$refs.confirmHomeModal.show();
    },
    setHome() {
      Checkin.saveHome((data) => {
        this.result = data;
        this.$store.dispatch("fetchUserData");
        this.notyf.success(
          this.$i18n.choice("_.user.home-set", 1, { station: this.result.name })
        );
      }).catch((error) => {
        console.error(error);
      });
    },
  },
};
</script>
