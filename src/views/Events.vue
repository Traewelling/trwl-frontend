<template>
  <LayoutBasicNoSidebar>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-8 mb-2">
        <div class="card">
          <div class="card-body">
            <h2 class="fs-4" id="heading-live-upcoming">
              <em class="far fa-calendar-alt"></em>
              {{ $i18n.get("_.events.live-and-upcoming") }}
            </h2>
            <hr />
            <p v-if="upcomingEvents.length === 0 && !loading" class="text-trwl">
              {{ $i18n.get("_.events.no-upcoming") }}
              {{ $i18n.get("_.events.request-question") }}
            </p>
            <div v-else-if="!loading" class="table-responsive">
              <table class="table" aria-describedby="heading-live-upcoming">
                <tbody>
                  <tr v-for="event in upcomingEvents" :key="event.id">
                    <td>
                      {{ event.name }}
                      <small
                        v-if="event.station"
                        class="grey--text text--darken-1"
                      >
                        <br />
                        {{ $i18n.get("_.events.closestStation") }}:
                        <router-link
                          :to="{
                            name: 'trains.stationboard',
                            query: { station: event.station.name },
                          }"
                        >
                          {{ event.station.name }}
                        </router-link>
                      </small>
                    </td>
                    <td
                      v-if="
                        moment(event.begin).isSame(moment(event.end), 'day')
                      "
                    >
                      {{ moment(event.begin).format("LL") }}
                    </td>
                    <td v-else>
                      {{ moment(event.begin).format("LL") }}
                      - {{ moment(event.end).format("LL") }}
                    </td>
                    <td>
                      <router-link
                        :to="{ name: 'event', params: { slug: event.slug } }"
                        class="btn btn-primary btn-sm"
                      >
                        {{ $i18n.get("_.menu.show-more") }}
                        <em class="fas fa-angle-double-right"></em>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <spinner v-if="loading"></spinner>
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
      <div class="col-md-4 col-lg-4">
        <v-card>
          <v-card-title class="text--primary">
            <v-icon>mdi-calendar-plus</v-icon>
            &nbsp;
            {{ $i18n.get("_.events.request") }}
          </v-card-title>
          <v-card-text class="card-body">
            <v-form
              ref="form"
              v-model="form.valid"
              v-if="$store.state.authenticated"
              @submit.prevent="submitProposal"
            >
              <div class="form-outline mb-4">
                <v-text-field
                  :label="$i18n.get('_.events.name')"
                  :rules="form.nameRules"
                  v-model="suggest.name"
                  required
                />
              </div>
              <div class="form-outline mb-4">
                <v-text-field
                  :rules="form.organiserRules"
                  :label="$i18n.get('_.events.host')"
                  v-model="suggest.host"
                />
              </div>
              <div class="row">
                <div class="col-md-6">
                  <v-menu
                    v-model="menu.begin"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="suggest.begin"
                        :label="$i18n.get('_.events.begin')"
                        prepend-icon="mdi-calendar"
                        :rules="form.beginRules"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="suggest.begin"
                      @input="menu.begin = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
                <div class="col-md-6">
                  <v-menu
                    v-model="menu.end"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="suggest.end"
                        :rules="form.endRules"
                        :label="$i18n.get('_.events.end')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="suggest.end"
                      @input="menu.end = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
              </div>
              <div class="form-outline mb-4">
                <v-text-field
                  v-model="suggest.url"
                  :rules="form.websiteRules"
                  :label="$i18n.get('_.events.url')"
                />
              </div>
              <v-btn type="submit" block :loading="suggestLoading">
                {{ $i18n.get("_.events.request-button") }}
              </v-btn>
              <v-divider class="my-2" />
              <small class="grey--text text--darken-1">{{
                $i18n.get("_.events.notice")
              }}</small>
            </v-form>
            <p v-else class="text-trwl bold">
              {{ $i18n.get("_.auth.required") }}
            </p>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </LayoutBasicNoSidebar>
</template>

<script>
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import Event from "@/ApiClient/Event";
import Spinner from "@/components/Spinner";

export default {
  name: "Events",
  components: { Spinner, LayoutBasicNoSidebar },
  metaInfo() {
    return {
      title: this.$i18n.get("_.events.live"),
      meta: [{ name: "robots", content: "index", vmid: "robots" }],
    };
  },
  data() {
    return {
      upcomingEvents: [],
      loading: true,
      links: null,
      suggestLoading: false,
      suggest: {},
      menu: {
        begin: false,
        end: false,
      },
      form: {
        valid: false,
        nameRules: [(v) => !!v || "Required"],
        beginRules: [(v) => !!v || "Required"],
        endRules: [(v) => !!v || "Required"],
        organiserRules: [(v) => !!v || "Required"],
        websiteRules: [(v) => !!v || "Required"],
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchMore() {
      this.loading = true;
      this.fetchMoreData(this.links.next).then((data) => {
        this.upcomingEvents = this.upcomingEvents.concat(data.data);
        this.links = data.links;
        this.loading = false;
      });
    },
    fetchData() {
      Event.upcoming().then((data) => {
        this.upcomingEvents = data.data;
        this.links = data.links;
        this.loading = false;
      });
    },
    submitProposal() {
      this.$refs.form.validate();
      if (!this.form.valid) {
        return;
      }
      this.suggestLoading = true;
      const formData = {};
      Object.assign(formData, this.suggest);
      Event.suggest(formData)
        .then(() => {
          this.suggestLoading = false;
          this.notyf.success(this.$i18n.get("_.settings.saved"));
          this.suggest = {};
        })
        .catch((error) => {
          this.suggestLoading = false;
          console.error(error);
        });
    },
  },
};
</script>

<style scoped lang="scss">
#event-header {
  h2 {
    font-size: 145%;
    margin-bottom: 0;
    line-height: 1.5;
  }
}
</style>
