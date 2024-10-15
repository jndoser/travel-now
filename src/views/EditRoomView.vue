<template>
  <div class="flex flex-col gap-5 items-center justify-center">
    <div class="font-bold text-2xl">Edit room</div>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="w-[90%]"
    >
      <a-form-item label="Title" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item label="Description" name="desc">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
      <a-form-item label="Address" name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>
      <a-form-item label="Capacity" name="capacity">
        <a-input-number v-model:value="formState.capacity" />
      </a-form-item>
      <a-form-item label="Price" name="price">
        <a-input-number v-model:value="formState.price" />
      </a-form-item>
      <a-form-item label="Images" name="imageUrls">
        <a-upload
          v-model:file-list="formState.imageUrls"
          action="http://localhost:8000/api/images/upload"
          list-type="picture"
          multiple
          @remove="handleRemoveFile"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            upload
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="Amenities" name="amenities">
        <a-space :size="[10, 10]" wrap>
          <a-checkable-tag
            v-for="amenity in amenitiesStatus"
            :key="amenity.title"
            v-model:checked="amenity.checked"
            @change="(checked: boolean) => handleChange(amenity.title, checked)"
          >
            {{ amenity.title }}
          </a-checkable-tag>
        </a-space>
      </a-form-item>
    </a-form>
    <a-button
      @click="handleUpdateRoom"
      type="primary"
      :size="'large'"
      class="flex items-center justify-center"
    >
      <template #icon>
        <EditOutlined />
      </template>
      Update room
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { EditOutlined } from '@ant-design/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { UploadOutlined } from '@ant-design/icons-vue'
import { App, type UploadProps } from 'ant-design-vue'
import { useUser } from 'vue-clerk'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import {
  useRoomCreator,
  type AmenitiesStatusDataType,
  type RoomCreateDataType
} from '@/stores/roomCreator'
import { storeToRefs } from 'pinia'

// const fileList = ref<UploadProps['fileList']>([
//   {
//     uid: '-1',
//     name: 'xxx.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
//   },
//   {
//     uid: '-2',
//     name: 'yyy.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
//   }
// ])

interface FormState {
  title: string
  description: string
  address: string
  capacity: number
  price: number
  imageUrls: UploadProps['fileList']
}
const { user } = useUser()
const { message } = App.useApp()
const router = useRouter()
const route = useRoute()

const roomId = route.params.roomId as string

const formRef = ref()
const labelCol = { span: 5 }
const wrapperCol = { span: 13 }
const formState: UnwrapRef<FormState> = reactive({
  title: '',
  description: '',
  address: '',
  capacity: 0,
  price: 0,
  imageUrls: []
})

const { setRoomData, setCurrentRoomData, updateAmenitiesStatus } = useRoomCreator()

const { amenitiesStatus, roomData } = storeToRefs(useRoomCreator())

// const rules: Record<string, Rule[]> = {
//   name: [
//     { required: true, message: 'Please input Activity name', trigger: 'change' },
//     { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
//   ],
//   region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
//   date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
//   type: [
//     {
//       type: 'array',
//       required: true,
//       message: 'Please select at least one activity type',
//       trigger: 'change'
//     }
//   ],
//   resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
//   desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
// }

const handleChange = (title: string, checked: boolean) => {
  updateAmenitiesStatus(title, checked)
}

const handleRemoveFile = async (file: any) => {
  const deleteFilePublicId = file.response.responseData[0].public_id
  await axios.delete(
    `http://localhost:8000/api/images/upload/${deleteFilePublicId.replace('vue-travel-now/', '')}`
  )
}

const handleUpdateRoom = async () => {
  const newAmenities = amenitiesStatus.value
    .filter((amenity: AmenitiesStatusDataType) => amenity.checked === true)
    .map((amenity: AmenitiesStatusDataType) => amenity.id)
  const newRoomData = {
    title: formState.title,
    description: formState.description,
    address: formState.address,
    capacity: formState.capacity,
    price: formState.price,
    imageUrls: formState.imageUrls,
    serviceIDs: newAmenities
  }

  const res = await axios.put(`http://localhost:8000/api/room/${roomId}`, newRoomData)
  if (res.status === 200) {
    message.success('Update successfully!')
    router.push('/room-manager')
  }
}

onMounted(async () => {
  await setCurrentRoomData(roomId)
})

watch(
  roomData,
  (newRoomData) => {
    console.log('watch triggered for roomData:', newRoomData)
    formState.title = newRoomData.title
    formState.description = newRoomData.description
    formState.address = newRoomData.address
    formState.capacity = newRoomData.capacity
    formState.price = newRoomData.price
  },
  { immediate: true, deep: true }
)
</script>
