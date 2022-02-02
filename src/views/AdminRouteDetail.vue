<template>
  <v-card>
    <v-card-title>
      {{ routeName }}
      <v-spacer></v-spacer>
      <v-btn @click="planNewRoute" outlined>Modify Route</v-btn>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Modify Name and Description
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Modify Name and Description
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="newRouteName"
                :rules="nameValidateArray"
                label="Route Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="newRouteDescription"
                :rules="desValidateArray"
                label="Route Description"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validateForModify"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog2 = false;
                  newRouteName = routeName;
                  newRouteDescription = routeDescription;
                "
              >
                Cancel
              </v-btn>
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

              <v-btn color="error" class="mr-4" @click="submitDataForDelete">
                Yes, Delete
              </v-btn>

              <v-btn color="success" @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle> {{ routeSchool }} </v-card-subtitle>
    <v-card-subtitle> {{ routeDescription }} </v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="students"
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

export default {
  data() {
    return {
      routeName: "",
      newRouteName: "",
      routeSchool: "",
      routeSchoolID: "",
      newRouteSchool: null,
      routeDescription: "",
      newRouteDescription: "",
      search: "",
      valid: true,
      dialog: false,
      dialog2: false,
      oldSchoolID: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      students: [],
      schoolItems: [],
      nameValidateArray: [this.nameValidate],
      desValidateArray: [this.desValidate],
    };
  },
  methods: {
    planNewRoute() {
      this.$router.push({
        name: "AdminRoutePlanner",
        query: { id: this.routeSchoolID },
      });
    },
    getRouteInfo() {
      base_endpoint
        .get("/api/route/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.routeName = response.data.name;
          this.newRouteName = response.data.name;
          this.routeSchool = response.data.school;
          this.routeSchoolID = response.data.school_id;
          this.newRouteSchool = response.data.school;
          this.routeDescription = response.data.description;
          this.newRouteDescription = response.data.description;
          this.oldSchoolID = response.data.school.id;
          this.getSchools();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitDataForModify() {
      base_endpoint
        .patch(
          "/api/route/update/" + this.$route.query.id,
          {
            name: this.newRouteName,
            description: this.newRouteDescription,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.getRouteInfo();
          this.getStudentsInRoute();
        });
    },
    validateForModify() {
      this.$refs.form.validate();
      this.submitDataForModify();
      this.dialog2 = false;
      this.$emit(
        "schoolmodified",
        "A school has been modified and sent to database"
      );
    },
    getSchools() {
      base_endpoint
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolItems = response.data.map(this.getDisplaySchools);

          this.schoolItems.forEach((item) => {
            if (this.oldSchoolID == item.id) {
              this.newRouteSchool = item;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDisplaySchools(item) {
      return {
        name: item.name,
        id: item.id,
      };
    },
    getDisplayStudents(item) {
      return {
        name: item.name,
        id: item.id,
      };
    },
    submitDataForDelete() {
      this.dialog = false;
      base_endpoint
        .delete("/api/route/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminRouteList" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getStudentsInRoute() {
      base_endpoint
        .get("/api/student/getallfromroute/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudents);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nameValidate() {
      console.log(this.name);
      if (this.newRouteName == "" || this.newRouteName == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    desValidate() {
      console.log(this.name);
      if (this.newRouteDescription == "" || this.newRouteDescription == null) {
        return "Description is required";
      } else {
        return true;
      }
    },
    viewItem(item) {
      this.$router.push({ name: "AdminStudentDetail", query: { id: item.id } });
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
    this.getRouteInfo();
    this.getStudentsInRoute();
    //this.getSchools();
  },
};
</script>

<style>
</style>