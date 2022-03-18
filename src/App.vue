<template>
  <v-app>
    <nav-bar v-if="!(isResetPWRoute || isPrintableRoster)" />
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar v-model="snackbar.active" :timeout="3000" :color="snackbar.color">
      {{ snackbar.message}}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.active = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    NavBar,
  },
  
  computed: {
    ...mapState(["snackbar"]),
    isResetPWRoute() {
      return this.$route.name == "ResetPassword";
    },
    isPrintableRoster() {
      return this.$route.name == "PrintableRoster";
    }
  },

  data: () => ({
    //
  }),
};
</script>
