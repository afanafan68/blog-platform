// ------------------------------------------------------
// mock入口
// ------------------------------------------------------
import Mock from 'mockjs'

import './auth'
import './blog'
import './category'
import './comment'
import './favorites'
import './tag'
import './user'

// 设置延迟时间，模拟真实请求
Mock.setup({
  timeout: '200-600'
})

console.log('Mock 数据已启用')

export default Mock
