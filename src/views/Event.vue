<template>
  <HeroLayout>
    <template v-slot:hero>
      <div class="row justify-content-center">
        <div class="text-white col-md-8 col-lg-7">
          <h1 class="card-title font-bold">
            <strong>
              {{ event.name }}
              <code class="text-white">#{{ event.hashtag }}</code>
            </strong>
          </h1>
          <h3>
            <span class="font-weight-bold">
              <i aria-hidden="true" class="fa fa-route d-inline" />&nbsp;
              {{ event.trainDistance.toFixed(0) }}
            </span>
            <span class="small font-weight-lighter">km</span>
            <span
              class="font-weight-bold ps-sm-2"
              data-mdb-toggle="tooltip"
              :title="fullTime(event.trainDuration)"
            >
              <i aria-hidden="true" class="fa fa-stopwatch d-inline" />&nbsp;
              {{ fullTime(event.trainDuration, true) }}
            </span>
            <br class="d-block d-sm-none" />
            <span class="font-weight-bold ps-sm-2">
              <i aria-hidden="true" class="fa fa-user" />&nbsp;{{ event.host }}
            </span>
            <span class="font-weight-bold ps-sm-2 text-nowrap">
              <i aria-hidden="true" class="fa fa-link" />&nbsp;
              <a :href="event.url" class="text-white">{{ event.url }}</a>
            </span>
          </h3>
          <h2>
            <span class="font-weight-bold"
              ><i aria-hidden="true" class="fa fa-train"
            /></span>
            <span class="font-weight-bold">
              <a class="text-white" href="#">{{ event.station.name }}</a>
            </span>
          </h2>
        </div>
      </div>
    </template>
    <Spinner v-if="loading || statusesLoading" class="mt-5" />
    <div v-else class="row justify-content-center mt-5">
      <div v-if="statuses.length > 0" class="col-md-8 col-lg-7">
        <div v-if="statuses">
          <Status
            v-for="status in statuses"
            v-bind:key="status.id"
            :status="status"
          ></Status>
          <div v-if="links && links.next" class="text-center">
            <button
              aria-label="$i18n.get('_.menu.show-more')"
              class="btn btn-primary btn-lg btn-floating mt-4"
              @click.prevent="fetchMore"
            >
              <i aria-hidden="true" class="fas fa-caret-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </HeroLayout>
</template>

<script>
import Status from "@/components/Status";

import { EventModel, StatusModel } from "@/ApiClient/APImodels";
import HeroLayout from "@/components/layouts/HeroLayout";
import Spinner from "@/components/Spinner";
import Event from "@/ApiClient/Event";
import fullTime from "@/helpers/timeHelpers/fullTime";

export default {
  name: "Event",
  data() {
    return {
      username: this.$route.params.username,
      loading: false,
      statusesLoading: false,
      event: EventModel,
      statuses: [StatusModel],
      links: null,
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
        })
        .catch((error) => {
          this.loading = false;
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
        })
        .catch((error) => {
          this.statusesLoading = false;
          console.error(error);
        });
    },
    fetchMore() {
      this.fetchMoreData(this.links.next).then((data) => {
        this.statuses = this.statuses.concat(data.data);
        this.links = data.links;
        this.fetchStopovers(data.data);
      });
    },
  },
};
</script>

<style scoped></style>
