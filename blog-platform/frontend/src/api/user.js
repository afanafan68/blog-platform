import request from './index'

// 获取用户信息
export function getUserInfo(id) {
  return request.get(`/user/${id}`)
}

// 获取用户统计数据
export function getUserStats() {
  return request.get('/user/stats')
}

// 更新个人资料
export function updateProfile(data) {
  return request.put('/user/profile', data)
}

// 修改密码
export function updatePassword(data) {
  return request.put('/user/password', data)
}

// 注销账号
export function deleteAccount(data) {
  return request.post('/user/delete', data)
}
