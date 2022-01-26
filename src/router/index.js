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
    component: () => import('../views/AdminSchoolList.vue')
  },
  {
    path: '/adminstudentlist',
    name: 'AdminStudentList',
    component: () => import('../views/AdminStudentList.vue')
  },
  {
    path: '/adminuserlist',
    name: 'AdminUserList',
    component: () => import('../views/AdminUserList.vue')
  },
  {
    path: '/adminroutelist',
    name: 'AdminRouteList',
    component: () => import('../views/AdminRouteList.vue')
  },
  {
    path: '/adminschooldetail',
    name: 'AdminSchoolDetail',
    component: () => import('../views/AdminSchoolDetail.vue')
  },
  {
    path: '/adminuserdetail',
    name: 'AdminUserDetail',
    component: () => import('../views/AdminUserDetail.vue')
  },
  {
    path: '/adminstudentdetail',
    name: 'AdminStudentDetail',
    component: () => import('../views/AdminStudentDetail.vue')
  },
  {
    path: '/parentdetails',
    name: 'ParentDetails',
    component: () => import('../views/ParentDetails.vue')
  },
  {
    path: '/adminroutecreate',
    name: 'AdminRouteCreate',
    component: () => import('../views/AdminRouteCreate.vue')
  },
  {
    path: '/adminroutedetail',
    name: 'AdminRouteDetail',
    component: () => import('../views/AdminRouteDetail.vue')
  },
  {
    path: '/adminusercreate',
    name: 'AdminUserCreate',
    component: () => import('../views/AdminUserCreate.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
