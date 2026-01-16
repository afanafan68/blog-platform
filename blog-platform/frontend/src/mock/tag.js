// ------------------------------------------------------
// src/mock/tag.js - 标签模块 Mock
// ------------------------------------------------------
import Mock from 'mockjs'

// 标签数据
const tags = [
  { id: 1, name: 'Vue3' },
  { id: 2, name: 'React' },
  { id: 3, name: 'JavaScript' },
  { id: 4, name: 'TypeScript' },
  { id: 5, name: 'Node.js' },
  { id: 6, name: 'Spring Boot' },
  { id: 7, name: 'MySQL' },
  { id: 8, name: 'Redis' },
  { id: 9, name: 'Docker' },
  { id: 10, name: 'Linux' },
  { id: 11, name: 'Git' },
  { id: 12, name: 'CSS' },
  { id: 13, name: 'HTML5' },
  { id: 14, name: 'Python' },
  { id: 15, name: 'AI' }
]

// 获取标签列表
Mock.mock(/\/api\/tag\/list/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: tags
  }
})

// 获取热门标签
Mock.mock(/\/api\/tag\/hot/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: tags.slice(0, 10)
  }
})

export { tags }
