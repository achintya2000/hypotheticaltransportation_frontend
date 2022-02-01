<template>
  <nav>
    <v-app-bar color="#FFFFFF" flat app>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-spacer class="hidden-md-and-up"></v-spacer>

      <router-link to="/" style="text-decoration: none; color: inherit">
        <v-toolbar-title> Hypothetical Transportation </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-btn
        class="hidden-sm-and-down"
        text
        v-for="name in names"
        :key="name.title"
      >
        <router-link
          :to="name.to"
          style="text-decoration: none; color: inherit"
          >{{ name.title }}</router-link
        >
      </v-btn>
      
      <v-container v-if="accessToken != null">
        <v-btn
          class="hidden-sm-and-down"
          text
          v-for="loggedInLink in loggedInLinks"
          :key="loggedInLink.title"
        >
          <router-link
            :to="loggedInLink.to"
            style="text-decoration: none; color: inherit"
            >{{ loggedInLink.title }}</router-link
          >
        </v-btn>
      </v-container>
      <login v-if="accessToken == null"></login>
      <logout v-if="accessToken != null"></logout>
    </v-app-bar>
  </nav>
</template>

<script>
import Login from "./Login.vue";
import Logout from "./Logout.vue";
import { mapState } from "vuex";

export default {
  components: { Login, Logout },
  methods: {},
  data() {
    return {
      drawer: false,
      names: [{ title: "About", to: "/about" }],
      loggedInLinks: [
        { title: "School", to: "/adminschoollist" },
        { title: "User", to: "/adminuserlist" },
        { title: "Student", to: "/adminstudentlist" },
        { title: "Route", to: "/adminroutelist" },
        { title: "Your Students", to: "/parentdetails" },
      ],
      contactpoints: [],
    };
  },
  computed: mapState(["accessToken"]),
};
</script>

<style>
</style>