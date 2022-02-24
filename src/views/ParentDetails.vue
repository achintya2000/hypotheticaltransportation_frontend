<template>
  <v-card>
    <v-card-title class="font-weight-black">
      Your Information
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog3" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on"> Change Password </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Change Password
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="newPassword"
                :rules="resetPassword1ValidationArray"
                label="New Password"
                :type="'password'"
                required
              ></v-text-field>

              <v-text-field
                v-model="newPassword2"
                :rules="resetPassword2ValidationArray"
                :type="'password'"
                label="Confirm New Password"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validateForResetPassword"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog3 = false;
                  reset();
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Name: </span
      ><span class="black--text"> {{ userName }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Email: </span
      ><span class="black--text"> {{ userEmail }} </span>
    </v-card-subtitle>
    <v-card-subtitle>
      <span class="black--text font-weight-bold"> Address: </span
      ><span class="black--text"> {{ userAddress }} </span>
    </v-card-subtitle>

    <v-card-title>Your Students:</v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      @click:row="viewItem"
    >
      <template v-slot:[`item.route`]="{ item }">
        <div v-if="item.route">{{ item.route }}</div>
        <div v-if="!item.route">No Route</div>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" outlines bottom color="success">
      Your password has been changed

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
      <template v-slot:no-data>
          You have no students assigned to you
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      enabled: null,
      dialog3: false,
      valid: true,
      reveal: false,
      snackbar: false,
      search: "",
      newPassword: "",
      newPasswordRules: [(v) => !!v || "Name is required"],
      newPassword2: "",
      newPassword2Rules: [(v) => !!v || "Address is required"],
      userEmail: "",
      userName: "",
      userAddress: "",
      resetPassword1ValidationArray: [this.resetPassword1Validation],
      resetPassword2ValidationArray: [this.resetPassword2Validation],
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Student ID", value: "sid" },
        { text: "School", value: "school" },
        { text: "Route", value: "route", sortable: false },
      ],
      students: [],
    };
  },
  methods: {
    isEnabled (slot) {
        return this.enabled === slot
      },
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(row) {
      this.$router.push({
        name: "ParentStudentDetail",
        query: { id: row.id },
      });
    },
    getUserInfo() {
      base_endpoint
        .get("/api/profile/get/" + this.$store.state.loggedInUserID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response);
          this.userEmail = response.data.email;
          this.userName = response.data.full_name;
          this.userAddress = response.data.address;
          this.administrator = response.data.is_superuser;
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },

    getDisplayStudent(item) {
      return {
        name: item.name,
        sid: item.sid,
        school: item.school,
        route: item.route,
        id: item.id,
      };
    },
    getRequestAllStudents() {
      base_endpoint
        .get(
          "/api/student/getallfromprofile/" + this.$store.state.loggedInUserID,
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudent);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },

    validateForResetPassword() {
      if (
        this.newPassword != "" &&
        this.newPassword != null &&
        this.newPassword2 != "" &&
        this.newPassword2 != null
      ) {
        this.$refs.form.validate();
        this.submitDataForResetPassword();
        this.dialog3 = false;
        this.snackbar = true;
        this.$emit(
          "schoolmodified",
          "A school has been modified and sent to database"
        );
      }
    },
    submitDataForResetPassword() {
      console.log(this.$store.state.loggedInUserID);
      base_endpoint
        .patch(
          "/api/profile/changepassword/" + this.$store.state.loggedInUserID,
          {
            new_password: this.newPassword2,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    resetPassword1Validation() {
      if (this.newPassword == "" || this.newPassword == null) {
        return "This field is required";
      } else {
        return true;
      }
    },
    resetPassword2Validation() {
      if (this.newPassword2 == "" || this.newPassword2 == null) {
        return "This field is required";
      } else if (this.newPassword2 != this.newPassword) {
        return "The passwords must match";
      } else {
        return true;
      }
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
    this.getUserInfo();
    this.getRequestAllStudents();
  },
};
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>