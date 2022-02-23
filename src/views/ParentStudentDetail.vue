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
      <span class="black--text font-weight-bold"> ID: </span
      ><span class="black--text"> {{ studentId }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> School: </span
      ><span class="black--text"> {{ studentSchool }} </span>
    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Route: </span
      ><span class="black--text"> {{ studentRoute }} </span>
    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Route: </span
      ><span class="black--text"> {{ studentRouteDescription }} </span>
    </v-card-subtitle>

    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Parent: </span
      ><span class="black--text"> {{ studentParent }} </span>
    </v-card-subtitle>

    <v-row>
      <v-col width="50%">
        <v-data-table :headers="headers" :items="stopsInRange"> </v-data-table>
      </v-col>
      <v-col width="50%">
        <GmapMap
          ref="mapRef"
          style="width: 100%; height: 400px"
          :center="center"
          :zoom="12"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in stopsInRange"
            :position="m.position"
            :icon="stopMapMarker.icon"
            :label="stopMapMarker.label"
          />
        </GmapMap>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import { stopMapMarker } from "../assets/markers";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";
import moment from "moment";

export default {
  data() {
    return {
      stopMapMarker,
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
          text: "Stop Name",
          align: "start",
          value: "name",
        },
        { text: "Pick Up Time", align: "start", value: "pickupTime" },
        { text: "Drop Off Time", align: "start", value: "dropoffTime" },
      ],
      schoolItems: [],
      parentItems: [],
      school: null,
      parent: null,
      studentSchool: "",
      studentRoute: "",
      studentRouteDescription: "",
      studentParent: "",
      newStudentName: "",
      newStudentId: "",
      newStudentSchool: "",
      newStudentParent: "",
      stopsInRange: [],
      center: { lat: 36.001465, lng: -78.939133 },
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
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
          this.studentRouteDescription = response.data.route_description;
          this.studentParent = response.data.parent;
          this.newStudentParent = response.data.parent;
          this.studentSchoolId = response.data.school_id;
          this.studentRouteId = response.data.route_id;
          this.studentParentId = response.data.parent_id;
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    getDisplayStops(item) {
      var pTime = moment.utc(item.pickupTime);
      var dTime = moment.utc(item.dropoffTime);

      return {
        name: item.name,
        position: { lat: item.latitude, lng: item.longitude },
        pickupTime: pTime.local().format("h:mm A"),
        dropoffTime: dTime.local().format("h:mm A"),
      };
    },
    getInRangeStops() {
      base_endpoint
        .get("/api/student/getinrangestops/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response.data);
          this.stopsInRange = response.data.map(this.getDisplayStops);

          var bounds = new this.google.maps.LatLngBounds();
          for (var i = 0; i < this.stopsInRange.length; i++) {
            bounds.extend(this.stopsInRange[i].position);
          }
          this.$refs.mapRef.$mapPromise.then((map) => {
            map.fitBounds(bounds);
          });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    validate() {
      this.$refs.form.validate();
    },
  },
  created() {
    this.getStudentInfo();
    this.getInRangeStops();
  },
  computed: {
    google: gmapApi,
  },
};
</script>

<style>
</style>