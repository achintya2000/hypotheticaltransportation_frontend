<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
    @click:outside="dialog = false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" x-large color="primary"> login </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Login</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="loginForm"
          v-model="valid"
          lazy-validation
          @submit.prevent="login"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="username"
                :rules="loginEmailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :append-icon="show ? 'eye' : 'eye-off'"
                :rules="[rules.required]"
                :type="show ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                @click:append="show = !show"
              ></v-text-field>
            </v-col>
            <v-alert cols="12" dense outlined v-if="incorrectAuth" type="error">
              The email or password you entered is incorrect
            </v-alert>
            <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog2"
              max-width="600px"
              @click:outside="dialog2 = false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on">Forget Password</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Forget Password</span>
                </v-card-title>
                <v-card-text>
                  <v-form
                    ref="forgetForm"
                    v-model="valid2"
                    lazy-validation
                    @submit.prevent="login"
                  >
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="username2"
                          :rules="loginEmailRules2"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                      <v-spacer></v-spacer>
                      <v-btn @click="forgetPassword"> Forget Password </v-btn>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-btn type="submit" text :disabled="!valid2"> Login </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" outlines color="success">
      A new school has been created

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
export default {
  name: "Login",
  data() {
    return {
      password: "",
      username: "",
      username2: "",
      snackbar: false,
      dialog: false,
      incorrectAuth: false,
      valid: true,
      valid2: true,
      show: false,
      loginEmailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      loginEmailRules2: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 7) || "Min 8 characters",
      },
    };
  },
  methods: {
    forgetPassword() {
      base_endpoint
        .post("/api/forgotpassword", {
          email: this.username2,
        })
        .then((response) => {
          console.log(response);
          this.$router.push({
            name: "Home",
          });
          this.dialog = false;
          this.dialog2 = false;
          this.snackbar = true;
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    login() {
      this.$store
        .dispatch("userLogin", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$store
            .dispatch("getLoggedInUserInfo", {
              token: localStorage.getItem("token"),
            })
            .then(() => {
              if (localStorage.getItem("userType") == "student") {
                this.$router.push({
                  name: "ParentStudentDetail",
                  query: { id: localStorage.getItem("studentID") },
                });
              } else {
                this.$router.push({ name: "ParentDetails" });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          this.incorrectAuth = true;
        });
    },
  },
};
</script>

<style>
</style>