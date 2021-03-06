<template>
  <LayoutBasicNoSidebar>
    <v-row class="justify-content-center">
      <v-col class="col-12 col-md-8 col-lg-6">
        <v-card style="position: sticky; top: 76px">
          <Map :poly-lines="polylines" />
        </v-card>
      </v-col>
      <v-col class="col-md-8 col-lg-6">
        <span class="mt-4 text-h4 mb-4">{{ $i18n.get("_.menu.active") }}</span>
        <Spinner v-if="loading" class="mt-5" />
        <div v-if="error" class="error">
          <p>{{ error }}</p>

          <p>
            <button @click.prevent="fetchData">
              {{ $i18n.get("_.vue.tryAgain") }}
            </button>
          </p>
        </div>
        <div v-if="statuses" class="mt-3">
          <Status
            v-for="status in statuses"
            v-bind:key="status.id"
            :status="status"
            v-bind:stopovers="stopovers"
          ></Status>
        </div>
      </v-col>
    </v-row>
  </LayoutBasicNoSidebar>
</template>

<script>
import Status from "@/components/Status";
import Map from "@/components/Map";
import { StatusModel } from "@/ApiClient/APImodels";
import Spinner from "@/components/Spinner";
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import ApiStatus from "@/ApiClient/Status";

export default {
  name: "ActiveStatuses",
  data() {
    return {
      loading: true,
      error: null,
      interval: null,
      statuses: [StatusModel],
      stopovers: null,
      polylines: null,
    };
  },
  metaInfo() {
    return {
      title: this.$i18n.get("_.menu.active"),
      meta: [
        { name: "robots", content: "index", vmid: "robots" },
        {
          name: "description",
          content: this.$i18n.get("_.description.en-route"),
          vmid: "description",
        },
        {
          name: "DC.Description",
          content: this.$i18n.get("_.description.en-route"),
          vmid: "DC.Description",
        },
      ],
    };
  },
  components: {
    LayoutBasicNoSidebar,
    Spinner,
    Status,
    Map,
  },
  created() {
    this.fetchData();
    this.startRefresh();
  },
  methods: {
    fetchData() {
      const oldStatuses = this.statuses;
      this.error = this.statuses = null;
      ApiStatus.get()
        .then((data) => {
          this.loading = false;
          // FixMe: Why is this comparison not working correctly?
          if (oldStatuses != data) {
            this.statuses = data;
            if (this.statuses.length) {
              this.fetchPolyline();
              this.fetchStopovers();
            }
          }
        })
        .catch((error) => {
          this.loading = false;
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
    fetchPolyline() {
      let tripIds = "";
      this.statuses.forEach((status) => {
        tripIds += status.id + ",";
      });
      ApiStatus.fetchPolyLine(tripIds)
        .then((data) => {
          this.polylines = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    startRefresh() {
      setInterval(() => this.fetchData(), 70000);
    },
  },
};
</script>

<style scoped></style>
