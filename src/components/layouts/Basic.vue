<template>
  <div>
    <NavbarComponent v-on:offCanvas="drawer = !drawer" />
    <main>
      <div class="container">
        <div class="row mb-3 justify-content-around">
          <div class="col-md-3 d-none d-md-block">
            <SidebarNav />
          </div>
          <slot />
        </div>
        <OffCanvasNavigation v-model="drawer" />
      </div>
    </main>
    <MobileFooterNav />
    <FooterComponent :hideFooter="false" />
  </div>
</template>

<script>
import NavbarComponent from "./NavbarComponent";
import FooterComponent from "./FooterComponent";
import MobileFooterNav from "./MobileFooterNav";
import OffCanvasNavigation from "./OffCanvasNavigation";
import SidebarNav from "./SidebarNav";

export default {
  name: "LayoutBasic",
  components: {
    SidebarNav,
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
