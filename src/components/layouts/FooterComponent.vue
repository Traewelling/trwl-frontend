<template>
  <footer class="footer mt-auto py-3">
    <v-row :class="{ 'd-md-flex': !hideFooter }" class="d-none px-16">
      <v-col class="col-8">
        <nav class="grey--text text--darken-1 mb-0">
          <router-link
            :class="{ 'white--text': dashboard }"
            :to="{ name: 'about' }"
            class="footer-link"
          >
            {{ $i18n.get("_.menu.about") }}
          </router-link>
          <router-link
            v-if="$store.state.authenticated"
            :class="{ 'white--text': dashboard }"
            :to="{ name: 'dashboard.global' }"
            class="footer-link"
          >
            {{ $i18n.get("_.menu.globaldashboard") }}
          </router-link>
          <router-link
            :class="{ 'white--text': dashboard }"
            class="footer-link"
            :to="{ name: 'events' }"
          >
            {{ $i18n.get("_.events") }}
          </router-link>
          <router-link
            :class="{ 'white--text': dashboard }"
            class="footer-link"
            :to="{ name: 'privacy' }"
          >
            {{ $i18n.get("_.menu.privacy") }}
          </router-link>
          <router-link
            :class="{ 'white--text': dashboard }"
            class="footer-link"
            :to="{ name: 'legal' }"
          >
            {{ $i18n.get("_.menu.legal-notice") }}
          </router-link>
          <a
            :class="{ 'white--text': dashboard }"
            class="footer-link"
            href="https://blog.traewelling.de"
            target="blog"
          >
            {{ $i18n.get("_.menu.blog") }}
          </a>
        </nav>
        <p
          v-if="!dashboard"
          class="mb-0"
          v-html="$i18n.get('_.menu.developed')"
        ></p>
        <p class="mb-0">&copy; {{ moment().format("Y") }} Tr&auml;welling</p>
        <p v-if="!dashboard" class="mb-0 grey--text text--darken-1 small">
          commit:
          <!--          ToDo: get current commit -->
          <a
            class="grey--text text--darken-1"
            href="https://github.com/Traewelling/traewelling/commit/get_current_git_commit()"
          >
            get_current_git_commit()
          </a>
        </p>
      </v-col>
      <v-col class="col-3 justify-end">
        <ChangeLanguageButton :dashboard="dashboard" class="float-end" />
      </v-col>
    </v-row>
  </footer>
</template>

<script>
import { languages } from "@/i18n/translations";
import ChangeLanguageButton from "@/components/buttons/ChangeLanguageButton";

export default {
  name: "FooterComponent",
  data() {
    return {
      langs: languages,
    };
  },
  components: { ChangeLanguageButton },
  props: {
    dashboard: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.footer-link {
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
