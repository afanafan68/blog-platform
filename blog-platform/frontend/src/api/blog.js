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
 * @description 将博客添加到指定收藏夹。如果 tagName 对应的收藏夹不存在，后端将自动创建该收藏夹标签。
 */
export function addFavorite(data) {
  // 确保发送的数据包含 blogId 和 tagName
  const requestData = {
    blogId: data.blogId,
    tagName: data.tagName || '默认收藏夹'
  }
  return request.post('/favorites', requestData)
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
 * 获取收藏列表
 * GET /api/favorites/list
 * @param {Object} params - { page, size, tag }
 */
export function getFavoriteList(params) {
  return request.get('/favorites/list', { params })
}

/**
 * 获取收藏标签列表（收藏夹列表）
 * GET /api/favorites/tags
 * @description 获取当前用户的所有收藏夹列表，包含收藏夹ID、名称和收藏数量
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

// ------------------------------------------------------
// 收藏夹管理API（收藏文件夹）
// ------------------------------------------------------

/**
 * 创建收藏夹
 * POST /api/favorites/folder
 * @param {Object} data - { folderName }
 * @description 创建一个新的收藏夹
 */
export function createFavoriteFolder(data) {
  // 后端DTO使用驼峰命名 folderName
  const requestData = {
    folderName: data.folderName || data.folder_name || data.name
  }
  return request.post('/favorites/folder', requestData)
}

/**
 * 获取收藏夹列表
 * GET /api/favorites/folders
 * @description 获取当前用户的所有收藏夹，返回收藏文件夹主键、收藏文件夹名字
 */
export function getFavoriteFolders() {
  return request.get('/favorites/folders')
}

/**
 * 根据收藏夹名称获取博客列表
 * GET /api/favorites/folder/blog
 * @param {Object} params - { page, size, folder_name }
 * @description 获取指定收藏夹下的博客列表
 */
export function getFolderBlogs(params) {
  return request.get('/favorites/folder/blog', { params })
}
