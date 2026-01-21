# 多阶段构建 - 后端 Dockerfile
# 阶段1: 构建阶段
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# 复制父 pom.xml
COPY pom.xml .

# 复制所有子模块的 pom.xml
COPY blog-common/pom.xml blog-common/
COPY aliyun-oss-spring-boot-autoconfigure/pom.xml aliyun-oss-spring-boot-autoconfigure/
COPY aliyun-oss-spring-boot-starter/pom.xml aliyun-oss-spring-boot-starter/
COPY blog-server/pom.xml blog-server/

# 下载依赖（利用 Docker 缓存层）
RUN mvn dependency:go-offline -B

# 复制所有源代码
COPY blog-common/src blog-common/src
COPY aliyun-oss-spring-boot-autoconfigure/src aliyun-oss-spring-boot-autoconfigure/src
COPY blog-server/src blog-server/src

# 构建项目（跳过测试）
RUN mvn clean package -DskipTests -B

# 阶段2: 运行阶段 - 使用 Eclipse Temurin JRE 21 (基于 Debian)
FROM eclipse-temurin:21-jre-jammy AS runtime

# 设置工作目录
WORKDIR /app

# 安装必要工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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
