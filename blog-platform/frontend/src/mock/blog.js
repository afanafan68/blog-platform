// ------------------------------------------------------
// src/mock/blog.js - 博客模块 Mock
// ------------------------------------------------------
import Mock from 'mockjs'
import { users } from './auth'
import { categories } from './category'
import { tags } from './tag'

const Random = Mock.Random

// 生成博客列表数据
const generateBlogs = (count = 30) => {
  const blogs = []
  for (let i = 1; i <= count; i++) {
    const author = users[Random.integer(0, users.length - 1)]
    const category = categories[Random.integer(0, categories.length - 1)]
    const blogTags = Random.pick(tags, Random.integer(1, 4))
    
    blogs.push({
      id: i,
      title: Random.ctitle(10, 30),
      summary: Random.cparagraph(2, 4),
      content: `# ${Random.ctitle(5, 15)}\n\n${Random.cparagraph(5, 10)}\n\n## ${Random.ctitle(3, 8)}\n\n${Random.cparagraph(3, 6)}\n\n\`\`\`javascript\nconst hello = () => {\n  console.log('Hello World!');\n};\n\`\`\`\n\n${Random.cparagraph(4, 8)}`,
      coverImage: Random.boolean() ? Random.image('800x450', Random.color(), '#FFF', 'Blog') : '',
      categoryId: category.id,
      categoryName: category.name,
      tags: blogTags,
      author: {
        id: author.id,
        nickname: author.nickname,
        avatar: author.avatar
      },
      viewCount: Random.integer(100, 10000),
      likeCount: Random.integer(10, 500),
      commentCount: Random.integer(0, 100),
      status: 1,
      isTop: i <= 2 ? 1 : 0,
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  // 按创建时间倒序
  return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

let blogs = generateBlogs(30)

// 获取博客列表
Mock.mock(/\/api\/blog\/list/, 'get', (options) => {
  const url = new URL('http://mock.com' + options.url)
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10
  const categoryId = url.searchParams.get('categoryId')

  let filteredBlogs = blogs.filter(b => b.status === 1)

  // 分类筛选
  if (categoryId) {
    filteredBlogs = filteredBlogs.filter(b => b.categoryId === parseInt(categoryId))
  }

  const total = filteredBlogs.length
  const start = (page - 1) * size
  const list = filteredBlogs.slice(start, start + size)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
      page,
      size
    }
  }
})

// 获取博客详情
Mock.mock(/\/api\/blog\/\d+$/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)/)[1])
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return {
      code: 404,
      message: '文章不存在',
      data: null
    }
  }

  // 增加浏览量
  blog.viewCount++

  return {
    code: 200,
    message: 'success',
    data: blog
  }
})

// 发表博客
Mock.mock(/\/api\/blog$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const author = users[0]
  const category = categories.find(c => c.id === body.categoryId)

  const newBlog = {
    id: blogs.length + 1,
    title: body.title,
    summary: body.summary || body.content.substring(0, 150),
    content: body.content,
    coverImage: body.coverImage || '',
    categoryId: body.categoryId,
    categoryName: category?.name || '',
    tags: body.tagIds?.map(id => tags.find(t => t.id === id)).filter(Boolean) || [],
    author: {
      id: author.id,
      nickname: author.nickname,
      avatar: author.avatar
    },
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    status: body.status || 0,
    isTop: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  blogs.unshift(newBlog)

  return {
    code: 200,
    message: body.status === 1 ? '发布成功' : '保存成功',
    data: { id: newBlog.id }
  }
})

// 更新博客
Mock.mock(/\/api\/blog\/\d+$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return {
      code: 404,
      message: '文章不存在',
      data: null
    }
  }

  const category = categories.find(c => c.id === body.categoryId)

  Object.assign(blog, {
    title: body.title,
    summary: body.summary || body.content.substring(0, 150),
    content: body.content,
    coverImage: body.coverImage || blog.coverImage,
    categoryId: body.categoryId,
    categoryName: category?.name || blog.categoryName,
    tags: body.tagIds?.map(id => tags.find(t => t.id === id)).filter(Boolean) || blog.tags,
    status: body.status ?? blog.status,
    updatedAt: new Date().toISOString()
  })

  return {
    code: 200,
    message: '更新成功',
    data: null
  }
})

// 删除博客
Mock.mock(/\/api\/blog\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)/)[1])
  const index = blogs.findIndex(b => b.id === id)

  if (index === -1) {
    return {
      code: 404,
      message: '文章不存在',
      data: null
    }
  }

  blogs.splice(index, 1)

  return {
    code: 200,
    message: '删除成功',
    data: null
  }
})

// 搜索博客
Mock.mock(/\/api\/blog\/search/, 'get', (options) => {
  const url = new URL('http://mock.com' + options.url)
  const q = url.searchParams.get('q') || ''
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10
  const categoryId = url.searchParams.get('categoryId')
  const sort = url.searchParams.get('sort') || 'time'

  let filteredBlogs = blogs.filter(b => 
    b.status === 1 && 
    (b.title.includes(q) || b.summary.includes(q) || b.content.includes(q))
  )

  // 分类筛选
  if (categoryId) {
    filteredBlogs = filteredBlogs.filter(b => b.categoryId === parseInt(categoryId))
  }

  // 排序
  if (sort === 'views') {
    filteredBlogs.sort((a, b) => b.viewCount - a.viewCount)
  } else if (sort === 'likes') {
    filteredBlogs.sort((a, b) => b.likeCount - a.likeCount)
  }

  const total = filteredBlogs.length
  const start = (page - 1) * size
  const list = filteredBlogs.slice(start, start + size)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
      page,
      size
    }
  }
})

// 获取用户的博客
Mock.mock(/\/api\/blog\/user\/\d+/, 'get', (options) => {
  const url = new URL('http://mock.com' + options.url)
  const userId = parseInt(options.url.match(/\/api\/blog\/user\/(\d+)/)[1])
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10
  const status = url.searchParams.get('status')

  let filteredBlogs = blogs.filter(b => b.author.id === userId)

  if (status !== null && status !== undefined && status !== '') {
    filteredBlogs = filteredBlogs.filter(b => b.status === parseInt(status))
  }

  const total = filteredBlogs.length
  const start = (page - 1) * size
  const list = filteredBlogs.slice(start, start + size)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
      page,
      size
    }
  }
})

// 点赞博客
Mock.mock(/\/api\/blog\/\d+\/like/, 'post', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)\/like/)[1])
  const blog = blogs.find(b => b.id === id)

  if (blog) {
    blog.likeCount++
  }

  return {
    code: 200,
    message: '点赞成功',
    data: null
  }
})

export { blogs }
