<template>
  <LayoutBasicNoSidebar footerclass="pt-5">
    <span class="text-h3">{{ $i18n.get("_.menu.settings") }}</span>
    <v-row class="mt-2">
      <v-col class="col-md-12 col-lg-8 ml-9">
        <v-card>
          <v-tabs background-color="transparent">
            <v-tab>
              {{ this.$i18n.get("_.settings.tab.profile") }}
            </v-tab>
            <v-tab>
              {{ this.$i18n.get("_.settings.tab.account") }}
            </v-tab>
            <v-tab>
              {{ this.$i18n.get("_.settings.tab.connectivity") }}
            </v-tab>

            <v-tab-item>
              <ProfileSettings v-model="userProfileSettings" />
            </v-tab-item>
            <v-tab-item>
              <AccountSettings v-model="userProfileSettings" />
            </v-tab-item>
            <v-tab-item>
              <ConnectivitySettings v-model="userProfileSettings" />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </LayoutBasicNoSidebar>
</template>

<script>
import LayoutBasicNoSidebar from "@/components/layouts/BasicNoSidebar";
import { userProfileSettings, visibility } from "@/ApiClient/APImodels";
import ProfileSettings from "@/components/settings/ProfileSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import ConnectivitySettings from "@/components/settings/ConnectivitySettings";
import Settings from "@/ApiClient/Settings";

export default {
  name: "Settings",
  data() {
    return {
      visibility: visibility,
      showUpload: false,
      //Profile Settings
      userProfileSettings: userProfileSettings,
    };
  },
  components: {
    ConnectivitySettings,
    AccountSettings,
    ProfileSettings,
    LayoutBasicNoSidebar,
  },
  mounted() {
    this.fetchProfileSettings();
  },
  methods: {
    fetchProfileSettings() {
      Settings.getProfileSettings()
        .then((data) => {
          this.userProfileSettings = data;
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
  },
};
</script>

<style scoped></style>
