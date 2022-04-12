<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title class="font-weight-black">
      {{ studentName }}
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
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="newStudentName"
                label="Student Name"
                :rules="studentNameValidateArray"
                required
              ></v-text-field>

              <v-text-field
                v-model="newStudentId"
                label="Student ID"
                :rules="studentIDValidateArray"
              ></v-text-field>

              <v-autocomplete
                v-model="newStudentParent"
                :items="parentItems"
                item-text="full_name"
                label="Parent"
                :rules="studentParentValidateArray"
                return-object
              ></v-autocomplete>

              <v-autocomplete
                v-model="newStudentSchool"
                :items="schoolItems"
                item-text="name"
                label="School Name"
                :rules="studentSchoolValidateArray"
                return-object
              ></v-autocomplete>
              <v-text>Give Student Accont:</v-text>
              <v-radio-group v-model="newStudentAccountState" row dense>
                <v-radio label="Yes" :value="true"></v-radio>
                <v-radio label="No" :value="false"></v-radio>
              </v-radio-group>
              <v-text-field
                v-model="newStudentEmail"
                v-if="newStudentAccountState == true"
                :rules="studentEmailValidateArray"
                label="Student Email"
              ></v-text-field>
              <v-text-field
                v-model="newStudentPhone"
                v-if="newStudentAccountState == true"
                label="Student Phone Number"
                append-icon="mdi-phone"
              ></v-text-field>

              <v-btn
                color="success"
                class="mr-4"
                @click="updateStudent"
                :disabled="!valid"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog2 = false;
                  newStudentName = studentName;
                  newStudentId = studentId;
                  parent = studentParent;
                  school = studentSchool;
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog"
        width="500"
        v-if="this.userType != 'busDriver'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-radio-group v-model="studentDeleteChoice" row dense>
                <v-radio
                  v-if="studentAccountState == true"
                  label="Student Login Ability Only"
                  value="loginOnly"
                ></v-radio>
                <v-radio
                  label="Whole Student Profile"
                  value="wholeThing"
                ></v-radio>
              </v-radio-group>
              <v-spacer></v-spacer>

              <v-btn color="error" class="mr-4" @click="validateDelete">
                Yes, Delete
              </v-btn>

              <v-btn color="success" @click="dialog = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-row>
      <v-col>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> ID: </span>
          <span class="black--text" v-if="studentId != null">
            {{ studentId }}
          </span>
          <span class="black--text" v-if="studentId == null || studentId == ''">
            None
          </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Email: </span>
          <span class="black--text" v-if="studentEmail != null">
            {{ studentEmail }}
          </span>
          <span
            class="black--text"
            v-if="studentEmail == null || studentEmail == ''"
          >
            None
          </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Phone: </span>
          <span class="black--text" v-if="studentPhone != null">
            {{ studentPhone }}
          </span>
          <span
            class="black--text"
            v-if="studentPhone == null || studentPhone == ''"
          >
            None
          </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> School: </span>
          <span
            text
            @click="viewSchool(studentSchool.id)"
            class="txt blue--text text--darken-4"
          >
            {{ studentSchool.name }}
          </span>
        </v-card-subtitle>

        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Route: </span>
          <span
            text
            @click="viewRoute(studentRouteId)"
            class="txt blue--text text--darken-4"
            v-if="studentRoute != 'No route assigned'"
          >
            {{ studentRoute }}
          </span>

          <span
            text
            class="red--text"
            v-if="studentRoute == 'No route assigned'"
          >
            No Route Assigned
          </span>
        </v-card-subtitle>

        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Stop Status: </span>
          <span
            text
            class="black--text"
            v-if="
              studentRoute != 'No route assigned' &&
              studentInRangeStatus == true
            "
          >
            Stop(s) in Range
          </span>
          <span
            text
            class="red--text"
            v-if="
              studentRoute != 'No route assigned' &&
              studentInRangeStatus == false
            "
          >
            Stop(s) not in Range
          </span>

          <span
            text
            class="red--text"
            v-if="studentRoute == 'No route assigned'"
          >
            No Route Assigned
          </span>
        </v-card-subtitle>
        <v-data-table :headers="headers2" :items="stopsInRange"> </v-data-table>

        <v-card-subtitle>
          <span class="black--text font-weight-bold"> In Transit Status: </span
          ><span class="black--text"> {{ routeInTransit }} </span>
        </v-card-subtitle>
        <v-card-subtitle v-if="this.routeInTransit == true">
          <span class="black--text font-weight-bold"> In Transit Bus: </span
          ><span class="black--text"> {{ routeInTransitBus }} </span>
        </v-card-subtitle>
        <v-card-subtitle v-if="this.routeInTransit == true">
          <span class="black--text font-weight-bold"> In Transit Driver: </span
          ><span class="black--text"> {{ routeInTransitDriverName }} </span>
        </v-card-subtitle>

        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Parent: </span>
          <span
            text
            @click="viewParent(studentParent.id)"
            class="txt blue--text text--darken-4"
          >
            {{ studentParent.full_name }}
          </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Parent Email: </span>
          <span class="black--text"> {{ studentParentEmail }} </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Parent Address: </span>
          <span class="black--text"> {{ studentParentAddress }} </span>
        </v-card-subtitle>
        <v-card-subtitle>
          <span class="black--text font-weight-bold"> Parent Phone: </span>
          <span class="black--text"> {{ studentParentPhone }} </span>
        </v-card-subtitle>
      </v-col>
      <v-col>
        <GmapMap
          ref="mapRef"
          style="width: 100%; height: 400px"
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
          <GmapMarker
            :key="'bus_' + index"
            v-for="(m, index) in buses"
            :position="m.position"
            :icon="m.icon"
            :label="m.label"
          />
        </GmapMap>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import { stopMapMarker, bluePerson } from "../assets/markers";
