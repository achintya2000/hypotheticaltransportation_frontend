<template>
  <v-card>
    <v-card-title>
      John Doe
      <v-spacer></v-spacer>
      <v-btn outlined>Reset Password</v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined>Modify</v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined>Delete</v-btn>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-subtitle>
    11 Duke Street, Durham NC, 27705
    </v-card-subtitle>
    <v-card-subtitle>
    johndoe@gmail.com
    </v-card-subtitle>
    <v-card-subtitle>
    Admin: No
    </v-card-subtitle>
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