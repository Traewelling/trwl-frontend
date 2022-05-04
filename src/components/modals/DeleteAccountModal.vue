<template>
  <v-dialog v-model="dialog" persistent max-width="450">
    <v-card>
      <v-card-title class="text-h5">
        {{ $i18n.get("_.settings.delete-account") }}
      </v-card-title>
      <v-card-text>
        <span
          v-html="
            $i18n.choice('_.settings.delete-account-verify', 1, {
              appname: $appName,
            })
          "
        ></span>
        <hr />
        <label
          v-html="
            $i18n.choice('_.messages.account.please-confirm', 1, {
              delete: username,
            })
          "
        >
        </label>
        <v-text-field
          v-model="confirmDelete"
          :placeholder="username"
          class="form-control"
          name="confirmation"
          required
          type="text"
          @submit="deleteAccount"
      /></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="dialog = false">
          {{ $i18n.get("_.settings.delete-account-btn-back") }}
        </v-btn>
        <v-btn color="red darken-1" text @click="deleteAccount">
          {{ $i18n.get("_.settings.delete-account-btn-confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Settings from "@/ApiClient/Settings";
export default {
  name: "DeleteAccountModal",
  props: ["username"],
  data() {
    return {
      confirmDelete: null,
      dialog: false,
    };
  },
  methods: {
    deleteAccount() {
      Settings.deleteAccount(this.confirmDelete)
        .then(() => {
          this.confirmDelete = null;
          this.$store.dispatch("logout");
          this.dialog = false;
          this.notyf.success(
            this.$i18n.get("_.settings.delete-account-completed")
          );
        })
        .catch((error) => {
          this.confirmDelete = null;
          console.error(error);
        });
    },
    show() {
      this.dialog = true;
    },
  },
};
</script>

<style scoped></style>
