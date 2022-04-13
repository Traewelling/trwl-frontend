<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <v-text-field
        type="email"
        name="email"
        v-model="email"
        placeholder="User"
        persistent-placeholder
      />
      <v-text-field
        type="password"
        name="password"
        v-model="password"
        placeholder="Password"
        persistent-placeholder
      />
      <v-btn type="submit">Login</v-btn>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    login() {
      this.$store
        .dispatch("login", {
          login: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "About" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
