<template>
  <div>
    <a-steps :current="current" :items="items"></a-steps>
    <div class="steps-content">
      <component
        :is="steps[current].component"
        v-if="current === 0"
        ref="createFormRef"
        :key="'createRoom'"
      ></component>
      <component :is="steps[current].component" v-else :key="current"></component>
    </div>
    <div class="steps-action">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
      <a-button
        v-if="current == steps.length - 1"
        type="primary"
        @click="message.success('Processing complete!')"
      >
        Done
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import CreateRoomView from './CreateRoomView.vue'
import AmenitiesSelectView from './AmenitiesSelectView.vue'
import { storeToRefs } from 'pinia'
import { useRoomCreator, type AmenitiesStatusDataType } from '@/stores/roomCreator'
import axios from 'axios'
import { useRouter } from 'vue-router'
import CreateRoomResultView from './CreateRoomResultView.vue'

interface CreateFormComponentInstance {
  submitFormData: () => void
}

const current = ref<number>(0)
const createFormRef = ref<CreateFormComponentInstance | null>(null)
const { amenitiesStatus, roomData } = storeToRefs(useRoomCreator())
const router = useRouter()

const next = async () => {
  if (current.value === 0 && createFormRef.value) {
    createFormRef.value.submitFormData() // Try to trigger the form submission
  }
  if (current.value === 1) {
    const serviceIds = amenitiesStatus.value
      .filter((amenity: AmenitiesStatusDataType) => amenity.checked === true)
      .map((amenity: AmenitiesStatusDataType) => amenity.id)

    const newRoom = {
      ...roomData.value,
      serviceIds
    }

    const res = await axios.post('http://localhost:8000/api/room', newRoom)
    if (res.status === 201) {
      message.success('Create room successfully!')
    }
  }

  current.value++
}
const prev = () => {
  current.value--
}

const steps = [
  {
    title: 'Create room',
    component: CreateRoomView
  },
  {
    title: 'Add amenities',
    component: AmenitiesSelectView
  },
  {
    title: 'Done',
    component: CreateRoomResultView
  }
]
const items = steps.map((item) => ({ key: item.title, title: item.title }))
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  height: 600px;
  text-align: left;
  padding-top: 80px;
}

.steps-action {
  margin-top: 24px;
}

[data-theme='dark'] .steps-content {
  background-color: #2f2f2f;
  border: 1px dashed #404040;
}
</style>
