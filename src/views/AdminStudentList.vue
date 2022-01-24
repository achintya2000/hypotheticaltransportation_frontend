<template>
  <v-card>
    <v-card-title>
      Your Students
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="addresses"
      :search="search"
      :sort-by="['calories', 'fat']"
      :sort-desc="[false, true]"
      multi-sort
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Student ID", value: "studentID" },
        { text: "School Name", value: "schoolName" },
        { text: "Route Name", value: "routeName" },
      ],
      addresses: [
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Choclate",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
        {
          name: "Frozen Yogurt",
          studentID: 12345,
          schoolName: "Hello 1",
          routeName: "Hello 2",
        },
      ],
    };
  },
};
</script>

<style>
</style>