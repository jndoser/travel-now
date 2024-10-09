<template>
  <a-row :gutter="[18, 18]">
    <a-col v-for="item in roomData" :key="item.toString()" :span="8">
      <RoomCard
        :id="item.id"
        :title="item.title"
        :description="item.description"
        :address="item.address"
        :rating="item.rating"
        :numberOfFeedbacks="item.numberOfFeedbacks"
        :price="item.price"
        :imageUrls="item.imageUrls"
      />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RoomCard, { type RoomCardProps } from '../components/RoomCard.vue'
import axios from 'axios'

const roomData = ref<RoomCardProps[]>()

const loadRoomData = async () => {
  const res = await axios.get('http://localhost:8000/api/room')
  roomData.value =
    res.data.length > 0
      ? res.data.map(
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
              imageUrls: room.imageUrls
            }) as RoomCardProps
        )
      : []
}

onMounted(() => {
  loadRoomData()
})
</script>
