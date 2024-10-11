<template>
  <a-list :grid="{ gutter: 18, column: 2 }" :pagination="pagination" :data-source="feedbacksInfo">
    <template #renderItem="{ item }">
      <Feedback
        :authorFullName="item.authorFullName"
        :description="item.description"
        :createdDate="item.createdDate"
      />
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Feedback, { type FeedbackProps } from './Feedback.vue'
import axios from 'axios'

interface RoomFeedbacksProps {
  roomId: string
}

const roomFeedbacksData = defineProps<RoomFeedbacksProps>()
const feedbacksInfo = ref<FeedbackProps[]>()
const totalFeedbacksCount = ref<number>()
const currentPage = ref<number>(1)

const pagination = computed(() => ({
  onChange: (page: number) => {
    currentPage.value = page
    loadFeedbacks(page) // Load new page data when page changes
  },
  pageSize: 6,
  total: totalFeedbacksCount.value,
  current: currentPage.value
}))

const loadFeedbacks = async (page: number) => {
  const res = await axios.get(
    `http://localhost:8000/api/room-feedbacks/${roomFeedbacksData.roomId}?page=${page}&limit=4`
  )
  feedbacksInfo.value = res.data.feedbacks.map((f: any) => ({
    authorFullName: `${f.author.firstName} ${f.author.lastName}`,
    description: f.comment,
    createdDate: f.createdAt
  }))

  totalFeedbacksCount.value = res.data.total
}

watch(
  () => roomFeedbacksData.roomId,
  (newRoomId) => {
    if (newRoomId) {
      loadFeedbacks(1) // Load feedbacks once roomId is available
    }
  }
)
</script>
