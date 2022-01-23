<template>
  <v-card>
    <v-card-title>
      Your Schools
      <v-spacer></v-spacer>
      <v-btn outlined>Add School</v-btn>
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
        {
          name: "Jelly bean",
          address: 375,
        },
        {
          name: "Lollipop",
          address: 392,
        },
        {
          name: "Honeycomb",
          address: 408,
        },
        {
          name: "Donut",
          address: 452,
        },
        {
          name: "KitKat",
          address: 518,
        },
      ],
    };
  },
};
</script>

<style>
</style>