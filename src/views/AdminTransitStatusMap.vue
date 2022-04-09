<template >
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title>
      Transit Log
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
      :items="logs"
      :sort-by="['name']"
      :search="search"
      @click:row="viewItem"
      class="row-pointer"
    >
      <template v-slot:[`item.routeComplete`]="{ item }">
        <v-icon v-if="item.routeComplete == false" color="red">
          mdi-close
        </v-icon>
        <v-icon v-if="item.routeComplete == true"> mdi-check </v-icon>
      </template>
    </v-data-table>

    <GmapMap
      style="width: 100%; height: 400px"
      ref="mapRef"
      :center="center"
      :zoom="6"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :icon="m.icon"
        :label="m.label"
      />
    </GmapMap>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";

export default {
  data() {
    return {
      center: { lat: 39.930886713537696, lng: -98.76953125 },
      search: "",
      userType: "",
      userID: "",
      headers: [
        {
          text: "Driver",
          align: "start",
          value: "driverName",
        },
        { text: "Bus Number", value: "busNumber" },
        { text: "School", value: "schoolName" },
        { text: "Route", value: "routeName" },
        { text: "Direction", value: "direction" },
        { text: "Start Date & Time", value: "startDateAndTime" },
        { text: "Duration", value: "duration" },
      ],
      logs: [],
      markers: [],
      intervalId: null,
      firstBusLoc: true,
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    viewItem(item) {
      this.$router.push({ name: "AdminRouteDetail", query: { id: item.id } });
    },
    getDisplayLog(item) {
      return {
        driverID: item.driver_id,
        driverName: item.driver_name,
        busNumber: item.bus,
        schoolID: item.school_id,
        schoolName: item.school_name,
        routeID: item.route_id,
        routeName: item.route_name,
        direction: item.direction,
        startDateAndTime: item.start_time,
        duration: item.duration,
        lat: item.latitude,
        lng: item.longitude,
      };
    },
    getRequestAllRoutes() {
      base_endpoint
        .get("/api/getintransitlogs", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log("GOT HERE");
          console.log(response);
          this.logs = response.data.map(this.getDisplayLog);
          //this.$store.state.addresses = response.data;
          this.markers = [];

          this.logs.forEach((e) => {
            this.markers.push({
              position: { lat: e.lat, lng: e.lng },
              icon: {
                path: this.google.maps.SymbolPath.CIRCLE,
                scale: 20,
                fillOpacity: 1,
                strokeWeight: 2,
                fillColor: "#5384ED",
                strokeColor: "#ffffff",
              },
              label: {
                text: e.busNumber.toString(),
              },
            });
          });

          if (this.firstBusLoc) {
            if (this.markers.length > 0) {
              var bounds = new this.google.maps.LatLngBounds();
              for (var i = 0; i < this.markers.length; i++) {
                bounds.extend(this.markers[i].position);
              }
              this.$refs.mapRef.$mapPromise.then((map) => {
                map.fitBounds(bounds);
              });
            } else {
              this.geolocate();
            }
            this.firstBusLoc = false;
          }
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
    //this.getRequestAllRoutes();
    this.intervalId = setInterval(this.getRequestAllRoutes, 1000);
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
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {
  cursor: pointer;
}
</style>