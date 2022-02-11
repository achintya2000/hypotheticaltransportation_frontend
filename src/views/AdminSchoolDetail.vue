<template>
  <v-card>
    <v-card-title class="font-weight-black">
      {{ schoolName }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Modify </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> Modify </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid2" lazy-validation>
              <v-text-field
                v-model="newSchoolName"
                :rules="nameValidateArray"
                label="Name"
                required
              ></v-text-field>

              <gmap-autocomplete @place_changed="setPlace">
                <template v-slot:input="slotProps">
                  <v-text-field
                    v-model="newAddress"
                    label="Address"
                    :rules="addressValidateArray"
                    ref="input"
                    v-on:listeners="slotProps.listeners"
                    v-on:attrs="slotProps.attrs"
                    required
                  ></v-text-field>
                </template>
              </gmap-autocomplete>

              <v-btn
                :disabled="!valid2"
                color="success"
                class="mr-4"
                @click="validateForModify"
                type="submit"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog2 = false;
                  newSchoolName = schoolName;
                  newAddress = schoolAddress;
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
                v-model="deleteName"
                :rules="deleteValidationArray"
                label="School Name"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validateForDelete"
                type="submit"
              >
                Submit
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog = false;
                  reset();
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-btn style="margin: 10px" @click="planNewRoute" outlined>Plan New Route</v-btn>
    </v-card-title>
    <v-card-subtitle class="black--text"> 
      <span class="black--text font-weight-bold"> Address: </span><span class="black--text"> {{ schoolAddress }} </span>
    </v-card-subtitle>
    <v-card-title>
      Bus Routes
    </v-card-title>
    <v-data-table
      :headers="routeHeaders"
      :items="busRoutes"
      :search="search"
      @click:row="viewRoute"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          dense
          small
          dark
          v-bind="attrs"
          v-on="on"
          @click="viewRoute(item)"
        >
          Details
        </v-btn>
      </template>
    </v-data-table>

    <v-card-title> Students </v-card-title>

    <v-data-table
      :headers="studentsHeaders"
      :items="students"
      :search="search"
      @click:row="viewStudent"
    >
      <template v-slot:[`item.studentRoute`]="{ item }">
        <div v-if="item.studentRoute">{{item.studentRoute}}</div>
        <div v-if="!item.studentRoute">No Route</div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          dense
          small
          dark
          v-bind="attrs"
          v-on="on"
          @click="viewStudent(item)"
        >
          Details
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
  data() {
    return {
      schoolName: "",
      schoolAddress: "",
      search: "",
      valid: true,
      valid2: true,
      dialog: false,
      dialog2: false,
      latitude: 0,
      longitude: 0,
      formatted_address: "",
      newSchoolName: "",
      newAddress: "",
      deleteName: "",
      routeHeaders: [
        {
          text: "Name",
          align: "start",
          value: "routeName",
        },
        { text: "Description", value: "routeDescription" },
        { text: "# of Students", value: "routeNumStudent" },
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
      ],
      students: [],
      deleteValidationArray: [this.deleteValidation],
      nameValidateArray: [this.nameValidate],
      addressValidateArray: [this.addressValidate],
    };
  },
  methods: {
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },
    planNewRoute() {
      this.$router.push({
        name: "AdminRoutePlanner",
        query: { id: this.$route.query.id },
      });
    },
    viewRoute(row) {
      this.$router.push({
        name: "AdminRouteDetail",
        query: { id: row.routeId },
      });
    },
    viewStudent(row) {
      this.$router.push({
        name: "AdminStudentDetail",
        query: { id: row.studentId },
      });
    },
    getSchoolInfo() {
      base_endpoint
        .get("/api/school/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolName = response.data.name;
          this.newSchoolName = response.data.name;
          this.schoolAddress = response.data.address;
          this.newAddress = response.data.address;
          this.formatted_address = response.data.address;
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
        routeNumStudent: item.student_count,
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
    submitDataForDelete() {
      base_endpoint
        .delete("/api/school/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminSchoolList" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validateForDelete() {
      //this.$refs.form.validate();
      if (this.deleteName != "" && this.deleteName != null) {
        this.submitDataForDelete();
        this.dialog = false;
        this.$emit(
          "schoolmodified",
          "A school has been modified and sent to database"
        );
      }
    },
    submitDataForModify() {
      base_endpoint
        .patch(
          "/api/school/update/" + this.$route.query.id,
          {
            name: this.newSchoolName,
            address: this.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.getSchoolInfo();
        });
    },
    validateForModify() {
      if (this.newSchoolName != "" && this.newSchoolName != null && this.newAddress != "" && this.newAddress != null) {
        this.$refs.form.validate();
        this.submitDataForModify();
        this.dialog2 = false;
        this.$emit(
          "schoolmodified",
          "A school has been modified and sent to database"
        );
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    deleteValidation() {
      if (this.deleteName == "" || this.deleteName == null) {
        return "Name is required";
      } else if (
        this.deleteName.toLowerCase() != this.schoolName.toLowerCase()
      ) {
        return "The name typed must match the school name";
      } else {
        return true;
      }
    },
    nameValidate() {
      console.log(this.name);
      if (this.newSchoolName == "" || this.newSchoolName == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    addressValidate() {
      console.log(this.name);
      if (this.newAddress == "" || this.newAddress == null) {
        return "Address is required";
      } else {
        return true;
      }
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