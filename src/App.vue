<template>
  <v-app>
    <router-view data-app></router-view>
  </v-app>
</template>

<script>
import "mdb-ui-kit/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "mdb-ui-kit/js/mdb.min";
import "@mdi/font/css/materialdesignicons.min.css";

export default {
  name: "App",
  metaInfo() {
    return {
      title: "Träwelling",
      titleTemplate: "%s - " + this.$appName,
      htmlAttrs: {
        lang: this.$i18n.getLocale(),
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
          content: this.$i18n.get("_.about.block1"),
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
          content: this.$i18n.get("_.about.block1"),
          vmid: "DC.Description",
        },
        { name: "DC.Language", content: this.$i18n.getLocale() },
        { property: "og:title", content: this.$appName, vmid: "og:title" },
        { property: "og:site_name", content: this.$appName },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index,follow", vmid: "robots" },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "sass/app";
// Body
$body-bg: #f8fafc;

// Typography
/*$font-family-sans-serif: "Nunito", sans-serif;*/
$font-size-base: 0.9rem;
$line-height-base: 1.6;

body {
  background: rgb(248, 250, 252);
  overflow-x: hidden;
}

.product-icon {
  width: 1em;
  height: 1em;
}

.image-box {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    border-radius: 50%;
  }
}

.search-image-box {
  display: block !important;
}

ul.timeline {
  list-style-type: none;
  position: relative;
  &:last-child {
    background: transparent !important;
  }
  > li {
    margin: 20px 0;
    padding-left: 20px;

    > i.trwl-bulletpoint {
      content: " ";
      background: #fff;
      display: inline-block;
      position: absolute;
      border-radius: 50%;
      border: 3px solid $bahnrot;
      left: 20px;
      width: 20px;
      height: 20px;
      z-index: 2;
    }

    &:first-child:before {
      content: " ";
      background: #d4d9df;
      display: inline-block;
      left: 29px;
      width: 2px;
      height: 90%;
      position: absolute;
      z-index: 2;
    }

    &:last-child {
      line-height: 1;
    }
  }
}

ul.timeline > li p.status-body:before,
p.train-status:before {
  font-family: FontAwesome;
  display: inline-block;
  padding-right: 6px;
  vertical-align: middle;
}

.connection {
  background: #f5f5f5;
}

.bg-trwl {
  background-color: $trwlRot !important;
}

.navbar-dark .navbar-brand {
  font-weight: bold !important;
}

.dropdown-menu {
  z-index: 2000;
}

.nav-tabs {
  border-bottom: 0;
}

.text-trwl {
  color: $trwlRot !important;
}
</style>
