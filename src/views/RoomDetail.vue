<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-2xl">Cozy condo with stunning view</div>
      <div class="flex gap-4 justify-center items-center">
        <a-button :icon="h(ShareAltOutlined)" class="flex items-center justify-center"
          >Share</a-button
        >
        <a-button :icon="h(HeartOutlined)" class="flex items-center justify-center">Save</a-button>
      </div>
    </div>
    <ImageGallery :imagesData="roomData.imagesData" />
    <div class="flex flex-col mt-5">
      <div class="text-xl font-semibold">{{ roomData.title }}</div>
      <div>{{ roomData.capacity }} guests</div>
    </div>
    <HostAchievement :hostFullName="roomData.hostInfo.fullName" />
    <a-typography-paragraph
      :ellipsis="{ rows: 2, expandable: true, symbol: 'more' }"
      :content="roomData.description"
    />
    <a-divider />
    <ServiceOfferList :services="roomData.services" />
    <RatingReport :averageRate="roomData.ratingReportData.averageRate" />
    <a-divider />
    <RoomFeedbacks :feedbacks="roomData.feedbacksInfo" />
  </div>
</template>
<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { ShareAltOutlined, HeartOutlined } from '@ant-design/icons-vue'
import ImageGallery from '@/components/ImageGallery.vue'
import HostAchievement from '@/components/HostAchievement.vue'
import ServiceOfferList from '@/components/ServiceOfferList.vue'
import RatingReport from '@/components/RatingReport.vue'
import RoomFeedbacks, { type FeedbacksProps } from '@/components/RoomFeedbacks.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { FeedbackProps } from '@/components/Feedback.vue'

interface RoomDataType {
  imagesData: string[]
  title: string
  capacity: number
  hostInfo: {
    fullName: string
  }
  description: string
  services: string[]
  ratingReportData: {
    averageRate: 0
  }
  feedbacksInfo: FeedbackProps[]
}

const router = useRoute()
const id = router.params.id
const roomData = ref<RoomDataType>({
  imagesData: [],
  title: '',
  capacity: 0,
  hostInfo: { fullName: '' },
  description: '',
  services: [],
  ratingReportData: {
    averageRate: 0
  },
  feedbacksInfo: []
})

const getDetailRoom = async (roomId: string) => {
  const res = await axios.get('http://localhost:8000/api/room/66fcf5c1931a6b7afb58d962')

  roomData.value = {
    imagesData: res.data.imageUrls,
    title: res.data.title,
    capacity: res.data.capacity,
    hostInfo: {
      fullName: `${res.data.owner.firstName} ${res.data.owner.lastName}`
    },
    description: res.data.description,
    services: res.data.services.map((service: any) => service.title),
    ratingReportData: {
      averageRate:
        res.data.feedback.length > 0
          ? res.data.feedback.map((f: any) => f.rating).reduce((a: number, b: number) => a + b, 0) /
            res.data.feedback.length
          : 0
    },
    feedbacksInfo: res.data.feedback.map((f: any) => ({
      authorFullName: `${f.author.firstName} ${f.author.lastName}`,
      description: f.comment,
      createdDate: f.createdAt
    }))
  } as RoomDataType
}

onMounted(() => {
  getDetailRoom('')
})
</script>
