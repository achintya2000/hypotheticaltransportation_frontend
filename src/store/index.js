import Vue from 'vue'
import Vuex from 'vuex'
import { base_endpoint } from '../services/axios-api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: window.localStorage.getItem('token'),
    refreshToken: null,
    addresses: ''
  },
  mutations: {
    updateStorage(state, { access, refresh }) {
      state.accessToken = access
      state.refreshToken = refresh
      window.localStorage.setItem('token', access)
    },
    destroyToken(state) {
      state.accessToken = null
      state.refreshToken = null
    }
  },
  getters: {
    loggedIn(state) {
      return state.accessToken != null
    }
  },
  actions: {
    userLogout(context) {
      if (context.getters.loggedIn) {
        context.commit('destroyToken')
        window.localStorage.setItem('token', null)
      }
    },
    userLogin(context, usercredentials) {
      return new Promise((resolve, reject) => {
        base_endpoint.post('/api/login', {
          username: usercredentials.username,
          password: usercredentials.password
        })
          .then(response => {
            context.commit('updateStorage', { access: response.data.token, refresh: null })
            resolve()
          })
          .catch((err) => {
            console.log(err);
            reject()
          });
      })
    }
  },
  modules: {
  }
})
