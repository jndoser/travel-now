<template>
  <div class="flex flex-col items-center w-[400px] justify-center mx-auto">
    <div class="text-4xl font-bold">{{ ratingReportData.averageRate }}</div>
    <div class="text-lg font-semibold">Guest favorite</div>
    <div class="text-wrap">
      This home is in the top 5% of eligible listings based on ratings, reviews, and reliability
    </div>
  </div>
</template>
<script lang="ts" setup>
interface RatingReportProps {
  averageRate: number
}

const ratingReportData = defineProps<RatingReportProps>()
</script>
