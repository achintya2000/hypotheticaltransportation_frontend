<template>
  <v-card>
    <v-card-title>
      Your Information
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog3" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on"> Reset Password </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Reset Password
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
      <v-spacer></v-spacer>
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card-subtitle> Name: {{ userName }} </v-card-subtitle>
    <v-card-subtitle> Email: {{ userEmail }} </v-card-subtitle>
    <v-card-subtitle> Address: {{ userAddress }} </v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      :sort-by="['sid']"
      :sort-desc="[false, true]"
    >
      <template v-slot:[`item.route`]="{ item }">
        <div v-if="item.route">{{item.route}}</div>
        <div v-if="!item.route">No Route</div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          dense
          small
          dark
          v-bind="attrs"
          v-on="on"
          @click="viewItem(item)"
        >
          Details
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import { mapActions} from "vuex";
export default {
  data() {
    return {
      dialog3: false,
      valid: true,
      reveal: false,
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
        { text: "Actions", value: "actions", sortable: false },
      ],
      students: [],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(item) {
      this.$router.push({
        name: "ParentStudentDetail",
        query: { id: item.id },
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