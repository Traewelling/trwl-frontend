<template>
  <div class="fill-height">
    <NavbarComponent class="fill-height" v-on:offCanvas="drawer = !drawer" />
    <v-main>
      <v-container fluid>
        <v-row class="mb-3">
          <v-col class="col-3 d-none d-md-block">
            <div style="position: sticky; top: 76px">
              <SidebarNav />
            </div>
          </v-col>
          <v-col class="mt-6 col-md-8">
            <slot />
          </v-col>
          <OffCanvasNavigation v-model="drawer" />
        </v-row>
      </v-container>
      <MobileFooterNav />
      <FooterComponent :hideFooter="false" />
    </v-main>
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
