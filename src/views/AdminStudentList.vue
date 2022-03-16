<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title>
      Your Students
      <v-spacer></v-spacer>
      <create-new-student
        @studentcreated="getRequestAllStudents(); snackbar = true"
        v-if="this.userType!='busDriver'"
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
      @click:row="viewItem"
      class="row-pointer"
    >
    <template v-slot:[`item.studentInRange`]="{ item }">
        <v-icon v-if="item.studentInRange==false" color="red"> mdi-close </v-icon>
        <v-icon v-if="item.studentInRange==true"> mdi-check </v-icon>
      </template>
      
      <template v-slot:[`item.route`]="{ item }">
        <div v-if="item.route">{{item.route}}</div>
        <div v-if="!item.route" style="color:red;">No Route</div>
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
import { mapActions} from "vuex";
export default {
  components: { CreateNewStudent },
  data() {
    return {
      search: "",
      snackbar: false,
      userType: "",
      userID: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Student ID", value: "sid" },
        { text: "School", value: "school" },
        { text: "Parent Name", value: "parentName", sortable: false  },
        { text: "Parent Phone", value: "parentPhone", sortable: false  },
        { text: "Route", value: "route" },
        { text: "In-Range Status", value: "studentInRange", sortable: false },
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
        studentInRange: item.inRange,
        parentName: item.parent,
        parentPhone: item.phone,
      };
    },
    getRequestAllStudents() {
      base_endpoint
        .get("/api/student/getall/" + this.userID, {
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
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
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
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {  
  cursor: pointer;
}
</style>