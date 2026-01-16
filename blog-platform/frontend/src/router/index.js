import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', guest: true }
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/views/BlogDetail.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/write',
    name: 'BlogCreate',
    component: () => import('@/views/BlogEdit.vue'),
    meta: { title: '写文章', requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'BlogEdit',
    component: () => import('@/views/BlogEdit.vue'),
    meta: { title: '编辑文章', requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/user/settings',
    name: 'UserSettings',
    component: () => import('@/views/UserSettings.vue'),
    meta: { title: '个人设置', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} | Blog Platform`
  const userStore = useUserStore()
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  // 已登录用户访问登录/注册页
  if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: 'Home' })
    return
  }
  next()
})
export default router