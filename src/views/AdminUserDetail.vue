<template>
  <v-card>
    <v-card-title>
      {{ full_name }}
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog3" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Reset Password
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Reset Password
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid3"
              lazy-validation
            >
              <v-text-field
                v-model="newPassword"
                :rules="newPasswordRules"
                label="New Password"
                required
              ></v-text-field>

              <v-text-field
                v-model="newPassword2"
                :rules="newPassword2Rules"
                label="Confirm New Password"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid3"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Save
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
               Clear
              </v-btn>

              <v-btn
                color="warning"
                @click="dialog3 = false"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Modify
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Modify
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="userName"
                :rules="name2Rules"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="userEmail"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="userAddress"
                :rules="addressRules"
                label="Address"
                required
              ></v-text-field>

              <v-text-field
                v-model="userLongitude"
                :rules="longitudeRules"
                label="Longitude"
                required
              ></v-text-field>

              <v-text-field
                v-model="userLatitude"
                :rules="latitudeRules"
                label="Latitude"
                required
              ></v-text-field>

              <v-checkbox
                v-model="checkbox"
                :label="'Admin Status'"
              ></v-checkbox>
              

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Save
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
               Clear
              </v-btn>

              <v-btn
                color="warning"
                @click="dialog2 = false"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
            >
            <v-spacer></v-spacer>

              <v-btn
                color="error"
                class="mr-4"
                @click="validate"
              >
                Yes, Delete
              </v-btn>

              <v-btn
                color="success"
                @click="dialog = false"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle>
    {{ currentAddress }}
    </v-card-subtitle>
    <v-card-subtitle>
    {{ email }}
    </v-card-subtitle>
    <v-card-subtitle>
    Admin: {{ administrator }}
    </v-card-subtitle>
    <v-card-title>
        Students
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    >
    <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="viewStudent(item)"> mdi-eye </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
  data() {
    return {
      search: "",
      email: "",
      full_name: "",
      currentAddress: "",
      administrator: "",
      students: [],
      dialog: false,
        dialog2: false,
        dialog3: false,
              name2: 'Old Name',
      name2Rules: [
        v => !!v || 'Name is required',
      ],
      address: 'Old Address',
      addressRules: [
            v => !!v || 'Address is required',
      ],
      city: 'Old City',
      longitudeRules: [
        v => !!v || 'Longitude is required',
      ],
      state: 'Old State',
      latitudeRules: [
        v => !!v || 'Latitude is required',
        ],
      emailRules: [
        v => !!v || 'Email is required',
        ],
       
      headers: [
        {
          text: "Name",
          align: "start",
          value: "studentName",
        },
        { text: "Route", value: "studentRoute" },
        { text: "Parent", value: "studentParent" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
      viewStudent(item) {
      this.$router.push({
        name: "AdminStudentDetail",
        query: { id: item.studentId },
      });
    },
      getUserInfo() {
      base_endpoint
        .get("/api/profile/get/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.email = response.data.email;
          this.full_name = response.data.full_name;
          this.currentAddress = response.data.address;
          this.administrator = response.data.administrator;
          
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDisplayStudents(item) {
      return {
        studentId: item.id,
        studentName: item.name,
        studentRoute: item.route,
        studentParent: item.parent,
      };
    },
    getStudents() {
      base_endpoint
        .get("/api/student/getallfromprofile/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.students = response.data.map(this.getDisplayStudents);
          console.log(this.students)
        })
        .catch((err) => {
          console.log(err);
        });
    },
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
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