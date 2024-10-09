<template>
  <div class="flex flex-col gap-2">
    <div class="text-2xl mb-3">What this place offers</div>
    <a-row :gutter="[14, 14]">
      <a-col v-for="(service, index) in services.services" :key="index" :span="12">
        <div>{{ service }}</div>
      </a-col>
      <a-col :span="12">col-12</a-col>
    </a-row>
    <a-button shape="round" size="large" class="w-60 mt-3 mb-4"> Show all amenities </a-button>
  </div>
</template>
<script lang="ts" setup>
interface ServiceOfferListProps {
  services: string[]
}

const services = defineProps<ServiceOfferListProps>()
</script>
