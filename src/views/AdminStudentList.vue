<template>
  <v-card>
    <v-card-title>
      Your Students
      <v-spacer></v-spacer>
      <create-new-student
        @studentcreated="getRequestAllStudents"
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
      :sort-by="['sid']"
      :sort-desc="[false, true]"
    >
      
      <template v-slot:[`item.route`]="{ item }">
        <div v-if="item.route">{{item.route}}</div>
        <div v-if="!item.route">No Route</div>
      </template>
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
import CreateNewStudent from "../components/CreateNewStudent.vue";
import { mapActions} from "vuex";
export default {
  components: { CreateNewStudent },
  data() {
    return {
      search: "",
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
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
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
          this.showSnackBar();
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
</style>