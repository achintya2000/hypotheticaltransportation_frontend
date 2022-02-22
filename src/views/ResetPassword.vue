<template>
  <v-card width=100% height=100% class="d-flex align-center justify-center">
      <v-card width=50%>
          <v-card-title class="text-h5 grey lighten-2">
            Reset Password
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="newPassword"
                :rules="resetPassword1ValidationArray"
                label="New Password"
                :type="'password'"
                required
              ></v-text-field>

              <v-text-field
                v-model="newPassword2"
                :rules="resetPassword2ValidationArray"
                label="Confirm New Password"
                :type="'password'"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validateForResetPassword"
                type="submit"
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

              <v-btn
                color="warning"
                @click="
                  dialog3 = false;
                  reset();
                "
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

  </v-card>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {

    },
    components: {
    },
};
</script>
