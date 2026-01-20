-- 博客平台数据库初始化脚本
-- 此脚本在 MySQL 容器首次启动时自动执行

-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    `bio` TEXT COMMENT '个人简介',
    `role` TINYINT DEFAULT 0 COMMENT '角色: 0-普通用户, 1-管理员',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建分类表
CREATE TABLE IF NOT EXISTS `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 创建标签表
CREATE TABLE IF NOT EXISTS `tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
    `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 创建博客表
CREATE TABLE IF NOT EXISTS `blog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '博客ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `summary` VARCHAR(500) DEFAULT NULL COMMENT '摘要',
    `content` LONGTEXT NOT NULL COMMENT '内容',
    `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
    `user_id` BIGINT NOT NULL COMMENT '作者ID',
    `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `comment_count` INT DEFAULT 0 COMMENT '评论数',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-草稿, 1-已发布',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客表';

-- 创建博客标签关联表
CREATE TABLE IF NOT EXISTS `blog_tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `blog_id` BIGINT NOT NULL COMMENT '博客ID',
    `tag_id` BIGINT NOT NULL COMMENT '标签ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_blog_tag` (`blog_id`, `tag_id`),
    KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客标签关联表';

-- 创建评论表
CREATE TABLE IF NOT EXISTS `comment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
    `content` TEXT NOT NULL COMMENT '评论内容',
    `blog_id` BIGINT NOT NULL COMMENT '博客ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `parent_id` BIGINT DEFAULT NULL COMMENT '父评论ID',
    `reply_user_id` BIGINT DEFAULT NULL COMMENT '回复用户ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_blog_id` (`blog_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 创建点赞表
CREATE TABLE IF NOT EXISTS `blog_like` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `blog_id` BIGINT NOT NULL COMMENT '博客ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_blog_user` (`blog_id`, `user_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- 创建收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `blog_id` BIGINT NOT NULL COMMENT '博客ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_blog_user` (`blog_id`, `user_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- 插入默认分类
INSERT INTO `category` (`name`, `description`, `sort`) VALUES
('技术', '技术相关文章', 1),
('生活', '生活随笔', 2),
('读书', '读书笔记', 3),
('其他', '其他类型', 99)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 插入默认标签
INSERT INTO `tag` (`name`) VALUES
('Java'),
('Spring Boot'),
('Vue.js'),
('Docker'),
('MySQL'),
('Redis'),
('前端'),
('后端')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 插入管理员账号 (密码: admin123，实际部署时应该修改)
-- 注意：这里的密码需要使用 BCrypt 加密后的值
-- INSERT INTO `user` (`username`, `password`, `nickname`, `role`, `status`) VALUES
-- ('admin', '$2a$10$xxxxx', '管理员', 1, 1);
