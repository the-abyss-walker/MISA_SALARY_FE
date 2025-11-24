import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/salarycomposition',
  },
  {
    path: '/salarycomposition',
    name: 'SalaryComposition',
    component: () => import('@/pages/salary-composition/SalaryCompositionPage.vue'),
  },
  {
    path: '/salarycomposition/systemcategory',
    name: 'SystemCategory',
    component: () => import('@/pages/system-category/SystemCategory.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
  {
    path: '/coming-soon',
    name: 'ComingSoon',
    component: () => import('@/pages/ComingSoon.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
