<template>
  <v-card>
    <v-card-title>
      Your Routes

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="schools"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    ></v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "School", value: "school" },
        { text: "Description", value: "description" },
      ],
      schools: [],
    };
  },
  methods: {
    getDisplayRoute(item) {
      return {
        name: item.name,
        school: item.school,
        description: item.description,
      };
    },
    getRequestAllRoutes() {
      base_endpoint
        .get("/api/route/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schools = response.data.map(this.getDisplayRoute);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  //computed: mapState(["APIData"]),
  created() {
    this.getRequestAllRoutes();
  },
};
</script>

<style>
</style>