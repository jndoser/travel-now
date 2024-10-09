<template>
  <div class="flex flex-col items-start mt-7">
    <div class="flex gap-3 items-center justify-center">
      <a-avatar size="large">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <div class="flex flex-col">
        <div class="text-lg font-bold">Hosted by {{ hostData.hostFullName }}</div>
        <div>Superhost - 3 years hosting</div>
      </div>
    </div>
    <a-divider />
    <div class="flex flex-col gap-4 items-start">
      <div class="flex gap-3 items-center justify-center">
        <a-avatar size="large">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="flex flex-col">
          <div class="text-lg font-semibold">Top 5% of homes</div>
          <div>This home is highly ranked based on ratings, reviews, and reliability.</div>
        </div>
      </div>
      <div class="flex gap-3 items-center justify-center">
        <a-avatar size="large">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="flex flex-col">
          <div class="text-lg font-semibold">Danny is a Superhost</div>
          <div>Superhosts are experienced, highly rated Hosts.</div>
        </div>
      </div>
      <div class="flex gap-3 items-center justify-center">
        <a-avatar size="large">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="flex flex-col">
          <div class="text-lg font-semibold">Great location</div>
          <div>Guests who stayed here in the past year loved the location.</div>
        </div>
      </div>
    </div>
    <a-divider />
  </div>
</template>
<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'

interface HostAchievementProps {
  hostFullName: string
}

const hostData = defineProps<HostAchievementProps>()
</script>
