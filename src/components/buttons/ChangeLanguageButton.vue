<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-if="sidebar" link v-bind="attrs" v-on="on" class="px-0">
        <v-list-item-icon>
          <v-icon>mdi-earth</v-icon>
        </v-list-item-icon>
        <span>
          {{ $i18n.get("_.settings.language.set") }}
        </span>
      </v-list-item>
      <v-btn v-else :text="navbar" v-bind="attrs" v-on="on" class="float-end">
        <v-icon dark>mdi-earth</v-icon>
        <span :class="{ 'd-none d-md-inline': !navbar, 'd-inline': navbar }">
          {{ $i18n.get("_.settings.language.set") }}
        </span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(lang, key) in langs"
        :key="lang"
        @click="setLang(key)"
      >
        <v-list-item-title>{{ lang }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
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
    sidebar: {
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
        this.$i18n.setLocale(language);
        this.moment.locale(language.substr(0, 2));
        this.$forceUpdate();
        window.location.reload(); //ToDo change this to a better concept, so that the whole page doesn't need to be reloaded
      }
    },
  },
};
</script>

<style scoped></style>
