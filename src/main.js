import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps-withscopedautocomp';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCwev37Sc3k7fj7sqbnDgL9qh3IwEdrC3c',
    libraries: 'places',
  }
});

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  let userIsAdmin = store.state.isAdmin;
  let userIsLoggedIn = store.getters.loggedIn;

  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!userIsLoggedIn) {
      next({ name: 'Home' })
    } else {
      // User is logged in
      if (to.matched.some(record => record.meta.adminLocked)) {
        if (userIsAdmin == "false") {
          next({ name: 'ParentDetails' })
        } else {
          next()
        }
      }
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$http = axios;