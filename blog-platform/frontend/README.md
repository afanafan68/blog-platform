# 博客平台前端

基于 Vue 3 + Vite + Element Plus 构建的博客平台前端项目。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 组件库
- **Pinia** - Vue 状态管理
- **Vue Router** - 路由管理
- **Axios** - HTTP 请求库
- **SCSS** - CSS 预处理器
- **md-editor-v3** - Markdown 编辑器

## 项目设置

### 安装依赖

```bash
pnpm install
```

### 开发模式

#### 使用真实后端 API（默认）

```bash
pnpm dev
```

前端将通过代理将 `/api` 请求转发到 `http://localhost:8080`（后端服务）。

#### 使用 Mock 数据

如果后端服务不可用，可以使用 Mock 数据进行开发：

```bash
pnpm dev --mode mock
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 环境配置

项目支持多环境配置：

- `.env.development` - 开发环境（使用真实后端 API）
- `.env.mock` - Mock 环境（使用 Mock 数据）
- `.env.production` - 生产环境

### 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://localhost:8080` |
| `VITE_USE_MOCK` | 是否启用 Mock 数据 | `false` |

## 项目结构

```
src/
├── api/          # API 接口定义
├── assets/       # 静态资源
├── components/   # 公共组件
│   ├── blog/     # 博客相关组件
│   ├── common/   # 通用组件
│   └── layout/   # 布局组件
├── mock/         # Mock 数据
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面视图
```

## API 接口

前端 API 已对接后端接口，主要包括：

### 认证模块 (`/api/auth`)
- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `POST /logout` - 用户登出
- `GET /info` - 获取当前用户信息
- `POST /refresh` - 刷新 Token

### 用户模块 (`/api/user`)
- `GET /{id}` - 获取用户信息
- `PUT /profile` - 更新个人信息
- `PUT /password` - 修改密码
- `POST /avatar` - 上传头像

### 博客模块 (`/api/blog`)
- `GET /list` - 获取博客列表
- `GET /{id}` - 获取博客详情
- `POST /` - 发表博客
- `PUT /{id}` - 更新博客
- `DELETE /{id}` - 删除博客
- `GET /search` - 搜索博客
- `GET /user/{userId}` - 获取用户的博客
- `POST /{id}/like` - 点赞博客

### 评论模块 (`/api/comment`)
- `GET /blog/{blogId}` - 获取博客评论
- `POST /` - 发表评论
- `DELETE /{id}` - 删除评论
- `POST /{id}/like` - 点赞评论

### 分类模块 (`/api/category`)
- `GET /list` - 获取分类列表
- `GET /{id}/blogs` - 获取分类下的博客

### 标签模块 (`/api/tag`)
- `GET /list` - 获取标签列表
- `GET /hot` - 获取热门标签

## 开发说明

### 切换 Mock 和真实后端

1. **使用真实后端**：确保后端服务运行在 `localhost:8080`，然后运行 `pnpm dev`
2. **使用 Mock 数据**：运行 `pnpm dev --mode mock`

### 代理配置

在 `vite.config.js` 中配置了开发服务器代理：

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 注意事项

- 确保后端服务与前端的 API 路径一致
- 生产环境部署时需要配置 Nginx 反向代理
- Token 存储在 localStorage 中，key 为 `blog_token`
