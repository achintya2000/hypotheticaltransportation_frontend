<template>
  <v-card height="100%">
    <v-card-title>
      Your Schools
      <v-spacer></v-spacer>

      <create-new-school
        @schoolcreated="
          getRequestAllSchools();
          snackbar = true;
        "
      ></create-new-school>

      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table :headers="headers" :items="addresses" :search="search">
    </v-data-table>
    <v-snackbar v-model="snackbar" outlines color="success">
      A new school has been created

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
//import { mapState } from "vuex";
import { base_endpoint } from "../services/axios-api";
import CreateNewSchool from "../components/CreateNewSchool.vue";

export default {
  components: { CreateNewSchool },
  data() {
    return {
      snackbar: false,
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Address", value: "address", sortable: false },
      ],
      addresses: [],
    };
  },
  methods: {
    viewItem(row) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: row.id } });
    },
    getDisplayAddress(item) {
      return {
        name: item.name,
        address: item.address,
        id: item.id,
      };
    },
    getRequestAllSchools() {
      base_endpoint
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.addresses = response.data.map(this.getDisplayAddress);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  //computed: mapState(["APIData"]),
  created() {
    this.getRequestAllSchools();
  },
};
</script>

<style>
</style>