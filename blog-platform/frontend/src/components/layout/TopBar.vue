<!-- src/components/layout/TopBar.vue - 顶部栏 -->
<template>
  <header class="topbar">
    <!-- 左侧区域：移动端菜单按钮 -->
    <div class="topbar-left">
      <button class="menu-btn" @click="appStore.toggleMobileSidebar">
        <el-icon :size="24"><Menu /></el-icon>
      </button>
    </div>

    <!-- 中间区域：搜索框 + 写文章按钮 -->
    <div class="topbar-center">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章..."
        :prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
        class="search-input"
      />
      <!-- 写文章按钮（已登录时显示） -->
      <router-link v-if="userStore.isLoggedIn" to="/write" class="write-btn">
        <el-icon><Edit /></el-icon>
        <span class="btn-text">写文章</span>
      </router-link>
    </div>

    <!-- 右侧操作区：登录/注册按钮 -->
    <div class="topbar-right">
      <template v-if="!userStore.isLoggedIn">
        <router-link to="/login" class="login-btn">
          登录
        </router-link>
        <router-link to="/register" class="register-btn">
          注册
        </router-link>
      </template>
      <template v-else>
        <div class="user-placeholder"></div>
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
  justify-content: space-between;
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

.topbar-left {
  display: flex;
  align-items: center;
  min-width: 50px;
}

.topbar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  max-width: 600px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  min-width: 120px;
  justify-content: flex-end;
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

.search-input {
  flex: 1;
  max-width: 400px;

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
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: $color-accent-hover;
  }

  .btn-text {
    @media (max-width: $breakpoint-sm) {
      display: none;
    }
  }
}

.login-btn {
  padding: $spacing-sm $spacing-md;
  color: $text-primary;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 500;
  border-radius: 20px;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover {
    background-color: $bg-secondary;
  }
}

.register-btn {
  padding: $spacing-sm $spacing-md;
  background-color: $color-accent;
  color: $text-inverse;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 500;
  border-radius: 20px;
  transition: background-color $transition-fast;
  white-space: nowrap;

  &:hover {
    background-color: $color-accent-hover;
  }
}

.user-placeholder {
  width: 40px;
}
</style>
