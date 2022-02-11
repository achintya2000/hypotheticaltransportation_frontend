<template>
  <v-card height=100%>
    <v-card-title>
      Your Students
      <v-spacer></v-spacer>
      <create-new-student
        @studentcreated="getRequestAllStudents(); snackbar = true"
      ></create-new-student>

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
      :items="students"
      :search="search"
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
    <v-snackbar
      v-model="snackbar"
      outlines
      bottom
      color="success"
    >
      A new student has been created

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import CreateNewStudent from "../components/CreateNewStudent.vue";

export default {
  components: { CreateNewStudent },
  data() {
    return {
      search: "",
      snackbar: false,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Student ID", value: "sid" },
        { text: "School", value: "school" },
        { text: "Route", value: "route" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      students: [],
    };
  },
  methods: {
    viewItem(item) {
      this.$router.push({ name: "AdminStudentDetail", query: { id: item.id } });
    },
    getDisplayStudent(item) {
      return {
        name: item.name,
        sid: item.sid,
        school: item.school,
        route: item.route,
        id: item.id,
      };
    },
    getRequestAllStudents() {
      base_endpoint
        .get("/api/student/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudent);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  //computed: mapState(["APIData"]),
  created() {
    this.getRequestAllStudents();
  },
};
</script>

<style>
.v-snackbar {
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translate(-50%, -50%);
  margin: 0 auto; 
}
</style>