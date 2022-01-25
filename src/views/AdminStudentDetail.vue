<template>
  <v-card>
    <v-card-title>
      Jane Doe
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
                v-model="name"
                :rules="nameRules"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="studentID"
                :rules="studentIDRules"
                label="Student ID"
                required
              ></v-text-field>

              <v-autocomplete
                v-model="parentValue"
                :items="parentItems"
                label="Parent"
              ></v-autocomplete>

              <v-autocomplete
                v-model="schoolValue"
                :items="schoolItems"
                label="School"
              ></v-autocomplete>
              
              <v-autocomplete
                v-model="busRouteValue"
                :items="busRouteItems"
                label="Bus Route"
              ></v-autocomplete>

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
    jd1003098
    </v-card-subtitle>
    <v-card-subtitle>
    Staples High School
    </v-card-subtitle>
    <v-card-subtitle>
    Bus Route
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
        dialog: false,
        dialog2: false,
        name: 'Old Name',
        nameRules: [
            v => !!v || 'Name is required',
        ],
        studentID: 'Old Student ID',
        studentIDRules: [
            v => !!v || 'Student ID is required',
        ],
        parentValue: 'foo',
        parentRules: [
            v => !!v || 'Parent is required',
        ],
        schoolValue: 'Old School',
        schoolRules: [
            v => !!v || 'School is required',
        ],
        busRouteValue: 'Old Bus Route',
        busRouteRules: [
            v => !!v || 'Bus Route is required',
        ],
        parentItems: ['foo', 'bar', 'fizz', 'buzz'],
        parentValues: ['foo', 'bar'],
        parentValue: null,
        schoolItems: ['foo', 'bar', 'fizz', 'buzz'],
        schoolValues: ['foo', 'bar'],
        schoolValue: null,
        busRouteItems: ['foo', 'bar', 'fizz', 'buzz'],
        busRouteValues: ['foo', 'bar'],
        busRouteValue: null,
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