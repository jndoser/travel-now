<template>
  <div
    class="flex gap-1 justify-center items-center h-[370px] mt-4 rounded-xl overflow-hidden relative"
  >
    <div class="h-[100%] w-[50%]">
      <a-image height="100%" width="100%" :src="imagesData[0]" />
    </div>
    <a-row class="w-[50%] h-[100%]" :gutter="[6, 6]">
      <a-col v-for="item in imagesData.slice(1)" :key="item.toString()" :span="12">
        <div>
          <a-image height="184px" width="100%" :src="item" />
        </div>
      </a-col>
    </a-row>
    <ImagesDetailModal :imageUrls="imagesData" ref="imagesDetailModalRef" />
    <a-button
      type="primary"
      shape="round"
      size="large"
      class="absolute bottom-5 right-10 flex items-center justify-center"
      @click="showImagesDetailModal"
    >
      <template #icon>
        <EllipsisOutlined />
      </template>
      Show all photos
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { EllipsisOutlined } from '@ant-design/icons-vue'
import ImagesDetailModal from './ImagesDetailModal.vue'
import { ref } from 'vue'

interface ImageGalleryProps {
  imagesData: string[]
}

interface ImagesDetailModalInstance {
  showModal: () => void
}

const imagesDetailModalRef = ref<ImagesDetailModalInstance | null>(null)
const { imagesData } = defineProps<ImageGalleryProps>()

const showImagesDetailModal = () => {
  if (imagesDetailModalRef.value) {
    imagesDetailModalRef.value.showModal()
  }
}
</script>
