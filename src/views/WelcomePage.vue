<template>
  <div>
    <div class="videoContainer">
      <div class="overlay"></div>
      <video autoplay class="fullscreen-bg__video" loop muted>
        <source src="/img/vid2.mp4" type="video/mp4" />
      </video>
    </div>
    <v-row style="position: absolute" class="mx-lg-16 mt-md-16 mx-3 mt-5">
      <v-col class="white--text col-lg-5 d-md-block">
        <img alt="logo" class="logo" src="/img/icons/logo.svg" />
        <span class="text-h3">#Träwelling</span>
        <p>{{ $i18n.get("_.about.block1") }}</p>
        <v-btn :to="{ name: 'about' }" color="white">
          {{ $i18n.get("_.menu.about") }}
        </v-btn>
      </v-col>
      <v-col class="offset-lg-3 offset-0 col-12 col-md-4">
        <Login />
      </v-col>
    </v-row>
    <v-row>
      <FooterComponent
        style="width: 100%; bottom: 10%; position: fixed"
        class="white--text"
        :dashboard="true"
      />
    </v-row>
  </div>
</template>

<script>
import FooterComponent from "@/components/layouts/FooterComponent";
import Login from "@/components/Login";

export default {
  name: "WelcomePage",
  components: { FooterComponent, Login },
  data() {
    return {
      email: null,
      password: null,
      hasError: false,
    };
  },
  mounted() {
    //
  },
};
</script>
<style>
html,
body {
  height: 100%;
}

#app {
  height: 100%;
}
</style>
<style scoped>
.logo {
  height: 50px;
}

.videoContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  background-attachment: scroll;
  overflow: hidden;
}

.videoContainer video {
  min-width: 100%;
  min-height: 100%;
  position: relative;
  z-index: 1;
  background-image: url("https://images.pexels.com/photos/5387999/pexels-photo-5387999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
  filter: grayscale(100%); /* Standard CSS */
  -webkit-filter: grayscale(100%); /* CSS for Webkit Browsers */
  filter: url(/elements/grayscale.svg#desaturate); /* Firefox 4-34 */
  filter: gray; /* Internet Explorer IE6-9 */
  -webkit-filter: grayscale(1); /* Old WebKit Browsers */
}

.videoContainer .overlay {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #a20b11;
  opacity: 0.8;
}
</style>
