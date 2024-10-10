<template>
  <div class="flex flex-col gap-4 items-center">
    <span class="text-2xl" style="margin-right: 8px">Choose amenities:</span>
    <a-space :size="[10, 28]" wrap>
      <a-checkable-tag
        v-for="amenity in amenitiesStatus"
        :key="amenity.title"
        v-model:checked="amenity.checked"
        @change="(checked: boolean) => handleChange(amenity.title, checked)"
      >
        {{ amenity.title }}
      </a-checkable-tag>
    </a-space>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoomCreator } from '../stores/roomCreator'
import { storeToRefs } from 'pinia'

const { fetchAmenitiesData } = useRoomCreator()
const { amenitiesStatus, roomData } = storeToRefs(useRoomCreator())

onMounted(() => {
  fetchAmenitiesData()
})
console.log('roomData: ', roomData.value)

const handleChange = (title: string, checked: boolean) => {
  console.log(title, checked)
}
</script>
