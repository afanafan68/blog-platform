// ------------------------------------------------------
// src/mock/blog.js - 博客模块 Mock（使用真实内容）
// ------------------------------------------------------
import Mock from 'mockjs'

// 真实博客内容数据（基于资料提供.md）
const realBlogs = [
  {
    id: 1,
    title: '前端学习路线与技术栈详解',
    summary: '本文详细介绍了前端开发的学习路线，包括HTML/CSS基础、JavaScript进阶、Vue/React框架学习等内容，适合初学者参考。',
    content: `# 前端学习路线与技术栈详解

## 一、基础阶段

### 1. HTML5
- 语义化标签
- 表单增强
- 本地存储
- Canvas绘图

### 2. CSS3
- Flexbox布局
- Grid布局
- 动画与过渡
- 响应式设计

### 3. JavaScript
- ES6+语法
- DOM操作
- 事件处理
- 异步编程

## 二、框架阶段

### Vue.js
\`\`\`javascript
// Vue 3 组合式API示例
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    return { count, double }
  }
}
\`\`\`

### React
\`\`\`jsx
// React Hooks示例
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

- Webpack/Vite构建工具
- ESLint代码规范
- Git版本控制
- CI/CD自动化部署`,
    coverImage: 'https://picsum.photos/seed/frontend/800/400',
    category: { id: 1, name: '前端开发' },
    tags: [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'Vue' }, { id: 3, name: 'React' }],
    author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' },
    viewCount: 2580,
    likeCount: 189,
    commentCount: 45,
    status: 1,
    createTime: '2026-01-15T10:00:00',
    updateTime: '2026-01-15T10:00:00'
  },
  {
    id: 2,
    title: '注意力机制原理与Transformer实现',
    summary: '深入讲解Transformer中的注意力机制，包括自注意力、多头注意力的数学原理和PyTorch实现代码。',
    content: `# 注意力机制原理与Transformer实现

## 一、注意力机制概述

注意力机制的核心思想是让模型能够关注输入序列中最相关的部分。

### 自注意力（Self-Attention）

自注意力机制计算公式：

$$Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V$$

其中：
- Q (Query): 查询向量
- K (Key): 键向量
- V (Value): 值向量
- dk: 键向量的维度

## 二、PyTorch实现

\`\`\`python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attention = torch.softmax(scores, dim=-1)
        return torch.matmul(attention, V)
    
    def forward(self, Q, K, V, mask=None):
        batch_size = Q.size(0)
        
        Q = self.W_q(Q).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        x = self.scaled_dot_product_attention(Q, K, V, mask)
        x = x.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        return self.W_o(x)
\`\`\`

## 三、应用场景

- 机器翻译
- 文本摘要
- 问答系统
- 图像识别`,
    coverImage: 'https://picsum.photos/seed/attention/800/400',
    category: { id: 2, name: '人工智能' },
    tags: [{ id: 4, name: '深度学习' }, { id: 5, name: 'Transformer' }, { id: 6, name: 'PyTorch' }],
    author: { id: 2, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user2/100/100' },
    viewCount: 3120,
    likeCount: 267,
    commentCount: 32,
    status: 1,
    createTime: '2026-01-14T14:30:00',
    updateTime: '2026-01-14T14:30:00'
  },
  {
    id: 3,
    title: '编译原理词法分析器实现',
    summary: '介绍词法分析的基本原理，使用有限自动机实现一个简单的词法分析器，包括正则表达式到NFA的转换。',
    content: `# 编译原理词法分析器实现

## 一、词法分析概述

词法分析是编译器的第一个阶段，负责将源代码字符流转换为Token流。

### 主要任务
1. 识别单词（标识符、关键字、常量等）
2. 过滤空白字符和注释
3. 生成Token序列

## 二、有限自动机

### DFA（确定有限自动机）

\`\`\`python
class DFA:
    def __init__(self, states, alphabet, transitions, start, accepts):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start = start
        self.accepts = accepts
    
    def accepts_string(self, s):
        current = self.start
        for char in s:
            if (current, char) in self.transitions:
                current = self.transitions[(current, char)]
            else:
                return False
        return current in self.accepts
\`\`\`

## 三、简单词法分析器实现

\`\`\`python
import re

class Lexer:
    def __init__(self, source):
        self.source = source
        self.pos = 0
        self.tokens = []
        
        self.patterns = [
            ('NUMBER', r'\\d+(\\.\\d+)?'),
            ('IDENT', r'[a-zA-Z_][a-zA-Z0-9_]*'),
            ('OP', r'[+\\-*/=<>!]+'),
            ('LPAREN', r'\\('),
            ('RPAREN', r'\\)'),
            ('SKIP', r'[ \\t\\n]+'),
        ]
    
    def tokenize(self):
        while self.pos < len(self.source):
            match = None
            for token_type, pattern in self.patterns:
                regex = re.compile(pattern)
                match = regex.match(self.source, self.pos)
                if match:
                    if token_type != 'SKIP':
                        self.tokens.append((token_type, match.group()))
                    self.pos = match.end()
                    break
            if not match:
                raise SyntaxError(f'Unknown char: {self.source[self.pos]}')
        return self.tokens
\`\`\``,
    coverImage: 'https://picsum.photos/seed/compiler/800/400',
    category: { id: 3, name: '计算机基础' },
    tags: [{ id: 7, name: '编译原理' }, { id: 8, name: 'Python' }],
    author: { id: 3, nickname: '编译器爱好者', avatar: 'https://picsum.photos/seed/user3/100/100' },
    viewCount: 1560,
    likeCount: 89,
    commentCount: 18,
    status: 1,
    createTime: '2026-01-13T09:15:00',
    updateTime: '2026-01-13T09:15:00'
  },
  {
    id: 4,
    title: 'MySQL常用命令与操作指南',
    summary: '整理MySQL数据库的常用命令，包括数据库操作、表操作、数据增删改查、索引管理等内容。',
    content: `# MySQL常用命令与操作指南

## 一、数据库操作

\`\`\`sql
-- 创建数据库
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看所有数据库
SHOW DATABASES;

-- 选择数据库
USE mydb;

-- 删除数据库
DROP DATABASE mydb;
\`\`\`

## 二、表操作

\`\`\`sql
-- 创建表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查看表结构
DESC users;

-- 修改表
ALTER TABLE users ADD COLUMN age INT;
ALTER TABLE users MODIFY COLUMN email VARCHAR(150);
ALTER TABLE users DROP COLUMN age;
\`\`\`

## 三、数据操作

\`\`\`sql
-- 插入数据
INSERT INTO users (username, email) VALUES ('张三', 'zhangsan@example.com');

-- 查询数据
SELECT * FROM users WHERE id = 1;
SELECT username, email FROM users ORDER BY created_at DESC LIMIT 10;

-- 更新数据
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 删除数据
DELETE FROM users WHERE id = 1;
\`\`\`

## 四、索引管理

\`\`\`sql
-- 创建索引
CREATE INDEX idx_username ON users(username);
CREATE UNIQUE INDEX idx_email ON users(email);

-- 查看索引
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_username ON users;
\`\`\``,
    coverImage: 'https://picsum.photos/seed/mysql/800/400',
    category: { id: 4, name: '数据库' },
    tags: [{ id: 9, name: 'MySQL' }, { id: 10, name: 'SQL' }],
    author: { id: 4, nickname: 'DBA老张', avatar: 'https://picsum.photos/seed/user4/100/100' },
    viewCount: 4250,
    likeCount: 356,
    commentCount: 67,
    status: 1,
    createTime: '2026-01-12T16:00:00',
    updateTime: '2026-01-12T16:00:00'
  },
  {
    id: 5,
    title: 'Xv6操作系统页表机制详解',
    summary: '深入分析Xv6操作系统的页表实现，理解虚拟内存映射、多级页表结构和页表项格式。',
    content: `# Xv6操作系统页表机制详解

## 一、虚拟内存概述

Xv6使用RISC-V的Sv39分页方案，支持39位虚拟地址空间。

### 地址结构
- 虚拟地址：39位（512GB地址空间）
- 物理地址：56位
- 页大小：4KB（12位偏移）

## 二、三级页表结构

\`\`\`
虚拟地址结构（39位）：
┌─────────┬─────────┬─────────┬────────────┐
│ VPN[2]  │ VPN[1]  │ VPN[0]  │   Offset   │
│  9位    │  9位    │  9位    │   12位     │
└─────────┴─────────┴─────────┴────────────┘
\`\`\`

## 三、页表项（PTE）格式

\`\`\`c
// 页表项标志位
#define PTE_V (1L << 0) // 有效位
#define PTE_R (1L << 1) // 可读
#define PTE_W (1L << 2) // 可写
#define PTE_X (1L << 3) // 可执行
#define PTE_U (1L << 4) // 用户态可访问

// 从PTE提取物理地址
#define PTE2PA(pte) (((pte) >> 10) << 12)

// 从物理地址创建PTE
#define PA2PTE(pa) ((((uint64)pa) >> 12) << 10)
\`\`\`

## 四、关键函数实现

\`\`\`c
// 查找虚拟地址对应的PTE
pte_t *walk(pagetable_t pagetable, uint64 va, int alloc) {
    for(int level = 2; level > 0; level--) {
        pte_t *pte = &pagetable[PX(level, va)];
        if(*pte & PTE_V) {
            pagetable = (pagetable_t)PTE2PA(*pte);
        } else {
            if(!alloc || (pagetable = (pde_t*)kalloc()) == 0)
                return 0;
            memset(pagetable, 0, PGSIZE);
            *pte = PA2PTE(pagetable) | PTE_V;
        }
    }
    return &pagetable[PX(0, va)];
}
\`\`\``,
    coverImage: 'https://picsum.photos/seed/xv6/800/400',
    category: { id: 3, name: '计算机基础' },
    tags: [{ id: 11, name: '操作系统' }, { id: 12, name: 'Xv6' }, { id: 13, name: 'C语言' }],
    author: { id: 5, nickname: 'OS研究者', avatar: 'https://picsum.photos/seed/user5/100/100' },
    viewCount: 1890,
    likeCount: 145,
    commentCount: 23,
    status: 1,
    createTime: '2026-01-11T11:20:00',
    updateTime: '2026-01-11T11:20:00'
  },
  {
    id: 6,
    title: 'Java虚拟线程实战指南',
    summary: '介绍Java 21中的虚拟线程特性，以及如何使用虚拟线程提升并发程序性能。',
    content: `# Java虚拟线程实战指南

## 一、虚拟线程简介

Java 21正式引入虚拟线程（Virtual Threads），是Project Loom的核心成果。

### 特点
- 轻量级：可创建数百万个虚拟线程
- 低开销：不占用操作系统线程资源
- 兼容性：与现有Thread API完全兼容

## 二、基本用法

\`\`\`java
// 创建虚拟线程
Thread vThread = Thread.ofVirtual().start(() -> {
    System.out.println("Hello from virtual thread!");
});

// 使用ExecutorService
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}
\`\`\`

## 三、实战示例

\`\`\`java
public class VirtualThreadDemo {
    public static void main(String[] args) throws Exception {
        // 并发处理HTTP请求
        HttpClient client = HttpClient.newHttpClient();
        List<URI> urls = List.of(
            URI.create("https://api.github.com"),
            URI.create("https://api.openai.com"),
            URI.create("https://api.twitter.com")
        );
        
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> futures = urls.stream()
                .map(url -> executor.submit(() -> fetch(client, url)))
                .toList();
            
            for (Future<String> future : futures) {
                System.out.println(future.get());
            }
        }
    }
    
    static String fetch(HttpClient client, URI url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(url).build();
        return client.send(request, BodyHandlers.ofString()).body();
    }
}
\`\`\``,
    coverImage: 'https://picsum.photos/seed/java/800/400',
    category: { id: 5, name: '编程语言' },
    tags: [{ id: 14, name: 'Java' }, { id: 15, name: '并发编程' }],
    author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' },
    viewCount: 2890,
    likeCount: 234,
    commentCount: 41,
    status: 1,
    createTime: '2026-01-10T08:45:00',
    updateTime: '2026-01-10T08:45:00'
  },
  {
    id: 7,
    title: 'LeetCode栈与队列经典题解',
    summary: '精选LeetCode中关于栈和队列的经典题目，包括有效的括号、最小栈、滑动窗口最大值等详细解析。',
    content: `# LeetCode栈与队列经典题解

## 题目1：有效的括号（#20）

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

\`\`\`python
def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0
\`\`\`

## 题目2：最小栈（#155）

设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。

\`\`\`python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]
\`\`\`

## 题目3：滑动窗口最大值（#239）

\`\`\`python
from collections import deque

def maxSlidingWindow(nums, k):
    result = []
    dq = deque()  # 存储索引
    
    for i, num in enumerate(nums):
        # 移除窗口外的元素
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # 保持队列递减
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
\`\`\``,
    coverImage: 'https://picsum.photos/seed/leetcode/800/400',
    category: { id: 6, name: '算法' },
    tags: [{ id: 16, name: '数据结构' }, { id: 17, name: 'LeetCode' }, { id: 8, name: 'Python' }],
    author: { id: 7, nickname: '算法大师', avatar: 'https://picsum.photos/seed/user7/100/100' },
    viewCount: 3450,
    likeCount: 289,
    commentCount: 56,
    status: 1,
    createTime: '2026-01-09T15:30:00',
    updateTime: '2026-01-09T15:30:00'
  },
  {
    id: 8,
    title: 'Python爬虫实战教程',
    summary: '从零开始学习Python爬虫，包括requests、BeautifulSoup、Scrapy框架的使用方法和实际案例。',
    content: `# Python爬虫实战教程

## 一、基础知识

### requests库使用

\`\`\`python
import requests

# 发送GET请求
response = requests.get('https://api.github.com')
print(response.status_code)
print(response.json())

# 发送POST请求
data = {'key': 'value'}
response = requests.post('https://httpbin.org/post', json=data)

# 设置请求头
headers = {'User-Agent': 'Mozilla/5.0'}
response = requests.get(url, headers=headers)
\`\`\`

## 二、HTML解析

### BeautifulSoup

\`\`\`python
from bs4 import BeautifulSoup

html = '''
<html>
<body>
<div class="article">
    <h1>标题</h1>
    <p class="content">内容</p>
</div>
</body>
</html>
'''

soup = BeautifulSoup(html, 'html.parser')

# 查找元素
title = soup.find('h1').text
content = soup.find('p', class_='content').text
articles = soup.find_all('div', class_='article')
\`\`\`

## 三、Scrapy框架

\`\`\`python
import scrapy

class BlogSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ['https://example.com/blog']
    
    def parse(self, response):
        for article in response.css('.article'):
            yield {
                'title': article.css('h2::text').get(),
                'link': article.css('a::attr(href)').get(),
                'summary': article.css('.summary::text').get(),
            }
        
        # 翻页
        next_page = response.css('.next-page::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
\`\`\``,
    coverImage: 'https://picsum.photos/seed/crawler/800/400',
    category: { id: 5, name: '编程语言' },
    tags: [{ id: 8, name: 'Python' }, { id: 18, name: '爬虫' }],
    author: { id: 8, nickname: 'Python大神', avatar: 'https://picsum.photos/seed/user8/100/100' },
    viewCount: 5670,
    likeCount: 456,
    commentCount: 78,
    status: 1,
    createTime: '2026-01-08T10:00:00',
    updateTime: '2026-01-08T10:00:00'
  },
  {
    id: 9,
    title: 'Git版本控制最佳实践',
    summary: '介绍Git工作流、分支管理策略、提交规范等最佳实践，提升团队协作效率。',
    content: `# Git版本控制最佳实践

## 一、分支管理策略

### Git Flow
- master: 生产环境代码
- develop: 开发环境代码
- feature/*: 功能分支
- release/*: 发布分支
- hotfix/*: 紧急修复分支

## 二、提交规范

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Type类型
- feat: 新功能
- fix: 修复Bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建/工具

## 三、常用命令

\`\`\`bash
# 创建并切换分支
git checkout -b feature/new-feature

# 暂存修改
git stash
git stash pop

# 查看提交历史
git log --oneline --graph

# 合并分支
git merge --no-ff feature/new-feature

# 变基
git rebase develop

# 撤销提交
git reset --soft HEAD~1
git reset --hard HEAD~1

# Cherry-pick
git cherry-pick <commit-hash>
\`\`\``,
    coverImage: 'https://picsum.photos/seed/git/800/400',
    category: { id: 7, name: '开发工具' },
    tags: [{ id: 19, name: 'Git' }, { id: 20, name: '版本控制' }],
    author: { id: 9, nickname: 'DevOps工程师', avatar: 'https://picsum.photos/seed/user9/100/100' },
    viewCount: 3890,
    likeCount: 312,
    commentCount: 45,
    status: 1,
    createTime: '2026-01-07T14:20:00',
    updateTime: '2026-01-07T14:20:00'
  },
  {
    id: 10,
    title: 'OpenPose + ST-GCN人体动作识别',
    summary: '介绍如何使用OpenPose进行人体姿态估计，并结合ST-GCN进行动作识别，包括完整的环境配置和代码实现。',
    content: `# OpenPose + ST-GCN人体动作识别

## 一、环境配置

### 安装依赖

\`\`\`bash
# 创建conda环境
conda create -n pose python=3.8
conda activate pose

# 安装PyTorch
pip install torch torchvision

# 安装OpenPose Python绑定
pip install openpose-python

# 安装其他依赖
pip install numpy opencv-python matplotlib
\`\`\`

## 二、OpenPose姿态估计

\`\`\`python
import cv2
from openpose import pyopenpose as op

# 配置OpenPose参数
params = {
    "model_folder": "./models/",
    "number_people_max": 1,
}

# 初始化OpenPose
opWrapper = op.WrapperPython()
opWrapper.configure(params)
opWrapper.start()

# 处理图像
def extract_keypoints(image_path):
    datum = op.Datum()
    datum.cvInputData = cv2.imread(image_path)
    opWrapper.emplaceAndPop(op.VectorDatum([datum]))
    return datum.poseKeypoints
\`\`\`

## 三、ST-GCN动作识别

\`\`\`python
import torch
from stgcn import STGCN

# 加载预训练模型
model = STGCN(num_class=60, in_channels=3, 
              edge_importance_weighting=True)
model.load_state_dict(torch.load('stgcn_model.pth'))
model.eval()

# 预测动作
def predict_action(keypoints_sequence):
    with torch.no_grad():
        output = model(keypoints_sequence)
        _, predicted = torch.max(output, 1)
    return predicted.item()
\`\`\``,
    coverImage: 'https://picsum.photos/seed/openpose/800/400',
    category: { id: 2, name: '人工智能' },
    tags: [{ id: 21, name: '计算机视觉' }, { id: 22, name: '姿态估计' }, { id: 6, name: 'PyTorch' }],
    author: { id: 10, nickname: 'CV工程师', avatar: 'https://picsum.photos/seed/user10/100/100' },
    viewCount: 2340,
    likeCount: 189,
    commentCount: 34,
    status: 1,
    createTime: '2026-01-06T09:30:00',
    updateTime: '2026-01-06T09:30:00'
  }
]

