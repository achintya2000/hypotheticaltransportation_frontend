<template>
  <v-card>
    <v-card-title>
      Staples High School
      <v-spacer></v-spacer>
      <v-btn outlined>Modify</v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined>Delete</v-btn>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle>
    70 North Ave, Westport, CT 06880
    </v-card-subtitle>
    <v-card-title>
        Bus Routes
        <v-spacer></v-spacer>
        <v-btn outlined>Plan New Route</v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="addresses"
      :search="search"
      :sort-by="['name']"
      :sort-desc="[true]"
      multi-sort
    ></v-data-table>
    <v-card-title>
        Students
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
        { text: "Address", value: "address" },
      ],
      addresses: [
        {
          name: "Frozen Yogurt",
          address: 159,
        },
        {
          name: "Ice cream sandwich",
          address: 237,
        },
        {
          name: "Eclair",
          address: 262,
        },
        {
          name: "Cupcake",
          address: 305,
        },
        {
          name: "Gingerbread",
          address: 356,
        },
      ],
    };
  },
};
</script>

<style>
</style>