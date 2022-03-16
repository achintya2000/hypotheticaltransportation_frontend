<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title class="font-weight-black">
      {{ routeName }}
      <v-spacer></v-spacer>
      <v-btn @click="planNewRoute" outlined v-if="this.userType!='busDriver'">Modify Route</v-btn>
      <v-dialog v-model="dialog2" width="50%" v-if="this.userType!='busDriver'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            style="margin: 10px"
            outlined
            v-bind="attrs"
            v-on="on"
            @click="newmethod"
          >
            Modify Name and Description
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Modify Name and Description
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="newRouteName"
                    :rules="nameValidateArray"
                    label="Route Name"
                    required
                  ></v-text-field>

                  <v-textarea
                    v-model="newRouteDescription"
                    label="Route Description"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validateForModify"
                type="submit"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog2 = false;
                  newRouteName = routeName;
                  newRouteDescription = routeDescription;
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog style="margin: 10px" v-model="dialog" width="500" v-if="this.userType!='busDriver'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on"> Delete </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-spacer></v-spacer>

              <v-btn color="error" class="mr-4" @click="submitDataForDelete">
                Yes, Delete
              </v-btn>

              <v-btn color="success" @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <send-email
        :typeOfEmail="'routeRA'"
        :relevantID="this.$route.query.id"
        :relevantName = this.routeName
        v-if="this.userType!='busDriver'"
      ></send-email>
    </v-card-title>

    <v-row>
      <v-col md="3">
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> School: </span>
          <span
            text
            @click="viewSchool(routeSchoolID)"
            class="txt blue--text text--darken-4"
          >
            {{ routeSchool }}
          </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold">Status: </span>
          <span text class="red--text" v-if="routeStatus == false">
            Not Complete
          </span>
          <span text class="black--text" v-if="routeStatus == true">
            Complete
          </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Description: </span>
          <br />
          <span
            style="white-space: pre"
            class="black--text"
            v-if="routeDescription != ''"
            >{{ routeDescription }}</span
          >
          <span
            style="white-space: pre"
            class="black--text"
            v-if="routeDescription == ''"
            >No Route Descritpion</span
          >
        </v-card-subtitle>
      </v-col>
      <v-col md="9">
        <GmapMap
          style="width: 100%; height: 400px"
          ref="mapRef"
          @click="handleMapClick($event)"
          :center="center"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :label="m.label"
            :icon="m.icon"
          />
          <GmapMarker
            :key="'stop_' + index"
            v-for="(m, index) in stops"
            :position="m.position"
            :icon="stopMapMarker.icon"
            :label="m.label"
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
      <v-col>
        <v-card-title>Students: </v-card-title>
        <v-data-table
          :headers="headers"
          :items="students"
          :search="search"
          @click:row="viewItem"
          class="row-pointer"
        >
          <template v-slot:[`item.studentInRange`]="{ item }">
            <v-icon v-if="item.studentInRange == false" color="red">
              mdi-close
            </v-icon>
            <v-icon v-if="item.studentInRange == true"> mdi-check </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col>
        <v-card-title>Stops: </v-card-title>
        <v-data-table :headers="stopHeaders" :items="stops"> </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import {
  mapMarkerActiveInRange,
  mapMarkerActiveNotInRange,
  schoolMapMarker,
  stopMapMarker,
} from "../assets/markers";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";
import SendEmail from "../components/SendEmail.vue";
import moment from "moment";

