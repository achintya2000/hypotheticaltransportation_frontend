<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title>
      Your Schools
      <v-spacer></v-spacer>

      <create-new-school
        @schoolcreated="
          getRequestAllSchools();
          snackbar = true;
        "
        v-if="this.userType=='admin'"
      ></create-new-school>

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
      @click:row="viewItem"
      :sort-by="['name']"
      class="row-pointer"
    >
    </v-data-table>
    <v-snackbar v-model="snackbar" outlines color="success">
      A new school has been created

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
//import { mapState } from "vuex";
import { base_endpoint } from "../services/axios-api";
import { mapActions } from "vuex";
import CreateNewSchool from "../components/CreateNewSchool.vue";
import moment from "moment";

export default {
  components: { CreateNewSchool },
  data() {
    return {
      snackbar: false,
      search: "",
      userType: "",
      userID: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Address", value: "address", sortable: false },
        { text: "Arrival Time", value: "arrTime", sortable: true },
        { text: "Departure Time", value: "depTime", sortable: true },
      ],
      addresses: [],
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(item) {
      this.$router.push({ name: "AdminSchoolDetail", query: { id: item.id } });
    },
    getDisplayAddress(item) {
      var arrTime = moment.utc(item.arrivalTime);
      var depTime = moment.utc(item.departureTime);

      return {
        name: item.name,
        address: item.address,
        id: item.id,
        arrTime: arrTime.local().format("h:mm A"),
        depTime: depTime.local().format("h:mm A"),
      };
    },
    convert(input) {
      return moment(input, "HH:mm:ss").format("h:mm:ss A");
    },
    getRequestAllSchools() {
      base_endpoint
        .get("/api/school/getall/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.addresses = response.data.map(this.getDisplayAddress);
        })
        .catch((err) => {
          this.showSnackBar();
          console.log(err);
        });
    },
  },
  //computed: mapState(["APIData"]),
  created() {
    this.userType = window.localStorage.getItem("userType");
    this.userID = window.localStorage.getItem("userID");
    this.getRequestAllSchools();
  },
};
</script>

<style>
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {  
  cursor: pointer;
}
</style>