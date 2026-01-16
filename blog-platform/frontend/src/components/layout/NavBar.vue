<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <span class="logo-text">Blog</span>
      </router-link>

      <!-- 搜索框 -->
      <div class="navbar-search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章..."
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
          clearable
        />
      </div>

      <!-- 右侧菜单 -->
      <nav class="navbar-menu">
        <template v-if="userStore.isLoggedIn">
          <router-link to="/write" class="navbar-btn write-btn">
            <el-icon><Edit /></el-icon>
            <span>写文章</span>
          </router-link>

          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-avatar">
              <el-avatar :size="36" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
              </el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  个人设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <template v-else>
          <router-link to="/login" class="navbar-link">登录</router-link>
          <router-link to="/register" class="navbar-btn">注册</router-link>
        </template>
      </nav>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
        <el-icon :size="24"><Menu /></el-icon>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide">
      <div v-if="showMobileMenu" class="mobile-menu">
        <div class="mobile-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            :prefix-icon="Search"
            @keyup.enter="handleSearch"
          />
        </div>
        <template v-if="userStore.isLoggedIn">
          <router-link to="/write" class="mobile-menu-item" @click="showMobileMenu = false">
            写文章
          </router-link>
          <router-link to="/user/profile" class="mobile-menu-item" @click="showMobileMenu = false">
            个人中心
          </router-link>
          <router-link to="/user/settings" class="mobile-menu-item" @click="showMobileMenu = false">
            个人设置
          </router-link>
          <a class="mobile-menu-item" @click="handleLogout">退出登录</a>
        </template>
        <template v-else>
          <router-link to="/login" class="mobile-menu-item" @click="showMobileMenu = false">
            登录
          </router-link>
          <router-link to="/register" class="mobile-menu-item" @click="showMobileMenu = false">
            注册
          </router-link>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Edit, User, Setting, SwitchButton, Menu } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const showMobileMenu = ref(false)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
    showMobileMenu.value = false
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  await userStore.doLogout()
  ElMessage.success('已退出登录')
  router.push('/')
  showMobileMenu.value = false
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $nav-height;
  background-color: $bg-primary;
  border-bottom: 1px solid $border-color;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: $max-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.navbar-logo {
  .logo-text {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $text-primary;
  }
}

.navbar-search {
  flex: 1;
  max-width: 400px;
  margin: 0 $spacing-xl;

  @media (max-width: $breakpoint-md) {
    display: none;
  }

  :deep(.el-input__wrapper) {
    border-radius: 20px;
    background-color: $bg-secondary;
    border: none;

    &:hover, &.is-focus {
      background-color: $bg-primary;
      border: 1px solid $border-color;
    }
  }
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.navbar-link {
  padding: $spacing-sm $spacing-md;
  color: $text-secondary;
  font-size: $font-size-sm;
  transition: color $transition-fast;

  &:hover {
    color: $text-primary;
  }
}

.navbar-btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-lg;
  background-color: $color-accent;
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: 500;
  border-radius: 20px;
  transition: background-color $transition-fast;

  &:hover {
    background-color: $color-accent-hover;
    color: $text-inverse;
  }
}

.write-btn {
  background-color: transparent;
  color: $text-primary;
  border: 1px solid $border-color;

  &:hover {
    border-color: $color-accent;
    background-color: transparent;
    color: $text-primary;
  }
}

.user-avatar {
  cursor: pointer;
  transition: transform $transition-fast;

  &:hover {
    transform: scale(1.05);
  }
}

.mobile-menu-btn {
  display: none;
  padding: $spacing-sm;
  background: none;
  border: none;
  color: $text-primary;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}

.mobile-menu {
  position: absolute;
  top: $nav-height;
  left: 0;
  right: 0;
  background-color: $bg-primary;
  border-bottom: 1px solid $border-color;
  padding: $spacing-md;

  .mobile-search {
    margin-bottom: $spacing-md;
  }

  .mobile-menu-item {
    display: block;
    padding: $spacing-md;
    color: $text-primary;
    border-bottom: 1px solid $border-color-light;

    &:last-child {
      border-bottom: none;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
