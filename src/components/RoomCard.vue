<template>
  <a-card hoverable style="width: 300px" class="mr-3 mt-4" @click="clickRoomCardHandler">
    <template #cover>
      <a-carousel arrows>
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1" @click.stop>
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px" @click.stop>
            <right-circle-outlined />
          </div>
        </template>
        <div class="w-[100%]" v-for="imageUrl in imageUrls" :key="imageUrl">
          <img alt="example" :src="imageUrl" class="w-[100%]" />
        </div>
      </a-carousel>
      <div class="absolute top-0" @click.stop>
        <div class="rounded-2xl m-2 p-2 bg-white text-black w-fit">Super Hot</div>
        <heart-filled
          @click="clickHeartHandler"
          v-if="isSavedRoom"
          class="absolute right-2 top-1 text-2xl text-red-500"
        />
        <heart-two-tone
          v-else
          @click="clickHeartHandler"
          class="absolute right-2 top-1 text-2xl"
          twoToneColor="#eb2f96"
        />
      </div>
    </template>
    <a-card-meta>
      <template #title>
        <div class="flex justify-center items-center gap-2 text-sm">
          <div>{{ title }}</div>
          <div class="flex gap-1 justify-center items-center">
            <star-filled />
            <div>{{ rating }} ({{ numberOfFeedbacks }})</div>
          </div>
        </div>
      </template>
      <template #description>
        <div class="flex flex-col gap-2">
          <div>{{ description }}</div>
          <div>{{ address }}</div>
          <div class="font-bold">${{ price }} per month</div>
        </div>
      </template>
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" />
      </template>
    </a-card-meta>
  </a-card>
</template>
<script lang="ts" setup>
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  HeartTwoTone,
  StarFilled,
  HeartFilled
} from '@ant-design/icons-vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useUser } from 'vue-clerk'
import { useRouter } from 'vue-router'

export interface RoomCardProps {
  id: string
  title: string
  description: string
  address: string
  rating: number
  numberOfFeedbacks: number
  price: number
  imageUrls: string[]
  isSaved: boolean
}

const isSavedRoom = ref<boolean>(false)

const { id, title, description, address, rating, numberOfFeedbacks, price, imageUrls, isSaved } =
  defineProps<RoomCardProps>()

const router = useRouter()
const { user } = useUser()

const clickRoomCardHandler = () => {
  router.push(`/room/${id}`)
}

const clickHeartHandler = async () => {
  let res
  if (!isSavedRoom.value) {
    res = await axios.put(`http://localhost:8000/api/room/save/${id}`, { clerkId: user.value?.id })
  } else {
    res = await axios.put(`http://localhost:8000/api/room/unsave/${id}`, {
      clerkId: user.value?.id
    })
  }
  if (res.status === 200) {
    isSavedRoom.value = !isSavedRoom.value
  }
}

onMounted(() => {
  isSavedRoom.value = isSaved
})
</script>
<style scoped>
:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: white;
  overflow: hidden;
}
:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: black;
  background-color: white;
  border-radius: 50%;
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: black;
  opacity: 0.5;
}
</style>
