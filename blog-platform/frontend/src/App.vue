<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
onMounted(() => {
  userStore.init()
})
</script>
<style lang="scss" scoped>
.main-content {
  min-height: calc(100vh - #{$nav-height} - 200px);
  padding-top: $nav-height;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>