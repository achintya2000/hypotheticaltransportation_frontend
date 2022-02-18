<template>
  <v-card height="100%">
    <v-card-title>
      <v-btn
        text
        @click="viewSchool(schoolID)"
        style="text-transform: none !important"
        class="black--text font-weight-bold"
        size="6rem"
      >
        {{ schoolName }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="primary" dark v-bind="attrs" v-on="on">
            mdi-information-outline
          </v-icon>
        </template>
        <v-img
          src="../assets/marker_key.jpeg"
          max-height="200"
          max-width="250"
        ></v-img>
      </v-tooltip>
    </v-card-title>

    <GmapMap style="width: 100%; height: 400px" ref="mapRef" :center="center">
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="toggleInfo(m)"
        :icon="getMarkerIcons(m)"
        :label="getMarkerLabels(m)"
      />
      <GmapMarker
        :key="'stop_' + index"
        v-for="(m, index) in stops"
        :position="m.position"
        :icon="stopMapMarker.icon"
        :label="m.label"
        :draggable="true"
        @drag="moveCircle($event, index)"
      />
      <GmapCircle
        :key="'circle_' + index"
        v-for="(m, index) in stops"
        :center="m.position"
        :radius="483"
        :visible="true"
        :options="{
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        }"
      />
    </GmapMap>

    <v-row>
      <v-col width="50%">
        <v-card-subtitle>
          <v-row>
            <v-col>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined v-bind="attrs" v-on="on">
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
          </v-row>
        </v-card-subtitle>

        <v-data-table
          :headers="headers"
          :items="routes"
          :search="search"
          item-key="id"
          dense
          :single-select="true"
          @click:row="selectRow"
        >
        </v-data-table>
      </v-col>
      <v-col width="50%">
        <v-card-subtitle>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="stopName"
                  label="Enter Stop Name (optional)"
                  single-line
                ></v-text-field>
              </v-col>
              <v-col>
                <v-switch
                  v-model="canCreateStops"
                  :label="`Enable Stop Creation`"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-subtitle>

        <v-data-table
          :headers="headers_stops"
          :items="stops"
          item-key="id"
          dense
        >
        </v-data-table>
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
//import DataTableRowHandler from "../components/DataTableRowHandler.vue";
import {
  mapMarker,
  mapMarkerActive,
  mapMarkerUnassigned,
  schoolMapMarker,
  stopMapMarker,
} from "../assets/markers";
//import draggable from "vuedraggable";

export default {
  data() {
    return {
      mapMarker,
      mapMarkerActive,
      mapMarkerUnassigned,
      schoolMapMarker,
      stopMapMarker,
      center: { lat: 36.001465, lng: -78.939133 },
      stopName: "",
      snackbar: false,
      canCreateStops: false,
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
      allowDrag: true,
      selected: [],
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "# of Students", value: "routeNumStudent" },
      ],
      headers_stops: [
        {
          text: "Name",
          align: "start",
          value: "item",
        },
        { text: "Pick Up Time", value: "pickupTime" },
        { text: "Drop Off Time", value: "dropoffTime" },
        { text: "Order", value: "order" },
      ],
      routes: [],
      stops: [],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    getDisplayStops(item) {
      return {
        item: item.name,
        pickupTime: item.pickupTime,
        dropoffTime: item.dropoffTime,
        position: { lat: item.latitude, lng: item.longitude },
        order: item.order,
        label: {
          text: item.order.toString(),
          fontFamily: "Roboto",
          color: "#ffffff",
          fontSize: "18px",
        },
      };
    },
    selectRow(value, row) {
      if (row.isSelected) {
        this.activeRouteID = null;
        row.select(false);
        this.stops = [];
      } else {
        this.activeRouteID = value.id;
        row.select(true);
        base_endpoint
          .get("/api/stop/getallfromroute/" + value.id, {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          })
          .then((response) => {
            this.stops = response.data.map(this.getDisplayStops);
            console.log(this.stops);
          })
          .catch((err) => {
            this.showSnackBar();
            console.log(err);
          });
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
        routeNumStudent: item.student_count,
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
    getMarkerIcons(m) {
      if (m.isSchool == true) return this.schoolMapMarker.icon;
      if (m.routeID == null) return this.mapMarkerUnassigned.icon;
      if (m.routeID == this.activeRouteID) return this.mapMarkerActive.icon;
      return this.mapMarker.icon;
    },
    getMarkerLabels(m) {
      if (m.isSchool == true) return this.schoolMapMarker.label;
      if (m.routeID == null) return this.mapMarkerUnassigned.label;
      if (m.routeID == this.activeRouteID) return this.mapMarkerActive.label;
      return this.mapMarker.label;
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
    isDraggable(is_school) {
      return is_school ? true : false;
    },
    moveCircle(event, index) {
      this.stops[index].position.lat = event.latLng.lat();
      this.stops[index].position.lng = event.latLng.lng();
    },
    onCloneCallback(item) {
      // Create a fresh copy of item
      const cloneMe = JSON.parse(JSON.stringify(item));

      return cloneMe;
    },
    onMoveCallback(
      evt //originalEvent
    ) {
      const item = evt.draggedContext.element;
      //const itemIdx = evt.draggedContext.futureIndex;

      console.log("onMoveCallback");

      if (item.locked) {
        return false;
      }

      return true;
    },
    //onDropCallback(evt, originalEvent) {
    //  console.log("onDropCallback");
    //},
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
    activeHeaders() {
      return this.headers.filter((h) => {
        if (!this.allowDrag && h.value === "lock") {
          return false;
        }
        return true;
      });
    },
  },
  components: {
    //draggable,
    //DataTableRowHandler,
  },
};
</script>

<style>
tr.v-data-table__selected {
  background: #7d92f5 !important;
}
</style>
