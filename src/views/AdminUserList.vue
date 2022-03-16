<template>
  <v-card height="100%" style="padding-left: 15px; padding-right: 15px">
    <v-card-title>
      Your Users
      <v-spacer></v-spacer>
      <create-new-student
        @usercreated="getRequestAllUsers(); snackbar = true"
        v-if="this.userType!='busDriver'"
      ></create-new-student>
      <send-email :typeOfEmail="'allGA'"
       v-if="this.userType!='busDriver'"
      ></send-email>
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
      :items="profiles"
      :search="search"
      @click:row="viewItem"
      class="row-pointer"
    >
      <!-- <template v-slot:[`item.administrator`]="{ item }">
        <v-icon v-if="item.administrator==false"> mdi-close </v-icon>
        <v-icon v-if="item.administrator==true"> mdi-badge-account-horizontal </v-icon>
      </template> -->
      <template v-slot:[`item.userType`]="{ item }">
        <div v-if="item.userType=='admin'"> Admin </div>
        <div v-if="item.userType=='busDriver'"> Bus Driver </div>
        <div v-if="item.userType=='parent'"> Parent </div>
        <div v-if="item.userType=='schoolStaff'"> School Staff </div>
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      outlines
      color="success"
    >
      A new user has been created

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";
import CreateNewStudent from "../components/CreateNewStudent.vue";
import SendEmail from "../components/SendEmail.vue";
import { mapActions} from "vuex";
export default {
  components: { 
    CreateNewStudent, 
    SendEmail 
  },
  data() {
    return {
      search: "",
      snackbar: false,
      userType: "",
      userID: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Email", value: "email" },
        { text: "Address", value: "address", sortable: false },
        { text: "Phone #", value: "phone", sortable: false },
        { text: "Students", value: "student_count", sortable: false },
        { text: "Administrator", value: "administrator", sortable: false },
        { text: "User Role", value: "userType", sortable: true },
      ],
      profiles: [],
    };
  },

  methods: {
    ...mapActions(["snackBar"]),
    showSnackBar() {
      this.snackBar("Uh-Oh! Something Went Wrong!");
    },
    viewItem(item) {
      this.$router.push({ name: "AdminUserDetail", query: { id: item.id } });
    },
    getDisplayUser(item) {
      return {
        name: item.full_name,
        email: item.email,
        address: item.address,
        student_count: item.student_count,
        administrator: item.administrator,
        userType: item.type,
        id: item.id,
        phone: item.phone,
      };
    },
    getRequestAllUsers() {
      base_endpoint
        .get("/api/profile/getall/" + this.userID, {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.profiles = response.data.map(this.getDisplayUser);
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
    this.getRequestAllUsers();
  },
};
</script>

<style>
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {  
  cursor: pointer;
}
</style>