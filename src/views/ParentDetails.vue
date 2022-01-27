<template>
  <v-card>
    <v-card-title>
      Your Information
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
    </v-card-title>
    <v-card-subtitle>
        Email: FIX THIS
    </v-card-subtitle>
    <v-card-subtitle>
        Name: FIX THIS
    </v-card-subtitle>
    <v-card-subtitle>
        Address: FIX THIS
    </v-card-subtitle>
    <v-card
        class="mx-auto"
        max-width="344"
    >
        <v-card-text>
        <p class="text-h4 text--primary">
            Student #1 Name
        </p>
        <p> </p>
        <p> </p>
        <p> </p>
        <p> </p>
        <p> </p>
        </v-card-text>
        <v-card-actions>
        <v-btn
            text
            color="teal accent-4"
            @click="reveal = true"
        >
            Learn More
        </v-btn>
        </v-card-actions>

        <v-expand-transition>
        <v-card
            v-if="reveal"
            class="transition-fast-in-fast-out v-card--reveal"
            style="height: 100%;"
        >
            <v-card-text class="pb-0">
            <p class="text-h4 text--primary">
                Student Name
            </p>
            <p>Student ID #</p>
            <p>School</p>
            <p>Route Name</p>
            <p>Route Desctritypion</p>
            </v-card-text>
            <v-card-actions class="pt-0">
            <v-btn
                text
                color="teal accent-4"
                @click="reveal = false"
            >
                Close
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-expand-transition>
    </v-card>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      dialog3: false,
      valid: true,
      reveal: false,
      newPassword: '',
      newPasswordRules: [
        v => !!v || 'Name is required',
      ],
      newPassword2: '',
      newPassword2Rules: [
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
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>