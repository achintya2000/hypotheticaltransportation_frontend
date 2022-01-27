<template>
  <v-card>
    <v-card-title>
      Your Schools
      <v-spacer></v-spacer>
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
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="addresses"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    ></v-data-table>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { getAPI } from "../services/axios-api";

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
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Address", value: "address" },
      ],
      addresses: [],
      // addresses: [
      //   {
      //     name: "Frozen Yogurt",
      //     address: 159,
      //   },
      //   {
      //     name: "Ice cream sandwich",
      //     address: 237,
      //   },
      //   {
      //     name: "Eclair",
      //     address: 262,
      //   },
      //   {
      //     name: "Cupcake",
      //     address: 305,
      //   },
      //   {
      //     name: "Gingerbread",
      //     address: 356,
      //   },
      //   {
      //     name: "Jelly bean",
      //     address: 375,
      //   },
      //   {
      //     name: "Lollipop",
      //     address: 392,
      //   },
      //   {
      //     name: "Honeycomb",
      //     address: 408,
      //   },
      //   {
      //     name: "Donut",
      //     address: 452,
      //   },
      //   {
      //     name: "KitKat",
      //     address: 518,
      //   },
      // ],
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    getDisplayAddress(item) {
      return {
        name: item.name,
        address: item.address,
      };
    },
  },
  computed: mapState(["APIData"]),
  created() {
    getAPI
      .get("/api/school/getall", {
        headers: { Authorization: `Token ${this.$store.state.accessToken}` },
      })
      .then((response) => {
        console.log(response.data[0]);
        this.addresses = response.data.map(this.getDisplayAddress);
        this.$store.state.addresses = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
</style>