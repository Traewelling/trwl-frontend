<template>
  <footer class="footer mt-auto py-3">
    <div :class="{ 'd-md-block': !hideFooter }" class="container d-none">
      <ChangeLanguageButton :dashboard="dashboard" class="float-end" />
      <nav class="text-muted mb-0">
        <router-link
          :class="{ 'text-white': dashboard }"
          :to="{ name: 'about' }"
          class="footer-link"
        >
          {{ $i18n.get("_.menu.about") }}
        </router-link>
        <router-link
          v-if="$store.getters.isLogged"
          :class="{ 'text-white': dashboard }"
          :to="{ name: 'dashboard.global' }"
          class="footer-link"
        >
          {{ $i18n.get("_.menu.globaldashboard") }}
        </router-link>
        <router-link
          :class="{ 'text-white': dashboard }"
          class="footer-link"
          :to="{ name: 'events' }"
        >
          {{ $i18n.get("_.events") }}
        </router-link>
        <router-link
          :class="{ 'text-white': dashboard }"
          class="footer-link"
          :to="{ name: 'privacy' }"
        >
          {{ $i18n.get("_.menu.privacy") }}
        </router-link>
        <router-link
          :class="{ 'text-white': dashboard }"
          class="footer-link"
          :to="{ name: 'legal' }"
        >
          {{ $i18n.get("_.menu.legal-notice") }}
        </router-link>
        <a
          :class="{ 'text-white': dashboard }"
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
      <p v-if="!dashboard" class="mb-0 text-muted small">
        commit:
        <!--          ToDo: get current commit -->
        <a
          class="text-muted"
          href="https://github.com/Traewelling/traewelling/commit/get_current_git_commit()"
        >
          get_current_git_commit()
        </a>
      </p>
    </div>
  </footer>
</template>

<script>
import { languages } from "@/i18n/translations";
import ChangeLanguageButton from "@/components/ChangeLanguageButton";

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
