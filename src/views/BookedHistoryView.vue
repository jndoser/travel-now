<template>
  <div class="flex flex-col gap-4">
    <div class="text-2xl font-bold text-center">Booking History</div>
    <a-list :pagination="pagination" :data-source="roomData">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-popover title="Booking info">
              <template #content>
                <p>Status: {{ item.status }}</p>
                <p>Number of person: {{ item.numberOfPeople }}</p>
              </template>
              <a-button shape="circle" size="large" class="flex items-center justify-center">
                <template #icon>
                  <InfoCircleOutlined />
                </template>
              </a-button>
            </a-popover>
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
            <div>
              {{
                `${dayjs(item.bookedDate).format('YYYY-MM-DD HH:mm:ss')} - ${item.numberOfPeople} person`
              }}
            </div>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { useUser } from 'vue-clerk'
import { InfoCircleOutlined } from '@ant-design/icons-vue'

const roomData = ref()
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
  const res = await axios.get(
    `http://localhost:8000/api/room/user/booking/${user.value?.id}?page=${page}&limit=6`
  )
  roomData.value =
    res.data.bookedRooms.length > 0
      ? res.data.bookedRooms.map(
          (bookedRooms: any) =>
            ({
              id: bookedRooms.room.id,
              title:
                bookedRooms.room.title.length > 60
                  ? `${bookedRooms.room.title.slice(0, 56)}...`
                  : bookedRooms.room.title,
              description:
                bookedRooms.room.description.length > 49
                  ? `${bookedRooms.room.description.slice(0, 35)}...`
                  : bookedRooms.room.description,
              address: bookedRooms.room.address,
              price: bookedRooms.room.price,
              imageUrls: bookedRooms.room.imageUrls,
              numberOfPeople: bookedRooms.numberOfPeople,
              bookedDate: bookedRooms.bookedDate,
              status: bookedRooms.status
            }) as any
        )
      : []

  totalRoomCount.value = res.data.total
}

onMounted(() => {
  loadRoomData(1)
})
</script>
