<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <h2>Parents CSV File</h2>
    <label
      >File
      <input
        type="file"
        accept=".csv"
        @change="handleFileUpload($event, typeParent)"
      />
    </label>
    <br />

    <v-dialog v-model="parentDialog" width="50%">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Edit Row </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              label="Name"
              v-model="editedParent.name"
              :rules="userNameValidateArray"
            ></v-text-field>
            <v-text-field
              label="Email"
              :rules="userEmailValidateArray"
              v-model="editedParent.email"
            ></v-text-field>

            <gmap-autocomplete @place_changed="setPlaceParent">
              <template v-slot:input="slotProps">
                <v-text-field
                  v-model="editedParent.address"
                  label="Enter a location address"
                  append-icon="mdi-map-marker"
                  :rules="userPhoneValidateArray"
                  ref="input"
                  v-on:listeners="slotProps.listeners"
                  v-on:attrs="slotProps.attrs"
                ></v-text-field>
              </template>
            </gmap-autocomplete>

            <GmapMap
              style="width: 100%; height: 400px"
              ref="mapRef"
              :center="markerPos"
              :zoom="12"
            >
              <GmapMarker :key="index" :position="markerPos" />
            </GmapMap>

            <v-text-field
              label="Phone"
              :rules="userAddressValidateArray"
              v-model="editedParent.phone_number"
            ></v-text-field>

            <v-btn color="warning" class="mr-4" @click="parentDialog = false">
              Close
            </v-btn>
            <v-btn
              color="success"
              class="mr-4"
              :disabled="!valid"
              @click="
                parentDialog = false;
                saveParentItem();
              "
            >
              Save
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      v-model="parentSelected"
      :headers="headerParent"
      :items="indexedParentCSV"
      item-key="id"
      show-select
      hide-default-footer
      disable-pagination
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" class="mr-3" @click.stop="editParent(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-btn v-on:click="validateFile(typeParent)">Validate Parent CSV</v-btn>
    <v-btn v-on:click="submitFile(typeParent)">Submit Validated File</v-btn>

    <p></p>
    <!-- STUDENT STUFF STARTS BELOW --->

    <h2>Students CSV File</h2>
    <label
      >File
      <input
        type="file"
        accept=".csv"
        @change="handleFileUpload($event, typeStudent)"
      />
    </label>
    <br />

    <v-dialog v-model="studentDialog" width="50%">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Modify </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editedStudent.name"
              label="Student Name"
              :rules="studentNameValidateArray"
              required
            ></v-text-field>

            <v-text-field
              v-model="editedStudent.parent_email"
              label="Parent Email"
              :rules="studentParentValidateArray"
            ></v-text-field>

            <v-text-field
              v-model="editedStudent.student_id"
              label="Student ID"
              :rules="studentIDValidateArray"
            ></v-text-field>

            <v-autocomplete
              v-model="editedStudent.school_name"
              :items="schoolItems"
              item-text="name"
              label="School Name"
              :rules="studentSchoolValidateArray"
            ></v-autocomplete>

            <v-btn
              color="success"
              class="mr-4"
              @click="
                saveStudentItem();
                studentDialog = false;
              "
              :disabled="!valid"
            >
              Save
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset"> Clear </v-btn>

            <v-btn color="warning" @click="studentDialog = false">
              Cancel
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      :v-model="studentSelected"
      :headers="headerStudent"
      :items="indexedStudentCSV"
      item-key="id"
      show-select
      hide-default-footer
      disable-pagination
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" class="mr-3" @click.stop="editStudent(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-btn v-on:click="validateFile(typeStudent)">Submit Student CSV</v-btn>
    <v-btn :disabled="!studentCSVReady" v-on:click="submitFile(typeStudent)"
      >Submit Validated File</v-btn
    >
    <v-snackbar v-model="loadingSnackbar" outlines color="blue" :timeout="-1">
      Validation In Progress
      <v-progress-circular indeterminate color="black"></v-progress-circular>
    </v-snackbar>
  </v-card>
</template>

<script>
import Papa from "papaparse";
import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      test: "YEET",
      center: { lat: 36.001465, lng: -78.939133 },
      markerPos: { lat: 0, lng: 0 },
      file: "",
      content: [],
      valid: true,
      typeParent: "parent",
      typeStudent: "student",
      parentDialog: false,
      studentDialog: false,
      loadingSnackbar: false,
      userNameValidateArray: [this.userNameValidate],
      userEmailValidateArray: [this.userEmailValidate],
      userPhoneValidateArray: [this.userPhoneValidate],
      userAddressValidateArray: [this.userAddressValidate],
      studentNameValidateArray: [this.studentNameValidate],
      studentIDValidateArray: [this.studentIDValidate],
      studentSchoolValidateArray: [this.studentSchoolValidate],
      studentParentValidateArray: [this.studentParentValidate],
      csvTaskId: "",
      parentCSVData: [],
      parentSelected: [],
      studentSelected: [],
      headerParent: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Address", value: "address" },
        { text: "Phone", value: "phone_number" },
        { text: "Duplicate", value: "is_duplicate_of" },
        { text: "Errors", value: "error" },
        { text: "Edit", value: "actions", sortable: false, width: "100px" },
      ],
      parsed: false,
      editedParentIndex: -1,
      editedParent: {
        id: "",
        name: "",
        email: "",
        address: "",
        phone_number: "",
      },
      studentCSVData: [],
      headerStudent: [
        { text: "Name", value: "name" },
        { text: "Parent Email", value: "parent_email" },
        { text: "Student Id", value: "student_id" },
        { text: "School Name", value: "school_name" },
        { text: "Duplicate", value: "is_duplicate_of" },
        { text: "Errors", value: "error" },
        { text: "Edit", value: "actions", sortable: false, width: "100px" },
      ],
      editedStudentIndex: -1,
      editedStudent: {
        id: "",
        name: "",
        parent_email: "",
        student_id: "",
        school_name: "",
      },
      schoolItems: [],
      parentCSVReady: false,
      studentCSVReady: false,
      badAddressSnackbar: "",
    };
  },
  methods: {
    handleFileUpload(event, type) {
      this.file = event.target.files[0];
      this.parseFile(type);
    },
    parseFile(type) {
      Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          this.content = results;
          this.parsed = true;
          if (type == "parent") {
            this.parentCSVData = this.content.data;
          } else {
            this.studentCSVData = this.content.data;
            console.log(this.studentCSVData);
          }
        }.bind(this),
      });
    },
    validateFile(type) {
      // let formData = new FormData();
      // formData.append("file", this.file);
      this.loadingSnackbar = true;
      if (type == "parent") {
        base_endpoint
          .post(
            "/api/bulkimportvalidate",
            {
              headers: ["email", "name", "address", "phone_number"],
              csvdata: this.parentCSVData,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
            this.csvTaskId = res.data.id;
            this.pollStatus(this.typeParent);
          })
          .catch(function () {
            console.log("FAILURE!!");
          });
      } else {
        base_endpoint
          .post(
            "/api/bulkimportvalidate",
            {
              headers: ["name", "parent_email", "student_id", "school_name"],
              csvdata: this.studentCSVData,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((res) => {
            this.csvTaskId = res.data.id;
            this.pollStatus(this.typeStudent);
          })
          .catch(function () {
            console.log("FAILURE!!");
          });
      }
    },
    pollStatus(type) {
      if (type == "parent") {
        base_endpoint
          .get("/api/gettaskprogress/" + this.csvTaskId, {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          })
          .then((res) => {
            if (res.data.state == "SUCCESS") {
              console.log("done");
              console.log(res.data);
              this.parentCSVData = res.data.res.csvdata;
              this.parentCSVReady = res.data.res.valid;

              this.indexedParentCSV.forEach((e) => {
                if (e.exclude == true) {
                  this.parentSelected.push(e);
                }
              });

              return;
            }
            setTimeout(this.pollStatus(this.typeParent), 3000);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        base_endpoint
          .get("/api/gettaskprogress/" + this.csvTaskId, {
            headers: {
              Authorization: `Token ${this.$store.state.accessToken}`,
            },
          })
          .then((res) => {
            if (res.data.state == "SUCCESS") {
              console.log("done");
              console.log(res.data);
              this.studentCSVData = res.data.res.csvdata;
              this.studentCSVReady = res.data.res.valid;

              this.indexedStudentCSV.forEach((e) => {
                if (e.exclude == true) {
                  this.studentSelected.push(e);
                }
              });

              return;
            }
            setTimeout(this.pollStatus(this.typeStudent), 3000);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    submitFile(type) {
      if (type == "parent") {
        // console.log(this.parentSelected);
        // let removalIds = []
        // let parentCSVSubmisson = []

        // this.parentSelected.forEach(e => {
        //   removalIds.push(e.id)
        // })

        // for (let i = 0; this.indexedParentCSV.length; i++) {
        //   if (removalIds.includes(this.indexedParentCSV[i].id)) {
        //     parentCSVSubmisson.push(this.indexedParentCSV[i])
        //   }
        // }
        base_endpoint
          .post(
            "/api/bulkimportsubmit",
            {
              headers: ["email", "name", "address", "phone_number"],
              csvdata: this.parentCSVData,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch(function () {
            console.log("FAILURE!!");
          });
      } else {
        base_endpoint
          .post(
            "/api/bulkimportsubmit",
            {
              headers: ["name", "parent_email", "student_id", "school_name"],
              csvdata: this.studentCSVData,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch(function () {
            console.log("FAILURE!!");
          });
      }
    },
    setPlaceParent(place) {
      this.editedParent.address = place.formatted_address;
      this.markerPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    },
    editParent(item) {
      base_endpoint
        .post("/api/getaddress", {
          address: item.address,
        })
        .then((res) => {
          console.log(res);
          if (res.err != "") {
            this.badAddressSnackbar = res.err;
          }
          this.loadingSnackbar = false;
          this.markerPos = { lat: res.data.lat, lng: res.data.lng };
          this.parentDialog = true;
          this.editedParentIndex = item.id;
          this.editedParent = Object.assign({}, item);
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
    saveParentItem() {
      console.log("YEET");
      if (this.editedParentIndex > -1) {
        Object.assign(
          this.parentCSVData[this.editedParentIndex],
          this.editedParent
        );
      }
    },
    editStudent(item) {
      this.studentDialog = true;
      this.editedStudentIndex = item.id;
      this.editedStudent = Object.assign({}, item);
    },
    saveStudentItem() {
      if (this.editedStudentIndex > -1) {
        Object.assign(
          this.studentCSVData[this.editedStudentIndex],
          this.editedStudent
        );
      }
    },
    getDisplaySchools(item) {
      return {
        name: item.name,
        address: item.address,
        id: item.id,
      };
    },
    getSchools() {
      base_endpoint
        .get("/api/school/getall/" + window.localStorage.getItem("userID"), {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolItems = response.data.map(this.getDisplaySchools);

          this.schoolItems.forEach((item) => {
            if (this.studentSchoolId == item.id) {
              this.school = item;
            }
          });
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
    userNameValidate() {
      if (this.editedParent.name == null || this.editedParent.name == "") {
        return "Parent name is required";
      } else {
        return true;
      }
    },
    userEmailValidate() {
      if (this.editedParent.email == null || this.editedParent.email == "") {
        return "Parent email is required";
      } else {
        const splitStringAt = this.editedParent.email.split("@");
        if (splitStringAt.length != 2) {
          return "Please enter a valid email address";
        } else {
          const splitStringPeriod = splitStringAt[1].split(".");
          if (
            splitStringPeriod.length != 2 ||
            splitStringPeriod[1].length == 0
          ) {
            return "Please enter a valid email address";
          } else {
            return true;
          }
        }
      }
    },
    userAddressValidate() {
      if (
        this.editedParent.address == null ||
        this.editedParent.address == ""
      ) {
        return "Parent address is required";
      } else {
        return true;
      }
    },
    userPhoneValidate() {
      if (
        this.editedParent.phone_number == null ||
        this.editedParent.phone_number == ""
      ) {
        return "Parent phone number is required";
      } else {
        return true;
      }
    },
    studentNameValidate() {
      if (this.editedStudent.name == null || this.editedStudent.name == "") {
        return "Student Name is required";
      } else {
        return true;
      }
    },
    studentIDValidate() {
      if (isNaN(this.editedStudent.student_id) == true) {
        return "Student ID must be a number";
      } else if (isNaN(this.editedStudent.student_id) == false) {
        if (parseInt(this.editedStudent.student_id) < 0) {
          return "Student ID must be a postive number";
        }
      } else {
        return true;
      }
    },
    studentSchoolValidate() {
      if (
        this.editedStudent.school_name == null ||
        this.editedStudent.school_name == ""
      ) {
        return "Student school is required";
      } else {
        return true;
      }
    },
    studentParentValidate() {
      if (
        this.editedStudent.parent_email == null ||
        this.editedStudent.parent_email == ""
      ) {
        return "Student's parent is required";
      } else {
        return true;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    validate() {
      this.$refs.form.validate();
    },
  },
  computed: {
    indexedParentCSV() {
      return this.parentCSVData.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
    indexedStudentCSV() {
      return this.studentCSVData.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
  },
  created() {
    this.getSchools();
  },
};
</script>

<style>
</style>