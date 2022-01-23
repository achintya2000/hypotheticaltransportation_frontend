<template>
  <nav>
    <v-app-bar color="#FFFFFF" flat app>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-spacer class="hidden-md-and-up"></v-spacer>

      <router-link to="/" style="text-decoration: none; color: inherit">
        <v-toolbar-title> Hypothetical Transportation </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on"> login </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="loginEmail"
                    :rules="loginEmailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="loginPassword"
                    :append-icon="show1 ? 'eye' : 'eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                  <v-btn
                    text
                    :disabled="!valid"
                    color="blue darken-1"
                    @click="
                      validate;
                      dialog = false;
                    "
                  >
                    Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-btn
        class="hidden-sm-and-down"
        text
        v-for="name in names"
        :key="name.title"
      >
        <router-link
          :to="name.to"
          style="text-decoration: none; color: inherit"
          >{{ name.title }}</router-link
        >
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  data() {
    return {
      dialog: false,
      drawer: false,
      names: [{ title: "About", to: "/about" }],
      contactpoints: [],
      valid: true,

      firstName: "",
      lastName: "",
      email: "",
      password: "",
      verify: "",
      loginPassword: "",
      loginEmail: "",
      loginEmailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
      },
    };
  },
};
</script>

<style>
</style>