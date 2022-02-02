<template>
  <v-card>
    <v-layout row wrap>
      <v-card width="50%">
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
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
              Add New Route
            </v-btn>
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
                <v-btn color="warning" @click="dialog = false; reset()"> Cancel </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>

      <GmapMap :center="center" :zoom="12" style="width: 50%; height: 400px">
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

      <v-btn color="green lighten-2" dark @click="submitChanges()">
        Save
      </v-btn>
      <v-btn color="green lighten-2" dark> Cancel </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
  data() {
    let mapMarker =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyMyAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0yMyAxMS41QzIzIDIxLjUgMTEuNSAyOC41IDExLjUgMjguNUMxMS41IDI4LjUgMCAyMS41IDAgMTEuNUMwIDUuMTQ4NzMgNS4xNDg3MyAwIDExLjUgMEMxNy44NTEzIDAgMjMgNS4xNDg3MyAyMyAxMS41WiIgZmlsbD0iI0M3MDYyOSIvPg0KPGNpcmNsZSBjeD0iMTEuNSIgY3k9IjExLjUiIHI9IjUuNSIgZmlsbD0iIzgxMDAxNyIvPg0KPC9zdmc+DQo=";
    let mapMarkerActive =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyMyAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0yMyAxMS41QzIzIDIxLjUgMTEuNSAyOC41IDExLjUgMjguNUMxMS41IDI4LjUgMCAyMS41IDAgMTEuNUMwIDUuMTQ4NzMgNS4xNDg3MyAwIDExLjUgMEMxNy44NTEzIDAgMjMgNS4xNDg3MyAyMyAxMS41WiIgZmlsbD0iIzMzMzMzMyIvPg0KPGNpcmNsZSBjeD0iMTEuNSIgY3k9IjExLjUiIHI9IjUuNSIgZmlsbD0iYmxhY2siLz4NCjwvc3ZnPg0K";
    let mapMarkerUnassigned =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAANbY1E9YMgAABPNJREFUWMO1lwtMm1UUx29pWYUCC21nVhzvxyaP8iqUMh6jDygwSikC5SlvRFgmgmOgA1Y2trn5ntscTKZxGh9TMVt0WUQzpqjRqclMJJnJ3Ey2+VhMjBI24Hjut6RA+1XZnTb55cv9er9z//fcc8+5lwAA4cPS8ysp7r1OTF2XSFbtaZJS/DKJNQwJg+Nr1N6y0F6BQDBCCDlKn96ykG2BMaWp8ca9ohTLKNlQ8wExdf7IfU/tuBqDQv5NQGHXZaJv+oTEaPvjJT5+p0Qi91mZXzyEJtbDuvUdEKpqANkaFeD7OYmPYjwqs0etazjDCf9PBFiQqIyt9+NsZwKiLGBs+xasg/NQtRvslO+Yh7xN30GQ0ooWyey61Ida7d/fiYDS/hmSkPtEnUBAQG0Zhao9ABVDAFbbPJRtn13ANse9p/+nlr4Gbm5uoNQNttHvmQWYu6+QzOoTKhz8hqb4KFTvBRxsbunATsxBDfZLs75JPTGfZn0r3dx9lU1ATus54quIPeWPbq/es5zBF6h+HACDFXzkERPZLV+ImATEZu9Od3MTQm77N1CxE5Y9OKUc+xd0TIFQ6A7RWdtymARIFfGP+SqUnDHH2RuaP8VdUAseEhn3pG3HpaAxsSpATb1gYxKAv+EgZRkX5Y4zpIOKRCI7tO3YhwZkmKqeGhphFTAaltTIGXI0Tme+WABt8wm4F/MEtcMkAKP/UEC05Y48EBJfDQJCDjMJuDsoo2ulPByTzhy3z283BmjsSBWxILsn8VEmAaqNzydgnp8xNJ2ByqHb2wU0AI1tX4JA4DafYNyXxiRA33QWvZD+KgKVu3iynyvQW3TZ/CKMOHvVmB7rApOAIsxg6NpQobv4ulJnW3Yyov0wfWM6Fv2ha/gosqj7Gmst+I2UYS7XFL+kx0ieTsx/hndHOAae2nKERv7NJNPBgtKBG5wdZgGcCDSiNg8Xo1HYUHOCd1dQ6DIZmidw3QXUA3WlA7cKEXsx2nLFTkn/NIlIaR8QS+Rg6bmK5XepCCvmurKBv8BbGgrBsVX7qeiinl9I0dafOZgEFDx80Y6p8xIpfOQnoY987WRwXKWTF2g7WtsHYg/fH/I2nV9Z0HmRbOy4YIdJgPHBr5eQv3mKJJuHtXQpctvO2QuUdRDQK9dAtMITYrQD9XTAHOy/GCYB2vpxJwwtn2GJjjsZGLNQI+gzLnsXiD2lU/rGs2JD8yR3hFsMcx5wJKf1K5KY97RBKBJD4ZbLt2LBNgte0mAIS2rppJ7SN044wSQgo2LMmcr38Pmu+wqx94Vk82Go2YeR3zKJdV80nV45Fmho+dxp9sweWF/2Bi+ZVSfJ6hDtczTT1T4F9MABXr5BE9q6cTyOv88LkwB10Yu8aO47RtZqNud6eK3CGLiJhw4NrIk096ZXvENSS47xwiQAI54XddERkpD3pMJdLPlT1/AxeHqvhqjM3rTUklcIvZTwwSQgRrfdBTai1A8SD4n8+8iMbrhLIvtdlf+sLIV6yDzCC5sAbb9LYg07iY8s5EO5fzKuf8D55MIXSJLpEHKQFyYBYUnNLsG0THzk4a+vEEvw0Bl+WqnfQaKz+lzyvwjAO8MBmhW9pcHH8ehF8FrmEiYBSaYDLqGB5R9Z2EcFKMIM+/E65nLXUJgEuNpSlPTyt0l48gM1VADegNrTKo4TDe4CV/yTgL8Bg0AIlCA8gh8AAAAASUVORK5CYII=";

    return {
      mapMarker,
      mapMarkerActive,
      mapMarkerUnassigned,
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
          this.markers = response.data.map(this.getDisplayMarkers);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validate() {
      if (this.newRouteName != "" && this.newRouteName != null) {
        this.$refs.form.validate();
        this.submitData();
        this.dialog = false;
        this.$refs.form.reset();
      }
    },
    submitData() {
      base_endpoint.post(
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
      ).then(response => {
          console.log(response)
          this.getRequestAllRoutes()
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
      console.log(this.name)
      if (this.newRouteName == "" || this.newRouteName == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    desValidate() {
      console.log(this.name)
      if (this.newRouteDescription == "" || this.newRouteDescription == null) {
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