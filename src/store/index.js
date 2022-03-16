import Vue from 'vue'
import Vuex from 'vuex'
import { base_endpoint } from '../services/axios-api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: window.localStorage.getItem('token'),
    isAdmin: window.localStorage.getItem('isAdmin'),
    loggedInUserID: window.localStorage.getItem('userID'),
    loggedInUserType: window.localStorage.getItem('userType'),
    snackbar: { active: false, color: "", message: "", },
  },
  mutations: {
    updateStorage(state, { access }) {
      state.accessToken = access
      window.localStorage.setItem('token', access)
    },
    updateAdminStatus(state, { isAdmin, userID, userType }) {
      console.log("GOT HERE" + userType)
      state.isAdmin = isAdmin
      state.loggedInUserID = userID
      state.loggedInUserType = userType
      window.localStorage.setItem('isAdmin', isAdmin)
      window.localStorage.setItem('userID', userID)
      window.localStorage.setItem('userType', userType)
    },
    destroyToken(state) {
      state.accessToken = null
      state.isAdmin = "false"
      state.loggedInUserID = null
      state.loggedInUserType = null
    },
    SET_SNACKBAR(state, snackbar) {
      state.snackbar = snackbar;
    }
  },
  getters: {
    loggedIn(state) {
      return state.accessToken != null
    },
    isAdmin(state) {
      return state.isAdmin == "true";
    }
  },
  actions: {
    userLogout(context) {
      if (context.getters.loggedIn) {
        context.commit('destroyToken')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isAdmin')
        window.localStorage.removeItem('userID')
        window.localStorage.removeItem('userType')
      }
    },
    userLogin(context, usercredentials) {
      return new Promise((resolve, reject) => {
        base_endpoint.post('/api/login', {
          username: usercredentials.username,
          password: usercredentials.password
        })
          .then(response => {

            base_endpoint.post('/api/isotp', {
              username: usercredentials.username,
            })
              .then(otpRes => {
                if (otpRes.data.isotp) {
                  window.location.href = otpRes.data.link;
                  resolve()
                } else {
                  context.commit('updateStorage', { access: response.data.token, refresh: null })
                  resolve()
                }
              })
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
            context.commit('updateAdminStatus', { isAdmin: response.data.is_superuser.toString(), userID: response.data.id, userType: response.data.type })
            resolve()
          })
          .catch((err) => {
            console.log(err);
            reject()
          });
      })
    },
    snackBar({ commit }, message) {
      commit("SET_SNACKBAR", {
        active: true,
        color: "red", // You can create another actions for diferent color.
        message: message,
      });
    },
  },
  modules: {
  }
})
