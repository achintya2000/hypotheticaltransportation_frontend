import Vue from 'vue'
import Vuex from 'vuex'
import { base_endpoint } from '../services/axios-api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: window.localStorage.getItem('token'),
    refreshToken: null,
    isAdmin: window.localStorage.getItem('isAdmin')
  },
  mutations: {
    updateStorage(state, { access, refresh }) {
      state.accessToken = access
      state.refreshToken = refresh
      window.localStorage.setItem('token', access)
    },
    updateAdminStatus(state, { isAdmin }) {
      state.isAdmin = isAdmin
      window.localStorage.setItem('isAdmin', isAdmin)
    },
    destroyToken(state) {
      state.accessToken = null
      state.refreshToken = null
      state.isAdmin = false
    }
  },
  getters: {
    loggedIn(state) {
      return state.accessToken != null
    },
    userIsAdmin(state) {
      return state.isAdmin == true
    }
  },
  actions: {
    userLogout(context) {
      if (context.getters.loggedIn) {
        context.commit('destroyToken')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isAdmin')
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
    },
    userAdminSet(context, usercredentials) {
      return new Promise((resolve, reject) => {
        base_endpoint.get('/api/profile/get/' + usercredentials.username, {
          headers: { Authorization: `Token ${usercredentials.token}` },
        })
          .then(response => {
            console.log(response.data.is_superuser)
            context.commit('updateAdminStatus', { isAdmin: response.data.is_superuser })
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
