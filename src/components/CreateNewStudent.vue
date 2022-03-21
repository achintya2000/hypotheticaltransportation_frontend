<template>
  <v-dialog v-model="dialog" width="75%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Create New Student/User </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Create a New Student/User
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col>
              <v-checkbox
                v-model="userCheckbox"
                :label="'Create a New User'"
              ></v-checkbox>
              <v-text-field
                v-if="userCheckbox"
                v-model="parentName"
                :rules="userNameValidateArray"
                label="Full Name for User"
                append-icon="mdi-account"
                required
              ></v-text-field>
              <v-text-field
                v-if="userCheckbox"
                v-model="parentEmail"
                :rules="userEmailValidateArray"
                label="User Email"
                append-icon="mdi-email"
                required
              ></v-text-field>
              <v-text-field
                v-if="userCheckbox"
                v-model="parentPhone"
                :rules="userPhoneValidateArray"
                label="User Phone Number"
                append-icon="mdi-phone"
                required
              ></v-text-field>
              <gmap-autocomplete v-if="userCheckbox" @place_changed="setPlace">
                <template v-slot:input="slotProps">
                  <v-text-field
                    v-model="parentAddress"
                    label="Enter a location address"
                    :rules="userAddressValidateArray"
                    append-icon="mdi-map-marker"
                    ref="input"
                    v-on:listeners="slotProps.listeners"
                    v-on:attrs="slotProps.attrs"
                  ></v-text-field>
                </template>
              </gmap-autocomplete>
              <v-text v-if="userCheckbox">Password Type:</v-text>
                <v-radio-group
                  v-model="passType2"
                  row
                  :rules="userPasswordTypeValidateArray"
                  v-if="userCheckbox"
                  dense
                >
                  <v-radio
                    label="One Time Password"
                    value="otp"
                  ></v-radio>
                  <v-radio
                    label="Link Based Password Creation"
                    value="link"
                  ></v-radio>
                </v-radio-group>
              

