// ----------------------------------------------
// 用户认证模块相关 API
// ----------------------------------------------
import request from './index'

/**
 * 用户注册
 * POST /api/auth/register
 * @param {Object} data - { username, email, password }
 */
export function register(data) {
  return request.post('/auth/register', data)
}

/**
 * 用户登录
 * POST /api/auth/login
 * @param {Object} data - { username, password }
 */
export function login(data) {
  return request.post('/auth/login', data)
}

/**
 * 用户登出
 * POST /api/auth/logout
 */
export function logout() {
  return request.post('/auth/logout')
}

/**
 * 获取当前用户信息
 * GET /api/auth/info
 */
export function getUserInfo() {
  return request.get('/auth/info')
}

/**
 * 刷新 Token
 * POST /api/auth/refresh
 */
export function refreshToken() {
  return request.post('/auth/refresh')
}
