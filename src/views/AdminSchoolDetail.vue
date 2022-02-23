<template>
  <v-card>
    <v-card-title class="font-weight-black">
      {{ schoolName }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500">
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
              ></v-text-field>

              <gmap-autocomplete @place_changed="setPlace">
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
      <v-dialog v-model="dialog" width="500">
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

      <v-btn style="margin: 10px" @click="planNewRoute" outlined>Create/Edit Routes</v-btn>
      <send-email :typeOfEmail="'schoolGA'" :relevantID = this.$route.query.id
      ></send-email>
      <send-email :typeOfEmail="'schoolRA'" :relevantID = this.$route.query.id
      ></send-email>

    </v-card-title>
    <v-card-subtitle class="black--text">
      <span class="black--text font-weight-bold"> Address: </span
      ><span class="black--text"> {{ schoolAddress }} </span>
    </v-card-subtitle>

    <v-card-subtitle class="black--text"> 
      <span class="black--text font-weight-bold"> Bus Arrival Time: </span><span class="black--text"> {{ busArriveTime }} </span>
    </v-card-subtitle>
    <v-card-subtitle class="black--text"> 
      <span class="black--text font-weight-bold"> Bus Departure Time: </span><span class="black--text"> {{ busDepTime }} </span>
    </v-card-subtitle>
    <v-card-title>
      Bus Routes
    </v-card-title>

    <v-data-table
      :headers="routeHeaders"
      :items="busRoutes"
      :search="search"
      @click:row="viewRoute"
    >
      <template v-slot:[`item.routeComplete`]="{ item }">
        <v-icon v-if="item.routeComplete==false"> mdi-close </v-icon>
        <v-icon v-if="item.routeComplete==true"> mdi-check </v-icon>
      </template>
    </v-data-table>

    <v-card-title> Students </v-card-title>

    <v-data-table
      :headers="studentsHeaders"
      :items="students"
      :search="search"
      @click:row="viewStudent"
    >
      <template v-slot:[`item.studentRoute`]="{ item }">
        <div v-if="item.studentRoute">{{ item.studentRoute }}</div>
        <div v-if="!item.studentRoute">No Route</div>
      </template>
      <template v-slot:[`item.studentInRange`]="{ item }">
        <v-icon v-if="item.studentInRange==false"> mdi-close </v-icon>
        <v-icon v-if="item.studentInRange==true"> mdi-check </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions} from "vuex";
import moment from 'moment';
import SendEmail from "../components/SendEmail.vue";

export default {
  components: { 
    SendEmail 
  },
  data() {
    return {
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
          this.formatted_address = response.data.address;
          var arrTime = moment.utc(response.data.arrivalTime);
          this.busArriveTime = arrTime.local().format("h:mm A");
          var depTime = moment.utc(response.data.departureTime);
          this.busDepTime = depTime.local().format("h:mm A");
          var newarrTime = moment.utc(response.data.arrivalTime);
          this.newBusArriveTime = newarrTime.local().format("hh:mm");
          var newdepTime = moment.utc(response.data.departureTime);
          this.newBusDepTime = newdepTime.local().format("hh:mm");
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
      console.log("Here it is: " + this.newBusArriveTime);
      console.log("Here it is 2: " + new Date("2021-01-01 " + this.newBusArriveTime + ":00").toUTCString());
      base_endpoint
        .patch(
          "/api/school/update/" + this.$route.query.id,
          {
            name: this.newSchoolName,
            address: this.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
            arrivalTime: new Date("2021-01-01 " + this.newBusArriveTime + ":00"),
            departureTime: new Date("2021-01-01 " + this.newBusDepTime + ":00"),
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
      if (this.newSchoolName != "" && this.newSchoolName != null && this.newAddress != "" && this.newAddress != null && this.busArriveTime != "" && this.busArriveTime != null && this.busDepTime != "" && this.busDepTime != null) {
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
      if (this.busArriveTime == "" || this.busArriveTime == null) {
        return "Bus Arrival Time is required, remember to type AM or PM";
      } else {
        return true;
      }
    },
    busDepValidate() {
      console.log("Hello 2: " + this.busDepTime);
      if (this.busDepTime == "" || this.busDepTime == null) {
        return "Bus Departure Time is required, remember to type AM or PM";
      } else {
        return true;
      }
    },
  },

  created() {
    this.getSchoolInfo();
    this.getSchoolRoutes();
    this.getStudents();
  },
};
</script>

<style>
</style>