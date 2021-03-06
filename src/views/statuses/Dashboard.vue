<template>
  <LayoutBasic>
    <StationForm class="d-none d-md-block" />
    <Spinner v-if="loading" class="mt-5" />
    <div
      v-if="futureStatuses.length > 0 && !loading"
      id="accordionFutureCheckIns"
      class="accordion accordion-flush mt-5 mb-0"
    >
      <div class="accordion-item">
        <h1 id="flush-headingOne" class="accordion-header">
          <button
            aria-controls="future-check-ins"
            aria-expanded="false"
            class="accordion-button collapsed px-0"
            data-mdb-target="#future-check-ins"
            data-mdb-toggle="collapse"
            type="button"
          >
            {{ $i18n.get("_.dashboard.future") }}
          </button>
        </h1>
        <div
          id="future-check-ins"
          aria-labelledby="flush-headingOne"
          class="accordion-collapse collapse"
          data-mdb-parent="#accordionFutureCheckIns"
        >
          <div class="accordion-body pa-0">
            <Status
              v-for="status in futureStatuses"
              v-bind:key="status.id"
              :show-date="showDate(status, statuses)"
              :status="status"
              v-bind:stopovers="stopovers"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="statuses">
      <Status
        v-for="status in statuses"
        v-bind:key="status.id"
        :show-date="showDate(status, statuses)"
        :status="status"
        v-bind:stopovers="stopovers"
      />

      <div v-if="links && links.next" class="text-center">
        <v-btn
          fab
          dark
          color="primary"
          :aria-label="$i18n.get('_.menu.show-more')"
          class="mt-4"
          @click="fetchMore"
          :loading="loadingMore"
        >
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </div>
    </div>
    <CheckinSuccessModal
      v-if="checkin"
      :points="checkin.points.points"
      :calculation="checkin.points.calculation"
      :status="checkin.status"
      :alsoOnThisConnection="checkin.alsoOnThisConnection"
    ></CheckinSuccessModal>
  </LayoutBasic>
</template>

<script>
import Status from "@/components/Status";
import moment from "moment";
import { StatusModel } from "@/ApiClient/APImodels";
import StationForm from "@/components/StationForm";
import LayoutBasic from "@/components/layouts/Basic";
import Spinner from "@/components/Spinner";
import Dashboard from "@/ApiClient/Dashboard";
import ApiStatus from "@/ApiClient/Status";
import CheckinSuccessModal from "@/components/modals/CheckinSuccessModal";

export default {
  name: "dashboard",
  data() {
    return {
      loading: true,
      loadingMore: false,
      statuses: [],
      futureStatuses: [StatusModel],
      stopovers: null, //ToDo Typedef
      moment: moment,
      links: null,
    };
  },
  props: ["checkin"],
  metaInfo() {
    return {
      title: this.$i18n.get("_.menu.dashboard"),
    };
  },
  components: {
    CheckinSuccessModal,
    Spinner,
    LayoutBasic,
    StationForm,
    Status,
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    showDate(item, statuses) {
      let index = statuses.indexOf(item);
      if (index === -1 || index === 0) {
        return true;
      }
      return (
        moment(item.train.origin.departure).date() !==
        moment(statuses[index - 1].train.origin.departure).date()
      );
    },
    originalPoints(points) {
      let factor = this.checkin.points.calculation.factor;
      return points / (factor !== 0 ? factor : 1);
    },
    fetchData() {
      this.statuses = this.futureStatuses = [];
      Dashboard.getFuture()
        .then((data) => {
          this.futureStatuses = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });

      Dashboard.get(this.$route.path === "/dashboard/global")
        .then((data) => {
          this.loading = false;
          if (
            !Object.keys(data.data).length &&
            this.$route.path === "/dashboard"
          ) {
            this.$router.push({ name: "dashboard.global" }); //ToDo: Redirect if following nobody
            this.fetchData();
          }
          this.statuses = data.data;
          this.links = data.links;
          this.fetchStopovers(this.statuses);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchMore() {
      this.loadingMore = true;
      this.fetchMoreData(this.links.next)
        .then((data) => {
          this.statuses = this.statuses.concat(data.data);
          this.links = data.links;
          this.loadingMore = false;
          this.fetchStopovers(data.data);
        })
        .catch(() => {
          this.loadingMore = false;
        });
    },
    fetchStopovers(statuses) {
      if (!this.stopovers) {
        this.stopovers = {};
      }
      let tripIds = "";
      statuses.forEach((status) => {
        if (!(status.train.trip in this.stopovers)) {
          tripIds += status.train.trip + ",";
        }
      });
      ApiStatus.fetchStopovers(tripIds)
        .then((data) => {
          Object.keys(data).forEach((key) => {
            this.stopovers[key] = data[key];
          });
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
  },
  watch: {
    $route() {
      this.fetchData();
    },
  },
};
</script>

<style scoped>
.accordion-button {
  background: none;
}
</style>
