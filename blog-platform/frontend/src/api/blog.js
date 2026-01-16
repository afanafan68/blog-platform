import request from './index'
// 获取博客列表
export function getBlogList(params) {
  return request.get('/blog/list', { params })
}
// 获取博客详情
export function getBlogDetail(id) {
  return request.get(`/blog/${id}`)
}
// 创建博客
export function createBlog(data) {
  return request.post('/blog', data)
}
// 更新博客
export function updateBlog(id, data) {
  return request.put(`/blog/${id}`, data)
}
// 删除博客
export function deleteBlog(id) {
  return request.delete(`/blog/${id}`)
}
// 搜索博客
export function searchBlog(params) {
  return request.get('/blog/search', { params })
}
// 获取用户的博客
export function getUserBlogs(userId, params) {
  return request.get(`/blog/user/${userId}`, { params })
}
// 获取分类列表
export function getCategories() {
  return request.get('/category/list')
}
// 获取标签列表
export function getTags() {
  return request.get('/tag/list')
}