<template>
  <div id="app">
    <!-- 需要布局的页面 -->
    <template v-if="showLayout">
      <AppLayout>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </AppLayout>
    </template>
    
    <!-- 不需要布局的页面（登录、注册等） -->
    <template v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  </div>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/stores/user'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()

// 不需要布局的页面路由
const noLayoutRoutes = ['/login', '/register']

const showLayout = computed(() => {
  return !noLayoutRoutes.includes(route.path)
})

onMounted(() => {
  userStore.init()
})
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
