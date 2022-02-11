<template>
  <v-card>
    <v-card-title class="font-weight-black">
      {{ studentName }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Modify </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> Modify </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="newStudentName"
                label="Student Name"
                :rules="studentNameValidateArray"
                required
              ></v-text-field>

              <v-text-field
                v-model="newStudentId"
                label="Student ID"
                :rules="studentIDValidateArray"
                required
              ></v-text-field>

              <v-autocomplete
                v-model="parent"
                :items="parentItems"
                item-text="full_name"
                label="Parent"
                :rules="studentParentValidateArray"
                return-object
              ></v-autocomplete>

              <v-autocomplete
                v-model="school"
                :items="schoolItems"
                item-text="name"
                label="School Name"
                :rules="studentSchoolValidateArray"
                return-object
              ></v-autocomplete>

              <v-btn
                color="success"
                class="mr-4"
                @click="updateStudent"
                :disabled="!valid"
                type="submit"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog2 = false;
                  newStudentName = studentName;
                  newStudentId = studentId;
                  parent = studentParent;
                  school = studentSchool;
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Delete </v-btn>
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
    </v-card-title>
    <v-card-subtitle> 
      <span class="black--text font-weight-bold"> ID: </span><span class="black--text"> {{ studentId }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> School: </span> 
      <v-btn text 
        @click="viewSchool(studentSchoolId)"
        style="text-transform:none !important">
        {{ studentSchool }} 
        </v-btn>

    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Route: </span>
      <v-btn text 
        @click="viewRoute(studentRouteId)"
        style="text-transform:none !important"
        v-if="studentRoute != 'No route assigned'">
        {{ studentRoute }} 
        </v-btn>
        
        <v-btn text 
        style="text-transform:none !important"
        v-if="studentRoute == 'No route assigned'">
        No Route Assigned
        </v-btn>

    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Parent: </span>
      <v-btn text 
        @click="viewSchool(studentParentId)"
        style="text-transform:none !important">
        {{ studentParent }} 
        </v-btn>
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
      valid: false,
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
      studentNameValidateArray: [this.studentNameValidate],
      studentIDValidateArray: [this.studentIDValidate],
      studentSchoolValidateArray: [this.studentSchoolValidate],
      studentParentValidateArray: [this.studentParentValidate],
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
        .get("/api/profile/getallwithaddress", {
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
      this.dialog2 = false;
      base_endpoint
        .patch(
          "/api/student/update/" + this.$route.query.id,
          {
            full_name: this.newStudentName,
            sid: this.newStudentId,
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
        .then((response) => {
          console.log(response);
          this.getStudentInfo();
        })

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
          console.log(response);
          this.$router.push({ name: "AdminStudentList" });
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
    studentNameValidate() {
      if (this.newStudentName == null || this.newStudentName == "") {
        return "Student Name is required";
      } else {
        return true;
      }
    },
    studentIDValidate() {
      if (this.newStudentId == null || this.newStudentId == "") {
        return "Student ID is required";
      } else if (isNaN(this.newStudentId) == true) {
        return "Student ID must be a number";
      } else if (isNaN(this.newStudentId) == false) {
        if (parseInt(this.newStudentId) < 0) {
          return "Student ID must be a postive number";
        }
      } else {
        return true;
      }
    },
    studentSchoolValidate() {
      if (this.school == null || this.school == "") {
        return "Student school is required";
      } else {
        return true;
      }
    },
    studentParentValidate() {
      if (this.parent == null || this.parent == "") {
        return "Student's parent is required";
      } else {
        return true;
      }
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