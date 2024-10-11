<template>
  <a-result
    status="success"
    title="Successfully Create Room!"
    sub-title="Your room is created and waiting for approval. It will appear on our home soon."
  >
    <template #extra>
      <a-button key="home" type="primary" @click="goHome">Go Home</a-button>
    </template>
  </a-result>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/explore')
}
</script>
