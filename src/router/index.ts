import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '@/views/ExploreView.vue'
import RoomDetail from '@/views/RoomDetail.vue'
import CreateRoomStepView from '@/views/CreateRoomStepView.vue'
import SavedRoomsView from '@/views/SavedRoomsView.vue'
import RoomManagerView from '@/views/RoomManagerView.vue'
import EditRoomView from '@/views/EditRoomView.vue'

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
    },
    {
      path: '/savings',
      name: 'savings',
      component: SavedRoomsView
    },
    {
      path: '/room-manager',
      name: 'roomManager',
      component: RoomManagerView
    },
    {
      path: '/room/edit/:roomId',
      name: 'room-edit',
      component: EditRoomView
    }
  ]
})

export default router
