<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        ref="dropdownButton"
        :class="buttonClass"
        :aria-label="dropDown[selected].desc"
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <i :class="dropDown[selected].icon" aria-hidden="true"></i>
        <span v-if="showText">{{ $i18n.get(dropDown[selected].desc) }}</span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        :two-line="!!item.detail"
        v-for="(item, key) in dropDown"
        :key="item.icon"
        @click="selectItem(key)"
      >
        <v-list-item-icon>
          <i :class="item.icon" aria-hidden="true"></i>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ $i18n.get(item.desc) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="item.detail">
            {{ $i18n.get(item.detail) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "FADropdown",
  data() {
    return {
      selectedValue: null,
    };
  },
  model: {
    prop: "value",
    event: "input",
  },
  props: ["btnClass", "dropdownContent", "preSelect", "showText", "value"],
  computed: {
    buttonClass() {
      if (this.$props.btnClass) {
        return this.$props.btnClass;
      }
      return "btn-outline-primary";
    },
    dropDown() {
      return this.$props.dropdownContent;
    },
    selected() {
      if (!this.selectedValue && this.$props.preSelect) {
        return this.$props.preSelect;
      }
      if (this.selectedValue) {
        return this.selectedValue;
      }
      return 0;
    },
  },
  methods: {
    selectItem(key) {
      this.selectedValue = key;

      this.$emit("input", this.selectedValue);
    },
  },
};
</script>

<style scoped></style>
