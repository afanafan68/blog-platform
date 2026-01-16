<!-- src/components/layout/AppLayout.vue - 整体布局组件 -->
<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': appStore.sidebarCollapsed }">
    <SideBar />
    <TopBar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { onMounted, onUnmounted } from 'vue'
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'

const appStore = useAppStore()

// 检测窗口大小
const checkMobile = () => {
  appStore.setMobile(window.innerWidth < 768)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
}

.main-content {
  margin-left: $sidebar-width;
  padding-top: $header-height;
  min-height: 100vh;
  background-color: $bg-secondary;
  transition: margin-left $transition-normal;

  .sidebar-collapsed & {
    margin-left: $sidebar-collapsed-width;
  }

  @media (max-width: $breakpoint-md) {
    margin-left: 0;
  }
}
</style>
