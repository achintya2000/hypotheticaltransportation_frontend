<template>
  <nav>
    <v-app-bar color="#FFFFFF" flat app>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-spacer class="hidden-md-and-up"></v-spacer>

      <!-- <router-link to="/" style="text-decoration: none; color: inherit"> -->
      <v-toolbar-title> ConnectWise </v-toolbar-title>
      <!-- </router-link> -->

      <v-spacer></v-spacer>

      <v-btn
        class="hidden-sm-and-down"
        text
        v-for="link in navBarLinks"
        :key="link.title"
        v-show="link.show"
        :to="link.to"
      >
        {{ link.title }}
      </v-btn>

      <login v-if="!loggedIn"></login>
      <logout v-if="loggedIn"></logout>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      app
      class="hidden-md-and-up"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Hypothetical</v-list-item-title>
          <v-list-item-subtitle>Transportation</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="link in navBarLinks"
          :key="link.title"
          v-show="link.show"
          :to="link.to"
        >
          <v-list-item-content>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
          title: "Transit Log",
          to: "/admintransitlog",
          show: this.isAdmin,
        },
        {
          title: "Transit Map",
          to: "/admintransitstatusmap",
          show: this.isAdmin,
        },
        {
          title: "Your Details",
          to: "/parentdetails",
          show:
            this.loggedIn &&
            window.localStorage.getItem("userType") != "student",
        },
        {
          title: "Import",
          to: "/bulkimport",
          show:
            this.isAdmin &&
            window.localStorage.getItem("userType") != "busDriver",
        },
      ];
    },
  },
};
</script>

<style>
</style>