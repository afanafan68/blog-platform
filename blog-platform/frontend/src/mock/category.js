// ------------------------------------------------------
// src/mock/category.js - 分类模块 Mock
// ------------------------------------------------------
import Mock from 'mockjs'

// 分类数据
const categories = [
  { id: 1, name: '前端开发', description: 'HTML、CSS、JavaScript、Vue、React 等', sortOrder: 1 },
  { id: 2, name: '后端开发', description: 'Java、Python、Node.js、Go 等', sortOrder: 2 },
  { id: 3, name: '数据库', description: 'MySQL、Redis、MongoDB 等', sortOrder: 3 },
  { id: 4, name: '运维部署', description: 'Linux、Docker、K8s、CI/CD 等', sortOrder: 4 },
  { id: 5, name: '人工智能', description: '机器学习、深度学习、NLP 等', sortOrder: 5 },
  { id: 6, name: '生活随笔', description: '生活感悟、读书笔记等', sortOrder: 6 }
]

// 获取分类列表
Mock.mock(/\/api\/category\/list/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: categories
  }
})

// 获取分类下的博客
Mock.mock(/\/api\/category\/\d+\/blogs/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      list: [],
      total: 0
    }
  }
})

export { categories }