export default {
  components: {
    SendEmail,
  },
  data() {
    return {
      mapMarkerActiveInRange,
      mapMarkerActiveNotInRange,
      schoolMapMarker,
      stopMapMarker,
      center: { lat: 36.001465, lng: -78.939133 },
      routeName: "",
      newRouteName: "",
      routeSchool: "",
      routeStatus: "",
      routeSchoolID: "",
      newRouteSchool: null,
      routeDescription: "",
      newRouteDescription: "",
      search: "",
      valid: true,
      userType: "",
      userID: "",
      dialog: false,
      dialog2: false,
      oldSchoolID: "",
      busArriveTime: "",
      busDepTime: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Parent", value: "studentParent" },
        { text: "In-Range Status", value: "studentInRange", sortable: false },
      ],
      stopHeaders: [
        { text: "Order", align: "start", value: "order" },
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Pick Up Time", align: "start", value: "pickupTime" },
        { text: "Drop Off Time", align: "start", value: "dropoffTime" },
      ],
      students: [],
      stops: [],
      nameValidateArray: [this.nameValidate],
      markers: [],
    };
  },
  methods: {
    getSchoolInfo() {
      console.log("Here: " + this.busArriveTime);
      base_endpoint
        .get("/api/school/get/" + this.routeSchoolID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })

        .then((response) => {
          var arrTime = moment.utc(response.data.arrivalTime);
          this.busArriveTime = arrTime.local().format("h:mm A");
          console.log("Here: " + this.busArriveTime);
          var depTime = moment.utc(response.data.departureTime);
          this.busDepTime = depTime.local().format("h:mm A");
          console.log("Here 2: " + this.busDepTime);
          this.getRequestAllStops();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    newmethod() {
      var bounds = new this.google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].position);
      }
      this.$refs.mapRef2.$mapPromise.then((map) => {
        map.fitBounds(bounds);
      });
    },
    handleMapClick(event) {
      console.log(event.latLng.lat());
      console.log(event.latLng.lng());
    },
    viewSchool(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item } });
    },
    planNewRoute() {
      this.$router.push({
        name: "AdminRoutePlanner",
        query: { id: this.routeSchoolID },
      });
    },
    getRouteInfo() {
      base_endpoint
        .get("/api/route/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.routeName = response.data.name;
          this.newRouteName = response.data.name;
          this.routeSchool = response.data.school;
          this.routeSchoolID = response.data.school_id;
          this.newRouteSchool = response.data.school;
          this.routeDescription = response.data.description;
          this.newRouteDescription = response.data.description;
          this.oldSchoolID = response.data.school.id;
          this.routeStatus = response.data.complete;
          this.getSchoolInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitDataForModify() {
      base_endpoint
        .patch(
          "/api/route/update/" + this.$route.query.id,
          {
            name: this.newRouteName,
            description: this.newRouteDescription,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.getRouteInfo();
          this.getStudentsInRoute();
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
    getRequestAllStops() {
      base_endpoint
        .get("/api/stop/getallfromroute/" + this.$route.query.id, {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        })
        .then((response) => {
          this.stops = response.data.map(this.getDisplayStops);
          this.stops.sort((a, b) => (a.order > b.order ? 1 : -1));
          this.dict = {
            order: "School",
            name: this.routeSchool,
            pickupTime: this.busArriveTime,
            dropoffTime: this.busDepTime,
          };
          this.stops.push(this.dict);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    validateForModify() {
      this.$refs.form.validate();
      this.submitDataForModify();
      this.dialog2 = false;
      this.$emit(
        "schoolmodified",
        "A school has been modified and sent to database"
      );
    },
    getDisplayStudents(item) {
      return {
        name: item.name,
        id: item.id,
        studentParent: item.parent,
        studentInRange: item.inRange,
      };
    },
    getDisplayRouteMarkers(item) {
      return {
        position: { lat: item.latitude, lng: item.longitude },
        isSchool: item.is_school,
        icon: item.is_school
          ? this.schoolMapMarker.icon
          : item.inRange
          ? this.mapMarkerActiveInRange.icon
          : this.mapMarkerActiveNotInRange.icon,
        label: item.is_school
          ? this.schoolMapMarker.label
          : item.inRange
          ? this.mapMarkerActiveInRange.label
          : this.mapMarkerActiveNotInRange.label,
      };
    },
    submitDataForDelete() {
      this.dialog = false;
      base_endpoint
        .delete("/api/route/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminRouteList" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getStudentsInRoute() {
      base_endpoint
        .get("/api/student/getallfromroute/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudents);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRouteMarkers() {
      base_endpoint
        .get("/api/route/getlocations/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response.data);
          this.markers = response.data.map(this.getDisplayRouteMarkers);
          console.log(this.markers);

          var bounds = new this.google.maps.LatLngBounds();
          for (var i = 0; i < this.markers.length; i++) {
            bounds.extend(this.markers[i].position);
          }
          this.$refs.mapRef.$mapPromise.then((map) => {
            map.fitBounds(bounds);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMarkers(m) {
      if (m.isSchool == true) return this.schoolMapMarker;
      return this.mapMarker;
    },
    nameValidate() {
      if (this.newRouteName == "" || this.newRouteName == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    viewItem(item) {
      this.$router.push({ name: "AdminStudentDetail", query: { id: item.id } });
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getRouteInfo();
    console.log("Here 3: " + this.routeSchoolID);

    this.getStudentsInRoute();
    this.getRouteMarkers();
  },
  computed: {
    google: gmapApi,
  },
};
</script>

<style>
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {  
  cursor: pointer;
}
</style>
