<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
        Create New Student
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Create a New Student
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-checkbox
            v-model="checkbox"
            :label="'Add students to current user'"
          ></v-checkbox>

          <v-text-field
            v-if="checkbox"
            v-model="parentName"
            label="User Name"
            required
          ></v-text-field>
          <v-text-field
            v-if="checkbox"
            v-model="parentEmail"
            label="User Email"
            required
          ></v-text-field>
          <v-text-field
            v-if="checkbox"
            v-model="parentPassword"
            label="User Password"
            required
          ></v-text-field>
          
          <gmap-autocomplete v-if="checkbox" @place_changed="setPlace">
            <template v-slot:input="slotProps">
          <v-text-field
            
            v-model="parentAddress"
            label="User Address"
            required
            ref="input"
                v-on:listeners="slotProps.listeners"
                v-on:attrs="slotProps.attrs"
          ></v-text-field>
          </template>
          </gmap-autocomplete>

          <v-checkbox
            v-if="checkbox"
            v-model="userAdminCheckbox"
            :label="'Make User Admin?'"
          ></v-checkbox>

          <v-text-field
            v-model="studentName"
            :rules="nameRules"
            label="Student Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="sid"
            :rules="sidRules"
            label="Student ID"
            required
          ></v-text-field>
          <v-autocomplete
            v-model="parentSelected"
            v-if="!checkbox"
            item-text="name"
            label="Student's Parent"
            :items="parents"
            required
            return-object
          ></v-autocomplete>

          <v-autocomplete
            v-model="schoolSelected"
            item-text="name"
            label="Student School"
            :items="schools"
            @change="getRoutesForSchool()"
            required
            return-object
          ></v-autocomplete>

          <v-autocomplete 
            v-model="routeSelected"
            item-text="name" 
            label="Student Bus Route" 
            :items="routes"
            return-object
            >
          </v-autocomplete>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Submit
          </v-btn>

          <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>
          <v-btn color="warning" @click="dialog = false"> Cancel </v-btn>
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
      checkbox: false,
      schoolItems: [],
      dialog: false,
      valid: true,
      parentName: "",
      parentEmail: "",
      parentPassword: "",
      parentAddress: "",
      userAdminCheckbox: false,
      parentSelected: null,
      routeSelected: null,
      newParentID: "",
      studentName: "",
      nameRules: [(v) => !!v || "Name is required"],
      sid: "",
      sidRules: [(v) => !!v || "Student ID is required"],
      schools: [],
      routes: [],
      parents: [],
      schoolSelected: null,
      latitude: 0,
      longitude: 0,
      formatted_address: "",
    };
  },
  methods: {
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },
    getDisplayRoute(item) {
      return {
        name: item.name,
        school: item.school,
        description: item.description,
      };
    },
    getRoutesForSchool() {
      base_endpoint
        .get("/api/route/getallfromschool/" + this.schoolSelected.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.routes = response.data.map(this.getDisplayRoute);
        })
        .catch((err) => {
          console.log(err);
        });
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
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schools = response.data.map(this.getDisplaySchool);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDisplayParent(item) {
      return {
        id: item.id,
        name: item.full_name,
      };
    },
    getRequestAllParents() {
      base_endpoint
        .get("/api/profile/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.parents = response.data.map(this.getDisplayParent);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitData() {
      if (this.checkbox==true) {
        console.log("GOT INTO THE IF STATMENT");
        base_endpoint.post(
          "/api/profile/create",
          {
          full_name: this.parentName,
          address: this.formatted_address,
          longitude: this.longitude,
          latitude: this.latitude,
          email: this.parentEmail,
          password: this.parentPassword,
          is_superuser: this.userAdminCheckbox,
        },
        {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        }
      ).then((response) => {
        console.log("PRINTING PARENT ID CREATED");
        console.log(response.data.id);
          this.newParentID = response.data.id;
          console.log("CREATING STUDENT");
        base_endpoint.post(
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
        });
        
        }
      );
        
      } else {
        console.log("GOT INTO THE ELSE STATMENT");
        base_endpoint.post(
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
      );
      }
      
    },
    validate() {
      this.$refs.form.validate();
      this.submitData();
      this.dialog = false;
      this.$emit(
        "studentcreated",
        "A new student has been created and sent to database"
      );
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  created() {
    this.getRequestAllSchools();
    this.getRequestAllParents();
  },
};
</script>

<style>
</style>