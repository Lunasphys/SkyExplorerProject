import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import AdminSchedule from '../pages/AdminSchedule.vue'
import Billing from '../components/Billing.vue'
import Statistics from '../pages/Statistics.vue'
import StudentProgress from '../pages/StudentProgress.vue'
import Signup from '../pages/Signup.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/dashboard', component: Dashboard },
  { path: '/admin/schedule', component: AdminSchedule },
  { path: '/billing', component: Billing },
  { path: '/statistics', component: Statistics },
  { path: '/student_progress', component: StudentProgress },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
