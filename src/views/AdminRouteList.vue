<template>
  <v-card>
    <v-card-title>
      Your Routes
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
        { text: "School Name", value: "schoolName" },
        { text: "# of Students", value: "numStudents" },
      ],
      addresses: [
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 1,
        },
        {
          name: "Choclate",
          schoolName: "Hello 1",
          numStudents: 2,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 3,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 4,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 5,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 6,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 7,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 8,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 9,
        },
        {
          name: "Frozen Yogurt",
          schoolName: "Hello 1",
          numStudents: 10,
        },
      ],
    };
  },
};
</script>

<style>
</style>