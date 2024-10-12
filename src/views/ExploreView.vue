<template>
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
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
    loadRoomData(page) // Load new page data when page changes
  },
  pageSize: 6,
  total: totalRoomCount.value,
  current: currentPage.value
}))

const loadRoomData = async (page: number) => {
  const res = await axios.get(`http://localhost:8000/api/room?page=${page}&limit=6`)
  roomData.value =
    res.data.rooms.length > 0
      ? res.data.rooms.map(
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

onMounted(() => {
  loadRoomData(1)
})
</script>
