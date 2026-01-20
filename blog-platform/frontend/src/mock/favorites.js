// src/mock/favorites.js - 收藏模块 Mock 数据
import Mock from 'mockjs'

// 收藏标签列表
const favoritesTags = [
  { id: 1, name: '前端', count: 3 },
  { id: 2, name: '编译原理', count: 2 },
  { id: 3, name: '操作系统', count: 1 },
  { id: 4, name: 'mysql', count: 2 },
  { id: 5, name: 'HarmonyOS', count: 1 },
  { id: 6, name: '数据结构', count: 2 },
  { id: 7, name: 'C++', count: 1 },
  { id: 8, name: 'Java', count: 3 },
  { id: 9, name: '深度学习', count: 2 },
  { id: 10, name: '计算机视觉', count: 2 },
  { id: 11, name: 'conda', count: 1 },
  { id: 12, name: 'html', count: 1 },
  { id: 13, name: 'python', count: 2 },
  { id: 14, name: '默认收藏夹', count: 3 }
]

// 收藏的博客数据（基于资料提供.md中的真实内容）
const favoritesBlogs = [
  // 前端
  {
    id: 101,
    title: '前端学习路线与技术栈详解',
    summary: '本文详细介绍了前端开发的学习路线，包括HTML/CSS基础、JavaScript进阶、Vue/React框架学习等内容，适合初学者参考。',
    content: `# 前端学习路线与技术栈详解

## 一、基础阶段

### 1. HTML5
- 语义化标签：header、nav、main、article、section、footer
- 表单增强：新增input类型（email、date、range等）
- 本地存储：localStorage、sessionStorage
- Canvas绘图：2D绑bindbindbindbindbindbindbindbindbindbindbindbing图、动画

### 2. CSS3
- Flexbox布局：弹性盒子模型
- Grid布局：二维网格系统
- 动画与过渡：transition、animation
- 响应式设计：媒体查询、rem/vw单位

### 3. JavaScript
- ES6+语法：let/const、箭头函数、解构赋值
- DOM操作：节点操作、事件委托
- 异步编程：Promise、async/await

## 二、框架阶段

### Vue.js 3
\`\`\`javascript
// 组合式API示例
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return { count, double }
  }
}
\`\`\`

### React 18
\`\`\`jsx
import { useState, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = \`Count: \${count}\`
  }, [count])
  
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

## 三、工程化

- **构建工具**：Vite、Webpack
- **代码规范**：ESLint、Prettier
- **版本控制**：Git
- **CI/CD**：GitHub Actions`,
    coverImage: 'https://picsum.photos/seed/frontend/400/200',
    viewCount: 1520,
    likeCount: 89,
    createTime: '2026-01-10T10:00:00',
    author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' },
    category: { id: 1, name: '前端开发' },
    tags: [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'Vue' }],
    favoriteTag: '前端'
  },
  {
    id: 102,
    title: 'HTML5新特性与语义化标签',
    summary: '深入了解HTML5的新特性，包括语义化标签、表单增强、本地存储、Canvas绘图等核心内容。',
    coverImage: 'https://picsum.photos/seed/html5/400/200',
    viewCount: 980,
    likeCount: 56,
    createTime: '2026-01-08T14:30:00',
    author: { id: 2, nickname: '码农小李', avatar: 'https://picsum.photos/seed/user2/100/100' },
    category: { id: 1, name: '前端开发' },
    tags: [{ id: 3, name: 'HTML5' }],
    favoriteTag: 'html'
  },
  {
    id: 103,
    title: 'CSS Flexbox与Grid布局实战',
    summary: '详细讲解CSS Flexbox和Grid两种现代布局方式的使用方法和应用场景。',
    coverImage: 'https://picsum.photos/seed/css/400/200',
    viewCount: 1230,
    likeCount: 78,
    createTime: '2026-01-05T09:15:00',
    author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' },
    category: { id: 1, name: '前端开发' },
    tags: [{ id: 4, name: 'CSS' }],
    favoriteTag: '前端'
  },

  // 编译原理
  {
    id: 201,
    title: '编译原理词法分析器实现',
    summary: '介绍词法分析的基本原理，使用有限自动机实现一个简单的词法分析器，包括正则表达式到NFA的转换。',
    coverImage: 'https://picsum.photos/seed/compiler1/400/200',
    viewCount: 756,
    likeCount: 45,
    createTime: '2026-01-12T16:00:00',
    author: { id: 3, nickname: '编译器爱好者', avatar: 'https://picsum.photos/seed/user3/100/100' },
    category: { id: 2, name: '计算机基础' },
    tags: [{ id: 5, name: '编译原理' }],
    favoriteTag: '编译原理'
  },
  {
    id: 202,
    title: '语法分析与抽象语法树构建',
    summary: '深入讲解LL(1)和LR语法分析算法，以及如何构建抽象语法树（AST）。',
    coverImage: 'https://picsum.photos/seed/compiler2/400/200',
    viewCount: 623,
    likeCount: 38,
    createTime: '2026-01-11T11:20:00',
    author: { id: 3, nickname: '编译器爱好者', avatar: 'https://picsum.photos/seed/user3/100/100' },
    category: { id: 2, name: '计算机基础' },
    tags: [{ id: 5, name: '编译原理' }],
    favoriteTag: '编译原理'
  },

  // 操作系统
  {
    id: 301,
    title: 'Xv6页表机制详解',
    summary: '深入分析Xv6操作系统的页表实现，理解虚拟内存映射、多级页表结构和页表项格式。',
    coverImage: 'https://picsum.photos/seed/xv6/400/200',
    viewCount: 892,
    likeCount: 67,
    createTime: '2026-01-09T08:45:00',
    author: { id: 4, nickname: 'OS研究者', avatar: 'https://picsum.photos/seed/user4/100/100' },
    category: { id: 2, name: '计算机基础' },
    tags: [{ id: 6, name: '操作系统' }, { id: 7, name: 'Xv6' }],
    favoriteTag: '操作系统'
  },

  // MySQL
  {
    id: 401,
    title: 'MySQL常用命令与操作指南',
    summary: '整理MySQL数据库的常用命令，包括数据库操作、表操作、数据增删改查、索引管理等内容。',
    coverImage: 'https://picsum.photos/seed/mysql1/400/200',
    viewCount: 2150,
    likeCount: 156,
    createTime: '2026-01-07T13:00:00',
    author: { id: 5, nickname: 'DBA老张', avatar: 'https://picsum.photos/seed/user5/100/100' },
    category: { id: 3, name: '数据库' },
    tags: [{ id: 8, name: 'MySQL' }, { id: 9, name: 'SQL' }],
    favoriteTag: 'mysql'
  },
  {
    id: 402,
    title: 'JDBC数据库连接池配置与优化',
    summary: '详细介绍Java JDBC连接数据库的方法，以及如何配置和优化数据库连接池。',
    coverImage: 'https://picsum.photos/seed/jdbc/400/200',
    viewCount: 1340,
    likeCount: 89,
    createTime: '2026-01-06T15:30:00',
    author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' },
    category: { id: 3, name: '数据库' },
    tags: [{ id: 10, name: 'JDBC' }, { id: 11, name: 'Java' }],
    favoriteTag: 'mysql'
  },

  // HarmonyOS
  {
    id: 501,
    title: 'HarmonyOS应用开发入门',
    summary: '介绍HarmonyOS的基本概念、开发环境搭建、第一个Hello World应用的创建过程。',
    coverImage: 'https://picsum.photos/seed/harmony/400/200',
    viewCount: 1680,
    likeCount: 123,
    createTime: '2026-01-13T10:00:00',
    author: { id: 7, nickname: '鸿蒙开发者', avatar: 'https://picsum.photos/seed/user7/100/100' },
    category: { id: 4, name: '移动开发' },
    tags: [{ id: 12, name: 'HarmonyOS' }, { id: 13, name: 'ArkTS' }],
    favoriteTag: 'HarmonyOS'
  },

  // 数据结构
  {
    id: 601,
    title: 'LeetCode栈与队列经典题解',
    summary: '精选LeetCode中关于栈和队列的经典题目，包括有效的括号、最小栈、滑动窗口最大值等。',
    coverImage: 'https://picsum.photos/seed/leetcode1/400/200',
    viewCount: 2340,
    likeCount: 189,
    createTime: '2026-01-04T11:00:00',
    author: { id: 8, nickname: '算法大师', avatar: 'https://picsum.photos/seed/user8/100/100' },
    category: { id: 5, name: '算法' },
    tags: [{ id: 14, name: '数据结构' }, { id: 15, name: 'LeetCode' }],
    favoriteTag: '数据结构'
  },
  {
    id: 602,
    title: '线性插值算法原理与应用',
    summary: '详解线性插值的数学原理，以及在图形学、信号处理等领域的实际应用。',
    coverImage: 'https://picsum.photos/seed/interpolation/400/200',
    viewCount: 567,
    likeCount: 34,
    createTime: '2026-01-03T14:20:00',
    author: { id: 8, nickname: '算法大师', avatar: 'https://picsum.photos/seed/user8/100/100' },
    category: { id: 5, name: '算法' },
    tags: [{ id: 16, name: '算法' }],
    favoriteTag: '数据结构'
  },

  // C++
  {
    id: 701,
    title: 'C++智能指针详解',
    summary: '深入讲解C++11中的智能指针：unique_ptr、shared_ptr和weak_ptr的使用方法和应用场景。',
    coverImage: 'https://picsum.photos/seed/cpp/400/200',
    viewCount: 1890,
    likeCount: 145,
    createTime: '2026-01-02T09:00:00',
    author: { id: 9, nickname: 'C++大佬', avatar: 'https://picsum.photos/seed/user9/100/100' },
    category: { id: 6, name: '编程语言' },
    tags: [{ id: 17, name: 'C++' }, { id: 18, name: '内存管理' }],
    favoriteTag: 'C++'
  },

  // Java
  {
    id: 801,
    title: 'Java AWT布局管理器详解',
    summary: '详细介绍Java AWT的五种布局管理器：FlowLayout、BorderLayout、GridLayout、CardLayout和GridBagLayout。',
    coverImage: 'https://picsum.photos/seed/java1/400/200',
    viewCount: 1120,
    likeCount: 67,
    createTime: '2026-01-01T16:00:00',
    author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' },
    category: { id: 6, name: '编程语言' },
    tags: [{ id: 11, name: 'Java' }, { id: 19, name: 'AWT' }],
    favoriteTag: 'Java'
  },
  {
    id: 802,
    title: 'Java虚拟线程实战指南',
    summary: '介绍Java 21中的虚拟线程特性，以及如何使用虚拟线程提升并发程序性能。',
    coverImage: 'https://picsum.photos/seed/java2/400/200',
    viewCount: 2560,
    likeCount: 234,
    createTime: '2025-12-28T10:30:00',
    author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' },
    category: { id: 6, name: '编程语言' },
    tags: [{ id: 11, name: 'Java' }, { id: 20, name: '并发' }],
    favoriteTag: 'Java'
  },
  {
    id: 803,
    title: 'Spring Boot快速入门',
    summary: '从零开始搭建Spring Boot项目，学习自动配置、依赖注入、RESTful API开发等核心内容。',
    coverImage: 'https://picsum.photos/seed/springboot/400/200',
    viewCount: 3450,
    likeCount: 289,
    createTime: '2025-12-25T08:00:00',
    author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' },
    category: { id: 7, name: '后端开发' },
    tags: [{ id: 11, name: 'Java' }, { id: 21, name: 'Spring Boot' }],
    favoriteTag: 'Java'
  },

  // 深度学习
  {
    id: 901,
    title: '注意力机制原理与实现',
    summary: '深入讲解Transformer中的注意力机制，包括自注意力、多头注意力的数学原理和PyTorch实现。',
    coverImage: 'https://picsum.photos/seed/attention/400/200',
    viewCount: 3120,
    likeCount: 267,
    createTime: '2025-12-20T11:00:00',
    author: { id: 10, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user10/100/100' },
    category: { id: 8, name: '人工智能' },
    tags: [{ id: 22, name: '深度学习' }, { id: 23, name: 'Transformer' }],
    favoriteTag: '深度学习'
  },
  {
    id: 902,
    title: 'PyTorch神经网络训练技巧',
    summary: '分享深度学习模型训练的实用技巧，包括学习率调度、数据增强、正则化等方法。',
    coverImage: 'https://picsum.photos/seed/pytorch/400/200',
    viewCount: 2780,
    likeCount: 198,
    createTime: '2025-12-18T14:00:00',
    author: { id: 10, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user10/100/100' },
    category: { id: 8, name: '人工智能' },
    tags: [{ id: 22, name: '深度学习' }, { id: 24, name: 'PyTorch' }],
    favoriteTag: '深度学习'
  },

  // 计算机视觉
  {
    id: 1001,
    title: 'OpenPose + ST-GCN人体动作识别',
    summary: '介绍如何使用OpenPose进行人体姿态估计，并结合ST-GCN进行动作识别，包括完整的环境配置和代码实现。',
    coverImage: 'https://picsum.photos/seed/openpose/400/200',
    viewCount: 1890,
    likeCount: 145,
    createTime: '2025-12-15T09:30:00',
    author: { id: 11, nickname: 'CV工程师', avatar: 'https://picsum.photos/seed/user11/100/100' },
    category: { id: 8, name: '人工智能' },
    tags: [{ id: 25, name: '计算机视觉' }, { id: 26, name: '姿态估计' }],
    favoriteTag: '计算机视觉'
  },
  {
    id: 1002,
    title: 'Label Studio标注工具使用指南',
    summary: '详细介绍Label Studio数据标注工具的安装、配置和使用方法，解决常见问题。',
    coverImage: 'https://picsum.photos/seed/labelstudio/400/200',
    viewCount: 1234,
    likeCount: 89,
    createTime: '2025-12-12T16:45:00',
    author: { id: 11, nickname: 'CV工程师', avatar: 'https://picsum.photos/seed/user11/100/100' },
    category: { id: 8, name: '人工智能' },
    tags: [{ id: 25, name: '计算机视觉' }, { id: 27, name: '数据标注' }],
    favoriteTag: '计算机视觉'
  },

  // Conda
  {
    id: 1101,
    title: 'Conda环境管理完全指南',
    summary: '详细介绍Conda的安装、环境创建、包管理、环境导出等常用操作，解决环境配置问题。',
    coverImage: 'https://picsum.photos/seed/conda/400/200',
    viewCount: 4560,
    likeCount: 345,
    createTime: '2025-12-10T10:00:00',
    author: { id: 10, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user10/100/100' },
    category: { id: 9, name: '开发工具' },
    tags: [{ id: 28, name: 'Conda' }, { id: 29, name: 'Python' }],
    favoriteTag: 'conda'
  },

  // Python
  {
    id: 1201,
    title: 'Python爬虫实战教程',
    summary: '从零开始学习Python爬虫，包括requests、BeautifulSoup、Scrapy框架的使用方法。',
    coverImage: 'https://picsum.photos/seed/crawler/400/200',
    viewCount: 5670,
    likeCount: 456,
    createTime: '2025-12-08T11:30:00',
    author: { id: 12, nickname: 'Python大神', avatar: 'https://picsum.photos/seed/user12/100/100' },
    category: { id: 6, name: '编程语言' },
    tags: [{ id: 29, name: 'Python' }, { id: 30, name: '爬虫' }],
    favoriteTag: 'python'
  },
  {
    id: 1202,
    title: 'grep命令高级用法',
    summary: '详解Linux grep命令的高级用法，包括正则表达式、递归搜索、上下文显示等技巧。',
    coverImage: 'https://picsum.photos/seed/grep/400/200',
    viewCount: 890,
    likeCount: 56,
    createTime: '2025-12-05T15:00:00',
    author: { id: 4, nickname: 'OS研究者', avatar: 'https://picsum.photos/seed/user4/100/100' },
    category: { id: 9, name: '开发工具' },
    tags: [{ id: 31, name: 'Linux' }, { id: 32, name: '命令行' }],
    favoriteTag: 'python'
  },

  // 默认收藏夹
  {
    id: 1301,
    title: 'Git版本控制最佳实践',
    summary: '介绍Git工作流、分支管理策略、提交规范等最佳实践，提升团队协作效率。',
    coverImage: 'https://picsum.photos/seed/git/400/200',
    viewCount: 3450,
    likeCount: 278,
    createTime: '2025-12-01T09:00:00',
    author: { id: 13, nickname: 'DevOps工程师', avatar: 'https://picsum.photos/seed/user13/100/100' },
    category: { id: 9, name: '开发工具' },
    tags: [{ id: 33, name: 'Git' }, { id: 34, name: '版本控制' }],
    favoriteTag: '默认收藏夹'
  },
  {
    id: 1302,
    title: 'VS Code插件推荐与配置',
    summary: '推荐提升开发效率的VS Code插件，以及常用配置技巧。',
    coverImage: 'https://picsum.photos/seed/vscode/400/200',
    viewCount: 4120,
    likeCount: 334,
    createTime: '2025-11-28T14:30:00',
    author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' },
    category: { id: 9, name: '开发工具' },
    tags: [{ id: 35, name: 'VS Code' }, { id: 36, name: '工具' }],
    favoriteTag: '默认收藏夹'
  },
  {
    id: 1303,
    title: 'Markdown语法完全手册',
    summary: '详细介绍Markdown的基础语法和扩展语法，以及常用编辑器推荐。',
    coverImage: 'https://picsum.photos/seed/markdown/400/200',
    viewCount: 2890,
    likeCount: 198,
    createTime: '2025-11-25T10:00:00',
    author: { id: 2, nickname: '码农小李', avatar: 'https://picsum.photos/seed/user2/100/100' },
    category: { id: 9, name: '开发工具' },
    tags: [{ id: 37, name: 'Markdown' }],
    favoriteTag: '默认收藏夹'
  }
]

// 获取收藏标签列表
Mock.mock(/\/api\/favorites\/tags/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: favoritesTags
  }
})

// 获取收藏列表（支持按标签筛选）
Mock.mock(/\/api\/favorites\/list/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10
  const tagName = url.searchParams.get('tag') || ''

  let filteredBlogs = favoritesBlogs
  
  // 按标签筛选
  if (tagName && tagName !== '全部') {
    filteredBlogs = favoritesBlogs.filter(blog => blog.favoriteTag === tagName)
  }

  // 分页
  const start = (page - 1) * size
  const end = start + size
  const records = filteredBlogs.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      total: filteredBlogs.length,
      size: size,
      current: page,
      pages: Math.ceil(filteredBlogs.length / size),
      records: records
    }
  }
})

export { favoritesBlogs, favoritesTags }

