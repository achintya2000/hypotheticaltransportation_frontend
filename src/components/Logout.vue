<template>
  <v-btn outlined @click="logout"> Logout </v-btn>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("userLogout").then(() => {
        this.$router.push({ name: "Home" });
      });
    },
  },
};
</script>

<style>
</style>