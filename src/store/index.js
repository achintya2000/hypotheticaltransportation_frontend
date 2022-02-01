import Vue from 'vue'
import Vuex from 'vuex'
import { base_endpoint } from '../services/axios-api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: window.localStorage.getItem('token'),
    refreshToken: null,
    isAdmin: window.localStorage.getItem('isAdmin'),
    loggedInUserID: window.localStorage.getItem('userID')
  },
  mutations: {
    updateStorage(state, { access }) {
      state.accessToken = access
      window.localStorage.setItem('token', access)
    },
    updateAdminStatus(state, { isAdmin, userID }) {
      state.isAdmin = isAdmin
      state.loggedInUserID = userID
      window.localStorage.setItem('isAdmin', isAdmin)
      window.localStorage.setItem('userID', userID)
    },
    destroyToken(state) {
      state.accessToken = null
      state.refreshToken = null
      state.isAdmin = false
      state.loggedInUserID = null
    }
  },
  getters: {
    loggedIn(state) {
      return state.accessToken != null
    },
  },
  actions: {
    userLogout(context) {
      if (context.getters.loggedIn) {
        context.commit('destroyToken')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isAdmin')
        window.localStorage.removeItem('userID')
      }
    },
    userLogin(context, usercredentials) {
      return new Promise((resolve, reject) => {
        base_endpoint.post('/api/login', {
          username: usercredentials.username,
          password: usercredentials.password
        })
          .then(response => {
            console.log(response)
            context.commit('updateStorage', { access: response.data.token, refresh: null })
            resolve()
          })
          .catch((err) => {
            console.log(err);
            reject()
          });
      })
    },
    getLoggedInUserInfo(context, credentials) {
      return new Promise((resolve, reject) => {
        base_endpoint.get('/api/profile/getfromtoken/' + credentials.token, {
          headers: { Authorization: `Token ${credentials.token}` },
        })
          .then(response => {
            context.commit('updateAdminStatus', { isAdmin: response.data.is_superuser, userID: response.data.id })
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
