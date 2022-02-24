<template>
  <v-card>
    <v-card-title class="font-weight-black">
      {{ full_name }}
      <v-spacer></v-spacer>
      <create-new-student-only
      @studentcreated="getStudents()"
      ></create-new-student-only>
      <v-dialog v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Modify </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> Modify </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="newFull_name"
                :rules="userNameValidateArray"
                label="Full Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="newEmail"
                :rules="userEmailValidateArray"
                label="Email"
                required
              ></v-text-field>

              <gmap-autocomplete @place_changed="setPlace">
                <template v-slot:input="slotProps">
                  <v-text-field
                    v-model="newCurrentAddress"
                    placeholder="Address"
                    :rules="userAddressValidateArray"
                    ref="input"
                    v-on:listeners="slotProps.listeners"
                    v-on:attrs="slotProps.attrs"
                  >
                  </v-text-field>
                </template>
              </gmap-autocomplete>

              <v-checkbox
                v-model="newAdministrator"
                :label="'Admin Status'"
              ></v-checkbox>

              <v-btn color="success" class="mr-4" @click="updateUser" type="submit">
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog2 = false;
                  newFull_name = full_name;
                  newEmail = email;
                  newCurrentAddress = currentAddress;
                  newAdministrator = administrator;
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
          <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Delete </v-btn>
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
    </v-card-title>
    <v-card-subtitle v-if="currentAddress != ''" >
      <span class="black--text font-weight-bold"> Address: </span><span class="black--text"> {{ currentAddress }} </span>
    </v-card-subtitle>
    <v-card-subtitle v-if="currentAddress == ''" class="black--text">
      No address has been assigned
    </v-card-subtitle>
    <v-card-subtitle> 
      <span class="black--text font-weight-bold"> Email: </span><span class="black--text"> {{ email }} </span>
    </v-card-subtitle>
    <v-card-subtitle> 
      <span class="black--text font-weight-bold"> Admin: </span><span class="black--text"> {{ administrator }} </span>
    </v-card-subtitle>
    <v-card-title> Students </v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      @click:row="viewStudent"
    >
    <template v-slot:[`item.studentInRange`]="{ item }">
        <v-icon v-if="item.studentInRange==false" color="red"> mdi-close </v-icon>
        <v-icon v-if="item.studentInRange==true"> mdi-check </v-icon>
      </template>
    </v-data-table>
     <v-snackbar
      v-model="snackbar"
      outlines
      bottom
      color="success"
    >
      Password has been changed

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import CreateNewStudentOnly from '../components/CreateNewStudentOnly.vue';
import { base_endpoint } from "../services/axios-api";
import { mapActions} from "vuex";
export default {
  components: { CreateNewStudentOnly },
  data() {
    return {
      search: "",
      valid: true,
      snackbar: false,
      userEmail: "",
      userName: "",
      userAddress: "",
      administrator: "",
      newEmail: "",
      newFull_name: "",
      newCurrentAddress: "",
      newAdministrator: "",
      userNameValidateArray: [this.userNameValidate],
      userEmailValidateArray: [this.userEmailValidate],
      userAddressValidateArray: [this.userAddressValidate],
      students: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      newPassword: "",
      newPassword2: "",

      name2: "Old Name",
      name2Rules: [(v) => !!v || "Name is required"],
      address: "Old Address",
      addressRules: [(v) => !!v || "Address is required"],
      city: "Old City",
      longitudeRules: [(v) => !!v || "Longitude is required"],
      state: "Old State",
      latitudeRules: [(v) => !!v || "Latitude is required"],
      emailRules: [(v) => !!v || "Email is required"],
      latitude: 0,
      longitude: 0,
      formatted_address: "",
      adminCheckbox: false,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "studentName",
        },
        { text: "Route", value: "studentRoute" },
        { text: "Parent", value: "studentParent" },
        { text: "In-Range Status", value: "studentInRange", sortable: false },
      ],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    showSnackBarAddress() {
      this.snackBar("Uh-Oh! Something Went Wrong! Make sure to click the Autofill result to complete your Address!");
    },
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },

    viewStudent(row) {
      this.$router.push({
        name: "AdminStudentDetail",
        query: { id: row.studentId },
      });
    },
    getUserInfo() {
      base_endpoint
        .get("/api/profile/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.email = response.data.email;
          this.newEmail = response.data.email;
          this.full_name = response.data.full_name;
          this.newFull_name = response.data.full_name;
          this.currentAddress = response.data.address;
          this.newCurrentAddress = response.data.address;
          this.administrator = response.data.is_superuser;
          this.newAdministrator = response.data.is_superuser;
          this.formatted_address = response.data.address;
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
        .get("/api/student/getallfromprofile/" + this.$route.query.id, {
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

    updateUser() {
      this.dialog2 = false;
      base_endpoint
        .patch(
          "/api/profile/update/" + this.$route.query.id,
          {
            full_name: this.newFull_name,
            email: this.newEmail,
            address: this.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
            is_superuser: this.newAdministrator,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log("Got here");
          console.log(response);
          this.full_name = this.newFull_name;
          this.address = this.newCurrentAddress;
          this.administrator = this.newAdministrator;
          this.email = this.newEmail;
          this.$forceUpdate();
        })
        .catch((err) => {
          this.showSnackBarAddress();
          console.log(err);
        });
    },

    submitDataForDelete() {
      this.dialog = false;
      base_endpoint
        .delete("/api/profile/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminUserList" });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
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
    userNameValidate() {
      if (this.newFull_name == null || this.newFull_name == "") {
        return "Parent name is required";
      } else {
        return true;
      }
    },
    userEmailValidate() {
      if (this.newEmail == null || this.newEmail == "") {
        return "Parent email is required";
      } else {
        const splitStringAt = this.newEmail.split("@");
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
    },
    userAddressValidate() {
      if (
        (this.newCurrentAddress == null || this.newCurrentAddress == "") &&
        this.students.length != 0
      ) {
        return "Parent address is required";
      } else {
        return true;
      }
    },
  },
  created() {
    this.getUserInfo();
    this.getStudents();
  },
};
</script>

<style>
</style>