<template>
  <div class="flex flex-col gap-5">
    <div class="font-bold text-2xl self-center">Create new room</div>
    <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
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

      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">Create</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { UploadOutlined } from '@ant-design/icons-vue'
import { App, type UploadProps } from 'ant-design-vue'
import { useUser } from 'vue-clerk'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useRoomCreator, type RoomCreateDataType } from '@/stores/roomCreator'

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

interface CreateRoomViewProps {
  clickNextHandler: () => void
}

const createRoomData = defineProps<CreateRoomViewProps>()
const { setRoomData } = useRoomCreator()

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
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      const images = formState.imageUrls?.map((file: any) => file.response.responseData[0].url)

      const newRoom = {
        title: formState.title,
        description: formState.description,
        address: formState.address,
        capacity: formState.capacity,
        price: formState.price,
        imageUrls: images,
        ownerId: user.value?.id
      } as RoomCreateDataType

      setRoomData(newRoom)

      // const res = await axios.post('http://localhost:8000/api/room', newRoom)
      // if (res.status === 201) {
      //   message.success('Create room successfully!')
      //   router.push('/explore')
      // }
      // move to amenities selector
      createRoomData.clickNextHandler()
    })
    .catch((error: any) => {
      console.log('error', error)
    })
}
const resetForm = () => {
  formRef.value.resetFields()
}
const handleRemoveFile = async (file: any) => {
  const deleteFilePublicId = file.response.responseData[0].public_id
  const res = await axios.delete(
    `http://localhost:8000/api/images/upload/${deleteFilePublicId.replace('vue-travel-now/', '')}`
  )
}
</script>
