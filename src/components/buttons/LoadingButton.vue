<template>
  <button :type="buttonType" :class="{ disabled: disabled }">
    <slot></slot>
    <span
      v-if="disabled"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    <span v-if="disabled" class="visually-hidden">{{
      $i18n.get("_.menu.loading")
    }}</span>
  </button>
</template>

<script>
export default {
  name: "LoadingButton",
  props: {
    type: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonType() {
      return this.$props.type ?? "button";
    },
  },
};
</script>

<style scoped></style>
