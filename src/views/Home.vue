<template>
  <v-container>
    <nav-bar />
    <hello-world />
  </v-container>
</template>

<script>
import HelloWorld from "../components/HelloWorld";
import NavBar from "../components/NavBar.vue";

export default {
  name: "Home",

  components: {
    HelloWorld,
    NavBar,
  },
};
</script>
