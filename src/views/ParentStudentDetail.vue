<template>
  <v-card>
    <v-card-title class="font-weight-black">
      {{ studentName }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500"> </v-dialog>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle> 
      <span class="black--text font-weight-bold"> ID: </span><span class="black--text"> {{ studentId }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> School: </span><span class="black--text"> {{ studentSchool }} </span>
    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Route: </span><span class="black--text"> {{ studentRoute }} </span>
    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Parent: </span><span class="black--text"> {{ studentParent }} </span>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      studentName: "",
      dialog: false,
      dialog2: false,
      name: "Old Name",
      nameRules: [(v) => !!v || "Name is required"],
      studentId: "", 
      studentIDRules: [(v) => !!v || "Student ID is required"],
      parentValue: "Old Parent",
      parentRules: [(v) => !!v || "Parent is required"],
      schoolValue: "Old School",
      // schoolRules: [(v) => !!v || "School is required"],
      busRouteValue: "Old Bus Route",
      // busRouteRules: [(v) => !!v || "Bus Route is required"],

      headers: [
        {
          text: "Name",
          align: "start",
          value: "schoolName",
        },
        { text: "Address", value: "address" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      schoolItems: [],
      parentItems: [],
      school: null,
      parent: null,
      studentSchool: "",
      studentRoute: "",
      studentParent: "",
      newStudentName: "",
      newStudentId: "",
      newStudentSchool: "",
      newStudentParent: "",
    };
  },
  methods: {
    getStudentInfo() {
      base_endpoint
        .get("/api/student/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.studentName = response.data.full_name;
          this.newStudentName = response.data.full_name;
          this.studentId = response.data.sid;
          this.newStudentId = response.data.sid;
          this.studentSchool = response.data.school;
          this.newStudentSchool = response.data.school;
          this.studentRoute = response.data.route;
          this.studentParent = response.data.parent;
          this.newStudentParent = response.data.parent;
          this.studentSchoolId = response.data.school_id;
          this.studentRouteId = response.data.route_id;
          this.studentParentId = response.data.parent_id;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    validate() {
      this.$refs.form.validate();
    },
  },
  created() {
    this.getStudentInfo();
  },
};
</script>

<style>
</style>