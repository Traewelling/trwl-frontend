<template>
  <LayoutBasicNoSidebar>
    <v-row class="justify-content-center">
      <v-col class="col-12 col-md-8 col-lg-8 mb-2">
        <v-card>
          <v-card-title>
            <v-icon>mdi-calendar-month</v-icon>
            &nbsp;
            {{ $i18n.get("_.events.live-and-upcoming") }}
          </v-card-title>
          <v-card-text>
            <p v-if="upcomingEvents.length === 0 && !loading" class="text-trwl">
              {{ $i18n.get("_.events.no-upcoming") }}
              {{ $i18n.get("_.events.request-question") }}
            </p>
            <div v-else-if="!loading" class="table-responsive">
              <v-sheet tile height="54" class="d-flex">
                <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-spacer />
                <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-sheet>
              <v-calendar
                ref="calendar"
                :weekdays="calendar.weekday"
                :events="calendar.events"
                v-model="calendar.value"
                @click:event="goToEvent"
              ></v-calendar>
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
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-md-4 col-lg-4">
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
      </v-col>
    </v-row>
  </LayoutBasicNoSidebar>
</template>

<script>
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import Event from "@/ApiClient/Event";
import Spinner from "@/components/Spinner";
import moment from "moment";

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
      },
      calendar: {
        weekday: [1, 2, 3, 4, 5, 6, 0],
        value: "",
        events: [],
      },
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
        this.updateCalendar(this.upcomingEvents);
        this.links = data.links;
        this.loading = false;
      });
    },
    fetchData() {
      Event.upcoming().then((data) => {
        this.upcomingEvents = data.data;
        this.updateCalendar(data.data);
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
    updateCalendar(data) {
      this.calendar.events = data.map((obj) => {
        obj["start"] = moment(obj["begin"]).format("YYYY-MM-DD");
        obj["end"] = moment(obj["end"]).format("YYYY-MM-DD");
        return obj;
      });
    },
    goToEvent(event) {
      console.log(event.event);
      this.$router.push({ name: "event", params: { slug: event.event.slug } });
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