import moment from "moment";
import { gmapApi } from "vue2-google-maps-withscopedautocomp";

export default {
  data() {
    return {
      bluePerson,
      stopMapMarker,
      center: { lat: 36.001465, lng: -78.939133 },
      studentName: "",
      dialog: false,
      dialog2: false,
      valid: false,
      name: "Old Name",
      nameRules: [(v) => !!v || "Name is required"],
      studentId: "",
      studentIDRules: [(v) => !!v || "Student ID is required"],
      parentValue: "Old Parent",
      parentRules: [(v) => !!v || "Parent is required"],
      schoolValue: "Old School",
      // schoolRules: [(v) => !!v || "School is required"],
      busRouteValue: "Old Bus Route",
      // busRouteRules: [(v) => !!v || "Bus Route is required"],
      markers: [],
      buses: [],
      firstBusLoc: true,
      intervalId: null,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "schoolName",
        },
        { text: "Address", value: "address" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      headers2: [
        {
          text: "Stop Name",
          align: "start",
          value: "name",
        },
        { text: "Pick Up Time", align: "start", value: "pickupTime" },
        { text: "Drop Off Time", align: "start", value: "dropoffTime" },
        { text: "ETA", align: "start", value: "eta" },
      ],
      schoolItems: [],
      parentItems: [],

      school: null,
      parent: null,
      studentSchool: "",
      studentRoute: "",
      studentEmail: "",
      studentPhone: "",
      newStudentPhone: "",
      studentInRangeStatus: "",
      studentParent: "",
      studentParentEmail: "",
      studentAccountState: null,
      newStudentAccountState: null,
      newStudentEmail: "",
      studentParentAddress: "",
      studentParentPhone: "",
      newStudentName: "",
      studentDeleteChoice: "",
      newStudentId: "",
      newStudentSchool: "",
      newStudentParent: "",
      userType: "",
      userID: "",
      allParentEmails2: [],
      routeInTransit: "",
      routeInTransitBus: "",
      routeInTransitDriverID: "",
      routeInTransitDriverName: "",
      studentNameValidateArray: [this.studentNameValidate],
      studentIDValidateArray: [this.studentIDValidate],
      studentSchoolValidateArray: [this.studentSchoolValidate],
      studentParentValidateArray: [this.studentParentValidate],
      studentEmailValidateArray: [this.studentEmailValidate],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    getStudentInfo() {
      base_endpoint
        .get("/api/student/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log("YOOO");
          console.log(response);
          console.log(this.parentItems);
          if (this.dialog2 == false && this.dialog == false) {
            this.newStudentName = response.data.full_name;
            this.newStudentSchool = response.data.school;
            this.newStudentId = response.data.sid;
            this.newStudentParent = response.data.parent;
            this.newStudentEmail = response.data.studentEmail;
            this.newStudentPhone = response.data.studentPhone;
            if (this.studentEmail == "" || this.studentEmail == null) {
              this.studentAccountState = false;
              this.newStudentAccountState = false;
              this.studentDeleteChoice = "wholeThing";
            } else {
              this.studentAccountState = true;
              this.newStudentAccountState = true;
              this.studentDeleteChoice = "loginOnly";
            }
          }
          this.studentName = response.data.full_name;

          this.studentId = response.data.sid;

          this.studentSchool = response.data.school;

          this.studentRoute = response.data.route;
          this.studentParent = response.data.parent;

          this.studentParentEmail = response.data.email;
          this.studentParentAddress = response.data.address;
          this.studentParentPhone = response.data.phone;
          this.studentSchoolId = response.data.school_id;
          this.studentRouteId = response.data.route_id;
          this.studentParentId = response.data.parent_id;
          this.studentInRangeStatus = response.data.inRange;

          this.studentEmail = response.data.studentEmail;

          

          this.studentPhone = response.data.studentPhone;

          this.routeInTransit = response.data.in_transit;
          this.routeInTransitBus = response.data.bus_id;
          this.routeInTransitDriverID = response.data.driver_id;
          this.routeInTransitDriverName = response.data.driver_name;

          this.buses = [];
          var busMarker = {
            position: {
              lat: response.data.latitude,
              lng: response.data.longitude,
            },
            icon: {
              path: this.google.maps.SymbolPath.CIRCLE,
              scale: 20,
              fillOpacity: 1,
              strokeWeight: 2,
              fillColor: "#5384ED",
              strokeColor: "#ffffff",
            },
            label: {
              text: response.data.bus_id.toString(),
            },
          };
          this.buses.push(busMarker);

          this.getSchools();
          this.getParents();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },

    getDisplaySchools(item) {
      return {
        name: item.name,
        address: item.address,
        id: item.id,
      };
    },
    getSchools() {
      base_endpoint
        .get("/api/school/getall/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolItems = response.data.map(this.getDisplaySchools);

          this.schoolItems.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });

          this.schoolItems.forEach((item) => {
            if (this.studentSchoolId == item.id) {
              this.school = item;
            }
          });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },

    getDisplayParents(item) {
      return {
        full_name: item.full_name,
        id: item.id,
      };
    },
    getParents() {
      base_endpoint
        .get("/api/profile/getallparentswithuserid/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.parentItems = response.data.map(this.getDisplayParents);

          this.parentItems.sort(function (a, b) {
            if (a.full_name < b.full_name) {
              return -1;
            }
            if (a.full_name > b.full_name) {
              return 1;
            }
            return 0;
          });

          this.parentItems.forEach((item) => {
            if (this.studentParentId == item.id) {
              this.parent = item;
            }
          });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    getDisplayStops(item) {
      var pTime = moment.utc(item.pickupTime);
      var dTime = moment.utc(item.dropoffTime);
      var etaTime = moment.utc(item.eta);
      var etaMessage = item.etaMessage;
      if (item.eta == null) {
        return {
          name: item.name,
          position: { lat: item.latitude, lng: item.longitude },
          pickupTime: pTime.local().format("h:mm A"),
          dropoffTime: dTime.local().format("h:mm A"),
          icon: this.stopMapMarker.icon,
          label: this.stopMapMarker.label,
          eta: etaMessage,
        };
      } else {
        return {
          name: item.name,
          position: { lat: item.latitude, lng: item.longitude },
          pickupTime: pTime.local().format("h:mm A"),
          dropoffTime: dTime.local().format("h:mm A"),
          icon: this.stopMapMarker.icon,
          label: this.stopMapMarker.label,
          eta: etaTime.local().format("h:mm A"),
          
        };
      }
    },
    getInRangeStops() {
      base_endpoint
        .get("/api/student/getinrangestops/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.stopsInRange = response.data.map(this.getDisplayStops);

          var bounds = new this.google.maps.LatLngBounds();
          for (var i = 0; i < this.stopsInRange.length; i++) {
            bounds.extend(this.stopsInRange[i].position);
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
    getUserInfo() {
      base_endpoint
        .get("/api/student/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((res) => {
          base_endpoint
            .get("/api/student/getinrangestops/" + this.$route.query.id, {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            })
            .then((response) => {
              this.markers = [];
              this.markers = response.data.map(this.getDisplayStops);

              var house = {
                position: {
                  lat: parseFloat(res.data.parentLatitude),
                  lng: parseFloat(res.data.parentLongitude),
                },
                icon: this.bluePerson.icon,
                label: this.bluePerson.label,
              };
              this.markers.push(house);

              console.log(this.markers);

              var bounds = new this.google.maps.LatLngBounds();
              for (var i = 0; i < this.markers.length; i++) {
                bounds.extend(this.markers[i].position);
              }

              if (this.routeInTransit) {
                if (this.firstBusLoc) {
                  if (this.buses.length == 0) {
                    setTimeout(this.getUserInfo, 1000);
                  } else {
                    bounds.extend(this.buses[0].position);
                    this.firstBusLoc = false;
                  }
                }
              }

              this.$refs.mapRef.$mapPromise.then((map) => {
                map.fitBounds(bounds);
              });
            })
            .catch((err) => {
              this.showSnackBar();
              console.log(err);
            });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    updateStudent() {
      console.log("HERE");
      console.log(this.newStudentName);
      console.log(this.newStudentId);
      console.log(this.newStudentSchool);
      console.log(this.studentRoute);
      console.log(this.newStudentEmail);
      console.log(this.newStudentPhone);
      console.log(this.newStudentParent);
      console.log(this.newStudentAccountState);
      base_endpoint
        .patch(
          "/api/student/update/" + this.$route.query.id,
          {
            full_name: this.newStudentName,
            sid: this.newStudentId,
            school: this.newStudentSchool.id,
            route: this.studentRoute,
            email: this.newStudentEmail,
            phone: this.newStudentPhone,
            parent: this.newStudentParent.id,
            profile: this.newStudentAccountState,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          clearInterval(this.intervalId);
          this.dialog2 = false;
          this.intervalId = setInterval(this.getStudentInfo, 1000);
          this.getInRangeStops();
          this.getUserInfo();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },

    viewSchool(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item } });
    },
    viewRoute(item) {
      this.$router.push({ name: "AdminRouteDetail", query: { id: item } });
    },
    viewParent(item) {
      this.$router.push({ name: "AdminUserDetail", query: { id: item } });
    },
    validate() {
      this.$refs.form.validate();
    },
    submitDataForDelete() {
      base_endpoint
        .delete("/api/student/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminStudentList" });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    submitDataForDeleteProfileOnly() {
      base_endpoint
        .delete("/api/student/deleteprofile/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminStudentList" });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    validateDelete() {
      this.$refs.form.validate();
      if (this.studentDeleteChoice == "loginOnly") {
        this.submitDataForDeleteProfileOnly();
      } else if (this.studentDeleteChoice == "wholeThing") {
        this.submitDataForDelete();
      }
      this.dialog = false;
      this.$emit(
        "schoolmodified",
        "A school has been modified and sent to database"
      );
    },
    studentNameValidate() {
      if (this.newStudentName == null || this.newStudentName == "") {
        return "Student Name is required";
      } else {
        return true;
      }
    },
    studentIDValidate() {
      if (isNaN(this.newStudentId) == true) {
        return "Student ID must be a number";
      } else if (isNaN(this.newStudentId) == false) {
        if (parseInt(this.newStudentId) < 0) {
          return "Student ID must be a postive number";
        }
      } else {
        return true;
      }
    },
    studentSchoolValidate() {
      if (this.newStudentSchool == null || this.newStudentSchool == "") {
        return "Student school is required";
      } else {
        return true;
      }
    },
    studentParentValidate() {
      if (this.newStudentParent == null || this.newStudentParent == "") {
        return "Student's parent is required";
      } else {
        return true;
      }
    },
    studentEmailValidate() {
      if (
        this.studentCheckbox == true &&
        this.studentAccountState == "true" &&
        (this.newStudentEmail == null || this.newStudentEmail == "")
      ) {
        return "Student email is required";
      } else {
        if (this.allParentEmails2.includes(this.newStudentEmail)) {
          return "A email is already assigned to a user, try creating a new student";
        } else {
          const splitStringAt = this.newStudentEmail.split("@");
          if (splitStringAt.length != 2) {
            return "Please enter a valid email address";
          } else {
            const splitStringPeriod = splitStringAt[1].split(".");
            if (
              splitStringPeriod.length != 2 ||
              splitStringPeriod[1].length == 0
            ) {
              return "Please enter a valid email address";
            } else {
              return true;
            }
          }
        }
      }
    },
    getRequestAllParentsWithAddress() {
      base_endpoint
        .get("/api/profile/getallparentswithuserid/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.parents = response.data.map(this.getDisplayParent);
          for (let i = 0; i < this.parents.length; i++) {
            this.allParentEmails2.push(this.parents[i].email);
          }
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  computed: {
    google: gmapApi,
  },
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.intervalId = setInterval(this.getStudentInfo, 1000);

    this.getInRangeStops();
    this.getUserInfo();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
};
</script>
<style>
.txt:hover {
  text-decoration: underline;
}
</style>