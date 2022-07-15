<template>
  <v-card>
    <v-card-title>
      {{ $i18n.get("_.user.login") }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn color="blue" dark>
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn color="black" dark>
            <v-icon>mdi-apple</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn color="blue darken-2" dark>
            <v-icon>mdi-mastodon</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider />
        </v-col>
        <v-col class="text-center col-1">Or</v-col>
        <!--ToDo i18n-->
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-form @submit.prevent="authenticate">
        <v-text-field
          :label="$i18n.get('_.user.login-credentials')"
          v-model="login"
          autocapitalize="none"
          autocomplete="username"
          autofocus="autofocus"
          required
        />
        <v-text-field
          type="password"
          required
          v-model="password"
          :label="$i18n.get('_.user.password')"
        />
        <v-btn type="submit" block :loading="loginLoading">
          {{ $i18n.get("_.user.login") }}
        </v-btn>
      </v-form>
      <div class="text-center mt-2">
        <a class="text-dark" href="#">
          {{ $i18n.get("_.user.forgot-password") }}
        </a>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      login: null,
      password: null,
      hasError: false,
      loginLoading: false,
    };
  },
  methods: {
    authenticate() {
      this.$store
        .dispatch("login", {
          login: this.login,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "dashboard" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}
</style>