let blogs = [...realBlogs]

// 获取博客列表
Mock.mock(/\/api\/blog\/list/, 'get', (options) => {
  const url = new URL('http://mock.com' + options.url)
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10
  const categoryId = url.searchParams.get('categoryId')

  let filteredBlogs = blogs.filter(b => b.status === 1)

  if (categoryId) {
    filteredBlogs = filteredBlogs.filter(b => b.category.id === parseInt(categoryId))
  }

  const total = filteredBlogs.length
  const start = (page - 1) * size
  const records = filteredBlogs.slice(start, start + size)

  return {
    code: 200,
    message: 'success',
    data: {
      records,
      total,
      current: page,
      size,
      pages: Math.ceil(total / size)
    }
  }
})

// 收藏博客详情数据（用于查看收藏博客的详情）
const favoriteBlogDetails = {
  101: {
    content: `# 前端学习路线与技术栈详解

## 一、基础阶段

### 1. HTML5
- 语义化标签：header、nav、main、article、section、footer
- 表单增强：新增input类型（email、date、range等）
- 本地存储：localStorage、sessionStorage
- Canvas绘图：2D图形绑定、动画

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
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
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
\`\`\``
  },
  102: {
    content: `# HTML5新特性与语义化标签

## 语义化标签

HTML5引入了许多语义化标签，使文档结构更清晰：

- \`<header>\` - 页面或区块的头部
- \`<nav>\` - 导航链接区域
- \`<main>\` - 文档主要内容
- \`<article>\` - 独立的文章内容
- \`<section>\` - 文档中的节
- \`<aside>\` - 侧边栏内容
- \`<footer>\` - 页面或区块的底部

## 表单增强

\`\`\`html
<input type="email" placeholder="请输入邮箱">
<input type="date">
<input type="range" min="0" max="100">
<input type="color">
\`\`\`

## 本地存储

\`\`\`javascript
// localStorage
localStorage.setItem('key', 'value')
localStorage.getItem('key')

// sessionStorage
sessionStorage.setItem('key', 'value')
\`\`\``
  },
  103: {
    content: `# CSS Flexbox与Grid布局实战

## Flexbox布局

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 1 200px;
}
\`\`\`

## Grid布局

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.grid-item {
  grid-column: span 2;
}
\`\`\`

## 响应式设计

\`\`\`css
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
\`\`\``
  },
  201: {
    content: `# 编译原理词法分析器实现

## 词法分析概述

词法分析是编译器的第一个阶段，负责将源代码字符流转换为Token流。

## DFA实现

\`\`\`python
class DFA:
    def __init__(self, states, alphabet, transitions, start, accepts):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start = start
        self.accepts = accepts
    
    def accepts_string(self, s):
        current = self.start
        for char in s:
            if (current, char) in self.transitions:
                current = self.transitions[(current, char)]
            else:
                return False
        return current in self.accepts
\`\`\`

## 词法分析器

\`\`\`python
import re

class Lexer:
    def __init__(self, source):
        self.source = source
        self.pos = 0
        self.tokens = []
    
    def tokenize(self):
        patterns = [
            ('NUMBER', r'\\d+'),
            ('IDENT', r'[a-zA-Z_][a-zA-Z0-9_]*'),
            ('OP', r'[+\\-*/]'),
        ]
        # 实现词法分析逻辑
        return self.tokens
\`\`\``
  },
  202: {
    content: `# 语法分析与抽象语法树构建

## LL(1)语法分析

LL(1)分析器从左到右扫描输入，使用最左推导。

## 抽象语法树(AST)

\`\`\`python
class ASTNode:
    pass

class BinaryOp(ASTNode):
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class Number(ASTNode):
    def __init__(self, value):
        self.value = value
\`\`\`

## 递归下降解析

\`\`\`python
class Parser:
    def parse_expr(self):
        left = self.parse_term()
        while self.current_token in ('+', '-'):
            op = self.current_token
            self.advance()
            right = self.parse_term()
            left = BinaryOp(left, op, right)
        return left
\`\`\``
  },
  301: {
    content: `# Xv6页表机制详解

## 虚拟内存概述

Xv6使用RISC-V的Sv39分页方案，支持39位虚拟地址空间。

## 三级页表结构

\`\`\`
虚拟地址结构（39位）：
┌─────────┬─────────┬─────────┬────────────┐
│ VPN[2]  │ VPN[1]  │ VPN[0]  │   Offset   │
│  9位    │  9位    │  9位    │   12位     │
└─────────┴─────────┴─────────┴────────────┘
\`\`\`

## 页表项格式

\`\`\`c
#define PTE_V (1L << 0) // 有效位
#define PTE_R (1L << 1) // 可读
#define PTE_W (1L << 2) // 可写
#define PTE_X (1L << 3) // 可执行
#define PTE_U (1L << 4) // 用户态可访问

#define PTE2PA(pte) (((pte) >> 10) << 12)
#define PA2PTE(pa) ((((uint64)pa) >> 12) << 10)
\`\`\``
  },
  401: {
    content: `# MySQL常用命令与操作指南

## 数据库操作

\`\`\`sql
CREATE DATABASE mydb CHARACTER SET utf8mb4;
SHOW DATABASES;
USE mydb;
DROP DATABASE mydb;
\`\`\`

## 表操作

\`\`\`sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DESC users;
ALTER TABLE users ADD COLUMN age INT;
\`\`\`

## 数据操作

\`\`\`sql
INSERT INTO users (username, email) VALUES ('张三', 'test@example.com');
SELECT * FROM users WHERE id = 1;
UPDATE users SET email = 'new@example.com' WHERE id = 1;
DELETE FROM users WHERE id = 1;
\`\`\``
  },
  402: {
    content: `# JDBC数据库连接池配置与优化

## 基本连接

\`\`\`java
Connection conn = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/mydb",
    "username",
    "password"
);
\`\`\`

## HikariCP连接池

\`\`\`java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
config.setUsername("username");
config.setPassword("password");
config.setMaximumPoolSize(10);

HikariDataSource ds = new HikariDataSource(config);
\`\`\`

## 性能优化

- 设置合适的连接池大小
- 启用预编译语句缓存
- 配置连接超时时间`
  },
  501: {
    content: `# HarmonyOS应用开发入门

## 环境搭建

1. 下载DevEco Studio
2. 配置SDK
3. 创建项目

## Hello World

\`\`\`typescript
@Entry
@Component
struct Index {
  @State message: string = 'Hello World'

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
    }
    .height('100%')
  }
}
\`\`\`

## ArkTS语法

ArkTS是HarmonyOS的开发语言，基于TypeScript扩展。`
  },
  601: {
    content: `# LeetCode栈与队列经典题解

## 有效的括号 (#20)

\`\`\`python
def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0
\`\`\`

## 最小栈 (#155)

\`\`\`python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
\`\`\``
  },
  602: {
    content: `# 线性插值算法原理与应用

## 基本原理

线性插值是一种简单的插值方法，用于在两个已知点之间估算值。

## 公式

给定两点 (x0, y0) 和 (x1, y1)，x 处的插值为：

y = y0 + (y1 - y0) * (x - x0) / (x1 - x0)

## Python实现

\`\`\`python
def linear_interpolation(x0, y0, x1, y1, x):
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
\`\`\`

## 应用场景

- 图形学中的颜色渐变
- 信号处理中的重采样
- 动画中的关键帧插值`
  },
  701: {
    content: `# C++智能指针详解

## unique_ptr

\`\`\`cpp
#include <memory>

std::unique_ptr<int> ptr = std::make_unique<int>(42);
// 独占所有权，不能复制
auto ptr2 = std::move(ptr); // 转移所有权
\`\`\`

## shared_ptr

\`\`\`cpp
std::shared_ptr<int> ptr1 = std::make_shared<int>(42);
std::shared_ptr<int> ptr2 = ptr1; // 共享所有权
std::cout << ptr1.use_count(); // 引用计数
\`\`\`

## weak_ptr

\`\`\`cpp
std::weak_ptr<int> weak = ptr1;
if (auto shared = weak.lock()) {
    // 使用shared
}
\`\`\``
  },
  801: {
    content: `# Java AWT布局管理器详解

## FlowLayout

\`\`\`java
setLayout(new FlowLayout(FlowLayout.CENTER));
add(new Button("Button 1"));
add(new Button("Button 2"));
\`\`\`

## BorderLayout

\`\`\`java
setLayout(new BorderLayout());
add(new Button("North"), BorderLayout.NORTH);
add(new Button("Center"), BorderLayout.CENTER);
\`\`\`

## GridLayout

\`\`\`java
setLayout(new GridLayout(2, 3)); // 2行3列
for (int i = 1; i <= 6; i++) {
    add(new Button("Button " + i));
}
\`\`\``
  },
  802: {
    content: `# Java虚拟线程实战指南

## 创建虚拟线程

\`\`\`java
Thread vThread = Thread.ofVirtual().start(() -> {
    System.out.println("Hello from virtual thread!");
});

// 使用ExecutorService
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}
\`\`\`

## 优势

- 轻量级：可创建数百万个虚拟线程
- 低开销：不占用操作系统线程资源
- 兼容性：与现有Thread API完全兼容`
  },
  803: {
    content: `# Spring Boot快速入门

## 创建项目

使用Spring Initializr创建项目，添加以下依赖：
- Spring Web
- Spring Data JPA
- MySQL Driver

## 主类

\`\`\`java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
\`\`\`

## REST Controller

\`\`\`java
@RestController
@RequestMapping("/api")
public class UserController {
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
}
\`\`\``
  },
  901: {
    content: `# 注意力机制原理与实现

## 自注意力机制

$$Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V$$

## PyTorch实现

\`\`\`python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
\`\`\``
  },
  902: {
    content: `# PyTorch神经网络训练技巧

## 学习率调度

\`\`\`python
scheduler = torch.optim.lr_scheduler.StepLR(
    optimizer, step_size=30, gamma=0.1
)

# 或使用余弦退火
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
    optimizer, T_max=100
)
\`\`\`

## 数据增强

\`\`\`python
transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2),
    transforms.ToTensor(),
])
\`\`\`

## 正则化

- Dropout
- L2正则化
- Batch Normalization`
  },
  1001: {
    content: `# OpenPose + ST-GCN人体动作识别

## 环境配置

\`\`\`bash
conda create -n pose python=3.8
conda activate pose
pip install torch torchvision
pip install openpose-python
\`\`\`

## OpenPose姿态估计

\`\`\`python
import cv2
from openpose import pyopenpose as op

params = {"model_folder": "./models/"}
opWrapper = op.WrapperPython()
opWrapper.configure(params)
opWrapper.start()
\`\`\`

## ST-GCN动作识别

\`\`\`python
from stgcn import STGCN

model = STGCN(num_class=60, in_channels=3)
model.load_state_dict(torch.load('stgcn_model.pth'))
\`\`\``
  },
  1002: {
    content: `# Label Studio标注工具使用指南

## 安装

\`\`\`bash
pip install label-studio
label-studio start
\`\`\`

## 创建项目

1. 选择标注类型（图像、文本等）
2. 配置标签
3. 导入数据

## 标注配置

\`\`\`xml
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Car"/>
    <Label value="Person"/>
  </RectangleLabels>
</View>
\`\`\`

## 导出数据

支持多种格式：COCO、Pascal VOC、YOLO等`
  },
  1101: {
    content: `# Conda环境管理完全指南

## 安装Conda

从Anaconda或Miniconda官网下载安装包。

## 环境管理

\`\`\`bash
# 创建环境
conda create -n myenv python=3.9

# 激活环境
conda activate myenv

# 列出环境
conda env list

# 删除环境
conda remove -n myenv --all
\`\`\`

## 包管理

\`\`\`bash
conda install numpy pandas
conda list
conda update numpy
\`\`\`

## 环境导出

\`\`\`bash
conda env export > environment.yml
conda env create -f environment.yml
\`\`\``
  },
  1201: {
    content: `# Python爬虫实战教程

## requests基础

\`\`\`python
import requests

response = requests.get('https://api.github.com')
print(response.status_code)
print(response.json())
\`\`\`

## BeautifulSoup解析

\`\`\`python
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'html.parser')
title = soup.find('h1').text
links = soup.find_all('a')
\`\`\`

## Scrapy框架

\`\`\`python
import scrapy

class BlogSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ['https://example.com']
    
    def parse(self, response):
        for article in response.css('.article'):
            yield {'title': article.css('h2::text').get()}
\`\`\``
  },
  1202: {
    content: `# grep命令高级用法

## 基本用法

\`\`\`bash
grep "pattern" file.txt
grep -i "pattern" file.txt  # 忽略大小写
grep -r "pattern" ./        # 递归搜索
\`\`\`

## 正则表达式

\`\`\`bash
grep -E "^start" file.txt   # 行首匹配
grep -E "end$" file.txt     # 行尾匹配
grep -E "[0-9]+" file.txt   # 数字匹配
\`\`\`

## 上下文显示

\`\`\`bash
grep -B 3 "pattern" file.txt  # 显示前3行
grep -A 3 "pattern" file.txt  # 显示后3行
grep -C 3 "pattern" file.txt  # 显示前后3行
\`\`\``
  },
  1301: {
    content: `# Git版本控制最佳实践

## 分支策略

- master: 生产环境
- develop: 开发环境
- feature/*: 功能分支
- hotfix/*: 紧急修复

## 提交规范

\`\`\`
feat: 新功能
fix: 修复Bug
docs: 文档更新
style: 代码格式
refactor: 重构
\`\`\`

## 常用命令

\`\`\`bash
git checkout -b feature/new
git stash
git log --oneline --graph
git merge --no-ff feature/new
git rebase develop
\`\`\``
  },
  1302: {
    content: `# VS Code插件推荐与配置

## 必备插件

- ESLint - 代码检查
- Prettier - 代码格式化
- GitLens - Git增强
- Auto Rename Tag - 标签自动重命名

## Vue开发

- Volar - Vue 3支持
- Vue VSCode Snippets

## 配置示例

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2
}
\`\`\``
  },
  1303: {
    content: `# Markdown语法完全手册

## 标题

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
\`\`\`

## 强调

\`\`\`markdown
**粗体** *斜体* ~~删除线~~
\`\`\`

## 列表

\`\`\`markdown
- 无序列表
1. 有序列表
\`\`\`

## 代码

\`\`\`markdown
\`行内代码\`
\`\`\`代码块\`\`\`
\`\`\`

## 链接和图片

\`\`\`markdown
[链接文字](URL)
![图片描述](图片URL)
\`\`\``
  }
}

