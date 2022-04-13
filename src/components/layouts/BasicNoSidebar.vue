<template>
  <div>
    <NavbarComponent />
    <main class="py-4">
      <div class="container">
        <slot />
        <OffCanvasNavigation />
      </div>
    </main>
    <FooterComponent :class="footerclass" />
    <MobileFooterNav />
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
};
</script>

<style scoped></style>
