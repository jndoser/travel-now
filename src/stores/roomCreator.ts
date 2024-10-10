import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export interface RoomCreateDataType {
  title: string
  description: string
  address: string
  capacity: number
  price: number
  imageUrls: string[]
  ownerId: string
}

export interface AmenitiesStatusDataType {
  id: string
  title: string
  checked: boolean
}

export const useRoomCreator = defineStore('roomCreator', () => {
  const roomData = reactive({
    title: '',
    description: '',
    address: '',
    capacity: 0,
    price: 0,
    imageUrls: [] as string[],
    ownerId: ''
  })

  const amenitiesStatus = ref<AmenitiesStatusDataType[]>([])

  function setRoomData(roomDataInput: RoomCreateDataType) {
    roomData.title = roomDataInput.title
    roomData.description = roomDataInput.description
    roomData.address = roomDataInput.address
    roomData.capacity = roomDataInput.capacity
    roomData.price = roomDataInput.price
    roomData.imageUrls = roomDataInput.imageUrls
    roomData.ownerId = roomDataInput.ownerId

    console.log('setRoomData: ', roomData)
  }

  async function fetchAmenitiesData() {
    const res = await axios.get('http://localhost:8000/api/services')
    amenitiesStatus.value = res.data.map((service: any) => ({
      id: service.id,
      title: service.title,
      checked: false
    })) as AmenitiesStatusDataType[]
  }

  function updateAmenitiesStatus(title: string, checked: boolean) {
    amenitiesStatus.value = amenitiesStatus.value.map((item: AmenitiesStatusDataType) => {
      if (item.title === title) {
        item.checked = checked
      }
      return item
    })
  }

  function resetRoomData() {
    roomData.title = ''
    roomData.description = ''
    roomData.address = ''
    roomData.capacity = 0
    roomData.price = 0
    roomData.imageUrls = []
    roomData.ownerId = ''
  }

  return {
    roomData,
    amenitiesStatus,
    setRoomData,
    resetRoomData,
    fetchAmenitiesData,
    updateAmenitiesStatus
  }
})
