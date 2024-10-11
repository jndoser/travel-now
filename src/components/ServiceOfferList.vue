<template>
  <div class="flex flex-col gap-2">
    <div class="text-2xl mb-3">What this place offers</div>
    <a-row :gutter="[14, 14]">
      <a-col v-for="(service, index) in services.services" :key="index" :span="12">
        <div>{{ service }}</div>
      </a-col>
    </a-row>
    <AmenitiesDetailModal ref="amenitiesModalRef" :amenityNames="services.services" />
    <a-button @click="showAmenitiesModal" shape="round" size="large" class="w-60 mt-3 mb-4">
      Show all amenities
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import AmenitiesDetailModal from './AmenitiesDetailModal.vue'
interface ServiceOfferListProps {
  services: string[]
}

interface AmenitiesDetailModalInstance {
  showModal: () => void
}

const services = defineProps<ServiceOfferListProps>()
const amenitiesModalRef = ref<AmenitiesDetailModalInstance | null>(null)

const showAmenitiesModal = () => {
  if (amenitiesModalRef.value) {
    amenitiesModalRef.value.showModal()
  }
}
</script>
