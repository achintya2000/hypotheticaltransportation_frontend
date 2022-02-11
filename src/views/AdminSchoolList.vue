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
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn dense small dark @click="viewItem(item)"> Details </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
//import { mapState } from "vuex";
import { base_endpoint } from "../services/axios-api";
import { mapActions} from "vuex";
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
        { text: "Address", value: "address", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      addresses: [],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item.id } });
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
          this.showSnackBar();
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