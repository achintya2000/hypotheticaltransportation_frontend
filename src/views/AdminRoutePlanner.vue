<template>
  <v-card height="100%">
    <v-card-title>
      
      <span text 
        @click="viewSchool(schoolID)" class="txt blue--text text--darken-4">
         {{ schoolName }} 
      </span>
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
    <v-row>
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
                <v-btn
                  :disabled="!canCreateStops"
                  outlined
                  @click="
                    enableStopMarkerCreation();
                    snackbar2 = true;
                  "
                  >Create Stop</v-btn
                >
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
          <template #body="props">
            <draggable
              :list="props.items"
              tag="tbody"
              :disabled="!allowDrag"
              :move="onMoveCallback"
              :clone="onCloneCallback"
              @end="onDropCallback"
            >
              <data-table-row-handler
                v-for="(item, index) in props.items"
                :key="index"
                :item="item"
                :headers="headers_stops"
              >
                <template v-slot:[`item.drag`]>
                  <v-icon class="mr-3"> mdi-reorder-horizontal </v-icon>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <v-text-field
                    v-model="editedStop.name"
                    :hide-details="true"
                    dense
                    single-line
                    v-if="item.id === editedStop.id"
                  ></v-text-field>
                  <span v-else>{{ item.name }}</span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <div v-if="item.id === editedStop.id">
                    <v-icon color="red" class="mr-3" @click="closeStop">
                      mdi-window-close
                    </v-icon>
                    <v-icon color="green" @click="saveStop">
                      mdi-content-save
                    </v-icon>
                  </div>
                  <div v-else>
                    <v-icon
                      color="green"
                      class="mr-3"
                      @click="editStopItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon color="red" @click="deleteStopItem(item)">
                      mdi-delete
                    </v-icon>
                  </div>
                </template>
              </data-table-row-handler>
            </draggable>
          </template>
        </v-data-table>
      </v-col>
      <v-col width="50%">
        <GmapMap
          style="width: 100%; height: 400px"
          ref="mapRef"
          :center="center"
          @click="addStopMarker($event)"
        >
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
            @dragend="updateStopPosition($event, m)"
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
      </v-col>
    </v-row>

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
          <template v-slot:[`item.name`]="{ item }">
            <v-text-field
              @click.native.stop
              v-model="editedRoute.name"
              :hide-details="true"
              dense
              single-line
              v-if="item.id === editedRoute.id"
            ></v-text-field>
            <span v-else>{{ item.name }}</span>
          </template>
          <template v-slot:[`item.description`]="{ item }">
            <v-textarea
              @click.native.stop
              v-model="editedRoute.description"
              :hide-details="true"
              dense
              rows="1"
              v-if="item.id === editedRoute.id"
            ></v-textarea>
            <span v-else>{{ item.description }}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div v-if="item.id === editedRoute.id">
              <v-icon color="red" class="mr-3" @click.stop="closeRoute">
                mdi-window-close
              </v-icon>
              <v-icon color="green" @click.stop="saveRoute">
                mdi-content-save
              </v-icon>
            </div>
            <div v-else>
              <v-icon
                color="green"
                class="mr-3"
                @click.stop="editRouteItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon color="red" @click.stop="deleteRouteItem(item)">
                mdi-delete
              </v-icon>
            </div>
          </template>
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
    <v-snackbar v-model="snackbar2" outlines color="blue" :timeout="-1">
      Click anywhere on the map to place the new stop

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar2 = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbar3" outlines color="blue" :timeout="-1">
      The stop is being created
      <v-progress-circular indeterminate color="black"></v-progress-circular>

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar3 = false">
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
import DataTableRowHandler from "../components/DataTableRowHandler.vue";
import draggable from "vuedraggable";
import moment from "moment";
import {
  mapMarker,
  mapMarkerActiveInRange,
  mapMarkerActiveNotInRange,
  mapMarkerUnassigned,
  schoolMapMarker,
  stopMapMarker,
} from "../assets/markers";

