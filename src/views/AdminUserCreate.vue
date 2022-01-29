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

            <v-checkbox
                v-model="checkbox"
                :label="'Add students to current user'"
            ></v-checkbox>

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
                :items="items"                      
            >
          <template v-slot:top>
            <v-btn @click="addItem">Add Student</v-btn>
          </template>
          <template v-slot:item.name="props">
            <v-text-field v-model="props.item.qty1"></v-text-field>
          </template>
          <template v-slot:item.id="props">
            <v-text-field v-model="props.item.qty2"></v-text-field>
          </template>
          <template v-slot:item.school="props">
            <v-autocomplete
                v-model="props.item.qty1"
                :items="schoolItems"
                label="School"
              ></v-autocomplete>
          </template>
          <template v-slot:item.route="props">
            <v-autocomplete
                v-model="props.item.qty3"
                :items="busRouteItems"
                label="Bus Route"
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
export default {
  data() {
    return {
      checkbox: false,
      schoolItems: [],
      busRouteItems: ['Old Bus Route', 'bar', 'fizz', 'buzz'],
      items: [],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'ID', value: 'id' },
      { text: 'School', value: 'school' },
      { text: 'Route', value: 'route' },
    ],
    customer: {
      name: 'customer',
      items: [
        { name: "", id: "", school: '', route: ''},
      ]
    }
    };
  },
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      const items = [...this.customer.items]
      
      // deep copy is the solution
      // const items = JSON.parse(JSON.stringify(this.customer.items))
      
      items.map(item => {
        item.qty2 = ''
        return item
      })
      this.items = items
    },


    getDisplaySchool(item) {
      return {
        name: item.name,
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

      addItem(){
      var my_object = {
        mail:this.name,
        date:this.id,
        address:this.school,
        company: this.route,
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