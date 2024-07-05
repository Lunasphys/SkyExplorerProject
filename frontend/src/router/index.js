import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import AdminSchedule from '../pages/AdminSchedule.vue'
import Billing from '../pages/Billing.vue'
import Statistics from '../pages/Statistics.vue'
import StudentProgress from '../pages/StudentProgress.vue'
import Calendar from '@/pages/Calendar.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, Calendar },
  { path: '/admin/schedule', component: AdminSchedule },
  { path: '/billing', component: Billing },
  { path: '/statistics', component: Statistics },
  { path: '/student/progress', component: StudentProgress },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
