<template>
  <div>
    <NavbarComponent v-on:offCanvas="drawer = !drawer" />
    <main class="py-4">
      <div class="container">
        <slot />
        <OffCanvasNavigation v-model="drawer" />
      </div>
    </main>
    <MobileFooterNav />
    <FooterComponent :class="footerclass" />
  </div>
</template>

<script>
import NavbarComponent from "./NavbarComponent";
import FooterComponent from "./FooterComponent";
import MobileFooterNav from "./MobileFooterNav";
import OffCanvasNavigation from "./OffCanvasNavigation";

export default {
  name: "LayoutBasicNoSidebar",
  props: ["footerclass"],
  components: {
    OffCanvasNavigation,
    MobileFooterNav,
    FooterComponent,
    NavbarComponent,
  },
  data: () => {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped></style>
