import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '@/views/ExploreView.vue'
import RoomDetail from '@/views/RoomDetail.vue'
import CreateRoomView from '@/views/CreateRoomView.vue'
import CreateRoomStepView from '@/views/CreateRoomStepView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView
    },
    {
      path: '/room/:id',
      name: 'room-detail',
      component: RoomDetail
    },
    {
      path: '/room/create',
      name: 'room-create',
      component: CreateRoomStepView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
