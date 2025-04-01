import { createRouter, createWebHistory } from 'vue-router'
import List from '../views/product/List.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: List,
    },
  ],
})

export default router
