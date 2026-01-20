// --------------------------------------------
// 用户相关 API 接口
// --------------------------------------------
import request from './index'

/**
 * 获取用户信息
 * GET /api/user/{id}
 * @param {number} id - 用户ID
 */
export function getUserById(id) {
  return request.get(`/user/${id}`)
}

/**
 * 更新个人信息
 * PUT /api/user/profile
 * @param {Object} data - { nickname, email, bio, avatar }
 */
export function updateProfile(data) {
  return request.put('/user/profile', data)
}

/**
 * 修改密码
 * PUT /api/user/password
 * @param {Object} data - { oldPassword, newPassword }
 */
export function updatePassword(data) {
  return request.put('/user/password', data)
}

/**
 * 上传头像
 * POST /api/user/avatar
 * @param {File} file - 头像文件
 */
export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 注销账号（自定义接口，可选）
 * POST /api/user/delete
 * @param {Object} data - { password }
 */
export function deleteAccount(data) {
  return request.post('/user/delete', data)
}
