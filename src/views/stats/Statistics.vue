<template>
  <LayoutBasicNoSidebar>
    <div class="d-sm-flex mb-2">
      <h3 class="mb-0 mr-auto text-gray-800">{{ $i18n.get("_.stats") }}</h3>
      <div class="w-100"></div>
      <div class="me-2 mb-1">
        <v-btn
          class="btn btn-primary text-nowrap"
          @click="generateExport('pdf')"
        >
          <v-icon>mdi-content-save</v-icon>
          {{ $i18n.get("_.export.submit") }}
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="px-3" color="primary" v-bind="attrs" v-on="on">
              <span class="sr-only">
                {{ $i18n.get("_.sr.dropdown.toggle") }}
              </span>
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="type in ['csv', 'json']"
              :key="type"
              @click="generateExport(type)"
            >
              <v-list-item-title> .{{ type }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon>mdi-calendar</v-icon>&nbsp;
            {{ $i18n.get("_.stats.range") }} ({{ dateRange }})
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="fetchRecentDays(7)">
            {{ $i18n.choice("_.stats.range.days", 1, { days: 7 }) }}
          </v-list-item>
          <v-list-item @click="fetchRecentDays(14)">
            {{ $i18n.choice("_.stats.range.days", 1, { days: 14 }) }}
          </v-list-item>
          <v-list-item @click="fetchRecentDays(30)">
            {{ $i18n.choice("_.stats.range.days", 1, { days: 30 }) }}
          </v-list-item>
          <v-list-item @click="fetchRecentDays(60)">
            {{ $i18n.choice("_.stats.range.days", 1, { days: 60 }) }}
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item @click="picker.show()">
            {{ $i18n.choice("_.stats.range.picker") }}
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-row>
      <v-col class="col-lg-8">
        <v-divider class="my-2" />
        <v-row>
          <v-col class="col-md-6 mb-4">
            <v-card>
              <v-card-title>{{ $i18n.get("_.stats.purpose") }}</v-card-title>
              <v-card-text>
                <p
                  v-if="travelPurpose.length <= 0"
                  class="text-danger font-weight-bold mt-2"
                >
                  {{ $i18n.get("_.stats.no-data") }}
                </p>
                <apexchart
                  ref="purpose"
                  :options="pieChartOptions"
                  :series="emptySeries"
                  type="pie"
                  width="100%"
                ></apexchart>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col class="col-md-6 mb-4">
            <v-card>
              <v-card-title>{{ $i18n.get("_.stats.categories") }}</v-card-title>
              <v-card-text>
                <p
                  v-if="travelCategories.length <= 0"
                  class="text-danger font-weight-bold mt-2"
                >
                  {{ $i18n.get("_.stats.no-data") }}
                </p>
                <apexchart
                  ref="categories"
                  :options="pieChartOptions"
                  :series="emptySeries"
                  type="pie"
                  width="100%"
                ></apexchart>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col class="col-md-6 mb-4">
            <v-card>
              <v-card-title>{{ $i18n.get("_.stats.companies") }}</v-card-title>
              <v-card-text class="card-body">
                <p
                  v-if="trainProviders.length <= 0"
                  class="text-danger font-weight-bold mt-2"
                >
                  {{ $i18n.get("_.stats.no-data") }}
                </p>
                <apexchart
                  ref="companies"
                  :options="pieChartOptions"
                  :series="emptySeries"
                  type="pie"
                  width="100%"
                ></apexchart>
              </v-card-text>
            </v-card>
          </v-col>
          <v-divider class="my-2" />
          <v-col class="col-12 mb-4">
            <v-card>
              <v-card-title>{{ $i18n.get("_.stats.volume") }}</v-card-title>
              <v-card-text>
                <p
                  v-if="travelTime.length <= 0"
                  class="text-danger font-weight-bold mt-2"
                >
                  {{ $i18n.get("_.stats.no-data") }}
                </p>
                <apexchart
                  ref="travelTimeChart"
                  :options="barChartOptions"
                  :series="emptyDataSeries"
                  type="line"
                  width="100%"
                ></apexchart>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="col-lg-4">
        <v-divider class="my-2" />
        <v-card class="mb-4">
          <v-card-text>
            <v-row>
              <v-col class="col-4 text-center">
                <i aria-hidden="true" class="fas fa-ruler fa-4x mt-1"></i>
              </v-col>
              <v-col class="col-8 text-center">
                <span class="font-weight-bold text--primary text-h4">
                  {{ this.localizeDistance(this.globalData.distance) }} km
                </span>
                <br />
                <small class="grey--text text--darken-1">
                  {{ $i18n.get("_.stats.global.distance") }}
                </small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mb-4">
          <v-card-text>
            <v-row>
              <v-col class="col-4 text-center">
                <i aria-hidden="true" class="fas fa-clock fa-4x mt-1"></i>
              </v-col>
              <v-col class="col-8 text-center">
                <span class="font-weight-bold text--primary text-h4">
                  {{ fullTime(globalData.duration, true) }}
                </span>
                <br />
                <small class="grey--text text--darken-1">{{
                  $i18n.get("_.stats.global.duration")
                }}</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mb-4">
          <v-card-text>
            <v-row>
              <v-col class="col-4 text-center">
                <i aria-hidden="true" class="fas fa-users fa-4x mt-1"></i>
              </v-col>
              <v-col class="col-8 text-center">
                <span class="font-weight-bold text--primary text-h4">
                  {{ globalData.activeUsers }} x
                </span>
                <br />
                <small class="grey--text text--darken-1">{{
                  $i18n.get("_.stats.global.active")
                }}</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider class="my-2" />
        <small class="grey--text text--darken-1">
          *{{
            $i18n.choice("_.stats.global.explain", 1, {
              fromDate: moment(this.fromGlobal).format("LLL"),
              toDate: moment(this.untilGlobal).format("LLL"),
            })
          }}
        </small>
        <v-divider />
      </v-col>
    </v-row>
  </LayoutBasicNoSidebar>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import moment from "moment";
import LitePicker from "litepicker";
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import Statistics from "@/ApiClient/Statistics";
import localizeDistance from "@/helpers/timeHelpers/localizeDistance";
import localizeThousands from "@/helpers/timeHelpers/localizeThousands";
import fullTime from "@/helpers/timeHelpers/fullTime";

export default {
  name: "Statistics",
  components: {
    LayoutBasicNoSidebar,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      localizeDistance,
      localizeThousands,
      fullTime,
      loading: true,
      picker: null,
      from: moment().subtract(1, "month").toISOString(),
      until: moment().toISOString(),
      fromGlobal: 0,
      untilGlobal: 0,
      emptySeries: [
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
      ],
      emptyDataSeries: [
        {
          name: "series-1",
          data: [],
        },
      ],
      globalData: {
        distance: 15.123,
        duration: 0,
        activeUsers: 0,
      },
      travelPurpose: [{ name: "", count: 0, duration: 0 }],
      trainProviders: [{ name: "", count: 0, duration: 0 }],
      travelCategories: [{ name: "", count: 0, duration: 0 }],
      travelTime: [{ date: 0, duration: 2021, count: 1 }],
      pieChartOptions: {
        chart: {
          type: "pie",
        },
        dataLabels: {
          enabled: true,
        },
        legend: false,
      },
      barChartOptions: {
        chart: {
          height: 350,
          zoom: {
            enabled: false,
          },
          toolbar: false,
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        stroke: {
          curve: "smooth",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        yaxis: [
          {
            title: {
              text: this.$i18n.get("_.stats.time-in-minutes"),
            },
          },
          {
            opposite: true,
            title: {
              text: this.$i18n.get("_.stats.trips"),
            },
          },
        ],
      },
    };
  },
  metaInfo() {
    return {
      title: this.$i18n.get("_.stats"),
    };
  },
  mounted() {
    this.fetchGlobalData();
    this.fetchPersonalData();
    this.picker = new LitePicker({
      element: document.getElementById("daterange"),
      singleMode: false,
      lang: this.$i18n.getLocale(),
      tooltipNumber: (totalDays) => {
        return totalDays - 1;
      },
      setup: (picker) => {
        picker.on("selected", (date1, date2) => {
          this.from = moment(date1.toDateString()).toISOString();
          this.until = moment(date2.toDateString()).toISOString();
          this.fetchPersonalData();
        });
      },
    });
  },
  computed: {
    dateRange() {
      let from = moment(this.from);
      let until = moment(this.until);
      let diff = from.diff(until, "day");

      return moment.duration(diff, "days").humanize();
    },
  },
  methods: {
    generateExport(type) {
      Statistics.export(this.from, this.until, type)
        .then((res) => {
          const { data, headers } = res;
          let fileName = "export." + type;

          if (headers["content-disposition"]) {
            fileName = headers["Content-Disposition"].replace(
              /\w+; filename="(.*)"/,
              "$1"
            );
          }

          const blob = new Blob([data], { type: headers["content-type"] });
          let dom = document.createElement("a");
          let url = window.URL.createObjectURL(blob);
          dom.href = url;
          dom.download = decodeURI(fileName);
          dom.style.display = "none";
          document.body.appendChild(dom);
          dom.click();
          dom.parentNode.removeChild(dom);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchRecentDays(delta) {
      this.from = moment().subtract(delta, "days").toISOString();
      this.until = moment().toISOString();
      this.fetchPersonalData();
    },
    fetchPersonalData() {
      Statistics.fetchPersonalData(this.from, this.until)
        .then((data) => {
          this.travelPurpose = data.data.purpose;
          this.trainProviders = data.data.operators;
          this.travelCategories = data.data.categories;
          this.travelTime = data.data.time;
          this.from = data.meta.from;
          this.until = data.meta.until;
          this.loading = false;
          this.updatePurpose();
          this.updateCategories();
          this.updateProviders();
          this.updateVolume();
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    fetchGlobalData() {
      Statistics.fetchGlobalData()
        .then((data) => {
          this.globalData = data.data;
          this.untilGlobal = data.meta.until;
          this.fromGlobal = data.meta.from;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    updatePurpose() {
      this.$refs.purpose.updateOptions(
        {
          labels: this.travelPurpose.map((x) =>
            this.$i18n.get("_.stationboard.business." + x.name)
          ),
          series: this.travelPurpose.map((x) => x.count),
        },
        true
      );
    },
    updateCategories() {
      this.$refs.categories.updateOptions({
        labels: this.travelCategories.map((x) =>
          this.$i18n.get("_.transport_types." + x.name)
        ),
        series: this.travelCategories.map((x) => x.count),
      });
    },
    updateProviders() {
      this.$refs.companies.updateOptions({
        labels: this.trainProviders.map((x) => x.name),
        series: this.trainProviders.map((x) => x.count),
      });
    },
    updateVolume() {
      let fixedTravelTime = [];
      let store = moment(this.travelTime[0].date);
      this.travelTime.forEach(function callback(value) {
        let currentDate = moment(value.date);
        while (value.date && store.diff(currentDate) !== 0) {
          fixedTravelTime.push({
            date: store.format("L"),
            count: 0,
            duration: 0,
          });
          store.add(1, "day");
        }
        value.date = currentDate.format("L");
        fixedTravelTime.push(value);
        store = currentDate.add(1, "day");
      });

      this.$refs.travelTimeChart.updateSeries([
        {
          name: this.$i18n.get("_.stats.time-in-minutes"),
          type: "line",
          data: fixedTravelTime.map((x) => {
            return {
              x: x.date,
              y: x.duration,
            };
          }),
        },
        {
          name: this.$i18n.get("_.stats.trips"),
          type: "column",
          data: fixedTravelTime.map((x) => {
            return {
              x: x.date,
              y: x.count,
            };
          }),
        },
      ]);
    },
  },
};
</script>
