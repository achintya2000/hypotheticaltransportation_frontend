<template>
  <v-card>
    <v-row>
      <v-col width="50%">
        <v-card-title> {{ schoolName }} </v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="routes"
          :search="search"
          :sort-by="['name']"
          :sort-desc="[true]"
          item-key="name"
          show-select
          :single-select="true"
        ></v-data-table>

        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined v-bind="attrs" v-on="on"> Add New Route </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Add New Route
            </v-card-title>

            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="name"
                  :rules="nameValidateArray"
                  label="Name"
                  append-icon="mdi-bus"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="description"
                  :rules="desValidateArray"
                  label="Route Description"
                  append-icon="mdi-message-text"
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
      </v-col>

      <v-col width="50%">
        <GmapMap :center="center" :zoom="12" style="width: 100%; height: 400px">
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="
              center = m.position;
              toggleInfo(m);
            "
            :icon="getMarkers(m)"
          />
        </GmapMap>
        <v-btn dark @click="submitChanges()"> Save </v-btn>
        <v-btn outlined> Cancel </v-btn>
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
import {
  mapMarker,
  mapMarkerActive,
  mapMarkerUnassigned,
  schoolMapMarker,
} from "../assets/markers";

export default {
  data() {
    return {
      mapMarker,
      mapMarkerActive,
      mapMarkerUnassigned,
      schoolMapMarker,
      activeRouteID: null,
      selectedIndex: null,
      selectedMarker: null,
      address: "",
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null,
      markers: [],
      places: [],
      nameValidateArray: [this.nameValidate],
      desValidateArray: [this.desValidate],
      schoolName: "",
      search: "",
      selected: [],
      dialog: false,
      valid: true,
      name: "",
      description: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
      ],
      routes: [],
      markerChanges: [],
    };
  },
  methods: {
    submitChanges() {
      // Giving you a UserID and RouteID
      this.markerChanges.forEach((routeUpdate) => {
        base_endpoint
          .patch(
            "/api/route/addstudentsfromparent",
            {
              parent_id: routeUpdate.id,
              route_id: routeUpdate.newRoute,
              school_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then(() => {
            this.getMarkerData();
          });
      });
    },
    clearChanges() {
      this.markerChanges = [];
    },
    getDisplayRoute(item) {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
      };
    },
    getDisplayMarkers(item) {
      return {
        position: { lat: item.latitude, lng: item.longitude },
        routeID: item.route,
        parentID: item.parent_id,
        isSchool: item.is_school,
      };
    },
    getRequestAllRoutes() {
      base_endpoint
        .get("/api/route/getallfromschool/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.routes = response.data.map(this.getDisplayRoute);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSchoolInfo() {
      base_endpoint
        .get("/api/school/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolName = response.data.name;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMarkerData() {
      base_endpoint
        .get("/api/school/getalladdresses/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response.data);
          this.markers = response.data.map(this.getDisplayMarkers);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validate() {
      if (this.name != "" && this.name != null) {
        this.$refs.form.validate();
        this.submitData();
        this.dialog = false;
        this.$refs.form.reset();
      }
    },
    submitData() {
      base_endpoint
        .post(
          "/api/route/create",
          {
            name: this.name,
            school: this.$route.query.id,
            description: this.description,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.getRequestAllRoutes();
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetAndClose() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    toggleInfo(m) {
      if (m.isSchool) return;
      console.log("Currently selected route id: " + this.activeRouteID);
      console.log(m);
      if (m.routeID == this.activeRouteID) {
        m.routeID = null;
        this.trackChange(m.parentID, null);
      } else if (m.routeID == null) {
        m.routeID = this.activeRouteID;
        this.trackChange(m.parentID, this.activeRouteID);
      }
    },
    getMarkers(m) {
      console.log(m.isSchool);
      if (m.isSchool == true) return this.schoolMapMarker;
      if (m.routeID == null) return this.mapMarkerUnassigned;
      if (m.routeID == this.activeRouteID) return this.mapMarkerActive;
      return this.mapMarker;
    },
    toggleRoute(selected) {
      if (selected.length == 0) {
        this.activeRouteID = null;
      } else {
        this.activeRouteID = selected[0].id;
      }
    },
    trackChange(parentID, newVal) {
      this.markerChanges.forEach((element) => {
        if (element.id == parentID) {
          element.newRoute = newVal;
          return;
        }
      });
      var change = {
        id: parentID,
        newRoute: newVal,
      };
      this.markerChanges.push(change);
    },
    nameValidate() {
      console.log(this.name);
      if (this.name == "" || this.name == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    desValidate() {
      console.log(this.name);
      if (this.description == "" || this.description == null) {
        return "Description is required";
      } else {
        return true;
      }
    },
  },
  created() {
    this.getRequestAllRoutes();
    this.getSchoolInfo();
    this.getMarkerData();
  },
  mounted() {
    this.geolocate();
  },
  watch: {
    selected: function () {
      this.toggleRoute(this.selected);
    },
  },
};
</script>

<style>
</style>