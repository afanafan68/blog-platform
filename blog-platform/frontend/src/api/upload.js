// ------------------------------------------------------
// 文件上传模块相关API
// ------------------------------------------------------
import request from './index'

/**
 * 上传博客封面图片
 * POST /api/blog/cover
 * @param {File} file - 图片文件
 */
export function uploadBlogCover(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/blog/cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
