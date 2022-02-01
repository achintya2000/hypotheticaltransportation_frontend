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
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="newPassword"
                :rules="resetPassword1ValidationArray"
                label="New Password"
                required
              ></v-text-field>

              <v-text-field
                v-model="newPassword2"
                :rules="resetPassword2ValidationArray"
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
                v-model="newFull_name"
                :rules="name2Rules"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="newEmail"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>


              <gmap-autocomplete @place_changed="setPlace">
              <template v-slot:input="slotProps">
                <v-text-field
                  v-model="newCurrentAddress"
                  placeholder="Address"
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
              

              <v-btn color="success" class="mr-4" @click="updateUser">
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
                @click="submitDataForDelete"
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
    Email: {{ email }}
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
      valid: true,
      userEmail: "",
      userName: "",
      userAddress: "",
      administrator: "",
      newEmail: "",
      newFull_name: "",
      newCurrentAddress: "",
      newAdministrator: "",
      resetPassword1ValidationArray: [this.resetPassword1Validation],
      resetPassword2ValidationArray: [this.resetPassword2Validation],
      students: [],
      dialog: false,
        dialog2: false,
        dialog3: false,
        newPassword: "",
        newPassword2: "",

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
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },

    
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
          this.newEmail = response.data.email;
          this.full_name = response.data.full_name;
          this.newFull_name = response.data.full_name;
          this.currentAddress = response.data.address;
          this.newCurrentAddress = response.data.address;
          this.administrator = response.data.is_superuser;
          this.newAdministrator = response.data.is_superuser;
          
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
        ).then((response) => {
          console.log(response);
          this.getUserInfo();
          this.full_name = this.newFull_name;
          this.address = this.newCurrentAddress;
          this.administrator = this.newAdministrator;
          this.email = this.newEmail;
        })

        .catch((err) => {
          console.log(err);
        });
    },

    submitDataForDelete() {
    this.dialog=false;
      base_endpoint
        .delete("/api/profile/delete/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          console.log(response)
          this.$router.push({ name: "AdminUserList"});
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitDataForResetPassword() {
      base_endpoint
        .patch(
          "/api/profile/changepassword/" + this.$route.query.id,
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
        });
    },
    validateForResetPassword() {
      this.$refs.form.validate();
      this.submitDataForResetPassword();
      this.dialog3 = false;
      this.$emit(
        "schoolmodified",
        "A school has been modified and sent to database"
      );
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
        } else if (this.newPassword2 != this.newPassword)  {
          return "The passwords must match";
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