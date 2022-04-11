<template>
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
      class="row-pointer"
    >
      <template v-slot:[`item.routeComplete`]="{ item }">
        <v-icon v-if="item.routeComplete == false" color="red">
          mdi-close
        </v-icon>
        <v-icon v-if="item.routeComplete == true"> mdi-check </v-icon>
      </template>

      <template v-slot:[`item.driverName`]="{ item }">
        <span
          text
          @click="viewUser(item.driverID)"
          class="txt blue--text text--darken-4"
        >
          {{ item.driverName }}
        </span>
      </template>
      <template v-slot:[`item.schoolName`]="{ item }">
        <span
          text
          @click="viewSchool(item.schoolID)"
          class="txt blue--text text--darken-4"
        >
          {{ item.schoolName }}
        </span>
      </template>
      <template v-slot:[`item.routeName`]="{ item }">
        <span
          text
          @click="viewRoute(item.routeID)"
          class="txt blue--text text--darken-4"
        >
          {{ item.routeName }}
        </span>
      </template>
      <template v-slot:[`item.direction`]="{ item }">
        <span v-if="item.direction == 'to'">To-School</span>
        <span v-if="item.direction != 'to'">From-School</span>
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
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    getDisplayLog(item) {
      var startTime = moment.utc(item.start_time);
      return {
        driverID: item.driver_id,
        driverName: item.driver_name,
        busNumber: item.bus,
        schoolID: item.school_id,
        schoolName: item.school_name,
        routeID: item.route_id,
        routeName: item.route_name,
        direction: item.direction,
        startDateAndTime: startTime.local().format("M/D/YYYY h:mm A"),
        duration: item.duration,
      };
    },
    viewUser(item) {
      this.$router.push({ name: "AdminUserDetail", query: { id: item } });
    },
    viewSchool(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item } });
    },
    viewRoute(item) {
      this.$router.push({ name: "AdminRouteDetail", query: { id: item } });
    },
    getRequestAllRoutes() {
      base_endpoint
        .get("/api/getlogs", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.logs = response.data.map(this.getDisplayLog);
          //this.$store.state.addresses = response.data;
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
    this.getRequestAllRoutes();
    this.search = this.$route.query.name;
  },
};
</script>

<style>
.txt:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>