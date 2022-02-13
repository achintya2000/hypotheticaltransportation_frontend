<template>
  <v-card height="100%">
    <v-row>
      <v-col width="50%">
        <v-btn
          text
          @click="viewSchool(schoolID)"
          style="text-transform: none !important"
          class="black--text font-weight-bold"
          size="6rem"
        >
          {{ schoolName }}
        </v-btn>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="routes"
          :search="search"
          item-key="id"
          :single-select="true"
          @click:row="selectRow"
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

                <v-textarea
                  v-model="description"
                  label="Route Description"
                  append-icon="mdi-message-text"
                  required
                ></v-textarea>

                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate"
                  type="submit"
                >
                  Submit
                </v-btn>
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
        <GmapMap style="width: 100%; height: 400px" ref="mapRef">
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="toggleInfo(m)"
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
    <v-snackbar v-model="snackbar" outlines bottom color="success">
      A new route has been created

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";
import { mapActions } from "vuex";
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
      snackbar: false,
      mapMarkerActive,
      mapMarkerUnassigned,
      schoolMapMarker,
      activeRouteID: null,
      selectedIndex: null,
      selectedMarker: null,
      address: "",
      markers: [],
      places: [],
      nameValidateArray: [this.nameValidate],
      schoolName: "",
      search: "",
      dialog: false,
      valid: true,
      name: "",
      description: "",
      schoolID: this.$route.query.id,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
      ],
      routes: [],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    selectRow(value, row) {
      if (row.isSelected) {
        this.activeRouteID = null;
        row.select(false);
      } else {
        this.activeRouteID = value.id;
        row.select(true);
      }
    },
    updateMarker(parentID, newRouteID) {
      base_endpoint
        .patch(
          "/api/route/addstudentsfromparent",
          {
            parent_id: parentID,
            route_id: newRouteID,
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
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
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
          this.showSnackBar();
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
          this.showSnackBar();
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

          var bounds = new this.google.maps.LatLngBounds();
          for (var i = 0; i < this.markers.length; i++) {
            bounds.extend(this.markers[i].position);
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
      if (this.name != "" && this.name != null) {
        this.$refs.form.validate();
        this.submitData();
        this.dialog = false;
        this.snackbar = true;
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
        .then(() => {
          this.getRequestAllRoutes();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
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
    toggleInfo(m) {
      if (m.isSchool) return;
      if (m.routeID == this.activeRouteID) {
        this.updateMarker(m.parentID, null);
      } else {
        this.updateMarker(m.parentID, this.activeRouteID);
      }
    },
    getMarkers(m) {
      if (m.isSchool == true) return this.schoolMapMarker;
      if (m.routeID == null) return this.mapMarkerUnassigned;
      if (m.routeID == this.activeRouteID) return this.mapMarkerActive;
      return this.mapMarker;
    },
    nameValidate() {
      if (this.name == "" || this.name == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    desValidate() {
      if (this.description == "" || this.description == null) {
        return "Description is required";
      } else {
        return true;
      }
    },
    viewSchool(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item } });
    },
  },
  created() {
    this.getRequestAllRoutes();
    this.getSchoolInfo();
    this.getMarkerData();
  },
  mounted() {
    //this.geolocate();
  },
  computed: {
    google: gmapApi,
  },
};
</script>

<style>
tr.v-data-table__selected {
  background: #7d92f5 !important;
}
</style>