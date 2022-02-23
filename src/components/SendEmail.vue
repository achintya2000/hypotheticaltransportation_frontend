<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <v-dialog v-model="dialog" width="50%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn style="margin: 10px" outlined v-bind="attrs" v-on="on">
        <span v-if="GABool == true">General Announcement</span
        ><span v-if="GABool == false">Route Announcement</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        <span v-if="GABool == true">General Announcement:&nbsp</span
        ><span v-if="GABool == false">Route Announcement:&nbsp</span>
        <span v-if="allBool == true">All Users</span>
        <span v-if="schoolBool == true">Selected School</span>
        <span v-if="routeBool == true">Selected Route</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="subject"
            :rules="subjectValidateArray"
            label="Email Subject"
            required
          ></v-text-field>

          <v-textarea
            v-model="emailBody"
            :rules="emailBodyValidateArray"
            label="Email Body"
            required
          ></v-textarea>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
            type="submit"
          >
            Submit
          </v-btn>
          <v-btn
            color="warning"
            @click="
              dialog = false;
              reset();
            "
          >
            Cancel
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { base_endpoint } from "../services/axios-api";

export default {
  props: {
    typeOfEmail: {
      type: String,
      required: true,
    },
    relevantID: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      subject: "",
      emailBody: "",
      allBool: false,
      schoolBool: false,
      valid: "",
      routeBool: false,
      GABool: false,
      relevantIDNum: "",
      subjectValidateArray: [this.subjectValidate],
      emailBodyValidateArray: [this.emailBodyValidate],
      dialog: false,
      emails: [],
    };
  },
  methods: {
    validate() {
      if (this.subject != "" && this.subject != null) {
        this.$refs.form.validate();
        this.submitData();
        this.dialog = false;
        this.snackbar = true;
        this.$refs.form.reset();
      }
    },
    submitData() {
      console.log("subject: " + this.subject);
      console.log("body: " + this.emailBody);
      console.log("all: " + this.allBool);
      console.log("school: " + this.schoolBool);
      console.log("route: " + this.routeBool);
      console.log("GA: " + this.GABool);
      base_endpoint
        .post(
          "/api/email",
          {
            subject: this.subject,
            emailBody: this.emailBody,
            all: this.allBool,
            school: this.schoolBool,
            route: this.routeBool,
            GA: this.GABool,
            ID: this.relevantIDNum,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then(() => {
          this.getRequestAllRoutes();
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetAndClose() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    subjectValidate() {
      if (this.subject == "" || this.subject == null) {
        return "Subject is required";
      } else {
        return true;
      }
    },
    emailBodyValidate() {
      if (this.emailBody == "" || this.emailBody == null) {
        return "Email Body is required";
      } else {
        return true;
      }
    },
  },
  created() {
    this.allBool = this.typeOfEmail.includes("all");
    this.schoolBool = this.typeOfEmail.includes("school");
    this.routeBool = this.typeOfEmail.includes("route");
    this.GABool = this.typeOfEmail.includes("GA");
    this.relevantIDNum = this.$route.query.id;
    base_endpoint
        .post(
          "/api/getemails",
          {
            all: this.allBool,
            school: this.schoolBool,
            route: this.routeBool,
            ID: this.relevantIDNum,
          },
          {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          }
        )
        .then((response) => {
          this.emails = response.data.map;
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
        
  },
};
</script>
