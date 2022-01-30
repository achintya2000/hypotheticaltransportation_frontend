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
            v-model="name"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="sid"
            :rules="sidRules"
            label="Student ID"
            required
          ></v-text-field>

           <template v-slot:item.school="props">
            <v-autocomplete
                v-model="props.item.school"
                :items="schoolItems"
                item-text='name'
                :sort-by="['name']"
                label="School"
                @change="disable('school_selected'); getRequestSchoolRoutes(props)"

              ></v-autocomplete>
          </template>

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
      name: "",
      nameRules: [(v) => !!v || "Name is required"],
      sid: "",
      sidRules: [(v) => !!v || "Student ID is required"],
      schools: ['sdfa'],
      routes: [],
    };
  },
  methods: {
    getDisplayRoute(item) {
      return {
        name: item.name,
        school: item.school,
        description: item.description
      };
    },
    getRequestAllRoutes() {
      console.log("GOT HERE!!!");
      base_endpoint
        .get("/api/route/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.routes = response.data.map(this.getDisplayRoute);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDisplaySchool(item) {
      return {
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
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitData() {
      base_endpoint.post(
        "/api/student/create",
        {
          full_name: this.name,
          sid: this.sid,
          school: this.school,
          route: this.route,
        },
        {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        }
      );
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
};
</script>

<style>
</style>