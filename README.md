# 博客平台系统

中级软件实作课程项目

## 项目结构

├── blog-platform/          # 博客平台源码

│   ├── frontend/           # 前端代码

│   └── backend/            # 后端代码（待开发）

└── docs/                   # 项目文档

## 项目结构

### 环境要求

\- Node.js 18+

\- pnpm 8+

\- JDK 17+

\- MySQL 8.0+

\- Redis 7+

## 快速开始

### 前端

```bash
cd blog-platform/frontend
npm install
npm run dev
```

### 启动开发服务器

pnpm dev

### 访问地址

前端页面：http://localhost:5173

后端接口：http://localhost:8080

API文档：http://localhost:8080/doc.html

### 测试账号

| 用户名 | 密码   | 角色     |
| ------ | ------ | -------- |
| admin  | 123456 | 管理员   |
| tmt    | 123456 | 普通用户 |

##  团队成员

- tmt、buzhii、Lodestar

## License

MIT

```bash
## 步骤四：首次提交
```bash
# 添加所有文件
git add .
# 查看将要提交的文件
git status
# 首次提交
git commit -m "init: 初始化博客平台项目
- 添加前端基础代码
- 添加项目技术文档
- 配置 .gitignore"