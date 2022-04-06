<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title
      >Parents CSV File

      <v-spacer></v-spacer>
      <v-dialog v-model="intDialog" width="80%">
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on"> Instructions </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Bulk Import Format Proposal
          </v-card-title>

          <v-card-text>
            <p class="font-weight-medium">
              To begin bulk import, choose to either import students or users.
              In most situations, you will want to do users first since the
              account email's must be present in the database before the student
              can be created.
            </p>
            <p class="font-weight-medium">
              Select a csv file that follows the file format below and upload it
              to the correct file uploader. The data will populate into the
              table. Click the "Validate" button to determine if there are any
              errors or detected duplicates.
            </p>
            <p class="font-weight-medium">
              To modify the data entry, click the Pencil icon to the right. To
              exclude the data entry, check the box on the left. You must fix
              all errors or exclude data entires with errors in order to be able
              top submit. Continue to use the "Validate" button until the
              "Submit" button has been enabled.
            </p>

            <p class="font-weight-medium">
              Finally, click the "Submit" to commit the data to the database.
            </p>
            <div
              id="doc"
              class="markdown-body container-fluid comment-enabled"
              data-hard-breaks="true"
            >
              <h2 id="File-format" data-id="File-format">
                <span>File format</span>
              </h2>
              <ul>
                <li>
                  <span
                    >Two separate CSV files, one for users and one for
                    students.</span
                  >
                  <ul>
                    <li>
                      <span>CSV is defined as in </span
                      ><a
                        href="https://datatracker.ietf.org/doc/html/rfc4180#section-2"
                        target="_blank"
                        rel="noopener"
                        ><span>RFC 4180, Section 2</span></a
                      >
                      <ul>
                        <li>
                          <span>The optional header line in </span
                          ><a
                            href="https://datatracker.ietf.org/doc/html/rfc4180#section-2"
                            target="_blank"
                            rel="noopener"
                            ><span>RFC 4180, Section 2.3</span></a
                          ><span> is required for these files</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <span
                    >If the files exist (defined below) they will each have at
                    minimum two lines–the header and a record that follows the
                    defined formatting</span
                  >
                </li>
                <li>
                  <span
                    >“Field is not empty” indicates that at least one character
                    must be present in the field</span
                  >
                </li>
              </ul>
              <h2 id="Users-file" data-id="Users-file">
                <span>Users file</span>
              </h2>
              <p>
                <span
                  >Fields appear in the following order in the users file as
                  follows: </span
                ><code>email,name,address,phone_number</code
                ><span
                  >. This is also the contents of the first line in the file.
                  This file only exists if importing user(s) is desired.</span
                >
              </p>
              <ul>
                <li>
                  <p><code>email</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 254 chars</code
                      ><span> as per </span
                      ><a
                        href="https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.3"
                        target="_blank"
                        rel="noopener"
                        ><span>RFC 5321, Section 4.5.3.1.3</span></a
                      >
                    </li>
                    <li>
                      <span
                        >must be a valid address as per the addr-spec of </span
                      ><a
                        href="https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1"
                        target="_blank"
                        rel="noopener"
                        ><span>RFC 5322, Section 3.4.1</span></a
                      >
                    </li>
                    <li>
                      <span>field is not empty</span>
                      <ul>
                        <li>
                          <span>example: </span
                          ><code>john.smith@example.com</code><span>, </span
                          ><code>john.smith@cs.duke.edu</code>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><code>name</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 150 chars</code>
                    </li>
                    <li><span>field is not empty</span></li>
                    <li>
                      <span
                        >some text field containing both a first and last name
                        with potential suffixes (eg </span
                      ><code>Jr</code><span>, </span><code>Sr</code
                      ><span>, </span><code>III</code><span>, etc)</span>
                      <ul>
                        <li>
                          <span>example: </span><code>"John Smith Jr"</code>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><code>address</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 150 chars</code>
                    </li>
                    <li>
                      <span>some text that is a Complete Address as per </span
                      ><a
                        href="https://pe.usps.com/text/dmm300/602.htm#ep1085515"
                        target="_blank"
                        rel="noopener"
                        ><span>USPS Standard 602.1.4</span></a
                      ><span>.</span>
                      <ul>
                        <li>
                          <span
                            >Adressee Name (USPS Standard 602.1.4.2a) is not
                            applicable and is not included in this field</span
                          >
                        </li>
                        <li>
                          <span
                            >The delimiter between Address Elements (USPS
                            Standard 602.1.4.2) must match the regex </span
                          ><code>,? +</code>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span>field is not empty</span>
                      <ul>
                        <li>
                          <span>example: </span
                          ><code>"998 Chevis Rd, Savannah, GA 31419"</code>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><code>phone_number</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 35 chars</code
                      ><span>, including characters for formatting</span>
                    </li>
                    <li>
                      <span>field may be left empty</span>
                      <ul>
                        <li>
                          <span
                            >some implementations of the software may require
                            phone numbers, as per Variance Request #79 – if this
                            is the case and the phone number is left blank, then
                            it is up to the group’s implementation to either
                            reject the record with an appropriate error message
                            or mark the phone number as 0000000000.</span
                          >
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span>example: </span><code>19198776589</code
                      ><span>, </span><code>(555) 555-5555</code><span>, </span
                      ><code>+1 415 555 0132</code>
                    </li>
                  </ul>
                </li>
              </ul>
              <h2 id="Studentscsv" data-id="Studentscsv">
                <code>Students.csv</code>
              </h2>
              <p>
                <span>Fields appear in the following order in </span
                ><code>Students.csv</code><span> as follows: </span
                ><code>name,parent_email,student_id,school_name</code
                ><span
                  >. This is also the contents of the first line in the file.
                  This file only exists if importing student(s) is
                  desired.</span
                >
              </p>
              <ul>
                <li>
                  <p><code>name</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 150 chars</code>
                    </li>
                    <li><span>field is not empty</span></li>
                    <li>
                      <span
                        >some text field containing both a first and last name
                        with potential suffixes (eg </span
                      ><code>Jr</code><span>, </span><code>Sr</code
                      ><span>, </span><code>III</code><span>, etc)</span>
                      <ul>
                        <li>
                          <span>example: </span><code>"John Smith Jr"</code>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><code>parent_email</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 254 chars</code
                      ><span> as per </span
                      ><a
                        href="https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.3"
                        target="_blank"
                        rel="noopener"
                        ><span>RFC 5321, Section 4.5.3.1.3</span></a
                      >
                    </li>
                    <li>
                      <span
                        >must be a valid address as per the addr-spec of </span
                      ><a
                        href="https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1"
                        target="_blank"
                        rel="noopener"
                        ><span>RFC 5322, Section 3.4.1</span></a
                      >
                    </li>
                    <li>
                      <span>field is not empty</span>
                      <ul>
                        <li>
                          <span>example: </span
                          ><code>john.smith@example.com</code><span>, </span
                          ><code>john.smith@cs.duke.edu</code>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><code>student_id</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>some non-zero, positive (but less than </span
                      ><code>2147483647</code
                      ><span
                        >) number. As this is an optional field, if there is no
                        desired student id the field is left empty.</span
                      >
                      <ul>
                        <li>
                          <span
                            >some implementations of the software may require
                            student_id, as per Variance Request #37 - if this is
                            the case and the student id is left blank, then it
                            is up to the group’s implementation to either reject
                            the record with an appropriate error message or mark
                            the student id as 0.</span
                          >
                        </li>
                        <li><span>example: </span><code>24601</code></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><code>school_name</code><span> field:</span></p>
                  <ul>
                    <li>
                      <span>character limit: </span><code>&lt;= 150 chars</code>
                    </li>
                    <li>
                      <span
                        >school name must case-insensitively and
                        whitespace-insensitively match an existing school name,
                        or else the record will be rejected with an appropriate
                        error message</span
                      >
                      <ul>
                        <li>
                          <span
                            >for example, “A School” matches " a sCHoOl " and “A
                            School” but not “aschool”</span
                          >
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span>field is not empty</span>
                      <ul>
                        <li>
                          <span>example: </span><code>"Duke University"</code>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!parentValidEnable"
        v-on:click="validateFile(typeParent)"
        outlined
        >Validate Parent CSV</v-btn
      >

      <!-- <v-btn :disabled="!parentCSVReady" v-on:click="submitFile(typeParent)"
        >Submit Validated File</v-btn
      > -->
      <v-dialog v-model="confirm3" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!parentCSVReady"
            style="margin: 10px"
            outlined
            v-bind="attrs"
            v-on="on"
          >
            Submit Validated File
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-spacer></v-spacer>

              <v-btn
                color="error"
                class="mr-4"
                v-on:click="submitFile(typeParent)"
              >
                Yes, Submit
              </v-btn>

              <v-btn color="success" @click="confirm3 = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-btn outlined @click="clearParent">Clear</v-btn>
    </v-card-title>
    <v-card-subtitle
      >File
      <input
        type="file"
        accept=".csv"
        :key="parentInputKey"
        @change="handleFileUpload($event, typeParent)"
      />
    </v-card-subtitle>
    <v-card-subtitle
      >To exclude a record, select the checkbox on the left</v-card-subtitle
    >

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
      @item-selected="parentCheckBoxEvent"
      disable-pagination
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" class="mr-3" @click.stop="editParent(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>

    <p></p>
    <v-divider></v-divider>
    <p></p>
    <!-- STUDENT STUFF STARTS BELOW --->

    <v-card-title
      >Students CSV File <v-spacer></v-spacer
      ><v-btn
        :disabled="!studentValidEnable"
        v-on:click="validateFile(typeStudent)"
        outlined
        >Validate Student CSV</v-btn
      >
      <!-- <v-btn :disabled="!studentCSVReady" v-on:click="submitFile(typeStudent)">Submit Validated File</v-btn> -->
      <v-dialog v-model="confirm2" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!studentCSVReady"
            style="margin: 10px"
            outlined
            v-bind="attrs"
            v-on="on"
          >
            Submit Validated File
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Please Confirm
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-spacer></v-spacer>

              <v-btn
                color="error"
                class="mr-4"
                v-on:click="submitFile(typeStudent)"
              >
                Yes, Submit
              </v-btn>

              <v-btn color="success" @click="confirm2 = false"> Cancel </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-btn outlined @click="clearStudent">Clear</v-btn>
    </v-card-title>
    <v-card-subtitle
      >File
      <input
        type="file"
        accept=".csv"
        :key="studentInputKey"
        @change="handleFileUpload($event, typeStudent)"
      />
    </v-card-subtitle>
    <v-card-subtitle
      >To exclude a record, select the checkbox on the left</v-card-subtitle
    >

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
      v-model="studentSelected"
      :headers="headerStudent"
      :items="indexedStudentCSV"
      item-key="id"
      show-select
      hide-default-footer
      disable-pagination
      @item-selected="studentCheckBoxEvent"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" class="mr-3" @click.stop="editStudent(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>

    <v-snackbar v-model="loadingSnackbar" outlines color="blue" :timeout="-1">
      Validation In Progress
      <v-progress-circular indeterminate color="black"></v-progress-circular>
    </v-snackbar>
    <v-snackbar
      v-model="submissionSnackbar"
      outlines
      color="blue"
      :timeout="-1"
    >
      Submission In Progress
      <v-progress-circular indeterminate color="black"></v-progress-circular>
    </v-snackbar>
    <v-snackbar v-model="badAddressSnackbar" outlines color="red">
      This address was not recognized
    </v-snackbar>
    <v-snackbar v-model="badFileFormat" outlines color="red">
      This file is not formatted correctly. Check your headers
    </v-snackbar>
    <v-snackbar v-model="catchAllError" outlines color="red">
      {{ errorMessage }}
    </v-snackbar>
    <v-snackbar v-model="subDone" outlines color="green">
      Submission of {{ this.itemNums }} items is complete!
    </v-snackbar>
    <v-snackbar v-model="validDone" outlines color="green">
      Validation is complete!
    </v-snackbar>
  </v-card>
</template>

<script>
import Papa from "papaparse";
import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      center: { lat: 36.001465, lng: -78.939133 },
      markerPos: { lat: 0, lng: 0 },
      file: "",
      content: [],
      subDone: false,
      validDone: false,
      valid: true,
      typeParent: "parent",
      typeStudent: "student",
      parentDialog: false,
      studentDialog: false,
      intDialog: false,
      confirm2: false,
      confirm3: false,
      badFileFormat: false,
      catchAllError: false,
      loadingSnackbar: false,
      submissionSnackbar: false,
      userNameValidateArray: [this.userNameValidate],
      userEmailValidateArray: [this.userEmailValidate],
      userPhoneValidateArray: [this.userPhoneValidate],
      userAddressValidateArray: [this.userAddressValidate],
      studentNameValidateArray: [this.studentNameValidate],
      studentIDValidateArray: [this.studentIDValidate],
      studentSchoolValidateArray: [this.studentSchoolValidate],
      studentParentValidateArray: [this.studentParentValidate],
      csvTaskId: "",
      submitTaskId: "",
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
      badAddressSnackbar: false,
      parentValidEnable: false,
      studentValidEnable: false,
      parentInputKey: 0,
      studentInputKey: 0,
      errorMessage: "",
      itemNums: 0,
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
            this.parentValidEnable = true;
            this.parentCSVData = this.content.data;
          } else {
            this.studentValidEnable = true;
            this.studentCSVData = this.content.data;
          }
        }.bind(this),
      });
    },
    validateFile(type) {
      this.loadingSnackbar = true;
      if (type == "parent") {
        this.parentCSVData.forEach((e) => {
          e.exclude = false;
        });

        this.parentSelected.forEach((e) => {
          this.parentCSVData[e.id].exclude = true;
        });

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
            this.csvTaskId = res.data.id;
            this.pollStatus(this.typeParent);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.studentCSVData.forEach((e) => {
          e.exclude = false;
        });

        this.studentSelected.forEach((e) => {
          this.studentCSVData[e.id].exclude = true;
        });

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
          .catch((err) => {
            console.log("Failure");
            console.log(err);
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
            if (res.data.res == "error") {
              this.loadingSnackbar = false;
              console.log("YEET FAILURE");
              this.badFileFormat = true;
              return;
            }
            if (res.data.state == "SUCCESS") {
              console.log("done");
              console.log(res.data);
              this.parentCSVData = res.data.res.csvdata;
              this.parentCSVReady = res.data.res.valid;
              this.parentSelected = [];
              this.indexedParentCSV.forEach((e) => {
                if (e.exclude == true) {
                  this.parentSelected.push(e);
                }
              });
              this.loadingSnackbar = false;
              this.validDone = true;
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
            if (res.data.res == "error") {
              this.loadingSnackbar = false;
              console.log("YEET FAILURE");
              this.badFileFormat = true;
              return;
            }
            if (res.data.state == "SUCCESS") {
              console.log("done");
              console.log(res.data);
              this.studentCSVData = res.data.res.csvdata;
              this.studentCSVReady = res.data.res.valid;
              this.studentSelected = [];
              this.indexedStudentCSV.forEach((e) => {
                if (e.exclude == true) {
                  this.studentSelected.push(e);
                }
              });
              this.loadingSnackbar = false;
              this.validDone = true;
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
      this.submissionSnackbar = true;
      this.confirm2 = false;
      this.confirm3 = false;
      if (type == "parent") {
        let removalIds = [];
        let parentCSVSubmisson = [];

        this.parentSelected.forEach((e) => {
          removalIds.push(e.id);
        });

        this.indexedParentCSV.forEach((e) => {
          if (!removalIds.includes(e.id)) {
            parentCSVSubmisson.push(e);
          }
        });
        this.itemNums = parentCSVSubmisson.length;
        base_endpoint
          .post(
            "/api/bulkimportsubmit",
            {
              headers: ["email", "name", "address", "phone_number"],
              csvdata: parentCSVSubmisson,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
            this.submitTaskId = res.data;
            this.pollSubmission();
          })
          .catch(function () {
            console.log("FAILURE!!");
          });
      } else {
        let removalIds = [];
        let studentCSVSubmisson = [];

        this.studentSelected.forEach((e) => {
          removalIds.push(e.id);
        });

        this.indexedStudentCSV.forEach((e) => {
          if (!removalIds.includes(e.id)) {
            studentCSVSubmisson.push(e);
          }
        });
        this.itemNums = studentCSVSubmisson.length;
        base_endpoint
          .post(
            "/api/bulkimportsubmit",
            {
              headers: ["name", "parent_email", "student_id", "school_name"],
              csvdata: studentCSVSubmisson,
            },
            {
              headers: {
                Authorization: `Token ${this.$store.state.accessToken}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
            this.submitTaskId = res.data;
            this.pollSubmission();
          })
          .catch(function () {
            console.log("FAILURE!!");
          });
      }
    },
    pollSubmission() {
      base_endpoint
        .get("/api/gettaskprogress/" + this.submitTaskId, {
          headers: {
            Authorization: `Token ${this.$store.state.accessToken}`,
          },
        })
        .then((res) => {
          console.log("polling submission");
          if (res.data.state == "SUCCESS") {
            console.log("submit is done");
            this.submissionSnackbar = false;
            this.subDone = true;
            return;
          }
          setTimeout(this.pollSubmission, 3000);
        })
        .catch((err) => {
          console.log(err);
          this.errorMessage = err;
          this.catchAllError = true;
        });
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
          if (res.data.error != "") {
            this.badAddressSnackbar = true;
          }
          this.markerPos = { lat: res.data.lat, lng: res.data.lng };
          this.parentDialog = true;
          this.parentCSVReady = false;
          this.editedParentIndex = item.id;
          this.editedParent = Object.assign({}, item);
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
    saveParentItem() {
      if (this.editedParentIndex > -1) {
        Object.assign(
          this.parentCSVData[this.editedParentIndex],
          this.editedParent
        );
      }
    },
    editStudent(item) {
      this.studentCSVReady = false;
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

          this.schoolItems.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });

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
    parentCheckBoxEvent() {
      this.parentCSVReady = false;
    },
    studentCheckBoxEvent() {
      this.studentCSVReady = false;
    },
    clearParent() {
      console.log("clearing");
      this.parentInputKey++;
      this.parentCSVData = [];
      this.parentSelected = [];
      this.parentCSVReady = false;
      this.parentValidEnable = false;
    },
    clearStudent() {
      console.log("clearing");
      this.studentInputKey++;
      this.studentCSVData = [];
      this.studentSelected = [];
      this.studentCSVReady = false;
      this.studentValidEnable = false;
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