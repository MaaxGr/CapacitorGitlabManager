import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: () => import ('../views/Dashboard.vue')
  },
  {
    path: '/assigned-mrs',
    component: () => import ('../views/AssignedMRs.vue')
  },
  {
    path: '/review-mrs',
    component: () => import ('../views/ReviewMRs.vue')
  },
  {
    path: '/renovate-mrs',
    component: () => import ('../views/RenovateMRs.vue')
  },
  {
    path: '/settings',
    component: () => import ('../views/Settings.vue')
  },
  {
    path: '/compare-branches',
    component: () => import ('../views/CompareBranches.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
