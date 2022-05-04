<template>
  <v-container>
    <p>
      <router-link v-for="link in linkCloud" :to="link.route" :key="link.route">
        {{ link.text }}
      </router-link>
    </p>
    <p v-html="$i18n.get('_.menu.developed')" />
    <p class="mb-0">&copy; {{ moment().format("Y") }} Tr&auml;welling</p>
    <p class="mb-0 grey--text text--darken-1 small">
      commit:
      <!--          ToDo: get current commit -->
      <a
        class="grey--text text--darken-1"
        href="https://github.com/Traewelling/traewelling/commit/get_current_git_commit()"
      >
        get_current_git_commit()
      </a>
    </p>
  </v-container>
</template>

<script>
export default {
  name: "SidebarLinkCloud",
  data() {
    return {
      linkCloud: [
        { text: this.$i18n.get("_.menu.about"), route: "about" },
        { text: this.$i18n.get("_.menu.blog"), route: "blog" },
        { text: this.$i18n.get("_.menu.privacy"), route: "privacy" },
        { text: this.$i18n.get("_.menu.legal-notice"), route: "legal" },
      ],
    };
  },
};
</script>

<style scoped></style>
