<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title>
      Your Routes
      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" width="500">
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
            <v-form ref="form">
              <v-text-field
                v-model="busNum"
                placeholder="Bus Number"
                @change="forceSubmitRoute = false"
              ></v-text-field>

              <v-autocomplete
                @change="forceSubmitRoute = false"
                v-model="selectedRoute"
                item-text="name"
                label="Select Route"
                :items="schools"
                return-object
              ></v-autocomplete>

              <v-radio-group
                v-model="radioGroup"
                @change="forceSubmitRoute = false"
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
              <v-btn class="mr-4"> Stop </v-btn>

              <v-btn @click="dialog2 = false"> Cancel </v-btn>
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
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      forceSubmitRoute: false,
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
      search: "",
      userType: "",
      userID: "",
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
    getCurrentRunInfo() {

    },
    getRouteStatus() {
      base_endpoint
        .get("/api/intransit", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((res) => {
          this.cur_routeInTransit = res.data.in_transit;
          this.cur_routeID = res.data.route_id;
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