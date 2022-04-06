<template>
  <v-dialog v-model="dialog" width="50%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on"> Add a New Student </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Add a New Student
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>

          <v-text-field
            v-model="studentName"
            :rules="studentNameValidateArray"
            append-icon="mdi-account"
            label="Student Name"
          ></v-text-field>

          <v-text-field
            v-model="sid"
            :rules="studentIDValidateArray"
            append-icon="mdi-numeric-0-box"
            label="Student ID"
          ></v-text-field>

          <v-autocomplete
            v-model="schoolSelected"
            item-text="name"
            :rules="studentSchoolValidateArray"
            label="Student School"
            :items="schools"
            return-object
          ></v-autocomplete>

          <v-text>Give Student Accont:</v-text> 
              <v-radio-group
                  v-model="studentAccountState"
                  row
                  dense
                >
                  <v-radio
                    label="Yes"
                    value="true"
                  ></v-radio>
                  <v-radio
                    label="No"
                    value="false"
                  ></v-radio>
                </v-radio-group>
                <v-text-field
                v-model="studentEmail"
                v-if="studentAccountState=='true'"
                :rules="studentEmailValidateArray"
                label="Student Email"
              ></v-text-field>
              <v-text-field
                v-if="studentAccountState=='true'"
                v-model="studentPhone"
                label="Student Phone Number"
                append-icon="mdi-phone"
                required
              ></v-text-field>

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
export default {
  data() {
    return {
      userCheckbox: false,
      studentCheckbox: false,
      schoolItems: [],
      dialog: false,
      valid: true,
      newParentID: "",
      studentName: "",
      sid: "",
      schools: [],
      parents: [],
      schoolSelected: null,
      userType: "",
      userID: "",
      studentAccountState: "",
      studentEmail: "",
      studentPhone: "",
      latitude: 0,
      longitude: 0,
      formatted_address: "",
      allParentEmails: [],
      allParents: [],
      //reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      studentNameValidateArray: [this.studentNameValidate],
      studentIDValidateArray: [this.studentIDValidate],
      studentSchoolValidateArray: [this.studentSchoolValidate],
      studentEmailValidateArray: [this.studentEmailValidate],
    };
  },
  methods: {
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
          console.log(err);
        });
    },
    submitData() {
        console.log("GOT INTO THE ELSE STATMENT");
        base_endpoint
          .post(
            "/api/student/create",
            {
              full_name: this.studentName,
              sid: this.sid,
              school: this.schoolSelected.id,
              parent: this.$route.query.id,
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
          });
    },
    validate() {
      if (this.studentName != null &&
          this.studentName != "" &&
          this.schoolSelected != null &&
          this.schoolSelected != "") {
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
    studentNameValidate() {
      if (
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
        (this.schoolSelected == null || this.schoolSelected == "")
      ) {
        return "Student school is required";
      } else {
        return true;
      }
    },
    studentEmailValidate() {
      if (
         this.studentAccountState == "true" &&
        (this.studentEmail == null || this.studentEmail == "")
      ) {
        return "Student email is required";
      } else {
        if (this.allParentEmails.includes(this.studentEmail)) {
          return "A email is already assigned to a user, try creating a new student";
        } else {
          const splitStringAt = this.studentEmail.split("@");
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
    getDisplayParent(item) {
      return {
        id: item.id,
        name: item.full_name,
        email: item.email,
      };
    },
  },
  
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getRequestAllSchools();
    this.getRequestAllParents();
  },
};
</script>

<style>
</style>