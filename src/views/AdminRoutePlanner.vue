<template>
    <v-card>
  <v-card width = 40%>
    <v-card-title>
      Staples High School Routes
    </v-card-title>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="schools"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    ></v-data-table>
    <v-btn color="green lighten-2" dark v-bind="attrs" v-on="on">
            Add New Route
          </v-btn>
  </v-card>
  <GmapMap :center="center" :zoom="12" style="width: 50%; height: 400px">
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center = m.position"
      />
    </GmapMap>
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
        { text: "Description", value: "description" },
      ],
      schools: [],
    };
  },
  methods: {
    getDisplayRoute(item) {
      return {
        name: item.name,
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