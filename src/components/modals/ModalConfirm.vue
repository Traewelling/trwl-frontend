<template>
  <v-dialog v-model="dialog" max-width="550">
    <v-card>
      <v-card-title :class="this.header">
        {{ this.$props.titleText }}
      </v-card-title>
      <v-card-text v-if="bodyText || slotPassed">
        <span v-html="this.$props.bodyText"></span>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="this.$props.abortText"
          color="secondary"
          text
          @click="abort"
        >
          {{ this.$props.abortText }}
        </v-btn>
        <v-btn :color="confirmButtonColor" text @click="confirm">
          {{ this.$props.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ModalConfirm",
  data() {
    return {
      dialog: false,
    };
  },
  props: {
    titleText: null,
    abortText: null,
    confirmText: null,
    confirmButtonColor: null,
    bodyText: null,
    large: {
      type: Boolean,
      default: false,
    },
    extraLarge: {
      type: Boolean,
      default: false,
    },
    bodyClass: null,
    headerClass: {
      type: String,
      default: "",
    },
  },
  computed: {
    slotPassed() {
      return !!this.$slots.default;
    },
    header() {
      return "text-h5 " + this.$props.headerClass;
    },
  },
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    confirm() {
      this.$emit("confirm");
      this.hide();
    },
    abort() {
      this.$emit("abort");
      this.hide();
    },
  },
};
</script>

<style scoped></style>
