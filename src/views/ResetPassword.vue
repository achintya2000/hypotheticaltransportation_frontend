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
              >
                Save
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
    data() {
        return {
          resetPassword1ValidationArray: [this.resetPassword1Validation],
          resetPassword2ValidationArray: [this.resetPassword2Validation],
          valid: true,
        }
    },
    methods: {
      resetPassword1Validation() {
        if (this.newPassword == "" || this.newPassword == null) {
          return "This field is required";
        } else {
          return true;
        }
      },
      resetPassword2Validation() {
        if (this.newPassword2 == "" || this.newPassword2 == null) {
          return "This field is required";
        } else if (this.newPassword2 != this.newPassword) {
          return "The passwords must match";
        } else {
          return true;
        }
      },
      submitDataForResetPassword() {
      console.log("THIS IS  THE ID");
      console.log(this.$route.query.id);
      base_endpoint
        .patch(
          "/api/reset",
          {
            type: this.$route.query.type,
            token: this.$route.query.token,
            uidb64: this.$route.query.uidb64,
            password: this.newPassword2,
          },
        )
        .then((response) => {
          console.log(response);
           window.location.href = "http://localhost:8080/#/home"
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    validateForResetPassword() {
      if (
        this.newPassword != "" &&
        this.newPassword != null &&
        this.newPassword2 != "" &&
        this.newPassword2 != null
      ) {
        this.$refs.form.validate();
        this.submitDataForResetPassword();
        this.snackbar = true;
        this.dialog3 = false;
        this.$emit(
          "schoolmodified",
          "A school has been modified and sent to database"
        );
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    },
    components: {
    },
};
</script>
