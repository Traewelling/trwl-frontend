<template>
  <LayoutBasicNoSidebar>
    <v-row justify="center">
      <v-col class="col-6">
        <v-card
          v-if="userProfileSettings && userProfileSettings.email"
          elevation="7"
        >
          <v-card-title>
            {{ $i18n.get("_.support.create") }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.subject"
              :label="$i18n.get('_.subject')"
            ></v-text-field>
            <v-textarea
              :label="$i18n.get('_.how-can-we-help')"
              v-model="form.message"
              rows="4"
            ></v-textarea>
            <v-btn
              dark
              block
              type="submit"
              color="blue"
              :loading="formLoading"
              class="mb-4"
            >
              {{ $i18n.get("_.support.submit") }}
            </v-btn>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <small>
              {{
                $i18n.choice("_.support.answer", 1, {
                  address: userProfileSettings.email,
                })
              }}
            </small>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="col-6">
        <v-alert
          v-if="userProfileSettings && userProfileSettings.email"
          border="left"
          type="info"
          icon="mdi-shield-account"
        >
          <h5 class="fw-bold">
            {{ $i18n.get("_.support.privacy") }}
          </h5>
          {{ $i18n.get("_.support.privacy.description") }}
          {{ $i18n.get("_.support.privacy.description2") }}
        </v-alert>

        <spinner v-else-if="loading"></spinner>

        <template v-else>
          <h4>{{ $i18n.get("_.support.create") }}</h4>
          <v-divider class="my-3" />
          <v-alert border="left" type="error">
            <p>{{ $i18n.get("_.support.email-required") }}</p>
            <v-btn :to="{ name: 'settings' }">
              <v-icon>mdi-cog</v-icon>
              {{ $i18n.get("_.go-to-settings") }}
            </v-btn>
          </v-alert>
        </template>
      </v-col>
    </v-row>
  </LayoutBasicNoSidebar>
</template>

<script>
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import Spinner from "@/components/Spinner";
import Support from "@/ApiClient/Support";
import Settings from "@/ApiClient/Settings";

export default {
  name: "Support",
  components: { Spinner, LayoutBasicNoSidebar },
  metaInfo() {
    return {
      title: this.$i18n.get("_.support.create"),
      meta: [{ name: "robots", content: "index", vmid: "robots" }],
    };
  },
  data() {
    return {
      userProfileSettings: null,
      loading: true,
      links: null,
      formLoading: false,
      form: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Settings.getProfileSettings()
        .then((data) => {
          this.userProfileSettings = data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitForm() {
      this.formLoading = true;
      const formData = {};
      Object.assign(formData, this.form);
      Support.createTicket(formData)
        .then((data) => {
          this.formLoading = false;
          this.notyf.success(
            this.$i18n.choice("_.support.success", 1, {
              ticketNumber: data.ticket,
            })
          );
          this.form = {};
        })
        .catch((error) => {
          this.formLoading = false;
          console.error(error);
        });
    },
  },
};
</script>
