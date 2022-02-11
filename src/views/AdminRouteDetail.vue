<template>
  <v-card height=100%>
    <v-card-title class="font-weight-black">
      {{ routeName }}
      <v-spacer></v-spacer>
      <v-btn @click="planNewRoute" outlined>Modify Route</v-btn>
      <v-dialog v-model="dialog2" width="80%">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Modify Name and Description
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Modify Name and Description
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col>
              <v-text-field
                v-model="newRouteName"
                :rules="nameValidateArray"
                label="Route Name"
                required
              ></v-text-field>

              <v-textarea
                v-model="newRouteDescription"
                :rules="desValidateArray"
                label="Route Description"
                required
              ></v-textarea>
              </v-col>

              <v-col>
              
              <GmapMap :center="center" :zoom="12" style="width: 90%; height: 400px">
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="center = m.position"
            :icon="getMarkers(m)"
          />
        </GmapMap>
        </v-col>
        </v-row>


              <v-btn
                :disabled="!valid"
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
      <v-dialog style="margin: 10px" v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on"> Delete </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-spacer></v-spacer>

              <v-btn color="error" class="mr-4" @click="submitDataForDelete" >
                Yes, Delete
              </v-btn>

              <v-btn color="success" @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    

    <v-row>
      <v-col>
        <v-card-subtitle> <span class="black--text font-weight-bold"> School: </span><span class="black--text"> {{ routeSchool }} </span>
      <v-icon small @click="viewSchool(routeSchoolID)"> mdi-eye </v-icon>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Description: </span>
      <br>
      <span style="white-space: pre;" class="black--text">{{routeDescription}}</span>
    </v-card-subtitle>
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
      </v-col>
      <v-col>
        <GmapMap :center="center" :zoom="12" style="width: 90%; height: 400px">
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="center = m.position"
            :icon="getMarkers(m)"
          />
        </GmapMap>
        <v-img
          src="../assets/marker_key.jpeg"
          max-height="200"
          max-width="250"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapMarker, schoolMapMarker } from "../assets/markers";

export default {
  data() {
    return {
      mapMarker,
      schoolMapMarker,
      center: { lat: 36.001465, lng: -78.939133 },
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
      nameValidateArray: [this.nameValidate],
      desValidateArray: [this.desValidate],
      markers: [],
    };
  },
  methods: {
    viewSchool(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item } });
    },
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
    getDisplayStudents(item) {
      return {
        name: item.name,
        id: item.id,
      };
    },
    getDisplayRouteMarkers(item) {
      return {
        position: { lat: item.latitude, lng: item.longitude },
        isSchool: item.is_school,
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
    getRouteMarkers() {
      base_endpoint
        .get("/api/route/getlocations/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.markers = response.data.map(this.getDisplayRouteMarkers);
          console.log(this.markers);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMarkers(m) {
      if (m.isSchool == true) return this.schoolMapMarker;
      return this.mapMarker;
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
    this.getRouteMarkers();
  },
};
</script>

<style>
</style>
