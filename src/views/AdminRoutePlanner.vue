<template>
    <v-card>
        <v-layout row wrap>
    <v-card width = 50%>
    <v-card-title>
      Staples High School Routes
    </v-card-title>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        
      ></v-text-field>
    <v-data-table
        v-model="selected"
      :headers="headers"
      :items="schools"
      :single-select="true"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      item-key="name"
      multi-sort
      show-select
    ></v-data-table>
    <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
        Add New Route
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Add New Route
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
            v-model="description"
            :rules="descriptionRules"
            label="Route Description"
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
  </v-card>
  <GmapMap :center="center" :zoom="12" style="width: 50%; height: 400px">
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center = m.position"
      />
    </GmapMap>
        <v-btn color="green lighten-2" dark v-bind="attrs" v-on="on">
            Save
          </v-btn>
          <v-btn color="green lighten-2" dark v-bind="attrs" v-on="on">
            Cancel
          </v-btn>
    

  </v-layout>
      </v-card>
  
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
  data() {
    return {
      search: "",
      selected: "",
        dialog: false,
      valid: true,
      name: "",
      nameRules: [(v) => !!v || "Name is required"],
      description: "",
      descriptionRules: [(v) => !!v || "Description is required"],
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
      ],
      schools: [],
    };
  },
  methods: {
    submitData() {
      base_endpoint.post(
        "/api/route/create",
        {
          name: this.name,
          school: this.$route.query.id,
          description: this.description,
        },
        {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        }
      ).then(response => {
          console.log(response)
          this.getRequestAllRoutes()
      });
    },
    getDisplayRoute(item) {
      return {
        name: item.name,
        description: item.description,
      };
    },
    getRequestAllRoutes() {
      base_endpoint
        .get("/api/route/getallfromschool/" + this.$route.query.id, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schools = response.data.map(this.getDisplayRoute);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validate() {
      this.$refs.form.validate();
      this.submitData();
      this.dialog = false;
      this.$emit(
        "routecreated",
        "A new route has been created and sent to database"
      );
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  //computed: mapState(["APIData"]),
  created() {
    this.getRequestAllRoutes();
  },
};
</script>

<style>
</style>