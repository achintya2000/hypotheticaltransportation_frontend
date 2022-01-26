<template>
  <v-card>
    <v-card-title>
      Route Name
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
                v-model="routeName"
                :rules="routeNameRules"
                label="Route Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="routeDes"
                :rules="routeDesRules"
                label="Route Description"
                required
              ></v-text-field>

              <v-autocomplete
                v-model="schoolValue"
                :items="schoolItems"
                label="School"
                required
              ></v-autocomplete>

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
    Route School
    </v-card-subtitle>
    <v-card-subtitle>
    Route Descirption
    </v-card-subtitle>
    <v-card-subtitle>
    Students
    </v-card-subtitle>
    <v-card-text>
    Bullets
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      valid: true,
      dialog: false,
      dialog2: false,
      routeName: 'Old Name',
    schoolItems: ['Old School', 'bar', 'fizz', 'buzz'],
    schoolValues: ['foo', 'bar'],
      routeNameRules: [
        v => !!v || 'Name is required',
      ],
      routeDes: 'Old Route Des',
      routeDesRules: [
            v => !!v || 'Address is required',
      ],
      schoolValue: "Old School",
      schoolRules: [
            v => !!v || 'Address is required',
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