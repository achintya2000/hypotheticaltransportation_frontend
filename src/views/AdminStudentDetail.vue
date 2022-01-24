<template>
  <v-card>
    <v-card-title>
      Jane Doe
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
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >

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
    };
  },
};
</script>

<style>
</style>