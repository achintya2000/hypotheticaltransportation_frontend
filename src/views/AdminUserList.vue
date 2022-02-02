<template>
  <v-card>
    <v-card-title>
      Your Users
      <v-spacer></v-spacer>

      <create-new-user @usercreated="getRequestAllUsers"></create-new-user>
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
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          dense
          small
          color="blue lighten-2"
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
import CreateNewUser from "../components/CreateNewUser.vue";

export default {
  components: { CreateNewUser },
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
        { text: "Address", value: "address", sortable: false },
        { text: "Students", value: "student_count", sortable: false },
        { text: "Administrator", value: "administrator", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      profiles: [],
    };
  },

  methods: {
    viewItem(item) {
      this.$router.push({ name: "AdminUserDetail", query: { id: item.id } });
    },
    getDisplayUser(item) {
      return {
        name: item.full_name,
        email: item.email,
        address: item.address,
        student_count: item.student_count,
        administrator: item.administrator,
        id: item.id,
      };
    },
    getRequestAllUsers() {
      base_endpoint
        .get("/api/profile/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.profiles = response.data.map(this.getDisplayUser);
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