<!--               <v-checkbox
                v-if="userCheckbox"
                v-model="userAdminCheckbox"
                :label="'Make User Admin?'"
              ></v-checkbox> -->
              <v-text v-if="userCheckbox">User Role Type: {{this.userRoleType}}</v-text> 
              <v-radio-group
                  v-model="userRoleType"
                  row
                  :rules="userRoleTypeValidateArray"
                  v-if="userCheckbox"
                  @click="console.log(this.userRoleType)"
                  dense
                >
                  <v-radio
                    label="Admin"
                    value="admin"
                    @click="console.log(this.userRoleType)"
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
                  v-model="selectedSchoolsForSchoolStaff"
                  :items="schools"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  multiple
                  item-text="name"
                  v-if="userRoleType=='schoolStaff'"
                  hint="Pick the schools for them to manage"
                  persistent-hint
                ></v-select>

            </v-col>
            <v-col>
              <v-checkbox
                v-model="studentCheckbox"
                :label="'Create a New Student'"
                :disabled="this.userType=='schoolStaff'"
                input-value="1"
              ></v-checkbox>
              <v-text-field
                v-model="studentName"
                :rules="studentNameValidateArray"
                v-if="studentCheckbox"
                append-icon="mdi-account"
                label="Student Name"
              ></v-text-field>

              <v-text-field
                v-model="sid"
                v-if="studentCheckbox"
                :rules="studentIDValidateArray"
                append-icon="mdi-numeric-0-box"
                label="Student ID"
              ></v-text-field>
              <v-autocomplete
                v-model="parentSelected"
                v-if="userAndStudentCheckbox"
                :rules="studentParentValidateArray"
                item-text="name"
                label="Student's Parent"
                :items="parents"
                hint="If you can not find the user account you are looking for, please make sure it has been assigned an address"
                persistent-hint
                return-object
              ></v-autocomplete>

              <v-autocomplete
                v-model="schoolSelected"
                item-text="name"
                :rules="studentSchoolValidateArray"
                v-if="studentCheckbox"
                label="Student School"
                :items="schools"
                return-object
              ></v-autocomplete>
            </v-col>

          </v-row>
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Submit
          </v-btn>

          <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>
          <v-btn
            color="warning"
            @click="
              dialog = false;
              reset();
              userCheckbox = false;
              studentCheckbox = false;
            "
          >
            Cancel
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions} from "vuex";
export default {
  data() {
    return {
      userCheckbox: false,
      studentCheckbox: false,
      schoolItems: [],
      dialog: false,
      valid: true,
      passType2: "",
      parentName: "",
      parentEmail: "",
      userRoleType: null,
      parentPassword: "",
      parentPassword2: "",
      userType: "",
      userID: "",
      parentAddress: "",
      userAdminCheckbox: false,
      parentSelected: null,
      newParentID: "",
      studentName: "",
      nameRules: [(v) => !!v || "Name is required"],
      sid: "",
      sidRules: [(v) => !!v || "Student ID is required"],
      schools: [],
      parents: [],
      allParents: [],
      schoolSelected: null,
      latitude: 0,
      selectedSchoolsForSchoolStaff: [],
      longitude: 0,
      formatted_address: "",
      allParentEmails: [],
      theSpeicalID: "",
      allParentEmails2: [],
      //reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      userNameValidateArray: [this.userNameValidate],
      userEmailValidateArray: [this.userEmailValidate],
      userPhoneValidateArray: [this.userPhoneValidate],
      userPasswordTypeValidateArray: [this.userPasswordTypeValidate],
      userRoleTypeValidateArray: [this.userRoleTypeValidate],
      userAddressValidateArray: [this.userAddressValidate],
      studentNameValidateArray: [this.studentNameValidate],
      studentIDValidateArray: [this.studentIDValidate],
      studentSchoolValidateArray: [this.studentSchoolValidate],
      studentParentValidateArray: [this.studentParentValidate],
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
    showSnackBarWeirdCreate() {
      this.snackBar(
        "This user already exists and the student has been added. You can now view them from your User List page "
      );
    },
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },
    getDisplaySchool(item) {
      return {
        id: item.id,
        name: item.name,
        address: item.address,
      };
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
    getDisplayParent(item) {
      return {
        id: item.id,
        name: item.full_name,
        email: item.email,
      };
    },
    getRequestAllParentsWithAddress() {
      base_endpoint
        .get("/api/profile/getallwithaddress/" + this.userID, {
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
    getRequestAllParents() {
      base_endpoint
        .get("/api/profile/getallextreme", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          

          this.allParents = response.data.map(this.getDisplayParent);
          for (let i = 0; i < this.allParents.length; i++) {
            this.allParentEmails.push(this.allParents[i].email);
          }
          console.log("All Emails:" + this.allParentEmails);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    submitData() {
      if (this.userCheckbox == true) {
        console.log("GOT INTO THE IF STATMENT");
        console.log(this.userType=='schoolStaff');
        console.log(this.allParentEmails.includes(this.parentEmail));
        console.log(this.allParentEmails);
        console.log(this.parentEmail);
        if (this.userType=='schoolStaff' && this.allParentEmails.includes(this.parentEmail)) {
          console.log("GOT INTO THE NEWWWWW IF STATMENT");
          base_endpoint
                .get(
                  "/api/profile/getfromemail/" + this.parentEmail,
                  {
                    headers: {
                      Authorization: `Token ${this.$store.state.accessToken}`,
                    },
                  }
                )
                .then((response) => {
                  this.theSpeicalID = response.data.id;
                  console.log(this.theSpeicalID);
                  base_endpoint
                .post(
                  "/api/student/create",
                  {
                    full_name: this.studentName,
                    sid: this.sid,
                    school: this.schoolSelected.id,
                    parent: this.theSpeicalID,
                  },
                  {
                    headers: {
                      Authorization: `Token ${this.$store.state.accessToken}`,
                    },
                  }
                )
                .then(() => {
                  this.$emit(
                    "studentcreated",
                    "A new student has been created and sent to database"
                  );
                })
                .catch((err) => {
                  this.showSnackBarAddress();
                  console.log(err);
                });
                  this.showSnackBarWeirdCreate();
                })
                .catch((err) => {
                  this.showSnackBarAddress();
                  console.log(err);
                });


          
        } else {
          base_endpoint
          .post(
            "/api/profile/create",
            {
              full_name: this.parentName,
              address: this.formatted_address,
              longitude: this.longitude,
              latitude: this.latitude,
              email: this.parentEmail,
              password: this.parentPassword,
              type: this.userRoleType,
              passwordType: this.passType2,
              managed_schools: this.selectedSchoolsForSchoolStaff,
              phone: this.parentPhone,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((response) => {
            this.newParentID = response.data.id;
            
            this.$emit(
              "usercreated",
              "A new student has been created and sent to database"
            );
            if (
              this.studentName != null &&
              this.studentName != "" &&
              this.schoolSelected.id != null &&
              this.schoolSelected.id != "" &&
              this.newParentID != null &&
              this.newParentID != ""
            ) {
              
              console.log("CREATING STUDENT");
              base_endpoint
                .post(
                  "/api/student/create",
                  {
                    full_name: this.studentName,
                    sid: this.sid,
                    school: this.schoolSelected.id,
                    parent: this.newParentID,
                  },
                  {
                    headers: {
                      Authorization: `Token ${this.$store.state.accessToken}`,
                    },
                  }
                )
                .then(() => {
                  this.$emit(
                    "studentcreated",
                    "A new student has been created and sent to database"
                  );
                })
                .catch((err) => {
                  this.showSnackBarAddress();
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            this.showSnackBarAddress();
            console.log(err);
          });
        }
      } else {
        console.log("GOT INTO THE ELSE STATMENT");
        base_endpoint
          .post(
            "/api/student/create",
            {
              full_name: this.studentName,
              sid: this.sid,
              school: this.schoolSelected.id,
              parent: this.parentSelected.id,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then(() => {
            this.$emit(
              "studentcreated",
              "usercreated",
              "A new student has been created and sent to database"
            );
          })
          .catch((err) => {
            this.showSnackBar();
            console.log(err);
          });
      }
    },
    validate() {
      if (
        (this.userCheckbox == true &&
          (this.parentName != null &&
          this.parentName != "") &&
          (this.parentEmail != null &&
          this.parentEmail != "") &&
          (this.passType2 != null &&
          this.passType2 != "") &&
          (this.userRoleType != null &&
          this.userRoleType != "") &&
          (this.parentPhone != null &&
          this.parentPhone != "") &&
          (this.parentAddress != null && 
          this.parentAddress != "")) ||
        (this.studentCheckbox == true &&
          this.studentName != null &&
          this.studentName != "" &&
          this.schoolSelected != null &&
          this.schoolSelected != "" &&
          ((this.parentSelected != null && this.parentSelected != "") ||  this.userCheckbox == true))
      ) {
        this.$refs.form.validate();
        this.submitData();
        this.dialog = false;
      }
    },
    reset() {
      this.$refs.form.reset();
      this.userAdminCheckbox = false;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    userNameValidate() {
      if (
        this.userCheckbox == true &&
        (this.parentName == null || this.parentName == "")
      ) {
        return "Parent name is required";
      } else {
        return true;
      }
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
    userEmailValidate() {
      if (
        this.userCheckbox == true &&
        (this.parentEmail == null || this.parentEmail == "")
      ) {
        return "Parent email is required";
      } else {
        if (this.allParentEmails2.includes(this.parentEmail)) {
          return "A email is already assigned to a user, try creating a new student";
        } else {
          const splitStringAt = this.parentEmail.split("@");
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
    userPasswordTypeValidate() {
      if (
        this.userCheckbox == true &&
        (this.passType2 == null || this.passType2 == "")
      ) {
        return "Parent type is required";
      } else {
        return true;
      }
    },
    userRoleTypeValidate() {
      if (
        this.userCheckbox == true &&
        (this.userRoleType == null || this.userRoleType == "")
      ) {
        return "User type is required";
      } else {
        return true;
      }
    },
    userAddressValidate() {
      console.log("HIIIIIII  GUYS");
      if (
        this.userCheckbox == true &&
        (this.parentAddress == null || this.parentAddress == "")
      ) {
        return "Parent address is required";
      } else {
        return true;
      }
    },
    studentNameValidate() {
      if (
        this.studentCheckbox == true &&
        (this.studentName == null || this.studentName == "")
      ) {
        return "Student Name is required";
      } else {
        return true;
      }
    },
    studentIDValidate() {
      if (isNaN(this.sid) == true) {
        return "Student ID must be a number";
      } else if (isNaN(this.sid) == false) {
        if (parseInt(this.sid) < 0) {
          return "Student ID must be a postive number";
        }
      } else {
        return true;
      }
    },
    studentSchoolValidate() {
      if (
        this.studentCheckbox == true &&
        (this.schoolSelected == null || this.schoolSelected == "")
      ) {
        return "Student school is required";
      } else {
        return true;
      }
    },
    studentParentValidate() {
      if (
        this.studentCheckbox == true &&
        this.userCheckbox == false &&
        (this.parentSelected == null || this.parentSelected == "")
      ) {
        return "Student's parent is required";
      } else {
        return true;
      }
    },
    updateUserRole() {

    }
  },
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getRequestAllSchools();
    this.getRequestAllParentsWithAddress();
    this.getRequestAllParents();
    this.studentCheckbox = this.userType=='schoolStaff';
  },
  computed: {
    
    //...mapGetters(["loggedIn", "isAdmin", "loggedInUserID","loggedInUserType"]),
    userAndStudentCheckbox() {
      return !this.userCheckbox && this.studentCheckbox;
    },
  },
  watch: {
    userRoleType: 'updateUserRole'
  }
};
</script>

<style>
</style>