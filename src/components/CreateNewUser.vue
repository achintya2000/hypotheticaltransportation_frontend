<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
        Create User
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2"> Create User </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field 
            label="Parent Name" 
            v-model="name"
            :rules="nameRules"
            required
          ></v-text-field>

          <v-text-field 
            label="Parent Email" 
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>

          <v-text-field 
            label="Parent Password" 
            v-model="password"
            :rules="passwordRules"
            required
          ></v-text-field>

          <v-text-field 
            label="Parent Address" 
            v-model="address"
            :rules="addressRules"
            required
          ></v-text-field>

          <v-checkbox
            v-model="adminCheckbox"
            :label="'Is Admin'"
          ></v-checkbox>

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
      dialog: false,
      valid: true,
      name: "",
      nameRules: [(v) => !!v || "Name is required"],
      email: "",
      emailRules: [(v) => !!v || "Email is required"],
      password: "",
      passwordRules: [(v) => !!v || "Password is required"],
      address: "",
      addressRules: [(v) => !!v || "Address is required"],
      adminCheckbox: "",
    };
  },
  methods: {
    submitData() {
      base_endpoint.post(
        "/api/profile/create",
        {
          full_name: this.name,
          address: this.address,
          longitude: 35.5,
          latitude: 35.5,
          email: this.email,
          password: this.password,
          is_superuser: this.adminCheckbox,
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
      this.$emit(
        "usercreated",
        "A new user has been created and sent to database"
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