import { getUserInfo, login, logout, register } from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!token.value)
  // 登录
  async function doLogin(loginForm) {
    try {
      const res = await login(loginForm)
      token.value = res.data.token
      setToken(res.data.token)
      await fetchUserInfo()
      return res
    } catch (error) {
      throw error
    }
  }
  // 注册
  async function doRegister(registerForm) {
    try {
      const res = await register(registerForm)
      return res
    } catch (error) {
      throw error
    }
  }
  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
      return res
    } catch (error) {
      throw error
    }
  }
  // 登出
  async function doLogout() {
    try {
      await logout()
    } finally {
      token.value = null
      userInfo.value = null
      removeToken()
    }
  }
  // 初始化（刷新页面时）
  async function init() {
    if (token.value) {
      try {
        await fetchUserInfo()
      } catch (error) {
        token.value = null
        removeToken()
      }
    }
  }
  return {
    token,
    userInfo,
    isLoggedIn,
    doLogin,
    doRegister,
    fetchUserInfo,
    doLogout,
    init
  }
})