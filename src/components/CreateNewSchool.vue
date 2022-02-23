<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        style="margin: 10px"
        input-value="null"
        outlined
        v-bind="attrs"
        v-on="on"
      >
        Create New School
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Create a New School
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            append-icon="mdi-school"
            :rules="nameValidateArray"
            label="Name"
            required
          ></v-text-field>

          <gmap-autocomplete @place_changed="setPlace">
            <template v-slot:input="slotProps">
              <v-text-field
                v-model="address"
                label="Enter a location address"
                :rules="addressValidateArray"
                ref="input"
                append-icon="mdi-map-marker"
                v-on:listeners="slotProps.listeners"
                v-on:attrs="slotProps.attrs"
              >
              </v-text-field>
            </template>
          </gmap-autocomplete>

          <v-text-field
            v-model="busArriveTime"
            label="Bus Arrival Time"
            type="time"
            :rules="busArriveValidateArray"
            required
          ></v-text-field>

          <v-text-field
            v-model="busDepTime"
            label="Bus Departure Time"
            type="time"
            :rules="busDepValidateArray"
            required
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
            type="submit"
          >
            Submit
          </v-btn>

          <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>
          <v-btn
            color="warning"
            @click="
              dialog = false;
              reset();
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      name: "",
      dialog: false,
      valid: true,
      address: "",
      latitude: 0,
      longitude: 0,
      formatted_address: "",
      nameValidateArray: [this.nameValidate],
      addressValidateArray: [this.addressValidate],
      busArriveValidateArray: [this.busArriveValidate],
      busDepValidateArray: [this.busDepValidate],
      busArriveTime: "",
      busDepTime: "",
      schools: [],
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
    setPlace(place) {
      this.formatted_address = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },
    submitData() {
      base_endpoint
        .post(
          "/api/school/create",
          {
            name: this.name,
            address: this.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
            arrivalTime: new Date("2021-01-01 " + this.busArriveTime + ":00"),
            departureTime: new Date("2021-01-01 " + this.busDepTime + ":00"),
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {
          this.$emit(
            "schoolcreated",
            "A new school has been created and sent to database"
          );
        })
        .catch((err) => {
          this.showSnackBarAddress();
          console.log(err);
        });
    },
    validate() {
      if (
        this.name != "" &&
        this.name != null &&
        this.address != "" &&
        this.address != null &&
        this.busArriveTime != "" &&
        this.busArriveTime != null &&
        this.busDepTime != "" &&
        this.busDepTime != null
      ) {
        this.submitData();
        this.dialog = false;
        this.reset();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    nameValidate() {
      if (this.name == "" || this.name == null) {
        return "Name is required";
      } else if (this.schools.includes(this.name)) {
        return "The school name must be unique";
      } else {
        return true;
      }
    },
    addressValidate() {
      if (this.address == "" || this.address == null) {
        return "Address is required";
      } else {
        return true;
      }
    },
    busArriveValidate() {
      if (this.busArriveTime == "" || this.busArriveTime == null) {
        return "Bus Arrival Time is required, remember to type AM or PM";
      } else {
        return true;
      }
    },
    busDepValidate() {
      if (this.busDepTime == "" || this.busDepTime == null) {
        return "Bus Departure Time is required, remember to type AM or PM";
      } else {
        return true;
      }
    },
    getRequestAllSchools() {
      base_endpoint
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            this.schools.push(response.data[i].name);
          }
          console.log(this.schools);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
  },
  created() {
    this.getRequestAllSchools();
  }
};
</script>

<style>
</style>