export default {
  components: { DataTableRowHandler, draggable },
  data() {
    return {
      mapMarker,
      mapMarkerActiveInRange,
      mapMarkerActiveNotInRange,
      mapMarkerUnassigned,
      schoolMapMarker,
      stopMapMarker,
      center: { lat: 36.001465, lng: -78.939133 },
      stopName: "",
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      canCreateStops: false,
      canPlaceStopMarker: false,
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
        { text: "Actions", value: "actions", sortable: false, width: "100px" },
      ],
      headers_stops: [
        { text: " ", align: "start", value: "drag" },
        { text: "Order", align: "start", value: "order" },
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Pick Up Time", align: "start", value: "pickupTime" },
        { text: "Drop Off Time", align: "start", value: "dropoffTime" },

        { text: "Actions", value: "actions", sortable: false, width: "100px" },
      ],
      routes: [],
      stops: [],
      editedRouteIndex: -1,
      editedRoute: {
        id: 0,
        name: "",
        description: "",
      },
      defaultRoute: {
        id: -1,
        name: "",
        description: "",
        routeNumStudent: 0,
      },
      editedStopIndex: -1,
      editedStop: {
        id: 0,
        name: "",
        description: "",
        routeNumStudent: 0,
      },
      defaultStop: {
        id: -1,
        name: "",
        description: "",
        routeNumStudent: 0,
      },
      reorderedStop: null,
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    showSnackBarMapError() {
      this.snackBar(
        "Something Went Wrong with Map Load! Please Refresh the page."
      );
    },
    getDisplayStops(item) {
      var pTime = moment.utc(item.pickupTime);
      var dTime = moment.utc(item.dropoffTime);

      return {
        id: item.id,
        order: item.order,
        name: item.name,
        pickupTime: pTime.local().format("h:mm A"),
        dropoffTime: dTime.local().format("h:mm A"),
        position: { lat: item.latitude, lng: item.longitude },
        label: {
          text: item.order.toString(),
          fontFamily: "Roboto",
          color: "#ffffff",
          fontSize: "18px",
        },
      };
    },
    getRequestAllStops() {
      base_endpoint
        .get("/api/stop/getallfromroute/" + this.activeRouteID, {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        })
        .then((response) => {
          this.stops = response.data.map(this.getDisplayStops);
          this.stops.sort((a, b) => (a.order > b.order ? 1 : -1));
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    selectRow(value, row) {
      if (row.isSelected) {
        this.canCreateStops = false;
        this.activeRouteID = null;
        row.select(false);
        this.stops = [];
      } else {
        this.canCreateStops = true;
        this.activeRouteID = value.id;
        row.select(true);

        this.getRequestAllStops();
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
        isInRange: item.inRange,
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
          console.log(response.data);
          this.markers = response.data.map(this.getDisplayMarkers);
          var bounds = new this.google.maps.LatLngBounds();
          for (var i = 0; i < this.markers.length; i++) {
            bounds.extend(this.markers[i].position);
          }
          this.$refs.mapRef.$mapPromise.then((map) => {
            map.fitBounds(bounds);
          });

          this.getRequestAllRoutes();
        })
        .catch((err) => {
          this.showSnackBarMapError();
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
      if (this.activeRouteID == null) return;
      if (m.routeID == this.activeRouteID) {
        this.updateMarker(m.parentID, null);
      } else {
        this.updateMarker(m.parentID, this.activeRouteID);
      }
    },
    getMarkerIcons(m) {
      if (m.isSchool == true) return this.schoolMapMarker.icon;
      if (m.routeID == null) return this.mapMarkerUnassigned.icon;
      if (m.routeID == this.activeRouteID && m.isInRange == true) {
        return this.mapMarkerActiveInRange.icon;
      }
      if (m.routeID == this.activeRouteID && m.isInRange == false) {
        return this.mapMarkerActiveNotInRange.icon;
      }
      return this.mapMarker.icon;
    },
    getMarkerLabels(m) {
      if (m.isSchool == true) return this.schoolMapMarker.label;
      if (m.routeID == null) return this.mapMarkerUnassigned.label;
      if (m.routeID == this.activeRouteID && m.isInRange == true) {
        return this.mapMarkerActiveInRange.label;
      }
      if (m.routeID == this.activeRouteID && m.isInRange == false) {
        return this.mapMarkerActiveNotInRange.label;
      }
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
    updateStopPosition(event, m) {
      base_endpoint
        .patch(
          "/api/stop/update/" + m.id,
          {
            name: m.name,
            order: m.order,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {})
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    moveCircle(event, index) {
      this.stops[index].position.lat = event.latLng.lat();
      this.stops[index].position.lng = event.latLng.lng();
    },
    onCloneCallback(item) {
      // Create a fresh copy of item
      const cloneMe = JSON.parse(JSON.stringify(item));
      this.reorderedStop = cloneMe;
      return cloneMe;
    },
    onMoveCallback() {
      //console.log("onMoveCallback");
      //const item = evt.draggedContext.element;
      //const futIdx = evt.draggedContext.futureIndex;
      //console.log(evt);
    },
    onDropCallback(evt) {
      base_endpoint
        .patch(
          "/api/stop/update/" + this.reorderedStop.id,
          {
            name: this.reorderedStop.name,
            order: evt.newIndex + 1,
            latitude: this.reorderedStop.position.lat,
            longitude: this.reorderedStop.position.lng,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {
          this.getRequestAllStops();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    editRouteItem(item) {
      this.editedRouteIndex = this.routes.indexOf(item);
      this.editedRoute = Object.assign({}, item);
    },

    deleteRouteItem(item) {
      const index = this.routes.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.routes.splice(index, 1);
    },
    saveRoute() {
      if (this.editedRouteIndex > -1) {
        Object.assign(this.routes[this.editedRouteIndex], this.editedRoute);
      }
      this.closeRoute();

      base_endpoint
        .patch(
          "/api/route/update/" + this.editedRoute.id,
          {
            name: this.editedRoute.name,
            description: this.editedRoute.description,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {})
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    closeRoute() {
      setTimeout(() => {
        this.editedRoute = Object.assign({}, this.defaultRoute);
        this.editedRouteIndex = -1;
      }, 300);
    },
    editStopItem(item) {
      this.editedStopIndex = this.stops.indexOf(item);
      this.editedStop = Object.assign({}, item);
    },

    deleteStopItem(item) {
      const index = this.stops.indexOf(item);
      this.stops.splice(index, 1);
      this.snackbar3 = true;
      this.snackbar2 = false;

      base_endpoint
        .delete("/api/stop/delete/" + item.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then(() => {
          this.stops = [];
          this.getRequestAllStops();
          this.snackbar3 = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveStop() {
      if (this.editedStopIndex > -1) {
        Object.assign(this.stops[this.editedStopIndex], this.editedStop);
      }
      this.closeStop();

      base_endpoint
        .patch(
          "/api/stop/update/" + this.editedStop.id,
          {
            name: this.editedStop.name,
            order: this.editedStop.order,
            latitude: this.editedStop.position.lat,
            longitude: this.editedStop.position.lng,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    closeStop() {
      setTimeout(() => {
        this.editedStop = Object.assign({}, this.defaultStop);
        this.editedStopIndex = -1;
      }, 300);
    },
    addStopMarker(event) {
      var newStop = {
        name: this.stopName,
        position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
        label: {
          text: null,
          fontFamily: "Roboto",
          color: "#ffffff",
          fontSize: "18px",
        },
      };
      if (this.canPlaceStopMarker) {
        this.stops.push(newStop);
      }

      if (this.canPlaceStopMarker) {
        this.snackbar3 = true;
        this.snackbar2 = false;
        base_endpoint
          .post(
            "/api/stop/create",
            {
              name: this.stopName,
              route: this.activeRouteID,
              latitude: event.latLng.lat(),
              longitude: event.latLng.lng(),
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then(() => {
            this.stops = [];
            this.getRequestAllStops();
            this.snackbar3 = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.canPlaceStopMarker = false;
    },
    enableStopMarkerCreation() {
      this.canPlaceStopMarker = true;
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
    activeHeaders() {
      return this.headers.filter((h) => {
        if (!this.allowDrag && h.value === "lock") {
          return false;
        }
        return true;
      });
    },
  },
};
</script>

<style>
tr.v-data-table__selected {
  background: #add8e6 !important;
}
.txt:hover {
          text-decoration: underline;
      }
</style>
