<template>
  <a-app>
    <a-layout class="h-screen">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="w-[50%] font-bold text-lg text-white mx-auto my-3">Travel Now</div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <RouterLink to="/explore">
            <a-menu-item key="1">
              <compass-outlined />
              <span>Explore</span>
            </a-menu-item>
          </RouterLink>
          <RouterLink to="/savings">
            <a-menu-item key="2">
              <book-outlined />
              <span>Savings</span>
            </a-menu-item>
          </RouterLink>
          <RouterLink to="/booking-history">
            <a-menu-item key="3">
              <search-outlined />
              <span>Booking History</span>
            </a-menu-item>
          </RouterLink>
          <RouterLink to="/room-manager" v-if="isOwner">
            <a-menu-item key="4">
              <form-outlined />
              <span>Manage room</span>
            </a-menu-item>
          </RouterLink>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header
          style="background: #fff; padding-left: 2rem"
          class="flex items-center justify-between"
        >
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </a-layout-header>
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
          class="overflow-auto"
        >
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-app>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import {
  CompassOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BookOutlined,
  SearchOutlined,
  FormOutlined
} from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from 'vue-clerk'
import axios from 'axios'

const router = useRoute()
const { user } = useUser()
const isOwner = ref<boolean>(false)

watch(
  () => user.value?.id,
  async (newIdValue) => {
    if (newIdValue) {
      const res = await axios.get(`http://localhost:8000/api/user/${newIdValue}`)
      isOwner.value = res.data.role === 'owner'
    }
  }
)

const selectedKeys = computed(() => {
  switch (router.path) {
    case '/explore':
      return ['1']
    case '/savings':
      return ['2']
    case '/booking-history':
      return ['3']
    case '/room-manager':
      return ['4']
    default:
      return ['1']
  }
})
const collapsed = ref<boolean>(false)
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
