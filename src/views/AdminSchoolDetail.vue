<template>
  <v-card>
    <v-card-title>
      Staples High School
      <v-spacer></v-spacer>
      <v-btn outlined>Modify</v-btn>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Delete School
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-subtitle>
            Are you sure you want to delete the school?
            To continue, type the name of the school below
          </v-card-subtitle>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="School Name"
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

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
               Clear
              </v-btn>

              <v-btn
                color="warning"
                @click="reset"
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
    70 North Ave, Westport, CT 06880
    </v-card-subtitle>
    <v-card-title>
        Bus Routes
        <v-spacer></v-spacer>
        <v-btn outlined>Plan New Route</v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="addresses"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    ></v-data-table>
    <v-card-title>
        Students
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
export default {
  data() {
    return {
      search: "",
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Address", value: "address" },
      ],
      addresses: [
        {
          name: "Frozen Yogurt",
          address: 159,
        },
        {
          name: "Ice cream sandwich",
          address: 237,
        },
        {
          name: "Eclair",
          address: 262,
        },
        {
          name: "Cupcake",
          address: 305,
        },
        {
          name: "Gingerbread",
          address: 356,
        },
      ],
    };
  },
  methods: {
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
};
</script>

<style>
</style>