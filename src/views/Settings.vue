<template>
  <LayoutBasicNoSidebar footerclass="pt-5">
    <h1>{{ $i18n.get("_.menu.settings") }}</h1>
    <ul id="settingsTabs" class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <a
          id="settingsTab-profile"
          aria-controls="settingsTabs-profile"
          class="nav-link active"
          data-mdb-toggle="tab"
          href="#settingsTabs-profile"
          role="tab"
          aria-selected="true"
        >
          {{ $i18n.get("_.settings.tab.profile") }}
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a
          class="nav-link"
          id="settingsTab-account"
          data-mdb-toggle="tab"
          aria-controls="settingsTabs-account"
          role="tab"
          href="#settingsTabs-account"
          aria-selected="false"
        >
          {{ $i18n.get("_.settings.tab.account") }}
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a
          class="nav-link"
          id="settingsTab-connectivity"
          data-mdb-toggle="tab"
          aria-controls="settingsTabs-connectivity"
          role="tab"
          href="#settingsTabs-connectivity"
          aria-selected="false"
        >
          {{ $i18n.get("_.settings.tab.connectivity") }}
        </a>
      </li>
    </ul>
    <div id="settingsTabs-content" class="tab-content col-md-12 col-lg-8">
      <ProfileSettings v-model="userProfileSettings"></ProfileSettings>
      <AccountSettings v-model="userProfileSettings"></AccountSettings>
      <ConnectivitySettings
        v-model="userProfileSettings"
      ></ConnectivitySettings>
    </div>
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
