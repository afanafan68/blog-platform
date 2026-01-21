# 博客平台 Docker 部署指南

本文档详细说明如何使用 Docker 和 Docker Compose 部署博客平台。

## 目录

- [系统要求](#系统要求)
- [项目架构](#项目架构)
- [快速部署](#快速部署)
- [详细配置](#详细配置)
- [数据持久化](#数据持久化)
- [常用命令](#常用命令)
- [故障排除](#故障排除)

## 系统要求

- **操作系统**: Debian 13 (Trixie) 或 Debian 12 (Bookworm)，也支持其他 Linux 发行版
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **内存**: 至少 4GB RAM
- **磁盘空间**: 至少 10GB 可用空间

### 安装 Docker (Debian)

```bash
# 更新包索引
sudo apt-get update

# 安装必要的包
sudo apt-get install -y ca-certificates curl gnupg

# 添加 Docker 官方 GPG 密钥
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动 Docker 服务
sudo systemctl enable docker
sudo systemctl start docker

# 将当前用户添加到 docker 组（可选，避免每次使用 sudo）
sudo usermod -aG docker $USER
```

## 项目架构

```
┌─────────────────────────────────────────────────────────────┐
│                      宿主机 (Debian 13)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                            │
│  │   用户请求   │ ──────► Port 80                            │
│  └─────────────┘                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Docker 内部网络 (blog-network)          │    │
│  │  ┌─────────────┐                                    │    │
│  │  │  Frontend   │ Nginx (反向代理)                    │    │
│  │  │  Port: 80   │                                    │    │
│  │  └──────┬──────┘                                    │    │
│  │         │ /api/* 请求                               │    │
│  │         ▼                                           │    │
│  │  ┌─────────────┐                                    │    │
│  │  │  Backend    │ Spring Boot                        │    │
│  │  │  Port: 8080 │                                    │    │
│  │  └──────┬──────┘                                    │    │
│  │         │                                           │    │
│  │    ┌────┴────┐                                      │    │
│  │    ▼         ▼                                      │    │
│  │  ┌─────┐  ┌─────┐                                   │    │
│  │  │MySQL│  │Redis│                                   │    │
│  │  │:3306│  │:6379│                                   │    │
│  │  └─────┘  └─────┘                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  数据卷:                                                    │
│  - mysql-data: MySQL 数据持久化                             │
│  - redis-data: Redis 数据持久化                             │
│  - upload-data: 上传文件持久化                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 快速部署

### 1. 克隆项目

```bash
git clone https://github.com/afanafan68/blog-platform.git
cd blog-platform/blog-platform
```

### 2. 一键部署

```bash
# 构建并启动所有服务
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 3. 访问应用

- **前端**: http://localhost
- **API 健康检查**: http://localhost/api/health

## 详细配置

### 环境变量

后端服务支持以下环境变量配置：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| SPRING_PROFILES_ACTIVE | docker | Spring 配置文件 |
| SPRING_DATASOURCE_URL | jdbc:mysql://db:3306/blogplatform... | MySQL 连接 URL |
| SPRING_DATASOURCE_USERNAME | blog_user | 数据库用户名 |
| SPRING_DATASOURCE_PASSWORD | blog_password_2024 | 数据库密码 |
| SPRING_DATA_REDIS_HOST | redis | Redis 主机名 |
| SPRING_DATA_REDIS_PORT | 6379 | Redis 端口 |
| SPRING_DATA_REDIS_DATABASE | 3 | Redis 数据库编号 |
| JWT_SECRET_KEY | - | JWT 签名密钥 |

### 修改密码

**重要**: 生产环境部署前，请修改以下默认密码：

1. 编辑 `docker-compose.yml`：
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_PASSWORD`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET_KEY`

2. 确保密码一致性：
   ```yaml
   # MySQL 服务
   db:
     environment:
       MYSQL_ROOT_PASSWORD: 你的root密码
       MYSQL_PASSWORD: 你的用户密码
   
   # 后端服务
   backend:
     environment:
       SPRING_DATASOURCE_PASSWORD: 你的用户密码  # 必须与上面 MYSQL_PASSWORD 一致
   ```

### 暴露调试端口

如需在开发环境暴露后端或数据库端口，取消相关注释：

```yaml
# docker-compose.yml
backend:
  ports:
    - "8080:8080"  # 取消注释

db:
  ports:
    - "3306:3306"  # 取消注释

redis:
  ports:
    - "6379:6379"  # 取消注释
```

## 数据持久化

项目使用 Docker 命名卷实现数据持久化：

| 卷名 | 用途 | 容器路径 |
|------|------|----------|
| mysql-data | MySQL 数据库数据 | /var/lib/mysql |
| mysql-conf | MySQL 配置文件 | /etc/mysql/conf.d |
| redis-data | Redis 缓存数据 | /data |
| upload-data | 用户上传文件 | /app/uploads |

### 备份数据

```bash
# 备份 MySQL 数据
docker exec blog-mysql mysqldump -u root -proot_password_2024 blogplatform > backup.sql

# 备份数据卷
docker run --rm -v mysql-data:/data -v $(pwd):/backup alpine tar cvf /backup/mysql-data.tar /data
```

### 恢复数据

```bash
# 恢复 MySQL 数据
docker exec -i blog-mysql mysql -u root -proot_password_2024 blogplatform < backup.sql

# 恢复数据卷
docker run --rm -v mysql-data:/data -v $(pwd):/backup alpine tar xvf /backup/mysql-data.tar -C /
```

## 常用命令

### 服务管理

```bash
# 启动所有服务
docker compose up -d

# 停止所有服务
docker compose down

# 重启特定服务
docker compose restart backend

# 重新构建并启动
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看服务日志
docker compose logs -f [service_name]

# 进入容器
docker exec -it blog-backend sh
docker exec -it blog-mysql mysql -u root -p
docker exec -it blog-redis redis-cli
```

### 清理资源

```bash
# 停止并删除容器、网络
docker compose down

# 停止并删除容器、网络、卷（⚠️ 会删除所有数据）
docker compose down -v

# 清理未使用的镜像
docker image prune -a

# 清理所有未使用的资源
docker system prune -a
```

## 故障排除

### 1. 容器启动失败

```bash
# 查看详细日志
docker compose logs backend
docker compose logs db

# 检查容器状态
docker compose ps -a
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 是否就绪
docker exec blog-mysql mysqladmin ping -h localhost -u root -p

# 检查网络连接
docker exec blog-backend ping db
```

### 3. 前端无法访问后端 API

```bash
# 检查后端健康状态
curl http://localhost/api/health

# 检查 Nginx 配置
docker exec blog-frontend nginx -t

# 查看 Nginx 日志
docker logs blog-frontend
```

### 4. 端口被占用

```bash
# 检查端口占用
sudo lsof -i :80
sudo lsof -i :8080
sudo lsof -i :3306

# 修改 docker-compose.yml 中的端口映射
ports:
  - "8081:80"  # 改用其他端口
```

### 5. 重置所有数据

```bash
# 停止服务并删除所有数据
docker compose down -v

# 删除构建缓存
docker builder prune -a

# 重新构建并启动
docker compose up -d --build
```

## 生产环境建议

1. **使用 HTTPS**: 配置 SSL 证书，可以使用 Let's Encrypt
2. **修改默认密码**: 更改所有默认密码
3. **限制端口暴露**: 仅暴露必要的端口（80/443）
4. **设置防火墙**: 使用 iptables 或 ufw 限制访问
5. **定期备份**: 设置自动备份脚本
6. **监控告警**: 配置容器监控和告警

## 技术栈

- **前端**: Vue 3 + Vite + Element Plus + Nginx
- **后端**: Spring Boot 3.5 + MyBatis + Java 21
- **数据库**: MySQL 8.0 (Debian)
- **缓存**: Redis 7 (Bookworm)
- **容器化**: Docker + Docker Compose
