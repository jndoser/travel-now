<template>
  <div>
    <a-modal v-model:open="open" width="1000px" title="All amenities in this room" @ok="handleOk">
      <a-list :grid="{ gutter: 18, column: 2 }" :data-source="amenitiesModalInfo.amenityNames">
        <template #renderItem="{ item }">
          <div>{{ item }}</div>
        </template>
      </a-list>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const open = ref<boolean>(false)

interface AmentitiesDetailModalProps {
  amenityNames: string[]
}

const amenitiesModalInfo = defineProps<AmentitiesDetailModalProps>()

const showModal = () => {
  open.value = true
}

const handleOk = (e: MouseEvent) => {
  open.value = false
}

defineExpose({
  showModal
})
</script>
