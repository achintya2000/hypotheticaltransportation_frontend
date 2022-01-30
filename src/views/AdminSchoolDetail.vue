<template>
  <v-card>
    <v-card-title>
      {{ schoolName }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Modify
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> Modify </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="name2"
                :rules="name2Rules"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="address"
                :rules="addressRules"
                label="Address"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn color="warning" @click="dialog2 = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Delete School
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-subtitle>
            Are you sure you want to delete the school? To continue, type the
            name of the school below
          </v-card-subtitle>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="School Name"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Submit
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn color="warning" @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle> {{ schoolAddress }} </v-card-subtitle>
    <v-card-title>
      Bus Routes
      <v-spacer></v-spacer>
      <v-btn outlined>Plan New Route</v-btn>
    </v-card-title>
    <v-data-table
      :headers="routeHeaders"
      :items="busRoutes"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="viewRoute(item)"> mdi-eye </v-icon>
      </template>
    </v-data-table>

    <v-card-title> Students </v-card-title>

    <v-data-table
      :headers="studentsHeaders"
      :items="students"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="viewStudent(item)"> mdi-eye </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
  data() {
    var theSchoolsName = "Staples High School";
    return {
      schoolName: "",
      schoolAddress: "",
      search: "",
      valid: true,
      dialog: false,
      dialog2: false,
      name2: "Old Name",
      name2Rules: [(v) => !!v || "Name is required"],
      address: "Old Address",
      addressRules: [(v) => !!v || "Address is required"],
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) =>
          (v.toLowerCase() && v == theSchoolsName.toLowerCase()) ||
          "You must retype the name exactly",
      ],
      routeHeaders: [
        {
          text: "Name",
          align: "start",
          value: "routeName",
        },
        { text: "Description", value: "routeDescription" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      busRoutes: [],
      studentsHeaders: [
        {
          text: "Name",
          align: "start",
          value: "studentName",
        },
        { text: "Route", value: "studentRoute" },
        { text: "Parent", value: "studentParent" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      students: [],
    };
  },
  methods: {
    viewRoute(item) {
      this.$router.push({
        name: "AdminRouteDetail",
        query: { id: item.routeId },
      });
    },
    viewStudent(item) {
      this.$router.push({
        name: "AdminStudentDetail",
        query: { id: item.studentId },
      });
    },
    getSchoolInfo() {
      base_endpoint
        .get("/api/school/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolName = response.data.name;
          this.schoolAddress = response.data.address;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDisplayRoutes(item) {
      return {
        routeId: item.id,
        routeName: item.name,
        routeDescription: item.description,
      };
    },
    getSchoolRoutes() {
      base_endpoint
        .get("/api/route/getallfromschool/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.busRoutes = response.data.map(this.getDisplayRoutes);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDisplayStudents(item) {
      return {
        studentId: item.id,
        studentName: item.name,
        studentRoute: item.route,
        studentParent: item.parent,
      };
    },
    getStudents() {
      base_endpoint
        .get("/api/student/getallfromschool/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudents);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  created() {
    this.getSchoolInfo();
    this.getSchoolRoutes();
    this.getStudents();
  },
};
</script>

<style>
</style>