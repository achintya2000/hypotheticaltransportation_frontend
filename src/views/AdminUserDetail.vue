<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title class="font-weight-black">
      {{ full_name }}
      <v-spacer></v-spacer>
      <create-new-student-only
        @studentcreated="getStudents()"
        v-if="this.userType!='busDriver'"
      ></create-new-student-only>
      <v-dialog v-model="dialog2" width="500" v-if="this.userType!='busDriver'">
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

              <v-text-field
                v-model="newPhone"
                :rules="userPhoneValidateArray"
                label="User Phone Number"
                append-icon="mdi-phone"
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

              <v-text v-if="this.userType=='admin'">User Role Type:</v-text>
              <v-radio-group
                  v-model="newUserRoleType"
                  v-if="this.userType=='admin'"
                  row
                  :rules="userRoleTypeValidateArray"
                  dense
                  @focus="console.log(this.newUserRoleType)"
                >
                  <v-radio
                    label="Admin"
                    value="admin"
                    v-if="this.userType=='admin'"
                  ></v-radio>
                  <v-radio
                    label="Parent"
                    value="parent"
                  ></v-radio>
                  <v-radio
                    label="Bus Driver"
                    value="busDriver"
                    v-if="this.userType=='admin'"
                  ></v-radio>
                  <v-radio
                    label="School Staff"
                    value="schoolStaff"
                    v-if="this.userType=='admin'"
                  ></v-radio>
                </v-radio-group>
                <v-select
                  v-model="newManagedSchools"
                  :items="schools"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  v-if="newUserRoleType=='schoolStaff'"
                  multiple
                  item-text="name"
                  hint="Pick the schools for them to manage"
                  persistent-hint
                ></v-select>

              <v-btn
                color="success"
                class="mr-4"
                @click="updateUser"
                type="submit"
              >
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
      <v-dialog v-model="dialog" width="500" v-if="this.userType!='busDriver'">
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
    <v-card-subtitle v-if="currentAddress != ''">
      <span class="black--text font-weight-bold"> Address: </span
      ><span class="black--text"> {{ currentAddress }} </span>
    </v-card-subtitle>
    <v-card-subtitle v-if="currentAddress == ''" class="black--text">
      No address has been assigned
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Email: </span
      ><span class="black--text"> {{ email }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Phone: </span>
      <span v-if="userPhone != ''" class="black--text"> {{ userPhone }} </span>
      <span v-if="userPhone == ''" class="black--text">No phone number</span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Admin: </span
      ><span class="black--text"> {{ administrator }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> User Type: </span
      ><span class="black--text"> {{ userRoleType }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Managed Schools: </span
      ><span class="black--text"> {{ managedSchools }} </span>
    </v-card-subtitle>
    <v-card-title> Students </v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
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
    <v-snackbar v-model="snackbar" outlines bottom color="success">
      Password has been changed

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import CreateNewStudentOnly from "../components/CreateNewStudentOnly.vue";
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
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
      userPhone: "",
      newPhone: "",
      newEmail: "",
      newFull_name: "",
      newCurrentAddress: "",
      newAdministrator: "",
      userRoleType: "",
      newUserRoleType: "",
      userNameValidateArray: [this.userNameValidate],
      userEmailValidateArray: [this.userEmailValidate],
      userPhoneValidateArray: [this.userPhoneValidate],
      userAddressValidateArray: [this.userAddressValidate],
      userRoleTypeValidateArray: [this.userRoleTypeValidate],
      students: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      newPassword: "",
      newPassword2: "",
      userType: "",
      userID: "",
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
      managedSchools: [],
      newManagedSchools: [],
      schools: [],
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
    getRequestAllSchools() {
      base_endpoint
        .get("/api/school/getall/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schools = response.data.map(this.getDisplaySchool);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    showSnackBarAddress() {
      this.snackBar(
        "Uh-Oh! Something Went Wrong! Make sure to click the Autofill result to complete your Address!"
      );
    },
    showSnackBarNoDelete() {
      this.snackBar(
        "Uh-Oh! You can not delete this user becuase they have students who go to a school you do not manage!"
      );
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
    getDisplaySchool(item) {
      return {
        id: item.id,
        name: item.name,
        address: item.address
      };
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
          this.longitude = response.data.longitude;
          this.latitude = response.data.latitude;
          this.newCurrentAddress = response.data.address;
          this.userPhone = response.data.phone;
          this.newPhone = response.data.phone;
          this.administrator = response.data.is_superuser;
          this.newAdministrator = response.data.is_superuser;
          this.formatted_address = response.data.address;
          this.userRoleType = response.data.type;
          this.newUserRoleType = response.data.type;
          this.managedSchools = response.data.managed_schools.map(this.getDisplaySchool);
          this.newManagedSchools = response.data.managed_schools.map(this.getDisplaySchool);
          this.$forceUpdate();
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
        .get("/api/student/getallfromprofile/" + this.$route.query.id + "/" + this.userID, {
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
      console.log(this.newUserRoleType);
      base_endpoint
        .patch(
          "/api/profile/update/" + this.$route.query.id,
          {
            full_name: this.newFull_name,
            email: this.newEmail,
            address: this.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
            phone: this.newPhone,
            type: this.newUserRoleType,
            is_superuser: this.newAdministrator,
            managed_schools: this.newManagedSchools,
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
          this.getUserInfo();
          this.$forceUpdate();
        })
        .catch((err) => {
          this.showSnackBarAddress();
          console.log(err);
        });
    },
    userPhoneValidate() {
      if (
        this.userCheckbox == true &&
        (this.parentPhone == null || this.parentPhone == "")
      ) {
        return "Parent phone number is required";
      } else {
        return true;
      }
    },
    submitDataForDelete() {
      this.dialog = false;
      base_endpoint
        .delete("/api/profile/delete/" + this.$route.query.id + "/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "AdminUserList" });
        })
        .catch((err) => {
          this.showSnackBarNoDelete();
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
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getUserInfo();
    this.getStudents();
    this.getRequestAllSchools();
  },
};
</script>

<style>
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {  
  cursor: pointer;
}
</style>