<template>
  <nav>
    <v-app-bar color="#FFFFFF" flat app>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-spacer class="hidden-md-and-up"></v-spacer>

      <router-link to="/" style="text-decoration: none; color: inherit">
        <v-toolbar-title> ConnectWise </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-btn
        class="hidden-sm-and-down"
        text
        v-for="link in navBarLinks"
        :key="link.title"
        v-show="link.show"
      >
        <router-link
          :to="link.to"
          style="text-decoration: none; color: inherit"
          >{{ link.title }}</router-link
        >
      </v-btn>

      <login v-if="!loggedIn"></login>
      <logout v-if="loggedIn"></logout>
    </v-app-bar>
  </nav>
</template>

<script>
import Login from "./Login.vue";
import Logout from "./Logout.vue";
import { mapGetters } from "vuex";

export default {
  components: { Login, Logout },
  methods: {},
  data() {
    return {
      drawer: false,
      parentLinks: [{ title: "Your Students", to: "/parentdetails" }],
      contactpoints: [],
    };
  },
  computed: {
    ...mapGetters(["loggedIn", "isAdmin"]),
    navBarLinks() {
      return [
        {
          title: "School",
          to: "/adminschoollist",
          show: this.isAdmin,
        },
        {
          title: "User",
          to: "/adminuserlist",
          show: this.isAdmin,
        },
        {
          title: "Student",
          to: "/adminstudentlist",
          show: this.isAdmin,
        },
        {
          title: "Route",
          to: "/adminroutelist",
          show: this.isAdmin,
        },
        {
          title: "Your Students",
          to: "/parentdetails",
          show: this.loggedIn,
        },
      ];
    },
  },
};
</script>

<style>
</style>