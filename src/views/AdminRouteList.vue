<template>
  <v-card>
    <v-card-title>
      Your Routes
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
      :items="schools"
      :search="search"
      @click:row="viewItem"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          dense
          small
          dark
          v-bind="attrs"
          v-on="on"
          @click="viewItem(item)"
        >
          Details
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions} from "vuex";
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
        { text: "Description", value: "description", sortable: false },
        { text: "# of Students", value: "student_count" },
      ],
      schools: [],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(item) {
      this.$router.push({ name: "AdminRouteDetail", query: { id: item.id } });
    },
    getDisplayRoute(item) {
      return {
        name: item.name,
        school: item.school,
        description: item.description,
        student_count: item.student_count,
        id: item.id,
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
          this.showSnackBar();
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