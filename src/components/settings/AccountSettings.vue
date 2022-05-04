<template>
  <v-card>
    <h2>{{ $i18n.get("_.settings.heading.account") }}</h2>

    <h6 class="text-uppercase grey--text text--darken-1 border-bottom my-5">
      {{ $i18n.get("_.settings.tab.account") }}
    </h6>
    <v-row>
      <v-col cols="auto" class="mr-auto">
        {{ $i18n.get("_.user.email") }}<br />
        <span v-if="value.email" class="small grey--text text--darken-1">
          {{ value.email }}
        </span>
        <span v-else class="small grey--text text--darken-1">{{
          $i18n.get("_.user.email.not-set")
        }}</span>
      </v-col>
      <v-col cols="auto">
        <v-btn
          v-if="value.email && !value.email_verified"
          color="blue lighten-2"
          class="mr-1"
          elevation="1"
          outlined
          @click="resendMail"
        >
          {{ $i18n.get("_.controller.status.email-resend-mail") }}
        </v-btn>
        <v-dialog v-model="mailDialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              elevation="1"
              color="blue"
              outlined
              v-bind="attrs"
              v-on="on">
              {{ $i18n.get("_.generic.change") }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">
                {{ this.$i18n.get("_.user.email.change") }}
              </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  {{ this.$i18n.get("_.email.change") }}
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      id="mail"
                      v-model="email"
                      :label="$i18n.get('_.user.email.new')"
                      placeholder="mail@example.com"
                      required
                      type="email"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      id="password"
                      v-model="password"
                      placeholder=""
                      required
                      :label="$i18n.get('_.settings.current-password')"
                      type="password"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" text @click="mailDialog = false">
                {{ this.$i18n.get("_.menu.abort") }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="updateMail">
                {{ this.$i18n.get("_.modals.edit-confirm") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col cols="auto" class="mr-auto">
        {{ $i18n.get("_.user.password") }}<br />
        <span class="small grey--text text--darken-1">{{
          $i18n.get("_.passwords.password")
        }}</span>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="blue"
          outlined
          elevation="1"
          @click="$refs.password.show()"
        >
          {{ $i18n.get("_.generic.change") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col cols="auto" class="mr-auto">
        {{ $i18n.get("_.settings.language.set") }}
      </v-col>
      <v-col cols="auto">
        <ChangeLanguageButton class="float-end"></ChangeLanguageButton>
      </v-col>
    </v-row>

    <h6 class="text-uppercase text-danger border-bottom my-5">
      {{ $i18n.get("_.settings.delete-account") }}
    </h6>
    <v-row>
      <v-col cols="auto" class="mr-auto">
        {{ $i18n.get("_.settings.delete-account.detail") }}
      </v-col>
      <v-col cols="auto">
        <v-btn color="red" outlined @click="$refs.delete.show()">
          <i aria-hidden="true" class="fa fa-trash"></i>
          {{ $i18n.get("_.settings.delete-account") }}
        </v-btn>
      </v-col>
    </v-row>
   <ModalConfirm
      ref="password"
      :abort-text="$i18n.get('_.menu.abort')"
      :confirm-text="$i18n.get('_.modals.edit-confirm')"
      :title-text="$i18n.get('_.settings.title-change-password')"
      confirm-v-btn-color="btn-primary"
      v-on:confirm="updatePassword"
    >
      <form>
        <div v-if="value.password" class="form-floating mb-3">
          <input
            id="currentPassword"
            v-model="password"
            autocomplete="password"
            class="form-control"
            placeholder=""
            required
            type="password"
          />
          <label for="currentPassword">{{
            $i18n.get("_.settings.current-password")
          }}</label>
        </div>
        <div class="form-floating mb-3">
          <input
            id="newPassword"
            v-model="newPassword"
            autocomplete="new-password"
            class="form-control"
            placeholder=""
            required
            type="password"
          />
          <label for="newPassword">{{
            $i18n.get("_.settings.new-password")
          }}</label>
        </div>
        <div class="form-floating mb-3">
          <input
            id="newPassword_confirm"
            v-model="newPasswordConfirm"
            autocomplete="new-password"
            class="form-control"
            placeholder=""
            required
            type="password"
          />
          <label for="newPassword_confirm">{{
            $i18n.get("_.settings.confirm-password")
          }}</label>
        </div>
      </form>
    </ModalConfirm>
    <DeleteAccountModal :username="value.username" ref="delete">
    </DeleteAccountModal>
  </v-card>
</template>

<script>
import ChangeLanguageButton from "@/components/buttons/ChangeLanguageButton";
import ModalConfirm from "@/components/modals/ModalConfirm";
import Settings from "@/ApiClient/Settings";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";

export default {
  name: "AccountSettings",
  components: { DeleteAccountModal, ModalConfirm, ChangeLanguageButton },
  props: ["value"],
  model: { prop: "value", event: "input" },
  data() {
    return {
      password: null,
      newPassword: null,
      newPasswordConfirm: null,
      email: null,
      setValue: null,
      mailDialog: false,
    };
  },
  mounted() {
    this.setValue = this.$props.value;
  },
  methods: {
    updatePassword() {
      Settings.updatePassword(
        this.password,
        this.newPassword,
        this.newPasswordConfirm
      )
        .then((data) => {
          this.setValue = data.data;
          this.$emit("input", this.setValue);
          this.password = this.newPassword = this.newPasswordConfirm = null;
          this.notyf.success(
            this.$i18n.get("_.controller.user.password-changed-ok")
          );
        })
        .catch((error) => {
          this.password = this.email = null;
          this.apiErrorHandler(error);
        });
    },
    resendMail() {
      Settings.resendMail()
        .then(() => {
          this.notyf.success(this.$i18n.get("_.email.verification.sent"));
        })
        .catch((error) => {
          this.password = this.email = null;
          this.apiErrorHandler(error);
        });
    },
    updateMail() {
      Settings.updateMail(this.email, this.password)
        .then((data) => {
          this.setValue = data.data;
          this.$emit("input", this.setValue);
          this.password = null;
          this.email = null;
          this.notyf.success(this.$i18n.get("_.email.verification.sent"));
        })
        .catch((error) => {
          this.password = this.email = null;
          this.apiErrorHandler(error);
        });
    },
  },
};
</script>

<style scoped></style>
