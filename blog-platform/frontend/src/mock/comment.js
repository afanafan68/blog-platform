// ------------------------------------------------------
// src/mock/comment.js - 评论模块 Mock
// ------------------------------------------------------
import Mock from 'mockjs'
import { users } from './auth'

const Random = Mock.Random

// 生成评论数据
const generateComments = () => {
  const comments = []
  for (let blogId = 1; blogId <= 30; blogId++) {
    const commentCount = Random.integer(0, 10)
    for (let i = 0; i < commentCount; i++) {
      const user = users[Random.integer(0, users.length - 1)]
      comments.push({
        id: comments.length + 1,
        blogId,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar
        },
        content: Random.cparagraph(1, 3),
        likeCount: Random.integer(0, 50),
        parentId: null,
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
      })
    }
  }
  return comments
}

let comments = generateComments()

// 获取博客评论
Mock.mock(/\/api\/comment\/blog\/\d+/, 'get', (options) => {
  const blogId = parseInt(options.url.match(/\/api\/comment\/blog\/(\d+)/)[1])
  const blogComments = comments.filter(c => c.blogId === blogId)

  return {
    code: 200,
    message: 'success',
    data: blogComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// 发表评论
Mock.mock(/\/api\/comment$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const user = users[0]

  const newComment = {
    id: comments.length + 1,
    blogId: body.blogId,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar
    },
    content: body.content,
    likeCount: 0,
    parentId: body.parentId || null,
    createdAt: new Date().toISOString()
  }

  comments.push(newComment)

  return {
    code: 200,
    message: '评论成功',
    data: newComment
  }
})

// 删除评论
Mock.mock(/\/api\/comment\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/comment\/(\d+)/)[1])
  const index = comments.findIndex(c => c.id === id)

  if (index > -1) {
    comments.splice(index, 1)
  }

  return {
    code: 200,
    message: '删除成功',
    data: null
  }
})

// 点赞评论
Mock.mock(/\/api\/comment\/\d+\/like/, 'post', (options) => {
  const id = parseInt(options.url.match(/\/api\/comment\/(\d+)\/like/)[1])
  const comment = comments.find(c => c.id === id)

  if (comment) {
    comment.likeCount++
  }

  return {
    code: 200,
    message: '点赞成功',
    data: null
  }
})

// 上传图片
Mock.mock(/\/api\/upload\/image/, 'post', () => {
  return {
    code: 200,
    message: '上传成功',
    data: {
      url: Random.image('800x600', Random.color(), '#FFF', 'Image')
    }
  }
})
