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
    <v-autocomplete
      clearable
      outlined
      dense
      flat
      class="mx-4 mt-2"
      v-model="station"
      :label="$i18n.get('_.stationboard.station-placeholder') + ' / DS100'"
      :items="entries"
      :loading="loading"
      :search-input.sync="search"
      @keyup.enter="submitStation('')"
      prop="autocomplete"
      color="white"
      hide-no-datay
      hide-selected
      item-text="name"
      item-value="name"
      hide-details
      hide-no-data
      return-object
    />
    <v-card-actions>
      <v-btn text v-text="$i18n.get('_.stationboard.filter-products')" />
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
      <v-btn
        v-if="history.length > 0"
        :title="$i18n.get('_.stationboard.last-stations')"
      >
        <v-icon>mdi-history</v-icon>
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
    this.station = this.$route.query.station;
    this.search = this.$route.query.station;
    this.fetchData();
  },
  watch: {
    search(val) {
      val && val !== this.station && this.querySelections(val);
    },
  },
  methods: {
    querySelections(query) {
      if (query.length <= 3 && query !== query.toUpperCase()) {
        this.items = this.popularStations.map((e) => e.name);
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
      if (typeof travelType != "string") {
        travelType = this.currentTravelType;
      }

      if (this.station != null) {
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
