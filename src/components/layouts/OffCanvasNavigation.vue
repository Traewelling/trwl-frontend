<template>
  <v-navigation-drawer
    v-model="showDrawer"
    absolute
    temporary
  >
    <template v-slot:prepend v-if="$store.state.authenticated">
      <router-link
        tag="v-list-item"
        :to="{
          name: 'profile',
          params: { username: $store.state.user.username },
        }"
        two-line
      >
        <v-list-item-avatar>
          <img
            :alt="$i18n.get('_.settings.picture')"
            :src="$store.state.user.profilePicture"
            class="rounded-circle me-2"
            height="32"
            width="32"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="$store.state.user.displayName" />
          <v-list-item-subtitle v-text="`@` + $store.state.user.username" />
        </v-list-item-content>
      </router-link>
      <v-row dense>
        <v-col v-for="item in stats" :key="item.name" class="text-center">
          <v-icon>{{ item.icon }}</v-icon
          ><br />
          <span class="d-sr-only">{{ item.name }}</span>
          {{ item.content }}
        </v-col>
      </v-row>
      <v-divider />
    </template>
    <SidebarNavContent :desktop="true" />
    <v-divider />
    <SidebarLinkCloud />
  </v-navigation-drawer>
</template>

<script>
import SidebarNavContent from "./SidebarNavContent";
import SidebarLinkCloud from "@/components/layouts/SidebarLinkCloud";

export default {
  name: "offcanvasNavigation",
  components: { SidebarLinkCloud, SidebarNavContent },
  props: {
    value: null,
  },
  data() {
    return {
      showDrawer: this.value,
    };
  },
  methods: {
    handleState() {
      this.$emit("input", this.showDrawer);
    },
  },
  watch: {
    value: function () {
      this.showDrawer = this.value;
    },
    showDrawer: function () {
      this.handleState();
    },
  },
};
</script>

<style scoped></style>
