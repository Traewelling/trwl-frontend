<template>
  <div>
    <NavbarComponent v-on:offCanvas="drawer = !drawer" />
    <main class="py-4">
      <div class="px-4 py-5 mt-n4 hero-header">
        <div class="container white--text">
          <slot name="hero"></slot>
        </div>
      </div>
      <div class="container">
        <slot />
      </div>
      <OffCanvasNavigation v-model="drawer" />
    </main>
    <MobileFooterNav />
    <FooterComponent />
  </div>
</template>

<script>
import NavbarComponent from "./NavbarComponent";
import FooterComponent from "./FooterComponent";
import MobileFooterNav from "./MobileFooterNav";
import OffCanvasNavigation from "./OffCanvasNavigation";

export default {
  name: "HeroLayout",
  components: {
    OffCanvasNavigation,
    FooterComponent,
    NavbarComponent,
    MobileFooterNav,
  },
  data: () => {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped>
.hero-header {
  background-image: url("/img/covers/profile-background.png");
  background-position: center;
  background-color: #c5232c;
  background-size: cover;
}
</style>
