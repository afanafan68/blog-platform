# 博客平台 Docker 部署指南

本文档介绍如何使用 Docker 和 Docker Compose 部署博客平台。

## 系统要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间

## 目录结构

```
blog-platform/
├── backend/                 # 后端 Spring Boot 项目
│   ├── Dockerfile          # 后端 Dockerfile
│   ├── .dockerignore       # Docker 构建忽略文件
│   ├── blog-common/        # 公共模块
│   └── blog-server/        # 服务模块
├── frontend/               # 前端 Vue.js 项目
│   ├── Dockerfile          # 前端 Dockerfile
│   ├── .dockerignore       # Docker 构建忽略文件
│   └── nginx.conf          # Nginx 配置
├── init-db/                # 数据库初始化脚本
│   └── 01-init.sql         # 初始化 SQL
└── docker-compose.yml      # Docker Compose 配置
```

## 快速部署

### 1. 克隆项目

```bash
git clone https://github.com/afanafan68/blog-platform.git
cd blog-platform/blog-platform
```

### 2. 配置环境变量（可选）

如需自定义配置，可以创建 `.env` 文件：

```bash
# 数据库配置
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=blogplatform
MYSQL_USER=blog_user
MYSQL_PASSWORD=your_password

# JWT 密钥
JWT_SECRET_KEY=your_jwt_secret_key
```

### 3. 构建并启动服务

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 验证部署

- 前端访问: http://localhost
- 后端 API: http://localhost:8080/api/health
- 健康检查: http://localhost/health

## 服务说明

### 前端服务 (frontend)

- **端口**: 80 (映射到宿主机)
- **基础镜像**: nginx:stable-bookworm (Debian)
- **功能**: 
  - 托管 Vue.js 静态文件
  - 反向代理 API 请求到后端

### 后端服务 (backend)

- **端口**: 8080
- **基础镜像**: eclipse-temurin:21-jre-noble (Debian/Ubuntu)
- **功能**:
  - 提供 REST API
  - 处理业务逻辑

### 数据库服务 (db)

- **端口**: 3306
- **镜像**: mysql:8.0-debian
- **功能**:
  - 数据持久化存储
  - 自动执行初始化脚本

### 缓存服务 (redis)

- **端口**: 6379
- **镜像**: redis:7-bookworm (Debian)
- **功能**:
  - Session 缓存
  - 数据缓存

## 网络架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                          │
│                      (blog-network)                          │
│                                                              │
│  ┌──────────┐     ┌──────────┐     ┌────────┐    ┌───────┐ │
│  │ frontend │────▶│ backend  │────▶│   db   │    │ redis │ │
│  │ (nginx)  │     │ (spring) │────▶│(mysql) │    │       │ │
│  └────┬─────┘     └──────────┘     └────────┘    └───────┘ │
│       │                                                      │
└───────┼──────────────────────────────────────────────────────┘
        │
        ▼
   宿主机 80 端口
```

## 常用命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build

# 只重建特定服务
docker-compose up -d --build backend
```

### 日志查看

```bash
# 查看所有日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend

# 实时跟踪日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail 100
```

### 数据管理

```bash
# 进入 MySQL 容器
docker exec -it blog-mysql mysql -u blog_user -p

# 备份数据库
docker exec blog-mysql mysqldump -u root -p blogplatform > backup.sql

# 恢复数据库
docker exec -i blog-mysql mysql -u root -p blogplatform < backup.sql
```

### 清理资源

```bash
# 停止并删除容器
docker-compose down

# 停止并删除容器和数据卷
docker-compose down -v

# 清理未使用的镜像
docker image prune -f

# 清理所有未使用的资源
docker system prune -a
```

## 生产环境部署建议

### 1. 安全配置

- 修改默认数据库密码
- 使用强 JWT 密钥
- 配置 HTTPS（使用 Let's Encrypt 或其他证书）
- 限制数据库端口只在内部网络访问

### 2. 性能优化

```yaml
# docker-compose.yml 中添加资源限制
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 3. HTTPS 配置

在 nginx.conf 中添加 SSL 配置，或使用反向代理（如 Traefik、Caddy）。

### 4. 日志管理

配置日志轮转，避免日志文件过大：

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 故障排除

### 后端无法连接数据库

1. 检查数据库服务是否正常启动：`docker-compose ps db`
2. 检查数据库日志：`docker-compose logs db`
3. 确认数据库连接配置正确

### 前端无法访问后端 API

1. 检查后端服务状态：`docker-compose ps backend`
2. 验证健康检查：`curl http://localhost:8080/api/health`
3. 检查 nginx 代理配置

### 容器启动失败

1. 查看详细日志：`docker-compose logs <service-name>`
2. 检查端口占用：`netstat -tlnp | grep <port>`
3. 验证配置文件格式

## 版本信息

- 后端: Spring Boot 3.5.7, Java 21
- 前端: Vue 3.4, Vite 5.0
- 数据库: MySQL 8.0
- 缓存: Redis 7
- Web服务器: Nginx (Debian Bookworm)
