<template>
  <div class="flex flex-col gap-4">
    <div class="text-2xl font-bold text-center">Admin Room Manager</div>
    <a-radio-group v-model:value="selectedRoomStatus">
      <a-radio-button value="pending">Pending Review</a-radio-button>
      <a-radio-button value="approved">Approved</a-radio-button>
      <a-radio-button value="rejected">Rejected</a-radio-button>
    </a-radio-group>
    <a-list :pagination="pagination" :data-source="roomData">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a key="list-loadmore-edit" @click="clickApproveHandler(item.id)">approve</a>
            <a key="list-loadmore-more" @click="clickRejectHandler(item.id)">reject</a>
          </template>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta :description="item.description">
              <template #title>
                <RouterLink :to="`/room/${item.id}`">
                  <h1>{{ item.title }}</h1>
                </RouterLink>
              </template>
              <template #avatar>
                <a-avatar :src="item.imageUrls[0]" />
              </template>
            </a-list-item-meta>
            <div>{{ item.address }}</div>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { type RoomCardProps } from '../components/RoomCard.vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import { message } from 'ant-design-vue'

const roomData = ref<RoomCardProps[]>()
const totalRoomCount = ref<number>()
const currentPage = ref<number>(1)
const selectedRoomStatus = ref<string>('pending')

const { user } = useUser()

const pagination = computed(() => ({
  onChange: (page: number) => {
    currentPage.value = page
    loadRoomData(page) // Load new page data when page changes
  },
  pageSize: 6,
  total: totalRoomCount.value,
  current: currentPage.value
}))

const loadRoomData = async (page: number) => {
  let status = 'in%20progress'
  switch (selectedRoomStatus.value) {
    case 'approved':
      status = 'approved'
      break
    case 'rejected':
      status = 'rejected'
      break
    default:
      status = 'in%20progress'
  }
  console.log('status: ', status)
  const res = await axios.get(
    `http://localhost:8000/api/room?page=${page}&limit=6&status=${status}`
  )
  roomData.value =
    res.data.rooms.length > 0
      ? res.data.rooms.map(
          (room: any) =>
            ({
              id: room.id,
              title: room.title.length > 60 ? `${room.title.slice(0, 56)}...` : room.title,
              description:
                room.description.length > 49
                  ? `${room.description.slice(0, 35)}...`
                  : room.description,
              address: room.address,
              rating:
                room.feedback.length > 0
                  ? room.feedback
                      .map((f: any) => f.rating)
                      .reduce((a: number, b: number) => a + b, 0) / room.feedback.length
                  : 0,
              numberOfFeedbacks: room.feedback.length,
              price: room.price,
              imageUrls: room.imageUrls,
              isSaved:
                room.savedUsers.filter((savedUser: any) => savedUser.clerkId === user.value?.id)
                  .length > 0
            }) as RoomCardProps
        )
      : []

  totalRoomCount.value = res.data.total
}

const clickApproveHandler = async (roomId: string) => {
  const res = await axios.put(`http://localhost:8000/api/room/approve/${roomId}`)
  if (res.status === 200) {
    loadRoomData(1)
    message.success('Approve successfully')
  }
}

const clickRejectHandler = async (roomId: string) => {
  const res = await axios.put(`http://localhost:8000/api/room/reject/${roomId}`)
  if (res.status === 200) {
    loadRoomData(1)
    message.success('Reject successfully')
  }
}

watch(selectedRoomStatus, async (newSelectedRoomStatus) => {
  console.log('selected room status: ', newSelectedRoomStatus)
  await loadRoomData(1)
})

onMounted(() => {
  loadRoomData(1)
})
</script>
