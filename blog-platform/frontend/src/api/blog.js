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
 * @param {Object} params - { keyword, page, size, categoryId, sort }
 */
export function searchBlog(params) {
  // 兼容前端传入的 q 参数，转换为后端需要的 keyword
  const searchParams = { ...params }
  if (searchParams.q) {
    searchParams.keyword = searchParams.q
    delete searchParams.q
  }
  return request.get('/blog/search', { params: searchParams })
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

// ------------------------------------------------------
// 收藏相关API
// ------------------------------------------------------

/**
 * 添加收藏
 * POST /api/favorites
 * @param {Object} data - { blogId, tagName }
 */
export function addFavorite(data) {
  return request.post('/favorites', data)
}

/**
 * 取消收藏
 * DELETE /api/favorites/{blogId}
 * @param {number} blogId
 */
export function removeFavorite(blogId) {
  return request.delete(`/favorites/${blogId}`)
}

/**
 * 获取收藏标签列表
 * GET /api/favorites/tags
 */
export function getFavoriteTags() {
  return request.get('/favorites/tags')
}

/**
 * 检查是否已收藏
 * GET /api/favorites/check/{blogId}
 * @param {number} blogId
 */
export function checkFavorite(blogId) {
  return request.get(`/favorites/check/${blogId}`)
}
