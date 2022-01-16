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
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app class="hidden-md-and-up">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Application</v-list-item-title>
          <v-list-item-subtitle>subtext</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="name in names" :key="name.title" link :to="name.to">
          <v-list-item-content>
            <v-list-item-title>{{ name.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="contact in contactpoints"
          :key="contact.title"
          link
          :href="contact.link"
          target="_blank"
        >
          <v-list-item-icon>
            <v-icon>{{ contact.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ contact.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      names: [{ title: "Login", to: "/login" }],
      contactpoints: [],
    };
  },
};
</script>

<style>
</style>