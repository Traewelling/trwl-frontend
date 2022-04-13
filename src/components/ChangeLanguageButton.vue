<template>
  <div :class="{ 'btn-group': !navbar }" class="dropup">
    <button
      :aria-label="i18n.get('_.settings.language.set')"
      :class="{
        'btn-sm btn-light': dashboard && !navbar,
        'btn-primary': !dashboard,
        'nav-link bg-transparent': navbar,
        btn: !navbar,
      }"
      aria-expanded="false"
      aria-haspopup="true"
      class="dropdown-toggle"
      data-mdb-toggle="dropdown"
      type="button"
    >
      <i aria-hidden="true" class="fas fa-globe-europe"></i>
      <span
        :class="{ 'd-none d-md-inline': !navbar, 'd-inline': navbar }"
        aria-hidden="true"
      >
        {{ i18n.get("_.settings.language.set") }}
      </span>
    </button>
    <div class="dropdown-menu">
      <a
        v-for="(lang, key) in langs"
        v-bind:key="lang"
        class="dropdown-item"
        href="?language=$key"
        @click.prevent="setLang(key)"
      >
        {{ lang }}
      </a>
    </div>
  </div>
</template>

<script>
import { languages } from "@/i18n/translations";

export default {
  name: "ChangeLanguageButton",
  data() {
    return {
      langs: languages,
    };
  },
  props: {
    dashboard: {
      type: Boolean,
      default: false,
    },
    navbar: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    setLang(language) {
      if (typeof language === "string" && Object.hasOwn(languages, language)) {
        this.$store.commit("setLocale", language);
        this.i18n.setLocale(language);
        this.moment.locale(language.substr(0, 2));
        this.$forceUpdate();
        window.location.reload(); //ToDo change this to a better concept, so that the whole page doesn't need to be reloaded
      }
    },
  },
};
</script>

<style scoped></style>
