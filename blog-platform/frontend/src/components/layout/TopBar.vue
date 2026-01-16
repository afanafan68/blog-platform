<!-- src/components/layout/TopBar.vue - 顶部栏 -->
<template>
  <header class="topbar">
    <!-- 移动端菜单按钮 -->
    <button class="menu-btn" @click="appStore.toggleSidebar">
      <el-icon :size="24"><Menu /></el-icon>
    </button>

    <!-- 搜索框 -->
    <div class="search-wrapper">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章..."
        :prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
        class="search-input"
      />
    </div>

    <!-- 右侧操作区 -->
    <div class="topbar-actions">
      <template v-if="userStore.isLoggedIn">
        <router-link to="/write" class="write-btn">
          <el-icon><Edit /></el-icon>
          <span class="btn-text">写文章</span>
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { Edit, Menu, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const searchKeyword = ref('')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/search', query: { q: searchKeyword.value.trim() } })
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: $sidebar-width;
  height: $header-height;
  background-color: $bg-primary;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  padding: 0 $spacing-lg;
  gap: $spacing-md;
  z-index: $z-header;
  transition: left $transition-normal;

  .sidebar.collapsed ~ & {
    left: $sidebar-collapsed-width;
  }

  @media (max-width: $breakpoint-md) {
    left: 0;
  }
}

.menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: $text-primary;
  cursor: pointer;
  border-radius: $radius-md;

  &:hover {
    background-color: $bg-secondary;
  }

  @media (max-width: $breakpoint-md) {
    display: flex;
  }
}

.search-wrapper {
  flex: 1;
  max-width: 480px;
}

.search-input {
  :deep(.el-input__wrapper) {
    border-radius: 20px;
    background-color: $bg-secondary;
    box-shadow: none !important;
    border: 1px solid transparent;

    &:hover, &.is-focus {
      background-color: $bg-primary;
      border-color: $border-color;
    }
  }
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.write-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background-color: $color-accent;
  color: $text-inverse;
  border-radius: 20px;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 500;
  transition: background-color $transition-fast;

  &:hover {
    background-color: $color-accent-hover;
  }

  .btn-text {
    @media (max-width: $breakpoint-sm) {
      display: none;
    }
  }
}
</style>
