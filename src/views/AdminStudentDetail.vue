<template>
  <v-card>
    <v-card-title>
      {{ studentName }}
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
            <v-form ref="form">
              <v-text-field
                v-model="studentName"
                label="Student Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="studentId"
                label="Student ID"
                required
              ></v-text-field>

              <v-autocomplete
                v-model="parent"
                :items="parentItems"
                item-text="full_name"
                label="Parent"
                return-object
              ></v-autocomplete>

              <v-autocomplete
                v-model="school"
                :items="schoolItems"
                item-text="name"
                label="School Name"
                return-object
              ></v-autocomplete>

              <v-btn color="success" class="mr-4" @click="updateStudent">
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
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-spacer></v-spacer>

              <v-btn color="error" class="mr-4" @click="validateDelete">
                Yes, Delete
              </v-btn>

              <v-btn color="success" @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle> ID: {{ studentId }} </v-card-subtitle>
    <v-card-subtitle>
      School: {{ studentSchool }}

      <v-icon small @click="viewSchool(studentSchoolId)"> mdi-eye </v-icon>
    </v-card-subtitle>

    <v-card-subtitle>
      Route: {{ studentRoute }}

      <v-icon small @click="viewRoute(studentRouteId)"> mdi-eye </v-icon>
    </v-card-subtitle>

    <v-card-subtitle>
      Parent: {{ studentParent }}

      <v-icon small @click="viewParent(studentParentId)"> mdi-eye </v-icon>
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
          this.studentId = response.data.sid;
          this.studentSchool = response.data.school;
          this.studentRoute = response.data.route;
          this.studentParent = response.data.parent;
          this.studentSchoolId = response.data.school_id;
          this.studentRouteId = response.data.route_id;
          this.studentParentId = response.data.parent_id;

          this.getSchools();
          this.getParents();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDisplaySchools(item) {
      return {
        name: item.name,
        address: item.address,
        id: item.id,
      };
    },
    getSchools() {
      base_endpoint
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolItems = response.data.map(this.getDisplaySchools);

          this.schoolItems.forEach((item) => {
            if (this.studentSchoolId == item.id) {
              this.school = item;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDisplayParents(item) {
      return {
        full_name: item.full_name,
        id: item.id,
      };
    },
    getParents() {
      base_endpoint
        .get("/api/profile/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.parentItems = response.data.map(this.getDisplayParents);

          this.parentItems.forEach((item) => {
            if (this.studentParentId == item.id) {
              this.parent = item;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateStudent() {
      console.log(this.school.id);
      console.log(this.parent.id);
      base_endpoint
        .patch(
          "/api/student/update/" + this.$route.query.id,
          {
            full_name: this.studentName,
            sid: this.studentId,
            school: this.school.id,
            route: this.studentRoute,
            parent: this.parent.id,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )

        .catch((err) => {
          console.log(err);
        });
    },

    viewSchool(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item } });
    },
    viewRoute(item) {
      this.$router.push({ name: "AdminRouteDetail", query: { id: item } });
    },
    viewParent(item) {
      this.$router.push({ name: "AdminUserDetail", query: { id: item } });
    },
    validate() {
      this.$refs.form.validate();
    },
    submitDataForDelete() {
      base_endpoint
        .delete("/api/student/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validateDelete() {
      this.$refs.form.validate();
      this.submitDataForDelete();
      this.dialog = false;
      this.$emit(
        "schoolmodified",
        "A school has been modified and sent to database"
      );
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  created() {
    this.getStudentInfo();
  },
};
</script>

<style>
</style>