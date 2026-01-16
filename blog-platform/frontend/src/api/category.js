// ------------------------------------------------------
// 分类模块相关API
// ------------------------------------------------------
import request from './index'

/**
 * 获取分类列表
 * GET /api/category/list
 */
export function getCategories() {
  return request.get('/category/list')
}

/**
 * 获取分类下的博客
 * GET /api/category/{id}/blogs
 * @param {number} id - 分类ID
 * @param {Object} params - { page, size }
 */
export function getCategoryBlogs(id, params) {
  return request.get(`/category/${id}/blogs`, { params })
}
