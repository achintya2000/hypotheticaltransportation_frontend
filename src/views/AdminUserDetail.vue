<template>
  <v-card>
    <v-card-title>
      John Doe
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog3" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            Reset Password
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Reset Password
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid3"
              lazy-validation
            >
              <v-text-field
                v-model="newPassword"
                :rules="newPasswordRules"
                label="New Password"
                required
              ></v-text-field>

              <v-text-field
                v-model="newPassword2"
                :rules="newPassword2Rules"
                label="Confirm New Password"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid3"
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
                @click="dialog3 = false"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
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
                v-model="name2"
                :rules="name2Rules"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="address"
                :rules="addressRules"
                label="Address"
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
                label="Zipcode"
                required
              ></v-text-field>

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
    11 Duke Street, Durham NC, 27705
    </v-card-subtitle>
    <v-card-subtitle>
    johndoe@gmail.com
    </v-card-subtitle>
    <v-card-subtitle>
    Admin: No
    </v-card-subtitle>
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
      dialog: false,
        dialog2: false,
        dialog3: false,
              name2: 'Old Name',
      name2Rules: [
        v => !!v || 'Name is required',
      ],
      address: 'Old Address',
      addressRules: [
            v => !!v || 'Address is required',
      ],
      city: 'Old City',
      cityRules: [
        v => !!v || 'City is required',
      ],
      state: 'Old State',
      stateRules: [
        v => !!v || 'State is required',
        ],
        zipcode: 'Old Zipcode',
        zipcodeRules: [
            v => !!v || 'Zipcode is required',
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