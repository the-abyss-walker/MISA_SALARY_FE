import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/salarycomposition',
    name: 'SalaryComposition',
    component: () => import('@/pages/salary-composition/SalaryComposition.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
