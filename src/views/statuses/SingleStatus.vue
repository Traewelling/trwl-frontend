<template>
  <LayoutBasic>
    <div class="col-md-8 col-lg-7">
      <Spinner v-if="loading" class="mt-5" />

      <div v-if="error" class="error">
        <p>{{ error }}</p>

        <p>
          <button @click.prevent="fetchData">
            {{ $i18n.get("_.vue.tryAgain") }}
          </button>
        </p>
      </div>

      <div v-if="status">
        <Status
          :polyline="polyline"
          :status="status"
          :stopovers="stopovers"
          :show-date="true"
        ></Status>

        <v-card v-if="likes.count">
          <v-list>
            <template v-for="like in likes">
              <v-list-item :key="like.id">
                <router-link
                  :to="{ name: 'profile', params: { username: like.username } }"
                >
                  <v-list-item-avatar>
                    <v-img
                      :alt="$i18n.get('_.settings.picture')"
                      :src="like.profilePicture"
                    ></v-img>
                  </v-list-item-avatar>
                </router-link>
                <v-list-item-content>
                  <router-link
                    :to="{
                      name: 'profile',
                      params: { username: like.username },
                    }"
                  >
                    {{ like.username }}
                  </router-link>
                  <span v-if="like.id === status.user">{{
                    $i18n.get("_.user.liked-own-status")
                  }}</span>
                  <span v-else>{{ $i18n.get("_.user.liked-status") }}</span>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </div>
    </div>
  </LayoutBasic>
</template>

<script>
import Status from "@/components/Status";
import moment from "moment";
import { StatusModel } from "@/ApiClient/APImodels";
import LayoutBasic from "@/components/layouts/Basic";
import Spinner from "@/components/Spinner";
import StatusApi from "@/ApiClient/Status";

export default {
  name: "SingleStatus",
  data() {
    return {
      error: false,
      loading: false,
      status: StatusModel,
      polyline: null, //ToDo Typedef
      stopovers: null, //ToDo Typedef
      likes: null,
      moment: moment,
      metaData: {
        title: undefined,
        url: undefined,
        image: undefined,
        description: undefined,
        robots: undefined,
      },
    };
  },
  metaInfo() {
    return {
      title: this.metaData.title,
      meta: [
        { name: "robots", content: this.metaData.robots, vmid: "robots" },
        {
          name: "description",
          content: this.metaData.description,
          vmid: "description",
        },
        {
          name: "DC.Description",
          content: this.metaData.description,
          vmid: "DC.Description",
        },
        { name: "og:title", content: this.metaData.title, vmid: "og:title" },
        { name: "og:url", content: this.metaData.url, vmid: "og:url" },
        { name: "og:image", content: this.metaData.image, vmid: "og:image" },
        {
          name: "og:description",
          content: this.metaData.description,
          vmid: "og:description",
        },
        { name: "twitter:card", content: "summary", vmid: "twitter:card" },
        { name: "twitter:site", content: "@traewelling", vmid: "twitter:site" },
        {
          name: "twitter:title",
          content: this.metaData.title,
          vmid: "twitter:title",
        },
        {
          name: "twitter:description",
          content: this.metaData.description,
          vmid: "twitter:description",
        },
        {
          name: "twitter:image",
          content: this.metaData.image,
          vmid: "twitter:image",
        },
      ],
    };
  },
  created() {
    if (this.statusData == null) {
      this.fetchData();
    } else {
      this.status = this.statusData;
      this.updateMetadata();
      this.fetchPolyline();
      this.fetchLikes();
    }
  },
  components: {
    Spinner,
    LayoutBasic,
    Status,
  },
  props: {
    statusData: null,
  },
  computed: {
    rilIdentifierOrigin() {
      if (this.status.train.origin.rilIdentifier) {
        return " (" + this.status.train.origin.rilIdentifier + ")";
      }
      return "";
    },
    rilIdentifierDestination() {
      if (this.status.train.destination.rilIdentifier) {
        return " (" + this.status.train.destination.rilIdentifier + ")";
      }
      return "";
    },
  },
  methods: {
    fetchData() {
      this.error = null;
      this.loading = true;
      StatusApi.getById(this.$route.params.id)
        .then((data) => {
          this.loading = false;
          this.status = data;
          this.updateMetadata();
          this.fetchPolyline();
          this.fetchStopovers();
          this.fetchLikes();
        })
        .catch((errors) => {
          this.loading = false;
          console.error(errors);
        });
    },
    fetchPolyline() {
      StatusApi.fetchPolyLine(this.status.id)
        .then((data) => {
          this.polyline = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchStopovers() {
      StatusApi.fetchStopovers(this.status.train.trip)
        .then((data) => {
          this.stopovers = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchLikes() {
      StatusApi.fetchLikes(this.status.id)
        .then((data) => {
          this.likes = data;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    updateMetadata() {
      if (this.status.preventIndex) {
        this.metaData.robots = "noindex";
      }
      this.metaData.description = this.$i18n.choice("_.description.status", 1, {
        username: this.status.username,
        origin: this.status.train.origin.name + this.rilIdentifierOrigin,
        destination:
          this.status.train.destination.name + this.rilIdentifierDestination,
        date: this.moment(this.status.train.origin.departure).format("LLL"),
        lineName: this.status.train.lineName,
      });
      this.metaData.url =
        window.location.origin +
        this.$router.resolve({
          name: "singleStatus",
          params: { id: this.status.id },
        }).href; //ToDo combine all window.location.origin...-methods to one single method
      this.metaData.title = this.$i18n.choice("_.status.ogp-title", 1, {
        name: this.status.username,
      });
      this.metaData.image = this.status.profilePicture;
    },
  },
};
</script>

<style scoped></style>
