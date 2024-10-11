<template>
  <div class="flex flex-col gap-4">
    <a-input-group compact>
      <a-input v-model:value="commentInput" style="width: calc(70% - 200px)" />
      <a-button type="primary" @click="onComment">Submit</a-button>
    </a-input-group>
    <a-list :grid="{ gutter: 18, column: 2 }" :pagination="pagination" :data-source="feedbacksInfo">
      <template #renderItem="{ item }">
        <Feedback
          :authorFullName="item.authorFullName"
          :description="item.description"
          :createdDate="item.createdDate"
        />
      </template>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Feedback, { type FeedbackProps } from './Feedback.vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import { message } from 'ant-design-vue'

interface RoomFeedbacksProps {
  roomId: string
}

const roomFeedbacksData = defineProps<RoomFeedbacksProps>()
const feedbacksInfo = ref<FeedbackProps[]>()
const totalFeedbacksCount = ref<number>()
const currentPage = ref<number>(1)
const commentInput = ref<string>('')
const { user } = useUser()

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

const onComment = async () => {
  const commentInfo = {
    roomId: roomFeedbacksData.roomId,
    clerkId: user.value?.id,
    rating: 5,
    comment: commentInput.value
  }

  const res = await axios.post('http://localhost:8000/api/room-feedbacks/', commentInfo)
  if (res.status === 201) {
    message.success('Add feedback successfully!')
    commentInput.value = ''
    loadFeedbacks(1)
  }
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
