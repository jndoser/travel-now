<template>
  <div class="flex flex-col gap-2">
    <a-row :gutter="[14, 14]">
      <a-col v-for="(feedback, index) in feedbacksInfo.feedbacks" :key="index" :span="12">
        <Feedback
          :authorFullName="feedback.authorFullName"
          :description="feedback.description"
          :createdDate="feedback.createdDate"
        />
      </a-col>
    </a-row>
    <a-button shape="round" size="large" class="w-60 mt-3 mb-4"> Show all feedbacks </a-button>
  </div>
</template>
<script lang="ts" setup>
import Feedback, { type FeedbackProps } from './Feedback.vue'

export interface FeedbacksProps {
  feedbacks: FeedbackProps[]
}

const feedbacksInfo = defineProps<FeedbacksProps>()
</script>