// 获取博客详情
Mock.mock(/\/api\/blog\/\d+$/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)/)[1])
  
  // 首先在普通博客中查找
  let blog = blogs.find(b => b.id === id)
  
  // 如果没找到，检查是否是收藏博客的ID
  if (!blog && favoriteBlogDetails[id]) {
    // 构造收藏博客的详情数据
    const favoriteInfo = {
      101: { title: '前端学习路线与技术栈详解', summary: '本文详细介绍了前端开发的学习路线...', author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' }, category: { id: 1, name: '前端开发' }, tags: [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'Vue' }], coverImage: 'https://picsum.photos/seed/frontend/400/200', viewCount: 1520, likeCount: 89, createTime: '2026-01-10T10:00:00' },
      102: { title: 'HTML5新特性与语义化标签', summary: '深入了解HTML5的新特性...', author: { id: 2, nickname: '码农小李', avatar: 'https://picsum.photos/seed/user2/100/100' }, category: { id: 1, name: '前端开发' }, tags: [{ id: 3, name: 'HTML5' }], coverImage: 'https://picsum.photos/seed/html5/400/200', viewCount: 980, likeCount: 56, createTime: '2026-01-08T14:30:00' },
      103: { title: 'CSS Flexbox与Grid布局实战', summary: '详细讲解CSS布局方式...', author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' }, category: { id: 1, name: '前端开发' }, tags: [{ id: 4, name: 'CSS' }], coverImage: 'https://picsum.photos/seed/css/400/200', viewCount: 1230, likeCount: 78, createTime: '2026-01-05T09:15:00' },
      201: { title: '编译原理词法分析器实现', summary: '介绍词法分析的基本原理...', author: { id: 3, nickname: '编译器爱好者', avatar: 'https://picsum.photos/seed/user3/100/100' }, category: { id: 2, name: '计算机基础' }, tags: [{ id: 5, name: '编译原理' }], coverImage: 'https://picsum.photos/seed/compiler1/400/200', viewCount: 756, likeCount: 45, createTime: '2026-01-12T16:00:00' },
      202: { title: '语法分析与抽象语法树构建', summary: '深入讲解语法分析算法...', author: { id: 3, nickname: '编译器爱好者', avatar: 'https://picsum.photos/seed/user3/100/100' }, category: { id: 2, name: '计算机基础' }, tags: [{ id: 5, name: '编译原理' }], coverImage: 'https://picsum.photos/seed/compiler2/400/200', viewCount: 623, likeCount: 38, createTime: '2026-01-11T11:20:00' },
      301: { title: 'Xv6页表机制详解', summary: '深入分析Xv6操作系统的页表实现...', author: { id: 4, nickname: 'OS研究者', avatar: 'https://picsum.photos/seed/user4/100/100' }, category: { id: 2, name: '计算机基础' }, tags: [{ id: 6, name: '操作系统' }], coverImage: 'https://picsum.photos/seed/xv6/400/200', viewCount: 892, likeCount: 67, createTime: '2026-01-09T08:45:00' },
      401: { title: 'MySQL常用命令与操作指南', summary: '整理MySQL数据库的常用命令...', author: { id: 5, nickname: 'DBA老张', avatar: 'https://picsum.photos/seed/user5/100/100' }, category: { id: 3, name: '数据库' }, tags: [{ id: 8, name: 'MySQL' }], coverImage: 'https://picsum.photos/seed/mysql1/400/200', viewCount: 2150, likeCount: 156, createTime: '2026-01-07T13:00:00' },
      402: { title: 'JDBC数据库连接池配置与优化', summary: '详细介绍JDBC连接数据库的方法...', author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' }, category: { id: 3, name: '数据库' }, tags: [{ id: 10, name: 'JDBC' }], coverImage: 'https://picsum.photos/seed/jdbc/400/200', viewCount: 1340, likeCount: 89, createTime: '2026-01-06T15:30:00' },
      501: { title: 'HarmonyOS应用开发入门', summary: '介绍HarmonyOS的基本概念...', author: { id: 7, nickname: '鸿蒙开发者', avatar: 'https://picsum.photos/seed/user7/100/100' }, category: { id: 4, name: '移动开发' }, tags: [{ id: 12, name: 'HarmonyOS' }], coverImage: 'https://picsum.photos/seed/harmony/400/200', viewCount: 1680, likeCount: 123, createTime: '2026-01-13T10:00:00' },
      601: { title: 'LeetCode栈与队列经典题解', summary: '精选LeetCode经典题目...', author: { id: 8, nickname: '算法大师', avatar: 'https://picsum.photos/seed/user8/100/100' }, category: { id: 5, name: '算法' }, tags: [{ id: 14, name: '数据结构' }], coverImage: 'https://picsum.photos/seed/leetcode1/400/200', viewCount: 2340, likeCount: 189, createTime: '2026-01-04T11:00:00' },
      602: { title: '线性插值算法原理与应用', summary: '详解线性插值的数学原理...', author: { id: 8, nickname: '算法大师', avatar: 'https://picsum.photos/seed/user8/100/100' }, category: { id: 5, name: '算法' }, tags: [{ id: 16, name: '算法' }], coverImage: 'https://picsum.photos/seed/interpolation/400/200', viewCount: 567, likeCount: 34, createTime: '2026-01-03T14:20:00' },
      701: { title: 'C++智能指针详解', summary: '深入讲解C++11中的智能指针...', author: { id: 9, nickname: 'C++大佬', avatar: 'https://picsum.photos/seed/user9/100/100' }, category: { id: 6, name: '编程语言' }, tags: [{ id: 17, name: 'C++' }], coverImage: 'https://picsum.photos/seed/cpp/400/200', viewCount: 1890, likeCount: 145, createTime: '2026-01-02T09:00:00' },
      801: { title: 'Java AWT布局管理器详解', summary: '详细介绍Java AWT的布局管理器...', author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' }, category: { id: 6, name: '编程语言' }, tags: [{ id: 11, name: 'Java' }], coverImage: 'https://picsum.photos/seed/java1/400/200', viewCount: 1120, likeCount: 67, createTime: '2026-01-01T16:00:00' },
      802: { title: 'Java虚拟线程实战指南', summary: '介绍Java 21中的虚拟线程特性...', author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' }, category: { id: 6, name: '编程语言' }, tags: [{ id: 11, name: 'Java' }], coverImage: 'https://picsum.photos/seed/java2/400/200', viewCount: 2560, likeCount: 234, createTime: '2025-12-28T10:30:00' },
      803: { title: 'Spring Boot快速入门', summary: '从零开始搭建Spring Boot项目...', author: { id: 6, nickname: 'Java架构师', avatar: 'https://picsum.photos/seed/user6/100/100' }, category: { id: 7, name: '后端开发' }, tags: [{ id: 21, name: 'Spring Boot' }], coverImage: 'https://picsum.photos/seed/springboot/400/200', viewCount: 3450, likeCount: 289, createTime: '2025-12-25T08:00:00' },
      901: { title: '注意力机制原理与实现', summary: '深入讲解Transformer中的注意力机制...', author: { id: 10, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user10/100/100' }, category: { id: 8, name: '人工智能' }, tags: [{ id: 22, name: '深度学习' }], coverImage: 'https://picsum.photos/seed/attention/400/200', viewCount: 3120, likeCount: 267, createTime: '2025-12-20T11:00:00' },
      902: { title: 'PyTorch神经网络训练技巧', summary: '分享深度学习模型训练的实用技巧...', author: { id: 10, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user10/100/100' }, category: { id: 8, name: '人工智能' }, tags: [{ id: 24, name: 'PyTorch' }], coverImage: 'https://picsum.photos/seed/pytorch/400/200', viewCount: 2780, likeCount: 198, createTime: '2025-12-18T14:00:00' },
      1001: { title: 'OpenPose + ST-GCN人体动作识别', summary: '介绍如何使用OpenPose进行人体姿态估计...', author: { id: 11, nickname: 'CV工程师', avatar: 'https://picsum.photos/seed/user11/100/100' }, category: { id: 8, name: '人工智能' }, tags: [{ id: 25, name: '计算机视觉' }], coverImage: 'https://picsum.photos/seed/openpose/400/200', viewCount: 1890, likeCount: 145, createTime: '2025-12-15T09:30:00' },
      1002: { title: 'Label Studio标注工具使用指南', summary: '详细介绍Label Studio的使用方法...', author: { id: 11, nickname: 'CV工程师', avatar: 'https://picsum.photos/seed/user11/100/100' }, category: { id: 8, name: '人工智能' }, tags: [{ id: 27, name: '数据标注' }], coverImage: 'https://picsum.photos/seed/labelstudio/400/200', viewCount: 1234, likeCount: 89, createTime: '2025-12-12T16:45:00' },
      1101: { title: 'Conda环境管理完全指南', summary: '详细介绍Conda的安装和使用...', author: { id: 10, nickname: 'AI研究员', avatar: 'https://picsum.photos/seed/user10/100/100' }, category: { id: 9, name: '开发工具' }, tags: [{ id: 28, name: 'Conda' }], coverImage: 'https://picsum.photos/seed/conda/400/200', viewCount: 4560, likeCount: 345, createTime: '2025-12-10T10:00:00' },
      1201: { title: 'Python爬虫实战教程', summary: '从零开始学习Python爬虫...', author: { id: 12, nickname: 'Python大神', avatar: 'https://picsum.photos/seed/user12/100/100' }, category: { id: 6, name: '编程语言' }, tags: [{ id: 29, name: 'Python' }], coverImage: 'https://picsum.photos/seed/crawler/400/200', viewCount: 5670, likeCount: 456, createTime: '2025-12-08T11:30:00' },
      1202: { title: 'grep命令高级用法', summary: '详解Linux grep命令的高级用法...', author: { id: 4, nickname: 'OS研究者', avatar: 'https://picsum.photos/seed/user4/100/100' }, category: { id: 9, name: '开发工具' }, tags: [{ id: 31, name: 'Linux' }], coverImage: 'https://picsum.photos/seed/grep/400/200', viewCount: 890, likeCount: 56, createTime: '2025-12-05T15:00:00' },
      1301: { title: 'Git版本控制最佳实践', summary: '介绍Git工作流和分支管理策略...', author: { id: 13, nickname: 'DevOps工程师', avatar: 'https://picsum.photos/seed/user13/100/100' }, category: { id: 9, name: '开发工具' }, tags: [{ id: 33, name: 'Git' }], coverImage: 'https://picsum.photos/seed/git/400/200', viewCount: 3450, likeCount: 278, createTime: '2025-12-01T09:00:00' },
      1302: { title: 'VS Code插件推荐与配置', summary: '推荐提升开发效率的VS Code插件...', author: { id: 1, nickname: '前端小王', avatar: 'https://picsum.photos/seed/user1/100/100' }, category: { id: 9, name: '开发工具' }, tags: [{ id: 35, name: 'VS Code' }], coverImage: 'https://picsum.photos/seed/vscode/400/200', viewCount: 4120, likeCount: 334, createTime: '2025-11-28T14:30:00' },
      1303: { title: 'Markdown语法完全手册', summary: '详细介绍Markdown的语法...', author: { id: 2, nickname: '码农小李', avatar: 'https://picsum.photos/seed/user2/100/100' }, category: { id: 9, name: '开发工具' }, tags: [{ id: 37, name: 'Markdown' }], coverImage: 'https://picsum.photos/seed/markdown/400/200', viewCount: 2890, likeCount: 198, createTime: '2025-11-25T10:00:00' }
    }
    
    if (favoriteInfo[id]) {
      blog = {
        id,
        ...favoriteInfo[id],
        content: favoriteBlogDetails[id].content,
        status: 1,
        commentCount: 0,
        updateTime: favoriteInfo[id].createTime
      }
    }
  }

  if (!blog) {
    return { code: 404, message: '文章不存在', data: null }
  }

  if (blog.viewCount !== undefined) {
    blog.viewCount++
  }

  return { code: 200, message: 'success', data: blog }
})

// 发表博客
Mock.mock(/\/api\/blog$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  
  const newBlog = {
    id: blogs.length + 100,
    title: body.title,
    summary: body.summary || body.content.substring(0, 150),
    content: body.content,
    coverImage: body.coverImage || `https://picsum.photos/seed/${Date.now()}/800/400`,
    category: { id: body.categoryId || 1, name: '未分类' },
    tags: [],
    author: { id: 1, nickname: 'admin', avatar: 'https://picsum.photos/seed/admin/100/100' },
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    status: body.status || 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  blogs.unshift(newBlog)

  return { code: 200, message: '发布成功', data: newBlog.id }
})

// 更新博客
Mock.mock(/\/api\/blog\/\d+$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return { code: 404, message: '文章不存在', data: null }
  }

  Object.assign(blog, {
    title: body.title || blog.title,
    summary: body.summary || blog.summary,
    content: body.content || blog.content,
    coverImage: body.coverImage || blog.coverImage,
    status: body.status ?? blog.status,
    updateTime: new Date().toISOString()
  })

  return { code: 200, message: '更新成功', data: null }
})

// 删除博客
Mock.mock(/\/api\/blog\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)/)[1])
  const index = blogs.findIndex(b => b.id === id)

  if (index === -1) {
    return { code: 404, message: '文章不存在', data: null }
  }

  blogs.splice(index, 1)
  return { code: 200, message: '删除成功', data: null }
})

// 搜索博客
Mock.mock(/\/api\/blog\/search/, 'get', (options) => {
  const url = new URL('http://mock.com' + options.url)
  const q = url.searchParams.get('q') || ''
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10

  let filteredBlogs = blogs.filter(b => 
    b.status === 1 && 
    (b.title.includes(q) || b.summary.includes(q) || b.content.includes(q))
  )

  const total = filteredBlogs.length
  const start = (page - 1) * size
  const records = filteredBlogs.slice(start, start + size)

  return {
    code: 200,
    message: 'success',
    data: { records, total, current: page, size, pages: Math.ceil(total / size) }
  }
})

// 获取用户的博客
Mock.mock(/\/api\/blog\/user\/\d+/, 'get', (options) => {
  const url = new URL('http://mock.com' + options.url)
  const userId = parseInt(options.url.match(/\/api\/blog\/user\/(\d+)/)[1])
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10

  let filteredBlogs = blogs.filter(b => b.author.id === userId)

  const total = filteredBlogs.length
  const start = (page - 1) * size
  const records = filteredBlogs.slice(start, start + size)

  return {
    code: 200,
    message: 'success',
    data: { records, total, current: page, size, pages: Math.ceil(total / size) }
  }
})

// 点赞博客
Mock.mock(/\/api\/blog\/\d+\/like/, 'post', (options) => {
  const id = parseInt(options.url.match(/\/api\/blog\/(\d+)\/like/)[1])
  const blog = blogs.find(b => b.id === id)

  if (blog) {
    blog.likeCount++
  }

  return { code: 200, message: '点赞成功', data: null }
})

export { blogs, realBlogs }

