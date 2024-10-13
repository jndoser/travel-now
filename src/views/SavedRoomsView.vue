<template>
  <div class="flex flex-col gap-4 items-center justify-center">
    <div class="text-2xl font-bold">Saved Rooms</div>
    <a-list :grid="{ gutter: 18, column: 3 }" :pagination="pagination" :data-source="roomData">
      <template #renderItem="{ item }">
        <RoomCard
          :id="item.id"
          :title="item.title"
          :description="item.description"
          :address="item.address"
          :rating="item.rating"
          :numberOfFeedbacks="item.numberOfFeedbacks"
          :price="item.price"
          :imageUrls="item.imageUrls"
          :isSaved="item.isSaved"
        />
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import RoomCard, { type RoomCardProps } from '../components/RoomCard.vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'

const roomData = ref<RoomCardProps[]>()
const totalRoomCount = ref<number>()
const currentPage = ref<number>(1)
const { user } = useUser()

const pagination = computed(() => ({
  onChange: (page: number) => {
    currentPage.value = page
    loadSavedRoomData(page) // Load new page data when page changes
  },
  pageSize: 6,
  total: totalRoomCount.value,
  current: currentPage.value
}))

const loadSavedRoomData = async (page: number) => {
  if (!user.value?.id) return

  const res = await axios.get(
    `http://localhost:8000/api/user/saved-rooms/${user.value?.id}?page=${page}&limit=6`
  )
  roomData.value =
    res.data.savedRooms.length > 0
      ? res.data.savedRooms.map(
          (room: any) =>
            ({
              id: room.id,
              title: room.title.length > 20 ? `${room.title.slice(0, 16)}...` : room.title,
              description:
                room.description.length > 29
                  ? `${room.description.slice(0, 25)}...`
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

watch(
  () => user.value?.id,
  (newUserId) => {
    if (newUserId) {
      loadSavedRoomData(currentPage.value)
    }
  },
  { immediate: true }
)
</script>
