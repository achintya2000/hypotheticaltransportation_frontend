<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title>
      Your Routes
      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" width="500" v-if="this.userType=='busDriver'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Start A Run
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="busNum"
                placeholder="Bus Number"
                @change="forceSubmitRoute = false"
                :rules="busNumberValidateArray"
              ></v-text-field>

              <v-autocomplete
                @change="forceSubmitRoute = false"
                v-model="selectedRoute"
                item-text="name"
                label="Select Route"
                :items="schools"
                :rules="busRouteValidateArray"
                return-object
              ></v-autocomplete>

              <v-radio-group
                v-model="radioGroup"
                @change="forceSubmitRoute = false"
                :rules="busDirectionValidateArray"
              >
                <v-radio :key="1" :label="`To School`" :value="`to`"></v-radio>
                <v-radio
                  :key="2"
                  :label="`From School`"
                  :value="`from`"
                ></v-radio>
              </v-radio-group>

              <v-btn class="mr-4" @click="startRun">
                {{ submitBtnText }}
              </v-btn>

              <v-btn @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-if="cur_routeInTransit" v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Stop A Run
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-btn class="mr-4" @click="stopRun"> Stop </v-btn>

              <v-btn @click="dialog2 = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-if="cur_routeInTransit" v-model="dialog3" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Mark Stop as Reached
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-autocomplete
                v-model="stopSelected"
                item-text="name"
                :rules="stopValidateArray"
                label="Stop you just reached:"
                :items="stops"
                return-object
              ></v-autocomplete>

              <v-btn class="mr-4" @click="submitNewStopReached"> Submit </v-btn>

              <v-btn @click="dialog3 = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="routeSuccess" outlines color="green">
        Run Started
      </v-snackbar>
      <v-snackbar v-model="routeError" outlines color="red">
        {{ this.routeErrorText }}
      </v-snackbar>

      <v-snackbar v-model="routeStop" outlines color="green">
        Run Stopped
      </v-snackbar>

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
      :items="schools"
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
      <template v-slot:[`item.inTransit`]="{ item }">
        <div v-if="item.inTransit==true"> In Transit </div>
        <div v-if="item.inTransit==false"> Not In Transit </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      forceSubmitRoute: false,
      stopSelected: "",
      routeSuccess: false,
      routeError: false,
      routeStop: false,
      routeErrorText: "",
      radioGroup: null,
      busNum: "",
      selectedRoute: null,
      selectedRouteCancel: null,
      dialog: false,
      dialog2: false,
      dialog3: false,
      search: "",
      userType: "",
      cur_direction: "",
      userID: "",
      stops:  [],
      routeSchool: "",
      routeSchoolID: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "School", value: "school" },
        { text: "Description", value: "description", sortable: false },
        { text: "# of Students", value: "student_count" },
        { text: "Completion Status", value: "routeComplete", sortable: false },
        { text: "In Transit Status", value: "inTransit", sortable: false },
        { text: "In Transit Bus", value: "busNumber", sortable: false },
        { text: "In Transit Driver", value: "routeName", sortable: false },
      ],
      schools: [],
      cur_routeInTransit: false,
      cur_routeID: 0,
      cur_routeName: "",
      busNumberValidateArray: [this.busNumberValidate],
      busRouteValidateArray: [this.busRouteValidate],
      busDirectionValidateArray: [this.busDirectionValidate],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(item) {
      this.$router.push({ name: "AdminRouteDetail", query: { id: item.id } });
    },
    busNumberValidate() {
      if (isNaN(this.busNum) == true) {
        return "Bus number must be a number";
      } else if (isNaN(this.busNum) == false) {
        if (parseInt(this.busNum) < 1 || parseInt(this.busNum) > 99999) {
          return "Bus number must be between 1 and 99999";
        }
      } else {
        return true;
      }
    },
    busRouteValidate() {
      if (this.selectedRoute == null || this.selectedRoute == "") {
        return "Bus route is required";
      } else {
        return true;
      }
    },
    busDirectionValidate() {
      if (this.radioGroup == null || this.radioGroup == "") {
        return "Bus direction is required";
      } else {
        return true;
      }
    },
    getDisplayRoute(item) {
      return {
        name: item.name,
        school: item.school,
        description: item.description,
        student_count: item.student_count,
        id: item.id,
        routeComplete: item.complete,
        inTransit: item.in_transit,
        busNumber: item.bus_id,
        routeName: item.driver_name,
      };
    },
    getRequestAllRoutes() {
      base_endpoint
        .get("/api/route/getall/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schools = response.data.map(this.getDisplayRoute);
          this.schools.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    startRun() {
      if ((this.busNum != null && this.busNum != "") && 
          (this.selectedRoute != null && this.selectedRoute != "") && 
          (this.radioGroup != null && this.radioGroup != "")) {
          base_endpoint
            .post(
              "/api/startrun",
              {
                route: this.selectedRoute.id,
                bus: this.busNum,
                direction: this.radioGroup,
                forcesubmit: this.forceSubmitRoute,
              },
              {
                headers: {
                  Authorization: `Token ${this.$store.state.accessToken}`,
                },
              }
            )
            .then((res) => {
              console.log(res);
              if (res.data.error != "") {
                this.routeErrorText = res.data.error;
                this.routeError = true;
                this.forceSubmitRoute = true;
              } else {
                this.routeSuccess = true;
              }
              this.dialog = false;
              this.getRouteStatus();
            });
          }
    },
    stopRun() {
      base_endpoint
        .post(
          "/api/stoprun",
          {
            route: this.cur_routeID,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {
          this.routeStop = true;
          this.dialog2 = false;
          this.getRouteStatus();
        });
    },
    getRequestAllStops() {
      base_endpoint
        .get("/api/stop/getallfromroute/" + this.cur_routeID, {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        })
        .then((response) => {
          this.stops = response.data.map(this.getDisplayStops);
          if (this.cur_direction == "to") {
            this.stops.sort((a, b) => (a.order > b.order ? 1 : -1));
          } else {
            this.stops.sort((a, b) => (a.order > b.order ? -1 : 1));
          }
          
          base_endpoint
          .get("/api/route/get/" + this.cur_routeID, {
            headers: { Authorization: `Token ${this.$store.state.accessToken}` },
          })
          .then((response) => {
            this.routeSchool = response.data.school;
            this.routeSchoolID = response.data.school_id;
          })
          .catch((err) => {
            console.log(err);
          });
          
          console.log("Here are the stops");
          console.log(this.stops);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    submitNewStopReached() {
      base_endpoint
        .patch(
          "/api/updatelogstop",
          {
            stop: this.stopSelected.id,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {
          this.dialog3 = false;
        });
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
    getRouteStatus() {
      base_endpoint
        .get("/api/intransit", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((res) => {
          this.cur_routeInTransit = res.data.in_transit;
          this.cur_routeID = res.data.route_id;
          this.cur_direction = res.data.direction;
          this.cur_routeName = res.data.route_name;
          if (this.cur_routeInTransit) {
            this.getRequestAllStops();
          }
        });
    },
  },
  computed: {
    submitBtnText() {
      return this.forceSubmitRoute ? "Force Submit" : "Submit";
    },
  },
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getRequestAllRoutes();
    this.getRouteStatus();
  },
};
</script>

<style>
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {
  cursor: pointer;
}
</style>