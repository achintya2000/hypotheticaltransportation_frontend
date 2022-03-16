<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <h2>Preview CSV File</h2>
    <label
      >File
      <input type="file" accept=".csv" @change="handleFileUpload($event)" />
    </label>
    <br />
    <table v-if="parsed" style="width: 100%">
      <thead>
        <tr>
          <th
            v-for="(header, key) in content.meta.fields"
            v-bind:key="'header-' + key"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowKey) in content.data" v-bind:key="'row-' + rowKey">
          <td
            v-for="(column, columnKey) in content.meta.fields"
            v-bind:key="'row-' + rowKey + '-column-' + columnKey"
          >
            <input v-model="content.data[rowKey][column]" />
          </td>
        </tr>
      </tbody>
    </table>
    <v-data-table :headers="headers" :items="csvData"></v-data-table>
    <br />
    <v-btn v-on:click="submitFile()">Submit File</v-btn>
    <v-btn v-on:click="submitUpdates()">Submit Updates</v-btn>
  </v-card>
</template>

<script>
import Papa from "papaparse";
//import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      file: "",
      content: [],
      csvData: [],
      headers: [
        {
          text: "School",
          align: "start",
          value: "School",
        },
        { text: "Address", value: "Address" },
        { text: "Other", value: "Other", sortable: false },
      ],
      parsed: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.parseFile();
    },
    parseFile() {
      Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          this.content = results;
          this.parsed = true;
          this.csvData = this.content.data;
          console.log(this.content.data);
        }.bind(this),
      });
    },
    submitFile() {
      let formData = new FormData();

      formData.append("file", this.file);

      //   base_endpoint
      //     .post("/preview-file", formData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     })
      //     .then(function () {
      //       console.log("SUCCESS!!");
      //     })
      //     .catch(function () {
      //       console.log("FAILURE!!");
      //     });
    },
    submitUpdates() {
      //   base_endpoint
      //     .post("/preview-file-changes", this.content.data)
      //     .then(function () {
      //       console.log("SUCCESS!!");
      //     })
      //     .catch(function () {
      //       console.log("FAILURE!!");
      //     });
    },
  },
};
</script>

<style>
</style>