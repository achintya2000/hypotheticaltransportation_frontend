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
    path: '/adminschoollist',
    name: 'AdminSchoolList',
    component: () => import('../views/AdminSchoolList.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/adminstudentlist',
    name: 'AdminStudentList',
    component: () => import('../views/AdminStudentList.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/adminuserlist',
    name: 'AdminUserList',
    component: () => import('../views/AdminUserList.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/adminroutelist',
    name: 'AdminRouteList',
    component: () => import('../views/AdminRouteList.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/admintransitlog',
    name: 'AdminTransitLog',
    component: () => import('../views/AdminTransitLog.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },{
    path: '/admintransitstatusmap',
    name: 'AdminTransitStatusMap',
    component: () => import('../views/AdminTransitStatusMap.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/adminschooldetail',
    name: 'AdminSchoolDetail',
    component: () => import('../views/AdminSchoolDetail.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/adminuserdetail',
    name: 'AdminUserDetail',
    component: () => import('../views/AdminUserDetail.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/adminstudentdetail',
    name: 'AdminStudentDetail',
    component: () => import('../views/AdminStudentDetail.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/parentdetails',
    name: 'ParentDetails',
    component: () => import('../views/ParentDetails.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: false
    }
  },
  {
    path: '/adminroutedetail',
    name: 'AdminRouteDetail',
    component: () => import('../views/AdminRouteDetail.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/parentstudentdetail',
    name: 'ParentStudentDetail',
    component: () => import('../views/ParentStudentDetail.vue'),
    meta: {
      requiresLogin: true,
    }
  },
  {
    path: '/maptest',
    name: 'MapTest',
    component: () => import('../views/MapTest.vue')
  },
  {
    path: '/dragtest',
    name: 'Draggable',
    component: () => import('../views/Draggable.vue')
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue')
  },
  {
    path: '/adminrouteplanner',
    name: 'AdminRoutePlanner',
    component: () => import('../views/AdminRoutePlanner.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  },
  {
    path: '/bulkimport',
    name: 'BulkImport',
    component: () => import('../views/BulkImport.vue'),
    meta: {
      requiresLogin: true,
    }
  },
  {
    path: '/printableroster',
    name: 'PrintableRoster',
    component: () => import('../views/PrintableRoster.vue'),
    meta: {
      requiresLogin: true,
      adminLocked: true
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
