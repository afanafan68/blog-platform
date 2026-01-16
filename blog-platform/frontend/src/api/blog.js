// ------------------------------------------------------
// 博客模块相关API
// ------------------------------------------------------
import request from './index'

/**
 * 获取博客列表（分页）
 * GET /api/blog/list
 * @param {Object} params - { page, size, categoryId, tagId, sort }
 */
export function getBlogList(params) {
  return request.get('/blog/list', { params })
}

/**
 * 获取博客详情
 * GET /api/blog/{id}
 * @param {number} id - 博客ID
 */
export function getBlogDetail(id) {
  return request.get(`/blog/${id}`)
}

/**
 * 发表博客
 * POST /api/blog
 * @param {Object} data - { title, content, summary, categoryId, tagIds, coverImage, status }
 */
export function createBlog(data) {
  return request.post('/blog', data)
}

/**
 * 更新博客
 * PUT /api/blog/{id}
 * @param {number} id - 博客ID
 * @param {Object} data - { title, content, summary, categoryId, tagIds, coverImage, status }
 */
export function updateBlog(id, data) {
  return request.put(`/blog/${id}`, data)
}

/**
 * 删除博客
 * DELETE /api/blog/{id}
 * @param {number} id - 博客ID
 */
export function deleteBlog(id) {
  return request.delete(`/blog/${id}`)
}

/**
 * 搜索博客
 * GET /api/blog/search
 * @param {Object} params - { q, page, size, categoryId, sort }
 */
export function searchBlog(params) {
  return request.get('/blog/search', { params })
}

/**
 * 获取用户的博客
 * GET /api/blog/user/{userId}
 * @param {number} userId - 用户ID
 * @param {Object} params - { page, size, status }
 */
export function getUserBlogs(userId, params) {
  return request.get(`/blog/user/${userId}`, { params })
}

/**
 * 点赞博客
 * POST /api/blog/{id}/like
 * @param {number} id - 博客ID
 */
export function likeBlog(id) {
  return request.post(`/blog/${id}/like`)
}
