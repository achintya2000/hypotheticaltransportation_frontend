<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title class="font-weight-black">
      {{ schoolName }}
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialog2"
        width="500"
        v-if="this.userType != 'busDriver'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Modify
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> Modify </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid2" lazy-validation>
              <v-text-field
                v-model="newSchoolName"
                :rules="nameValidateArray"
                label="Name"
                required
                v-if="this.userType == 'admin'"
              ></v-text-field>

              <gmap-autocomplete
                @place_changed="setPlace"
                v-if="this.userType == 'admin'"
              >
                <template v-slot:input="slotProps">
                  <v-text-field
                    v-model="newAddress"
                    label="Address"
                    :rules="addressValidateArray"
                    ref="input"
                    v-on:listeners="slotProps.listeners"
                    v-on:attrs="slotProps.attrs"
                    required
                  ></v-text-field>
                </template>
              </gmap-autocomplete>

              <v-text-field
                v-model="newBusArriveTime"
                label="Bus Arrival Time"
                type="time"
                :rules="busArriveValidateArray"
                required
              ></v-text-field>

              <v-text-field
                v-model="newBusDepTime"
                label="Bus Departure Time"
                type="time"
                :rules="busDepValidateArray"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid2"
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
                  newSchoolName = schoolName;
                  newAddress = schoolAddress;
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" width="500" v-if="this.userType == 'admin'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Delete School
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-subtitle>
            Are you sure you want to delete the school? To continue, type the
            name of the school below
          </v-card-subtitle>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="deleteName"
                :rules="deleteValidationArray"
                label="School Name"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validateForDelete"
                type="submit"
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

      <v-btn
        style="margin: 10px"
        @click="planNewRoute"
        outlined
        v-if="this.userType != 'busDriver'"
        >Create/Edit Routes</v-btn
      >
      <send-email
        v-if="this.userType != 'busDriver'"
        :typeOfEmail="'schoolGA'"
        :relevantID="this.$route.query.id"
        :relevantName="this.schoolName"
      ></send-email>
    </v-card-title>
    <v-row>
      <v-col>
        <v-card-subtitle class="black--text">
          <span class="black--text font-weight-bold"> Address: </span
          ><span class="black--text"> {{ schoolAddress }} </span>
        </v-card-subtitle>

        <v-card-subtitle class="black--text">
          <span class="black--text font-weight-bold"> Bus Arrival Time: </span
          ><span class="black--text"> {{ busArriveTime }} </span>
        </v-card-subtitle>
        <v-card-subtitle class="black--text">
          <span class="black--text font-weight-bold"> Bus Departure Time: </span
          ><span class="black--text"> {{ busDepTime }} </span>
        </v-card-subtitle>
      </v-col>
      <v-col>
        <GmapMap
          style="width: 100%; height: 400px"
          ref="mapRef"
          :center="center"
          :zoom="12"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :icon="m.icon"
            :label="m.label"
          />
        </GmapMap>
      </v-col>
    </v-row>

    <v-card-title> Bus Routes </v-card-title>

    <v-data-table
      :headers="routeHeaders"
      :items="busRoutes"
      :search="search"
      :sort-by="['routeName']"
      @click:row="viewRoute"
      class="row-pointer"
    >
      <template v-slot:[`item.routeComplete`]="{ item }">
        <v-icon v-if="item.routeComplete == false" color="red">
          mdi-close
        </v-icon>
        <v-icon v-if="item.routeComplete == true"> mdi-check </v-icon>
      </template>
    </v-data-table>

    <v-card-title> Students </v-card-title>

    <v-data-table
      :headers="studentsHeaders"
      :items="students"
      :search="search"
      :sort-by="['studentName']"
      @click:row="viewStudent"
      class="row-pointer"
    >
      <template v-slot:[`item.studentRoute`]="{ item }">
        <div v-if="item.studentRoute">{{ item.studentRoute }}</div>
        <div v-if="!item.studentRoute" style="color: red">No Route</div>
      </template>
      <template v-slot:[`item.studentInRange`]="{ item }">
        <v-icon v-if="item.studentInRange == false" color="red">
          mdi-close
        </v-icon>
        <v-icon v-if="item.studentInRange == true"> mdi-check </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import moment from "moment";
