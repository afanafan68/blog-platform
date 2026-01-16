// ------------------------------------------------------
// 文件上传模块相关API
// ------------------------------------------------------
import request from './index'

/**
 * 上传图片（通用）
 * POST /api/upload/image
 * @param {File} file - 图片文件
 */
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
