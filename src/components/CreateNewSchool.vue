<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
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
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="address"
            :rules="addressRules"
            label="Street Address"
            required
          ></v-text-field>

          <v-text-field
            v-model="city"
            :rules="cityRules"
            label="City"
            required
          ></v-text-field>

          <v-text-field
            v-model="state"
            :rules="stateRules"
            label="State"
            required
          ></v-text-field>

          <v-text-field
            v-model="zipcode"
            :rules="zipcodeRules"
            label="Zip Code"
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
          <v-btn color="warning" @click="dialog = false"> Cancel </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      valid: true,
      name: "",
      nameRules: [(v) => !!v || "Name is required"],
      address: "",
      addressRules: [(v) => !!v || "Address is required"],
      city: "",
      cityRules: [(v) => !!v || "City is required"],
      state: "",
      stateRules: [(v) => !!v || "State is required"],
      zipcode: "",
      zipcodeRules: [(v) => !!v || "Zipcode is required"],
    };
  },
  methods: {
    submitData() {},
    validate() {
      this.$refs.form.validate();
      this.submitData();
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