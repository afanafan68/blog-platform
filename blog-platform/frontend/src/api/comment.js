import request from './index'

// 获取博客评论列表
export function getComments(blogId, params) {
  return request.get(`/comment/blog/${blogId}`, { params })
}

// 发表评论
export function createComment(data) {
  return request.post('/comment', data)
}

// 删除评论
export function deleteComment(id) {
  return request.delete(`/comment/${id}`)
}

// 点赞评论
export function likeComment(id) {
  return request.post(`/comment/${id}/like`)
}
