// ------------------------------------------------------
// 评论模块相关API
// ------------------------------------------------------
import request from './index'

/**
 * 获取博客评论
 * GET /api/comment/blog/{blogId}
 * @param {number} blogId - 博客ID
 * @param {Object} params - { page, size }
 */
export function getComments(blogId, params) {
  return request.get(`/comment/blog/${blogId}`, { params })
}

/**
 * 发表评论
 * POST /api/comment
 * @param {Object} data - { blogId, content, parentId }
 */
export function createComment(data) {
  return request.post('/comment', data)
}

/**
 * 删除评论
 * DELETE /api/comment/{id}
 * @param {number} id - 评论ID
 */
export function deleteComment(id) {
  return request.delete(`/comment/${id}`)
}

/**
 * 点赞评论
 * POST /api/comment/{id}/like
 * @param {number} id - 评论ID
 */
export function likeComment(id) {
  return request.post(`/comment/${id}/like`)
}
