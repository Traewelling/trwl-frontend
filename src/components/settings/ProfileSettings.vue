<template>
  <v-card-text>
    <p class="text-h4">{{ $i18n.get("_.settings.heading.profile") }}</p>

    <v-subheader>{{ $i18n.get("_.settings.picture") }}</v-subheader>
    <v-row align="center">
      <v-col class="col-3">
        <v-avatar size="200">
          <img
            ref="profilepicture"
            :alt="$i18n.get('_.settings.picture')"
            :src="$store.state.user.profilePicture"
            class="rounded-circle w-100 d-block"
          />
        </v-avatar>
      </v-col>
      <v-col>
        <v-btn color="blue" dark @click="toggleShowUpload">
          {{ $i18n.get("_.settings.upload-image") }}
        </v-btn>
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
    <v-col class="col-12 col-md-4 mb-3">
      <v-text-field
        placeholder="@Gertrud"
        counter="25"
        v-model="value.username"
        @change="profileSettingsChange"
        :label="$i18n.get('_.user.username')"
      />
    </v-col>
    <v-col class="col-12 col-md-4 mb-3">
      <v-text-field
        v-model="value.name"
        placeholder="Gertrud"
        counter="50"
        @change="profileSettingsChange"
        required
        :label="$i18n.get('_.user.displayname')"
      />
    </v-col>

    <v-subheader>
      {{ $i18n.get("_.settings.title-privacy") }}
    </v-subheader>

    <v-row>
      <v-col class="col-auto">
        <v-btn dark color="blue" :to="{ name: 'followers' }">
          {{ $i18n.get("_.settings.follower.manage") }}
        </v-btn>
      </v-col>
      <v-col>
        <label aria-label="visibilityDropdown" class="v-label theme--light">
          {{ $i18n.get("_.menu.settings.myFollower") }}
        </label>
      </v-col>
    </v-row>

    <v-row class="mt-3 pt-3">
      <v-col class="col-auto">
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
      <v-col>
        <label aria-label="visibilityDropdown" class="v-label theme--light">
          {{ $i18n.get("_.settings.visibility.default") }}
        </label>
      </v-col>
    </v-row>
    <v-row class="mt-3 pt-3">
      <v-col>
        <v-switch
          v-model="value.private_profile"
          @change="profileSettingsChange"
          :label="$i18n.get('_.user.private-profile')"
          :hint="$i18n.get('_.settings.visibility.disclaimer')"
          persistent-hint
        />
      </v-col>
    </v-row>
    <v-row class="mt-3 pt-3">
      <v-col>
        <v-switch
          v-model="value.prevent_index"
          @change="profileSettingsChange"
          :label="$i18n.get('_.settings.prevent-indexing')"
          :hint="$i18n.get('_.settings.search-engines.description')"
          persistent-hint
        />
      </v-col>
    </v-row>
    <v-row class="mt-3 pt-3">
      <v-col>
        <v-switch
          v-model="value.always_dbl"
          @click="profileSettingsChange"
          :label="$i18n.get('_.user.always-dbl')"
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
