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
          <v-text-field label="Name" v-model="editedParent.name"></v-text-field>
          <v-text-field
            label="Email"
            v-model="editedParent.email"
          ></v-text-field>

          <gmap-autocomplete @place_changed="setPlaceParent">
            <template v-slot:input="slotProps">
              <v-text-field
                v-model="editedParent.address"
                label="Enter a location address"
                append-icon="mdi-map-marker"
                ref="input"
                v-on:listeners="slotProps.listeners"
                v-on:attrs="slotProps.attrs"
              ></v-text-field>
            </template>
          </gmap-autocomplete>

          <v-text-field
            label="Phone"
            v-model="editedParent.phone_number"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="parentDialog = false">
            Close
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              parentDialog = false;
              saveParentItem();
            "
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      v-model="parentSelected"
      :headers="headerParent"
      :items="indexedParentCSV"
      item-key="id"
      show-select
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" class="mr-3" @click.stop="editParent(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-btn v-on:click="validateFile()">Validate Parent CSV</v-btn>
    <v-btn v-on:click="submitFile()">Submit Updates</v-btn>

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
              @click="saveStudentItem"
              :disabled="!valid"
              type="submit"
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
      :headers="headerStudent"
      :items="indexedStudentCSV"
      item-key="id"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" class="mr-3" @click.stop="editStudent(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-btn v-on:click="validateFile()">Submit File</v-btn>
    <v-btn v-on:click="submitFile()">Submit Updates</v-btn>
  </v-card>
</template>

<script>
import Papa from "papaparse";
import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      file: "",
      content: [],
      typeParent: "parent",
      typeStudent: "student",
      parentDialog: false,
      studentDialog: false,
      csvTaskId: "",
      parentCSVData: [],
      parentSelected: [],
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
    validateFile() {
      let formData = new FormData();
      formData.append("file", this.file);
      base_endpoint
        .post("/api/bulkimportvalidate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.parentCSVData = res.data.csv;
          this.csvTaskId = res.data.id;

          this.pollStatus();
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
    pollStatus() {
      base_endpoint
        .get("/api/gettaskprogress/" + this.csvTaskId, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((res) => {
          if (res.data.state == "SUCCESS") {
            console.log("done");
            console.log(res.data);
            this.parentCSVData = res.data.res;
            return;
          }
          setTimeout(this.pollStatus, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitFile() {
      console.log(this.parentSelected);
      //   base_endpoint
      //     .post("/preview-file-changes", this.content.data)
      //     .then(function () {
      //       console.log("SUCCESS!!");
      //     })
      //     .catch(function () {
      //       console.log("FAILURE!!");
      //     });
    },
    setPlaceParent(place) {
      this.editedParent.address = place.formatted_address;
    },
    editParent(item) {
      this.parentDialog = true;
      this.editedParentIndex = item.id;
      this.editedParent = Object.assign({}, item);
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