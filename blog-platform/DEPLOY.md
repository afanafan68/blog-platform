# 博客平台 Docker 部署指南

## 目录结构

```
blog-platform/
├── docker-compose.yml      # Docker Compose 配置
├── frontend/
│   ├── Dockerfile          # 前端 Docker 构建文件
│   ├── nginx.conf          # Nginx 配置
│   ├── .dockerignore       # Docker 构建忽略文件
│   └── ...
└── backend/                # 后端目录（待创建）
    └── Dockerfile          # 后端 Docker 构建文件（待创建）
```

## 快速开始

### 1. 前置要求

- 云服务器已安装 Docker 和 Docker Compose
- 开放端口：80（前端）、8080（后端）

### 2. 部署步骤

```bash
# 1. 克隆代码到服务器
git clone https://github.com/afanafan68/blog-platform.git
cd blog-platform

# 2. 构建并启动服务
docker-compose up -d --build

# 3. 查看服务状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

### 3. 常用命令

```bash
# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 只重启前端
docker-compose restart frontend

# 查看前端日志
docker-compose logs -f frontend

# 进入前端容器
docker exec -it blog-frontend sh
```

## 配置说明

### 前端配置 (frontend/nginx.conf)

- **端口**: 80
- **API 代理**: `/api/` → `http://backend:8080/api/`
- **静态资源缓存**: 1年
- **Gzip 压缩**: 已启用

### 后端配置（待完成）

当后端开发完成后，需要：

1. 在 `backend/` 目录创建 `Dockerfile`
2. 修改 `docker-compose.yml`，取消 backend 服务的注释并配置：
   - 构建上下文
   - 环境变量（数据库连接、JWT 密钥等）
   - 依赖服务（数据库、Redis）

### 示例后端 Dockerfile (Spring Boot)

```dockerfile
# backend/Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 环境变量

### 生产环境配置

创建 `.env` 文件用于存储敏感配置：

```bash
# .env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_min_32_chars
```

然后在 `docker-compose.yml` 中引用：

```yaml
environment:
  - DATABASE_PASSWORD=${MYSQL_PASSWORD}
  - JWT_SECRET=${JWT_SECRET}
```

## 生产环境优化

### 1. 添加 HTTPS（推荐使用 Traefik 或 Nginx 反向代理）

```yaml
# 在 docker-compose.yml 中添加 Traefik
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

### 2. 数据备份

```bash
# 备份 MySQL 数据
docker exec blog-mysql mysqldump -u root -p blog_platform > backup.sql

# 恢复数据
docker exec -i blog-mysql mysql -u root -p blog_platform < backup.sql
```

### 3. 日志管理

```yaml
# 在 docker-compose.yml 中配置日志
services:
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 故障排除

### 前端无法访问

```bash
# 检查容器状态
docker-compose ps

# 检查 Nginx 配置
docker exec blog-frontend nginx -t

# 查看 Nginx 错误日志
docker exec blog-frontend cat /var/log/nginx/error.log
```

### API 请求失败

1. 确认后端服务正在运行
2. 检查网络连接：`docker exec blog-frontend ping backend`
3. 检查后端日志：`docker-compose logs backend`

### 构建失败

```bash
# 清除 Docker 缓存重新构建
docker-compose build --no-cache

# 检查磁盘空间
df -h

# 清理未使用的 Docker 资源
docker system prune -a
```

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并启动
docker-compose up -d --build

# 3. 清理旧镜像（可选）
docker image prune -f
