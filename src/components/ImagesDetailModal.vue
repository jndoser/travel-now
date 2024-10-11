<template>
  <div>
    <a-modal v-model:open="open" width="1000px" title="Basic Modal" @ok="handleOk">
      <div v-for="imagesData in imagesToDisplay" :key="imagesData[0].toString()">
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
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
const open = ref<boolean>(false)

interface ImagesDetailModalProps {
  imageUrls: string[]
}

const formatImageData = (images: string[]) => {
  const numberItems = 5
  const formattedImageData = []
  for (let i = 0; i <= images.length; i += numberItems) {
    const subArray = images.slice(i, i + numberItems)
    formattedImageData.push(subArray)
  }
  return formattedImageData
}

const imagesDetailData = defineProps<ImagesDetailModalProps>()

const imagesToDisplay = computed(() => formatImageData(imagesDetailData.imageUrls))

console.log('imagesToDisplay: ', imagesToDisplay.value)

const showModal = () => {
  open.value = true
}

const handleOk = (e: MouseEvent) => {
  console.log(e)
  open.value = false
}

defineExpose({
  showModal
})
</script>
