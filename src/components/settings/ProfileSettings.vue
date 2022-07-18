<template>
  <v-card-text>
    <p class="text-h4">{{ $i18n.get("_.settings.heading.profile") }}</p>

    <v-subheader>{{ $i18n.get("_.settings.picture") }}</v-subheader>
    <v-row>
      <v-col class="col-3">
        <img
          ref="profilepicture"
          :alt="$i18n.get('_.settings.picture')"
          :src="$store.state.user.profilePicture"
          class="rounded-circle w-100 d-block"
        />
      </v-col>
      <v-col class="col-8 d-flex align-items-center">
        <button class="btn btn-primary me-1" @click="toggleShowUpload">
          {{ $i18n.get("_.settings.upload-image") }}
        </button>
        <button
          v-if="value.profile_picture_set"
          class="btn btn-outline-danger"
          @click="$refs.deleteModal.show()"
        >
          <v-icon>mdi-trash</v-icon>
          <span class="sr-only">{{
            $i18n.get("_.settings.delete-profile-picture-btn")
          }}</span>
        </button>
      </v-col>
    </v-row>

    <v-subheader>{{ $i18n.get("_.settings.title-profile") }}</v-subheader>
    <div class="form-floating mb-3">
      <input
        id="username"
        v-model="value.username"
        class="form-control"
        placeholder="@Gertrud"
        type="text"
        @change="profileSettingsChange"
      />
      <label for="username">{{ $i18n.get("_.user.username") }}</label>
    </div>
    <div class="form-floating mb-3">
      <input
        id="displayname"
        v-model="value.name"
        class="form-control"
        placeholder="Gertrud"
        type="text"
        @change="profileSettingsChange"
      />
      <label for="displayname">{{ $i18n.get("_.user.displayname") }}</label>
    </div>

    <v-subheader>
      {{ $i18n.get("_.settings.title-privacy") }}
    </v-subheader>

    <v-row>
      <v-col>
        <label aria-label="visibilityDropdown" class="form-check-label">
          {{ $i18n.get("_.menu.settings.myFollower") }}
        </label>
      </v-col>
      <v-col>
        <v-btn dark color="blue" :to="{ name: 'followers' }" class="float-end">
          {{ $i18n.get("_.settings.follower.manage") }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-3 pt-3">
      <v-col>
        <label aria-label="visibilityDropdown" class="form-check-label">
          {{ $i18n.get("_.settings.visibility.default") }}
        </label>
      </v-col>
      <v-col>
        <FADropdown
          id="visibilityDropdown"
          v-model="value.default_status_visibility"
          :dropdown-content="visibility"
          :pre-select="value.default_status_visibility"
          class="float-end"
          showText="true"
          @input="profileSettingsChange"
        ></FADropdown>
      </v-col>
    </v-row>
    <v-row class="mt-3 pt-3">
      <v-col class="col-9 col-md-11">
        <label class="form-check-label" for="privateProfileSwitch">
          {{ $i18n.get("_.user.private-profile") }}<br />
          <span class="small grey--text text--darken-1">{{
            $i18n.get("_.settings.visibility.disclaimer")
          }}</span>
        </label>
      </v-col>
      <v-col class="form-check form-switch">
        <input
          id="privateProfileSwitch"
          v-model="value.private_profile"
          class="form-check-input float-end"
          type="checkbox"
          @change="profileSettingsChange"
        />
      </v-col>
    </v-row>
    <v-row class="mt-3 pt-3">
      <v-col class="col-9 col-md-11">
        <label class="form-check-label" for="preventIndexSwitch">
          {{ $i18n.get("_.settings.prevent-indexing") }}<br />
          <span class="grey--text text--darken-1 small">
            {{ $i18n.get("_.settings.search-engines.description") }}
          </span>
        </label>
      </v-col>
      <v-col class="form-check form-switch">
        <input
          id="preventIndexSwitch"
          v-model="value.prevent_index"
          class="form-check-input float-end"
          type="checkbox"
          @change="profileSettingsChange"
        />
      </v-col>
    </v-row>
    <v-row class="mt-3 pt-3">
      <v-col>
        <label class="form-check-label" for="dblSwitch">
          {{ $i18n.get("_.user.always-dbl") }}
        </label>
      </v-col>
      <v-col class="form-check form-switch">
        <input
          id="dblSwitch"
          v-model="value.always_dbl"
          class="form-check-input float-end"
          type="checkbox"
          @change="profileSettingsChange"
        />
      </v-col>
    </v-row>
    <ModalConfirm
      ref="deleteModal"
      :abort-text="$i18n.get('_.settings.delete-profile-picture-no')"
      :body-text="$i18n.get('_.settings.delete-profile-picture-desc')"
      :confirm-text="$i18n.get('_.settings.delete-profile-picture-yes')"
      :title-text="$i18n.get('_.settings.delete-profile-picture')"
      confirm-button-color="btn-danger"
      v-on:confirm="deleteProfilePicture"
    ></ModalConfirm>
    <my-upload
      v-if="showUpload"
      v-model="showUpload"
      :height="300"
      :langType="$i18n.getLocale()"
      :width="300"
      field="img"
      img-format="png"
      @crop-success="cropSuccess"
    ></my-upload>
  </v-card-text>
</template>

<script>
import ModalConfirm from "@/components/modals/ModalConfirm";
import FADropdown from "@/components/buttons/FADropdown";
import myUpload from "vue-image-crop-upload";
import { visibility } from "@/ApiClient/APImodels";
import _debounce from "lodash/debounce";
import Settings from "@/ApiClient/Settings";

export default {
  name: "ProfileSettings",
  props: ["value"],
  model: {
    prop: "value",
    event: "input",
  },
  components: { ModalConfirm, FADropdown, myUpload },
  data() {
    return {
      visibility: visibility,
      showUpload: false,
    };
  },
  methods: {
    cropSuccess(val) {
      Settings.updateProfilePicture(val)
        .then(() => {
          this.toggleShowUpload();
          this.$store.dispatch("fetchUserData");
          this.notyf.success(this.$i18n.get("_.settings.saved"));
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
    toggleShowUpload() {
      this.showUpload = !this.showUpload;
    },
    updateProfileSettings() {
      Settings.updateProfileSettings(this.value)
        .then((data) => {
          this.value = data;
          this.notyf.success(this.$i18n.get("_.settings.saved"));
          this.$store.dispatch("fetchUserData");
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
    deleteProfilePicture() {
      Settings.deleteProfilePicture()
        .then(() => {
          this.notyf.success(this.$i18n.get("_.settings.saved"));
          this.$store.dispatch("fetchUserData");
        })
        .catch((error) => {
          this.apiErrorHandler(error);
        });
    },
    profileSettingsChange: _debounce(function () {
      this.updateProfileSettings();
    }, 300),
  },
};
</script>

<style scoped></style>
