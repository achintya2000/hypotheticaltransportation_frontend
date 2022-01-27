import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: null
  },
  {
    path: '/adminschoollist',
    name: 'AdminSchoolList',
    component: () => import('../views/AdminSchoolList.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminstudentlist',
    name: 'AdminStudentList',
    component: () => import('../views/AdminStudentList.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminuserlist',
    name: 'AdminUserList',
    component: () => import('../views/AdminUserList.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminroutelist',
    name: 'AdminRouteList',
    component: () => import('../views/AdminRouteList.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminschooldetail',
    name: 'AdminSchoolDetail',
    component: () => import('../views/AdminSchoolDetail.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminuserdetail',
    name: 'AdminUserDetail',
    component: () => import('../views/AdminUserDetail.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminstudentdetail',
    name: 'AdminStudentDetail',
    component: () => import('../views/AdminStudentDetail.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/parentdetails',
    name: 'ParentDetails',
    component: () => import('../views/ParentDetails.vue')
  },
  {
    path: '/adminroutecreate',
    name: 'AdminRouteCreate',
    component: () => import('../views/AdminRouteCreate.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminroutedetail',
    name: 'AdminRouteDetail',
    component: () => import('../views/AdminRouteDetail.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/adminusercreate',
    name: 'AdminUserCreate',
    component: () => import('../views/AdminUserCreate.vue'),
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/maptest',
    name: 'MapTest',
    component: () => import('../views/MapTest.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
