<template>
  <v-card>
    <v-card-title>
      Your Users
      <v-spacer></v-spacer>
      <v-btn outlined>Add User/Students</v-btn>
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
      :sort-by="['name']"
      :sort-desc="[true]"
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
        { text: "Email", value: "email" },
        { text: "Address", value: "address" },
        { text: "Students", value: "students" },
        { text: "Administrator", value: "administrator" },
      ],
      addresses: [
        {
          name: "Frozen Yogurt",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",

        },
        {
          name: "Ice cream sandwich",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Eclair",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Cupcake",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Gingerbread",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Jelly bean",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Lollipop",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Honeycomb",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "Donut",
          email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
        {
          name: "KitKat",
            email: "hello#gmail.com",
          address: 159,
          students: 5,
          administrator: "True",
        },
      ],
    };
  },
};
</script>

<style>
</style>