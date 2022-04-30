<template>
  <v-card>
    <v-toolbar dense flat>
      <v-toolbar-title v-text="$i18n.get('_.stationboard.where-are-you')" />
      <v-spacer />
      <v-btn
        icon
        class="text-trwl"
        :title="$i18n.get('_.stationboard.search-by-location')"
        @click.prevent="getGeoLocation"
      >
        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-autocomplete
        clearable
        dense
        class="mt-2 mb-1"
        v-model="station"
        persistent-hint
        :hint="$i18n.get('_.stationboard.station-placeholder') + ' / DS100'"
        :items="entries"
        :loading="loading"
        :search-input.sync="search"
        @keyup.enter="submitStation('')"
        prop="autocomplete"
        hide-no-datay
        hide-selected
        item-text="name"
        item-value="name"
        hide-details
        hide-no-data
        return-object
      >
        <template v-slot:append-outer v-if="history.length > 0">
          <v-icon
            class="ms-1"
            :title="$i18n.get('_.stationboard.last-stations')"
            color="info"
            @click="showHistory = !showHistory"
          >
            mdi-history
          </v-icon>
        </template>
      </v-autocomplete>
      <v-expand-transition>
        <v-container v-show="showHistory">
          <v-list-item
            key="history-heading"
            v-text="$i18n.get('_.stationboard.last-stations')"
          />
          <v-list-item
            v-for="(station, index) in history"
            :key="index"
            active-class="custom-active-class"
            @click="stationRedirect(station.name)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ station.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-container>
      </v-expand-transition>
      <v-expand-transition>
        <v-row v-show="showFilter">
          <v-col align="center" justify="space-around">
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('ferry')"
            >
              {{ $i18n.get("_.transport_types.ferry") }}
            </v-btn>
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('bus')"
            >
              {{ $i18n.get("_.transport_types.bus") }}
            </v-btn>
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('tram')"
            >
              {{ $i18n.get("_.transport_types.tram") }}
            </v-btn>
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('subway')"
            >
              {{ $i18n.get("_.transport_types.subway") }}
            </v-btn>
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('suburban')"
            >
              {{ $i18n.get("_.transport_types.suburban") }}
            </v-btn>
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('regional')"
            >
              {{ $i18n.get("_.transport_types.regional") }}
            </v-btn>
            <v-btn
              rounded
              class="mx-1"
              color="primary"
              v-on:click.prevent="submitStation('express')"
            >
              {{ $i18n.get("_.transport_types.express") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="showFilter = !showFilter"
        text
        v-text="$i18n.get('_.stationboard.filter-products')"
      />
      <v-spacer />
      <v-btn
        v-if="$store.state.user.home"
        :to="{
          name: 'trains.stationboard',
          query: { station: $store.state.user.home.name },
        }"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn color="primary" @click.prevent="submitStation('')">
        {{ $i18n.get("_.stationboard.submit-search") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Checkin from "@/ApiClient/Checkin";

export default {
  name: "StationForm",
  data() {
    return {
      station: null,
      errors: null,
      loading: false,
      history: [],
      showHistory: false,
      showFilter: false,
      descriptionLimit: 60,
      search: null,
      entries: [],
      model: null,
      popularStations: [
        { name: "Hamburg Hbf" },
        { name: "Berlin Hbf" },
        { name: "München Hbf" },
        { name: "Köln Hbf" },
        { name: "Frankfurt(Main)Hbf" },
        { name: "Stuttgart Hbf" },
        { name: "Düsseldorf Hbf" },
        { name: "Leipzig Hbf" },
        { name: "Dortmund Hbf" },
        { name: "Essen Hbf" },
        { name: "Bremen Hbf" },
        { name: "Dresden Hbf" },
        { name: "Hannover Hbf" },
        { name: "Nürnberg Hbf" },
        { name: "Duisburg Hbf" },
        { name: "Bochum Hbf" },
        { name: "Wuppertal Hbf" },
        { name: "Bielefeld Hbf" },
        { name: "Bonn Hbf" },
        { name: "Münster Hbf" },
        { name: "Karlsruhe Hbf" },
        { name: "Mannheim Hbf" },
        { name: "Augsburg Hbf" },
        { name: "Wiesbaden Hbf" },
        { name: "Mönchengladbach Hbf" },
      ],
    };
  },
  props: {
    now: null,
    next: null,
    prev: null,
    hideTimepicker: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentTravelType() {
      if (this.$route.query.travelType) {
        return this.$route.query.travelType;
      }
      return null;
    },
    when() {
      if (this.$route.query.when) {
        return this.$route.query.when;
      }
      return moment().toISOString();
    },
  },
  mounted() {
    this.changeStation(this.$route.query.station);
    this.fetchData();
  },
  watch: {
    search(val) {
      val && val !== this.station && this.querySelections(val);
    },
    station(val) {
      if (val) {
        this.submitStation();
      }
    },
  },
  methods: {
    changeStation(station) {
      if (station) {
        this.entries.unshift({ name: station });
        this.station = this.entries.at(0);
        this.search = this.entries.at(0).name;
      }
    },
    stationRedirect(station) {
      this.changeStation(station);
      this.$router.push({
        name: "trains.stationboard",
        query: { station: station.name },
      });
      this.showHistory = false;
      this.submitStation();
    },
    querySelections(query) {
      if (query === this.entries.at(0)?.name) {
        return;
      }
      if (query.length <= 3 && query !== query.toUpperCase()) {
        this.entries = this.popularStations.map((e) => e.name);
        return;
      }
      try {
        this.loading = true;
        axios
          .get(`/trains/station/autocomplete/${query.replace("/", " ")}`)
          .then((source) => {
            this.entries = source.data.data.map((item) => {
              if (item.rilIdentifier) {
                item.name = item.name.concat(" (", item.rilIdentifier, ")");
              }
              return item;
            });
            this.loading = false;
          });
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    fetchData() {
      Checkin.getHistory()
        .then((data) => {
          this.history = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitStation(travelType = null, time = this.when) {
      document.activeElement.blur();
      this.showFilter = false;
      this.showHistory = false;
      if (typeof travelType != "string") {
        travelType = this.currentTravelType;
      }

      let station = this.station ? this.station.name : this.search;

      if (station) {
        this.$router
          .push({
            name: "trains.stationboard",
            query: {
              station: this.search,
              travelType: travelType,
              when: time,
            },
          })
          .then(() => {
            this.$emit("refresh");
          })
          .catch(() => {
            this.$emit("refresh");
          });
      } else {
        console.error("station null");
      }
    },
    fetchNearbyStation(position) {
      Checkin.getNearbyStations(
        position.coords.latitude,
        position.coords.longitude
      )
        .then((data) => {
          this.station = data.name;
          this.submitStation();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.fetchNearbyStation(position);
          },
          () => {
            this.notyf.error(
              this.$i18n.get("_.stationboard.position-unavailable")
            );
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.custom-active-class.v-list-item--active::before {
  opacity: 0;
}
</style>

<style scoped lang="scss">
#timepicker-wrapper {
  padding: 2rem 0;

  .btn-rounded:first-child {
    border-top-left-radius: 10em;
    border-bottom-left-radius: 10em;
  }

  .btn-rounded:last-child {
    border-top-right-radius: 10em;
    border-bottom-right-radius: 10em;
  }

  .btn {
    box-shadow: none !important;
  }

  .text-white {
    color: white;
    text-transform: uppercase;
    word-wrap: break-word;
    white-space: normal;
    font-size: 0.81rem;
  }

  #timepicker-form {
    &.opacity-null {
      display: none;

      &.animated {
        transition: 0.2s display ease-ease;
      }
    }
  }
}
</style>
