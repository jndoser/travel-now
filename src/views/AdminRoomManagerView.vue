<template>
  <a-list :pagination="pagination" :data-source="roomData">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a key="list-loadmore-edit">approve</a>
          <a key="list-loadmore-more">reject</a>
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

onMounted(() => {
  loadRoomData(1)
})
</script>
