<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title class="font-weight-black">
      {{ studentName }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500"> </v-dialog>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
    </v-card-title>
    <v-row>
      <v-col width="50%">
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
          <span class="black--text font-weight-bold"> Route Description: </span
          ><span class="black--text"> {{ studentRouteDescription }} </span>
        </v-card-subtitle>

        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Parent: </span
          ><span class="black--text"> {{ studentParent }} </span>
        </v-card-subtitle>

        <v-data-table :headers="headers" :items="stopsInRange"> </v-data-table>
      </v-col>
      <v-col width="50%">
        <div class="map" id="map">
          <GmapMap
            ref="mapRef"
            style="width: 100%; height: 400px"
            :center="center"
            :zoom="12"
          >
            <GmapMarker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :icon="m.icon"
              :label="m.label"
            />
            <GmapMarker
              :key="'bus_' + index"
              v-for="(m, index) in buses"
              :position="m.position"
              :icon="m.icon"
              :label="m.label"
            />
          </GmapMap>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import { stopMapMarker, bluePerson } from "../assets/markers";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";
import moment from "moment";

export default {
  data() {
    return {
      bluePerson,
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
      markers: [],
      buses: [],
      intervalId: null,
      firstBusLoc: true,
      in_transit: false,
      parentLat: 0,
      parentLng: 0,
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    getStudentInfoInit() {
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
          this.in_transit = response.data.in_transit;

          this.parentLat = response.data.parentLatitude;
          this.parentLng = response.data.parentLongitude;

          this.getUserInfo();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    getStudentInfo() {
      base_endpoint
        .get("/api/student/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log("YEET");
          console.log(response);

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
          this.in_transit = response.data.in_transit;
          
          this.routeInTransit = response.data.in_transit;
          this.routeInTransitBus = response.data.bus_id;
          this.routeInTransitDriverID = response.data.driver_id;
          this.routeInTransitDriverName = response.data.driver_name;
          this.routeInTransitLat = response.data.driver_name;
          this.routeInTransitLong = response.data.driver_name;

          this.buses = [];
          var busMarker = {
            position: {
              lat: response.data.latitude,
              lng: response.data.longitude,
            },
            icon: {
              path: this.google.maps.SymbolPath.CIRCLE,
              scale: 20,
              fillOpacity: 1,
              strokeWeight: 2,
              fillColor: "#5384ED",
              strokeColor: "#ffffff",
            },
            label: {
              text: response.data.bus_id.toString(),
            },
          };

          if (this.in_transit) {
            this.buses.push(busMarker);
          }
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
        icon: this.stopMapMarker.icon,
        label: this.stopMapMarker.label,
      };
    },
    getInRangeStops() {
      base_endpoint
        .get("/api/student/getinrangestops/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
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
    getUserInfo() {
      // base_endpoint
      //   .get("/api/profile/get/" + this.studentParentId, {
      //     headers: { Authorization: `Token ${this.$store.state.accessToken}` },
      //   })
      //   .then((res) => {
      base_endpoint
        .get("/api/student/getinrangestops/" + this.$route.query.id, {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        })
        .then((response) => {
          this.markers = response.data.map(this.getDisplayStops);

          var house = {
            position: {
              lat: parseFloat(this.parentLat),
              lng: parseFloat(this.parentLng),
            },
            icon: this.bluePerson.icon,
            label: this.bluePerson.label,
          };
          this.markers.push(house);
          console.log("YOTE");
          console.log(this.markers);

          var bounds = new this.google.maps.LatLngBounds();
          for (var i = 0; i < this.markers.length; i++) {
            bounds.extend(this.markers[i].position);
          }

          if (this.in_transit) {
            if (this.firstBusLoc) {
              if (this.buses.length == 0) {
                setTimeout(this.getUserInfo, 1000);
              } else {
                bounds.extend(this.buses[0].position);
                this.firstBusLoc = false;
              }
            }
          }

          this.$refs.mapRef.$mapPromise.then((map) => {
            map.fitBounds(bounds);
          });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
      // })
      // .catch((err) => {
      //   this.showSnackBar();
      //   console.log(err);
      // });
    },
    validate() {
      this.$refs.form.validate();
    },
  },
  created() {
    this.getStudentInfoInit();
    this.intervalId = setInterval(this.getStudentInfo, 1000);
    this.getInRangeStops();
  },
  computed: {
    google: gmapApi,
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
};
</script>

<style>
#map {
  background-color: black;
  padding-top: 2px;
  padding-right: 2px;
  padding-bottom: 2px;
  padding-left: 2px;
}
</style>