// -------------------------------------
// 侧边栏与移动端状态管理 Store
// -------------------------------------
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const sidebarCollapsed = ref(false)
  
  // 是否为移动端
  const isMobile = ref(false)
  
  // 移动端侧边栏是否显示
  const mobileSidebarVisible = ref(false)

  // 切换侧边栏折叠状态
  function toggleSidebar() {
    if (isMobile.value) {
      mobileSidebarVisible.value = !mobileSidebarVisible.value
    } else {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }
  }

  // 关闭移动端侧边栏
  function closeMobileSidebar() {
    mobileSidebarVisible.value = false
  }

  // 切换移动端侧边栏
  function toggleMobileSidebar() {
    mobileSidebarVisible.value = !mobileSidebarVisible.value
  }

  // 设置移动端状态
  function setMobile(value) {
    isMobile.value = value
    if (value) {
      sidebarCollapsed.value = true
    }
  }

  return {
    sidebarCollapsed,
    isMobile,
    mobileSidebarVisible,
    toggleSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    setMobile
  }
})
