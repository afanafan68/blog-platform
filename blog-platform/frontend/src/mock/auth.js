// ------------------------------------------------------
// src/mock/auth.js - 认证模块 Mock
// ------------------------------------------------------
import Mock from 'mockjs'

const Random = Mock.Random

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@blog.com',
    nickname: '管理员',
    avatar: Random.image('100x100', '#50B347', '#FFF', 'A'),
    bio: '系统管理员，热爱技术分享',
    role: 1,
    status: 1,
    createdAt: '2026-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'tmt',
    password: '123456',
    email: 'tmt@blog.com',
    nickname: 'TMT',
    avatar: Random.image('100x100', '#4A7BF7', '#FFF', 'Z'),
    bio: '前端开发工程师',
    role: 0,
    status: 1,
    createdAt: '2026-01-15 10:30:00'
  },
  {
    id: 3,
    username: 'buzhii',
    password: '123456',
    email: 'buzhii@blog.com',
    nickname: 'buzhii_',
    avatar: Random.image('100x100', '#F74A4A', '#FFF', 'L'),
    bio: '后端开发工程师，专注于 Java 技术栈',
    role: 0,
    status: 1,
    createdAt: '2026-02-01 14:20:00'
  }
]

// 当前登录用户
let currentUser = null

// 用户注册
Mock.mock(/\/api\/auth\/register/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const { username, email, password } = body

  // 检查用户名是否存在
  if (users.find(u => u.username === username)) {
    return {
      code: 400,
      message: '用户名已存在',
      data: null
    }
  }

  // 检查邮箱是否存在
  if (users.find(u => u.email === email)) {
    return {
      code: 400,
      message: '邮箱已被注册',
      data: null
    }
  }

  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    password,
    email,
    nickname: username,
    avatar: Random.image('100x100', Random.color(), '#FFF', username.charAt(0).toUpperCase()),
    bio: '',
    role: 0,
    status: 1,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)

  return {
    code: 200,
    message: '注册成功',
    data: { id: newUser.id }
  }
})

// 用户登录
Mock.mock(/\/api\/auth\/login/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const { username, password } = body

  const user = users.find(u => (u.username === username || u.email === username) && u.password === password)

  if (!user) {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null
    }
  }

  if (user.status === 0) {
    return {
      code: 403,
      message: '账号已被禁用',
      data: null
    }
  }

  currentUser = user

  return {
    code: 200,
    message: '登录成功',
    data: {
      token: `mock_token_${user.id}_${Date.now()}`
    }
  }
})

// 用户登出
Mock.mock(/\/api\/auth\/logout/, 'post', () => {
  currentUser = null
  return {
    code: 200,
    message: '登出成功',
    data: null
  }
})

// 获取当前用户信息
Mock.mock(/\/api\/auth\/info/, 'get', () => {
  // 模拟已登录状态（默认返回第一个用户）
  const user = currentUser || users[0]

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
      role: user.role,
      createdAt: user.createdAt
    }
  }
})

// 刷新 Token
Mock.mock(/\/api\/auth\/refresh/, 'post', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      token: `mock_token_refresh_${Date.now()}`
    }
  }
})

export { users }
