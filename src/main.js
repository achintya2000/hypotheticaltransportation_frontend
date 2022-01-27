import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!store.getters.loggedIn) {
      next({ name: 'Home' })
    } else {
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