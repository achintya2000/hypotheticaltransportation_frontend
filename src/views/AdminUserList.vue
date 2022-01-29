<template>
  <v-card>
    <v-card-title>
      Your Users
      <v-spacer></v-spacer>

      <create-new-user
        @usercreated="getRequestAllUsers"
      ></create-new-user>

      <v-btn href="/#/parentdetails">Add User/Students</v-btn>
      <v-spacer></v-spacer>
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
      :items="profiles"
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
        { text: "Email", value: "email" },
        { text: "Address", value: "address" },
        { text: "Students", value: "student_count" },
        { text: "Administrator", value: "administrator" },
      ],
      profiles: [],
    };
  },

  methods: {
    getDisplayUser(item) {
      return {
        name: item.full_name,
        email: item.email,
        address: item.address,
        student_count: item.student_count,
        administrator: item.administrator
      };
    },
    getRequestAllRoutes() {
      console.log("GOT HERE!!!");
      base_endpoint
        .get("/api/profile/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.profiles = response.data.map(this.getDisplayUser);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  //computed: mapState(["APIData"]),
  created() {
    this.getRequestAllUsers();
  },
};
</script>

<style>
</style>