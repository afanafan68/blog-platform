// ------------------------------------------------------
// src/mock/user.js - 用户模块 Mock
// ------------------------------------------------------
import Mock from 'mockjs'
import { users } from './auth'

const Random = Mock.Random

// 获取用户信息
Mock.mock(/\/api\/user\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/user\/(\d+)/)[1])
  const user = users.find(u => u.id === id)

  if (!user) {
    return {
      code: 404,
      message: '用户不存在',
      data: null
    }
  }

  return {
    code: 200,
    message: 'success',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    }
  }
})

// 更新个人资料
Mock.mock(/\/api\/user\/profile/, 'put', (options) => {
  const body = JSON.parse(options.body)
  const user = users[0] // 模拟当前用户

  Object.assign(user, {
    nickname: body.nickname || user.nickname,
    email: body.email || user.email,
    bio: body.bio || user.bio,
    avatar: body.avatar || user.avatar
  })

  return {
    code: 200,
    message: '更新成功',
    data: null
  }
})

// 修改密码
Mock.mock(/\/api\/user\/password/, 'put', (options) => {
  const body = JSON.parse(options.body)
  const { oldPassword, newPassword } = body
  const user = users[0] // 模拟当前用户

  if (user.password !== oldPassword) {
    return {
      code: 400,
      message: '原密码错误',
      data: null
    }
  }

  user.password = newPassword

  return {
    code: 200,
    message: '密码修改成功',
    data: null
  }
})

// 上传头像
Mock.mock(/\/api\/user\/avatar/, 'post', () => {
  return {
    code: 200,
    message: '上传成功',
    data: {
      url: Random.image('200x200', Random.color(), '#FFF', 'Avatar')
    }
  }
})

// 获取用户统计
Mock.mock(/\/api\/user\/stats/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      blogCount: Random.integer(5, 50),
      viewCount: Random.integer(1000, 50000),
      likeCount: Random.integer(100, 5000)
    }
  }
})

// 注销账号
Mock.mock(/\/api\/user\/delete/, 'post', () => {
  return {
    code: 200,
    message: '账号已注销',
    data: null
  }
})
