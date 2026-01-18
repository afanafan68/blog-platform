<!-- src/components/layout/SideBar.vue - 左侧导航栏 -->
<template>
  <aside 
    class="sidebar" 
    :class="{ 
      collapsed: appStore.sidebarCollapsed,
      'mobile-visible': appStore.mobileSidebarVisible
    }"
  >
    <!-- Logo 区域 -->
    <div class="sidebar-header">
      <router-link to="/" class="logo" @click="handleNavClick">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span class="logo-text" v-show="!appStore.sidebarCollapsed">C-Blog</span>
      </router-link>
      
      <!-- 折叠按钮 -->
      <button class="collapse-btn" @click="appStore.toggleSidebar">
        <el-icon :size="20">
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </button>
    </div>

    <!-- 导航菜单 -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <ul class="nav-list">
          <li>
            <router-link 
              to="/" 
              class="nav-item" 
              :class="{ active: $route.path === '/' }"
              @click="handleNavClick"
            >
              <el-icon :size="20"><House /></el-icon>
              <span class="nav-text" v-show="!appStore.sidebarCollapsed">首页</span>
            </router-link>
          </li>
          <li v-if="userStore.isLoggedIn">
            <router-link 
              to="/user/profile" 
              class="nav-item" 
              :class="{ active: $route.path === '/user/profile' }"
              @click="handleNavClick"
            >
              <el-icon :size="20"><User /></el-icon>
              <span class="nav-text" v-show="!appStore.sidebarCollapsed">个人中心</span>
            </router-link>
          </li>
          <li v-if="userStore.isLoggedIn">
            <router-link 
              to="/favorites" 
              class="nav-item" 
              :class="{ active: $route.path === '/favorites' }"
              @click="handleNavClick"
            >
              <el-icon :size="20"><Star /></el-icon>
              <span class="nav-text" v-show="!appStore.sidebarCollapsed">收藏</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 登录后显示创作区 -->
      <div class="nav-section" v-if="userStore.isLoggedIn">
        <ul class="nav-list">
          <li>
            <router-link 
              to="/write" 
              class="nav-item" 
              :class="{ active: $route.path === '/write' }"
              @click="handleNavClick"
            >
              <el-icon :size="20"><Edit /></el-icon>
              <span class="nav-text" v-show="!appStore.sidebarCollapsed">写文章</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 底部用户区域 -->
    <div class="sidebar-footer">
      <template v-if="userStore.isLoggedIn">
        <div class="user-info" @click="goToProfile">
          <el-avatar :size="36" :src="userStore.avatar">
            {{ userStore.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="user-detail" v-show="!appStore.sidebarCollapsed">
            <span class="user-name">{{ userStore.nickname }}</span>
            <span class="user-email">{{ userStore.userInfo?.email }}</span>
          </div>
        </div>
        <div class="footer-actions" v-show="!appStore.sidebarCollapsed">
          <button class="action-btn" @click="goToSettings" title="设置">
            <el-icon><Setting /></el-icon>
          </button>
          <button class="action-btn" @click="handleLogout" title="退出">
            <el-icon><SwitchButton /></el-icon>
          </button>
        </div>
      </template>
    </div>
  </aside>

  <!-- 移动端遮罩 -->
  <div 
    class="sidebar-overlay" 
    v-if="appStore.mobileSidebarVisible"
    @click="appStore.closeMobileSidebar"
  ></div>
</template>

<script setup>
import { getCategories } from '@/api/category'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import {
  Edit,
  Expand,
  Fold,
  House,
  Setting,
  Star,
  SwitchButton,
  User
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const categories = ref([])
const selectedCategory = ref(null)

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 分类点击
const handleCategoryClick = (categoryId) => {
  selectedCategory.value = categoryId
  router.push({ path: '/', query: { category: categoryId } })
  appStore.closeMobileSidebar()
}

// 导航点击（移动端关闭侧边栏）
const handleNavClick = () => {
  appStore.closeMobileSidebar()
}

// 跳转到个人中心
const goToProfile = () => {
  router.push('/user/profile')
  appStore.closeMobileSidebar()
}

// 跳转到设置
const goToSettings = () => {
  router.push('/user/settings')
  appStore.closeMobileSidebar()
}

// 退出登录
const handleLogout = async () => {
  await userStore.doLogout()
  ElMessage.success('已退出登录')
  router.push('/')
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: $sidebar-width;
  background-color: $bg-sidebar;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  z-index: $z-sidebar;
  transition: width $transition-normal, transform $transition-normal;

  &.collapsed {
    width: $sidebar-collapsed-width;
  }

  @media (max-width: $breakpoint-md) {
    transform: translateX(-100%);
    
    &.mobile-visible {
      transform: translateX(0);
    }
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  height: $header-height;
  border-bottom: 1px solid $border-color-light;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-primary;
  text-decoration: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-accent;
  color: $text-inverse;
  border-radius: $radius-md;
  
  svg {
    width: 18px;
    height: 18px;
  }
}

.logo-text {
  font-size: $font-size-xl;
  font-weight: 700;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: $text-secondary;
  cursor: pointer;
  border-radius: $radius-sm;
  transition: all $transition-fast;

  &:hover {
    background-color: $bg-secondary;
    color: $text-primary;
  }

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md 0;
}

.nav-section {
  margin-bottom: $spacing-lg;
}

.nav-section-title {
  padding: 0 $spacing-md;
  margin-bottom: $spacing-sm;
  font-size: $font-size-xs;
  font-weight: 600;
  color: $text-tertiary;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  margin: 2px $spacing-sm;
  color: $text-secondary;
  text-decoration: none;
  border-radius: $radius-md;
  transition: all $transition-fast;
  cursor: pointer;

  &:hover {
    background-color: $bg-secondary;
    color: $text-primary;
  }

  &.active {
    background-color: $color-primary-light;
    color: $color-primary;
    font-weight: 500;
  }

  .collapsed & {
    justify-content: center;
    padding: $spacing-sm;
  }
}

.nav-text {
  font-size: $font-size-sm;
  white-space: nowrap;
}

.sidebar-footer {
  padding: $spacing-md;
  border-top: 1px solid $border-color-light;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:hover {
    background-color: $bg-secondary;
  }

  .collapsed & {
    justify-content: center;
    padding: $spacing-xs;
  }
}

.user-detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: $font-size-xs;
  color: $text-tertiary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-actions {
  display: flex;
  gap: $spacing-xs;
  margin-top: $spacing-sm;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm;
  background: none;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background-color: $bg-secondary;
    color: $text-primary;
  }
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-sm $spacing-md;
  background-color: $color-accent;
  color: $text-inverse;
  border-radius: $radius-md;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 500;
  transition: background-color $transition-fast;

  &:hover {
    background-color: $color-accent-hover;
  }

  .collapsed & {
    padding: $spacing-sm;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $z-overlay;

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}
</style>
