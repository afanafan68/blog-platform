# 多阶段构建 - 后端 Dockerfile
# 阶段1: 构建阶段
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# 复制父 pom.xml
COPY pom.xml .

# 复制子模块 pom.xml
COPY blog-common/pom.xml blog-common/
COPY blog-server/pom.xml blog-server/

# 下载依赖（利用 Docker 缓存层）
RUN mvn dependency:go-offline -B

# 复制源代码
COPY blog-common/src blog-common/src
COPY blog-server/src blog-server/src

# 构建项目（跳过测试）
RUN mvn clean package -DskipTests -B

# 阶段2: 运行阶段 - 基于 Debian 13 (Trixie/Bookworm)
# 使用 Debian Bookworm (12) 作为基础，因为 Trixie (13) 尚未有稳定的 JRE 镜像
# 注意：Debian 13 (Trixie) 目前处于测试阶段，生产环境建议使用 Bookworm
FROM debian:bookworm-slim AS runtime

# 设置工作目录
WORKDIR /app

# 安装 OpenJDK 21 和必要工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-21-jre-headless \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 设置 JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# 创建非 root 用户运行应用
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# 创建上传目录
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app/uploads

# 从构建阶段复制 jar 文件
COPY --from=builder /app/blog-server/target/*.jar app.jar

# 设置文件所有权
RUN chown -R appuser:appgroup /app

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8080

# 健康检查 - 使用 /api/health 端点
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# JVM 优化参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+HeapDumpOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
