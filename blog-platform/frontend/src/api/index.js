// ----------------------------------------------
// Axios 全局配置及拦截器
// ----------------------------------------------
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { getToken, removeToken } from '@/utils/auth'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 用于防止重复显示401错误消息
let isShowingAuthError = false

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 根据后端统一响应格式处理
    // { code: 200, message: "success", data: {} }
    if (res.code === 200) {
      return res
    }

    // 业务错误
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    console.error('Response error:', error)

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未登录或 Token 过期
          // 防止多个请求同时触发401时重复显示错误消息和重复跳转
          if (!isShowingAuthError) {
            isShowingAuthError = true
            ElMessage.error('登录已过期，请重新登录')
            // 清除用户状态（包括store中的响应式状态和localStorage中的token）
            try {
              const userStore = useUserStore()
              userStore.reset()
            } catch (e) {
              // 如果store还未初始化，直接移除token
              removeToken()
            }
            router.push('/login')
            // 延迟重置标志，允许后续正常处理
            setTimeout(() => {
              isShowingAuthError = false
            }, 2000)
          }
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error(data?.message || '服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default request
