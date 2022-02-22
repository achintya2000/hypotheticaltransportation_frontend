import Vue from 'vue'
import Vuex from 'vuex'
import { base_endpoint } from '../services/axios-api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: window.localStorage.getItem('token'),
    isAdmin: window.localStorage.getItem('isAdmin'),
    loggedInUserID: window.localStorage.getItem('userID'),
    snackbar: { active: false, color: "", message: "", },
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
      state.isAdmin = "false"
      state.loggedInUserID = null
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
                console.log("HERE: "+ otpRes.data.isotp);
                if (otpRes.data.isotp) {
                  console.log("HERE 2: "+ otpRes.data.link)
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
            context.commit('updateAdminStatus', { isAdmin: response.data.is_superuser.toString(), userID: response.data.id })
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
