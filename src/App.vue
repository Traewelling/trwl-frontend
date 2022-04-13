<template>
  <router-view></router-view>
</template>

<script>
import htmlWebpackPlugin from "@vue/test-utils";
import "mdb-ui-kit/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "mdb-ui-kit/js/mdb.min";

export default {
  name: "App",
  metaInfo() {
    return {
      title: "Träwelling",
      titleTemplate: "%s - " + htmlWebpackPlugin.options.title,
      htmlAttrs: {
        lang: this.i18n.getLocale(),
      },
      meta: [
        { name: "charset", content: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "#c72730" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "theme-color", content: "#c72730" },
        { name: "name", content: this.$appName },

        { name: "copyright", content: "Träwelling Team" },
        {
          name: "description",
          content: this.i18n.get("_.about.block1"),
          vmid: "description",
        },
        {
          name: "keywords",
          content:
            "Träwelling, Twitter, Deutsche, Bahn, Travel, Check-In, Zug, Bus, Tram, Mastodon",
        },
        { name: "audience", conent: "Travellers" },
        { name: "DC.Rights", content: "Träwelling Team" },
        {
          name: "DC.Description",
          content: this.i18n.get("_.about.block1"),
          vmid: "DC.Description",
        },
        { name: "DC.Language", content: this.i18n.getLocale() },
        { property: "og:title", content: this.$appName, vmid: "og:title" },
        { property: "og:site_name", content: this.$appName },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index,follow", vmid: "robots" },
      ],
    };
  },
};
</script>
