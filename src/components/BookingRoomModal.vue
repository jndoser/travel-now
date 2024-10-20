<template>
  <div>
    <a-modal v-model:open="open" title="Booking room" @ok="handleOk" width="600px">
      <template #footer>
        <a-button key="cancel" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Number of people" name="numberOfPeople">
          <a-input-number v-model:value="formState.numberOfPeople" />
        </a-form-item>
        <a-form-item label="Booked Date" required name="bookedDate">
          <a-date-picker
            v-model:value="formState.bookedDate"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Dayjs } from 'dayjs'
import { reactive, toRaw } from 'vue'
import type { UnwrapRef } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import { message } from 'ant-design-vue'

const loading = ref<boolean>(false)
const open = ref<boolean>(false)
const { user } = useUser()

const showModal = () => {
  open.value = true
}

interface FormState {
  numberOfPeople: number
  bookedDate: Dayjs | undefined
}

interface BookingRoomModelProps {
  roomId: string
}

const { roomId } = defineProps<BookingRoomModelProps>()

const formRef = ref()
const labelCol = { span: 6 }
const wrapperCol = { span: 13 }
const formState: UnwrapRef<FormState> = reactive({
  numberOfPeople: 0,
  bookedDate: undefined
})

const handleOk = () => {
  loading.value = true
  formRef.value
    .validate()
    .then(async () => {
      const newBookedRoom = {
        roomId: roomId,
        clerkId: user.value?.id,
        numberOfPeople: formState.numberOfPeople,
        bookedDate: formState.bookedDate?.toISOString()
      }
      const res = await axios.post('http://localhost:8000/api/room/booking', newBookedRoom)
      if (res.status === 201) {
        loading.value = false
        open.value = false
        message.success('Booking success, please wait for the owner confirm this booking')
      }
    })
    .catch((error: any) => {
      console.log('error', error)
    })
}

const handleCancel = () => {
  open.value = false
}

defineExpose({ showModal })
</script>
