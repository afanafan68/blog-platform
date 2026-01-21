// ---------------------------------------------
// 用户状态管理 src/user.js
// ---------------------------------------------
import { getUserInfo, login, logout, register } from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(getToken())
  const userInfo = ref(null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userId = computed(() => userInfo.value?.id)
  const username = computed(() => userInfo.value?.username)
  const nickname = computed(() => userInfo.value?.nickname || userInfo.value?.username)
  const avatar = computed(() => userInfo.value?.avatar)

  /**
   * 登录
   */
  async function doLogin(loginForm) {
    try {
      const res = await login(loginForm)
      // 后端返回格式：{ token, tokenHead, userInfo }
      const { token: newToken, userInfo: userData } = res.data
      token.value = newToken
      setToken(newToken)
      // 直接使用登录返回的用户信息
      if (userData) {
        userInfo.value = userData
      } else {
        // 如果登录响应没有包含用户信息，则单独获取
        await fetchUserInfo()
      }
      return res
    } catch (error) {
      throw error
    }
  }

  /**
   * 注册
   */
  async function doRegister(registerForm) {
    try {
      const res = await register(registerForm)
      return res
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      // API文档3.1.4：响应格式为 { code, message, data: { userInfo: {...} } }
      userInfo.value = res.data.userInfo || res.data
      return res
    } catch (error) {
      // 获取失败，清除登录状态
      token.value = null
      userInfo.value = null
      removeToken()
      throw error
    }
  }

  /**
   * 登出
   */
  async function doLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 无论成功失败，都清除本地状态
      token.value = null
      userInfo.value = null
      removeToken()
    }
  }

  /**
   * 更新用户信息（本地）
   */
  function updateUserInfo(data) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data }
    }
  }

  /**
   * 初始化（页面刷新时调用）
   */
  async function init() {
    if (token.value) {
      try {
        await fetchUserInfo()
      } catch (error) {
        console.error('Init user info failed:', error)
      }
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    token.value = null
    userInfo.value = null
    removeToken()
  }

  return {
    // 状态
    token,
    userInfo,
    // 计算属性
    isLoggedIn,
    userId,
    username,
    nickname,
    avatar,
    // 方法
    doLogin,
    doRegister,
    fetchUserInfo,
    doLogout,
    updateUserInfo,
    init,
    reset
  }
})
