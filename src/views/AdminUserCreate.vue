<template>
  <v-card>
    <v-card-title>
      Create a New User
    </v-card-title>
    <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >

           

              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                v-if="checkbox==false"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                v-if="checkbox==false"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="address"
                :rules="addressRules"
                v-if="checkbox==false"
                label="Address"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                v-if="checkbox==false"
                label="Password"
                required
              ></v-text-field>

              <v-checkbox
                v-model="checkbox2"
                :label="'Admin?'"
                v-if="checkbox==false"
            ></v-checkbox>

            <v-autocomplete
                v-model="parentValue"
                :items="parentItems"
                v-if="checkbox==true"
                label="Name"
              ></v-autocomplete>

              <v-data-table
                :headers="headers"
                :items="items">
          <template v-slot:top>
            <v-btn @click="addItem">Add Student</v-btn>
          </template>
          <template v-slot:item.name="props">
            <v-text-field v-model="props.item.name"></v-text-field>
          </template>
          <template v-slot:item.id="props">
            <v-text-field v-model="props.item.id"></v-text-field>
          </template>
        <template v-slot:item.school="props">
            <v-autocomplete
                v-model="props.item.school"
                :items="schoolItems"
                item-text='name'
                :sort-by="['name']"
                label="School"
                @change="disable('school_selected'); getRequestSchoolRoutes(props)"

              ></v-autocomplete>
          </template>
          <template v-slot:item.route="props">
            <v-autocomplete
                v-model="props.item.route"
                :items="routeItems"
                item-text='name'
                label="Bus Route"
                :disabled="shouldDisable"
              
              ></v-autocomplete>
          </template>          
        </v-data-table>
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Save
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
               Clear
              </v-btn>

              <v-btn
                color="warning"
                @click="dialog2 = false"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card-text>
  </v-card>
</template>

<script>
import { base_endpoint } from "../services/axios-api";

export default {
  data() {
    return {
      checkbox: false,
      schoolItems: [],
      routeItems: [],
      items: [],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'ID', value: 'id' },
      { text: 'School', value: 'school' },
      { text: 'Route', value: 'route' },
    ],
    student: {
      name: 'student',
      items: [
        { name: "", id: "", school: '', route: ''},
      ]
    },
    shouldDisable : true
    };
  },
  created() {
    this.initialize()
    this.getRequestAllSchools()
    this.getRequestAllRoutes()
  },
  methods: {
    initialize() {
      const items = [...this.student.items]
      
      // deep copy is the solution
      //const items = JSON.parse(JSON.stringify(this.student.items))
      
      items.map(item => {
        item.qty1 = ''
        return item
      })
      this.items = items
    },


    getDisplaySchool(item) {
      return {
        name: item.name,
        id: item.id,
      };
    },

    getRequestAllSchools() {
      console.log("GOT HERE!!!");
      base_endpoint
        .get("/api/school/getall", {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.schoolItems = response.data.map(this.getDisplaySchool);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    
    getDisplayRoute(item) {
      return {
        name: item.name,
        school: item.school,
        description: item.description,
      };
    },
    getRequestSchoolRoutes(item) {
      base_endpoint
        .get("/api/route/getallfromschool/" + item.id.toString(), {
          headers: { Authorization: `Token ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.routeItems = response.data.map(this.getDisplayRoute);
          //this.$store.state.addresses = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    

    disable(input){
      if(input == 'school_selected'){
        this.shouldDisable = false
      } else {
        this.shouldDisable = true
      }
    },


      addItem(){
      var my_object = {
        name:this.name,
        id:this.id,
        school:this.school,
        route: this.route,
      };
      this.items.push(my_object)

      this.name = '';
      this.id = '';
      this.school = '';
      this.route = '';
    }
  }
};
</script>

<style>
</style>