import SendEmail from "../components/SendEmail.vue";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";
import { schoolMapMarker } from "../assets/markers";

export default {
  components: {
    SendEmail,
  },
  data() {
    return {
      schoolMarker: null,
      schoolMapMarker,
      center: { lat: 36.001465, lng: -78.939133 },
      markers: [],
      intervalId: null,
      firstBusLoc: true,
      schoolName: "",
      schoolAddress: "",
      newBusArriveTime: "",
      newBusDepTime: "",
      busArriveTime: "",
      busDepTime: "",
      search: "",
      valid: true,
      valid2: true,
      dialog: false,
      dialog2: false,
      latitude: 0,
      longitude: 0,
      formatted_address: "",
      newSchoolName: "",
      userType: "",
      userID: "",
      newAddress: "",
      deleteName: "",
      routeHeaders: [
        {
          text: "Name",
          align: "start",
          value: "routeName",
        },
        { text: "Description", value: "routeDescription" },
        { text: "# of Students", value: "routeNumStudent" },
        { text: "Completion Status", value: "routeComplete", sortable: false },
      ],
      busRoutes: [],
      studentsHeaders: [
        {
          text: "Name",
          align: "start",
          value: "studentName",
        },
        { text: "Route", value: "studentRoute" },
        { text: "Parent", value: "studentParent" },
        { text: "In-Range Status", value: "studentInRange", sortable: false },
      ],
      students: [],
      deleteValidationArray: [this.deleteValidation],
      nameValidateArray: [this.nameValidate],
      addressValidateArray: [this.addressValidate],
      busArriveValidateArray: [this.busArriveValidate],
      busDepValidateArray: [this.busDepValidate],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    showSnackBarAddress() {
      this.snackBar(
        "Uh-Oh! Something Went Wrong! Make sure to click the Autofill result to complete your Address!"
      );
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
        .get("/api/getschoolintransitlogs/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log("GOT HERE");
          console.log(response);
          this.logs = response.data.map(this.getDisplayLog);
          //this.$store.state.addresses = response.data;
          this.markers = [];
          this.markers.push(this.schoolMarker);

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
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },
    planNewRoute() {
      this.$router.push({
        name: "AdminRoutePlanner",
        query: { id: this.$route.query.id },
      });
    },
    viewRoute(row) {
      this.$router.push({
        name: "AdminRouteDetail",
        query: { id: row.routeId },
      });
    },
    viewStudent(row) {
      this.$router.push({
        name: "AdminStudentDetail",
        query: { id: row.studentId },
      });
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    getSchoolInfo() {
      base_endpoint
        .get("/api/school/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })

        .then((response) => {
          this.schoolName = response.data.name;
          this.newSchoolName = response.data.name;
          this.schoolAddress = response.data.address;
          this.newAddress = response.data.address;
          this.latitude = response.data.latitude;
          this.longitude = response.data.longitude;
          this.formatted_address = response.data.address;
          var arrTime = moment.utc(response.data.arrivalTime);
          this.busArriveTime = arrTime.local().format("h:mm A");
          var depTime = moment.utc(response.data.departureTime);
          this.busDepTime = depTime.local().format("h:mm A");
          var newarrTime = moment.utc(response.data.arrivalTime);
          this.newBusArriveTime = newarrTime.local().format("HH:mm");
          var newdepTime = moment.utc(response.data.departureTime);
          this.newBusDepTime = newdepTime.local().format("HH:mm");

          this.schoolMarker = {
            position: { lat: this.latitude, lng: this.longitude },
            icon: schoolMapMarker.icon,
            label: schoolMapMarker.label,
          };

          this.markers.push(this.schoolMarker);

          this.intervalId = setInterval(this.getRequestAllRoutes, 1000);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    getDisplayRoutes(item) {
      return {
        routeId: item.id,
        routeName: item.name,
        routeDescription: item.description,
        routeNumStudent: item.student_count,
        routeComplete: item.complete,
      };
    },
    getSchoolRoutes() {
      base_endpoint
        .get("/api/route/getallfromschool/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.busRoutes = response.data.map(this.getDisplayRoutes);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    getDisplayStudents(item) {
      return {
        studentId: item.id,
        studentName: item.name,
        studentRoute: item.route,
        studentParent: item.parent,
        studentInRange: item.inRange,
      };
    },
    getStudents() {
      base_endpoint
        .get("/api/student/getallfromschool/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudents);
          console.log(this.students);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    submitDataForDelete() {
      base_endpoint
        .delete("/api/school/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminSchoolList" });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    validateForDelete() {
      //this.$refs.form.validate();
      if (this.deleteName != "" && this.deleteName != null) {
        this.submitDataForDelete();
        this.dialog = false;
        this.$emit(
          "schoolmodified",
          "A school has been modified and sent to database"
        );
      }
    },
    submitDataForModify() {
      base_endpoint
        .patch(
          "/api/school/update/" + this.$route.query.id,
          {
            name: this.newSchoolName,
            address: this.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
            // arrivalTime: new Date("2021-01-01 " + this.busArriveTime + ":00"),
            // departureTime: new Date("2021-01-01 " + this.busDepTime + ":00"),
            arrivalTime: new moment(
              "2021-01-01 " + this.newBusArriveTime + ":00",
              "YYYY-MM-DD hh:mm:ss"
            ),
            departureTime: new moment(
              "2021-01-01 " + this.newBusDepTime + ":00",
              "YYYY-MM-DD hh:mm:ss"
            ),
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.getSchoolInfo();
        })
        .catch((err) => {
          this.showSnackBarAddress();
          console.log(err);
        });
    },
    validateForModify() {
      console.log("HERE" + this.busArriveTime + "HERE");
      if (
        this.newSchoolName != "" &&
        this.newSchoolName != null &&
        this.newAddress != "" &&
        this.newAddress != null &&
        this.newBusArriveTime != "" &&
        this.newBusArriveTime != null &&
        this.newBusDepTime != "" &&
        this.newBusDepTime != null
      ) {
        console.log("Did it get here?");
        this.$refs.form.validate();
        this.submitDataForModify();
        this.dialog2 = false;
        this.$emit(
          "schoolmodified",
          "A school has been modified and sent to database"
        );
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    deleteValidation() {
      if (this.deleteName == "" || this.deleteName == null) {
        return "Name is required";
      } else if (
        this.deleteName.toLowerCase() != this.schoolName.toLowerCase()
      ) {
        return "The name typed must match the school name";
      } else {
        return true;
      }
    },
    nameValidate() {
      if (this.newSchoolName == "" || this.newSchoolName == null) {
        return "Name is required";
      } else {
        return true;
      }
    },
    addressValidate() {
      if (this.newAddress == "" || this.newAddress == null) {
        return "Address is required";
      } else {
        return true;
      }
    },
    busArriveValidate() {
      if (this.newBusArriveTime == "" || this.newBusArriveTime == null) {
        return "Bus Arrival Time is required, remember to type AM or PM";
      } else {
        return true;
      }
    },
    busDepValidate() {
      console.log("Hello 2: " + this.busDepTime);
      if (this.newBusDepTime == "" || this.newBusDepTime == null) {
        return "Bus Departure Time is required, remember to type AM or PM";
      } else {
        return true;
      }
    },
  },
  computed: {
    google: gmapApi,
  },
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getSchoolInfo();
    this.getSchoolRoutes();
    this.getStudents();

    //this.intervalId = setInterval(this.getRequestAllRoutes, 1000);
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