<template>
  <v-card>
    <v-card-title>
      Your Schools
      <v-spacer></v-spacer>

      <create-new-school
        @schoolcreated="getRequestAllSchools"
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

    <v-data-table
      :headers="headers"
      :items="addresses"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    ></v-data-table>
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
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Address", value: "address" },
      ],
      addresses: [],
      // addresses: [
      //   {
      //     name: "Frozen Yogurt",
      //     address: 159,
      //   },
      //   {
      //     name: "Ice cream sandwich",
      //     address: 237,
      //   },
      //   {
      //     name: "Eclair",
      //     address: 262,
      //   },
      //   {
      //     name: "Cupcake",
      //     address: 305,
      //   },
      //   {
      //     name: "Gingerbread",
      //     address: 356,
      //   },
      //   {
      //     name: "Jelly bean",
      //     address: 375,
      //   },
      //   {
      //     name: "Lollipop",
      //     address: 392,
      //   },
      //   {
      //     name: "Honeycomb",
      //     address: 408,
      //   },
      //   {
      //     name: "Donut",
      //     address: 452,
      //   },
      //   {
      //     name: "KitKat",
      //     address: 518,
      //   },
      // ],
    };
  },
  methods: {
    getDisplayAddress(item) {
      return {
        name: item.name,
        address: item.address,
      };
    },
    getRequestAllSchools() {
      console.log("GOT HERE!!!");
      base_endpoint
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.addresses = response.data.map(this.getDisplayAddress);
          //this.$store.state.addresses = response.data;
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