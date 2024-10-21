<template>
  <div class="flex flex-col gap-4">
    <div class="text-2xl font-bold text-center">Booked Room Manager</div>
    <a-radio-group v-model:value="selectedRoomStatus">
      <a-radio-button value="Pending">Pending Review</a-radio-button>
      <a-radio-button value="Approved">Approved</a-radio-button>
      <a-radio-button value="Rejected">Rejected</a-radio-button>
    </a-radio-group>
    <a-list :pagination="pagination" :data-source="roomData">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a key="list-loadmore-edit" @click="clickApproveHandler(item.id)">Approve</a>
            <a key="list-loadmore-more" @click="clickRejectHandler(item.id)">Reject</a>
          </template>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta :description="item.email">
              <template #title>
                <h1>{{ item.userFullname }}</h1>
              </template>
              <template #avatar>
                <a-avatar :src="item.photo" />
              </template>
            </a-list-item-meta>
            <div>
              {{
                `${dayjs(item.bookedDate).format('YYYY-MM-DD HH:mm:ss')} - ${item.numberOfPeople} person`
              }}
            </div>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const roomData = ref()
const totalRoomCount = ref<number>()
const currentPage = ref<number>(1)
const selectedRoomStatus = ref<string>('Pending')
const route = useRoute()

const pagination = computed(() => ({
  onChange: (page: number) => {
    currentPage.value = page
    loadRoomData(page) // Load new page data when page changes
  },
  pageSize: 6,
  total: totalRoomCount.value,
  current: currentPage.value
}))

const loadRoomData = async (page: number) => {
  let status = 'Pending%20Approval'
  switch (selectedRoomStatus.value) {
    case 'Approved':
      status = 'Approved'
      break
    case 'Rejected':
      status = 'Rejected'
      break
    default:
      status = 'Pending%20Approval'
  }
  console.log('status: ', status)
  const res = await axios.get(
    `http://localhost:8000/api/room/booking/${route.params.bookingId}?page=${page}&limit=6&status=${status}`
  )
  roomData.value =
    res.data.bookedData.length > 0
      ? res.data.bookedData.map(
          (info: any) =>
            ({
              id: info.id,
              numberOfPeople: info.numberOfPeople,
              bookedDate: info.bookedDate,
              address: info.address,
              userFullname: info.user.firstName + ' ' + info.user.lastName,
              email: info.user.email,
              photo: info.user.photo
            }) as any
        )
      : []

  totalRoomCount.value = res.data.total
}

const clickApproveHandler = async (bookingId: string) => {
  const res = await axios.put(`http://localhost:8000/api/room/booking/approve/${bookingId}`)
  if (res.status === 200) {
    loadRoomData(1)
    message.success('Approve successfully')
  }
}

const clickRejectHandler = async (bookingId: string) => {
  const res = await axios.put(`http://localhost:8000/api/room/booking/reject/${bookingId}`)
  if (res.status === 200) {
    loadRoomData(1)
    message.success('Reject successfully')
  }
}

watch(selectedRoomStatus, async (newSelectedRoomStatus) => {
  console.log('selected room status: ', newSelectedRoomStatus)
  await loadRoomData(1)
})

onMounted(() => {
  loadRoomData(1)
})
</script>
