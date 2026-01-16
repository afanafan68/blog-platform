// ------------------------------------------------------
// 标签模块相关API
// ------------------------------------------------------
import request from './index'

/**
 * 获取标签列表
 * GET /api/tag/list
 */
export function getTags() {
  return request.get('/tag/list')
}

/**
 * 获取热门标签
 * GET /api/tag/hot
 */
export function getHotTags() {
  return request.get('/tag/hot')
}
