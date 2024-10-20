import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '@/views/ExploreView.vue'
import RoomDetail from '@/views/RoomDetail.vue'
import CreateRoomStepView from '@/views/CreateRoomStepView.vue'
import SavedRoomsView from '@/views/SavedRoomsView.vue'
import RoomManagerView from '@/views/RoomManagerView.vue'
import EditRoomView from '@/views/EditRoomView.vue'
import AdminRoomManagerView from '@/views/AdminRoomManagerView.vue'
import BookedHistoryView from '@/views/BookedHistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ExploreView
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
    },
    {
      path: '/admin/room-manager',
      name: 'adminRoomManager',
      component: AdminRoomManagerView
    },
    {
      path: '/booking-history',
      name: 'bookingHistory',
      component: BookedHistoryView
    }
  ]
})

export default router
