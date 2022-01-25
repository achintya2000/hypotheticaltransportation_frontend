import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: null,
    refreshToken: null
  },
  mutations: {
    updateStorage(state, { access, refresh }) {
      state.accessToken = access
      state.refreshToken = refresh
    }
  },
  actions: {
    userLogin(context, usercredentials) {
      return new Promise((resolve, reject) => {
        var axios = require('axios');
        var data = JSON.stringify({
          "username": usercredentials.username,
          "password": usercredentials.password
        });
        var config = {
          method: 'post',
          url: 'http://vcm-24682.vm.duke.edu:8000/api/login',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios(config)
          .then(response => {
            context.commit('updateStorage', { access: response.data.token, refresh: null })
            resolve()
          })
          .catch((err) => {
            console.log(err);
            reject()
          });
        // getAPI.post('/api/profile/login/', {
        //   username: usercredentials.username,
        //   password: usercredentials.password
        // })
        //   .then(response => {
        //     context.commit('updateStorage', { access: response.data.token, refresh: null })
        //     resolve()
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     reject()
        //   });
      })
    }
  },
  modules: {
  }
})
