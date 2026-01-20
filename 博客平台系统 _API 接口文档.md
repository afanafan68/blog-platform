# 博客平台系统 API 接口文档



[TOC]

## 1. 文档说明

本文档基于《博客平台系统_项目技术文档》编写，适用于 Spring Boot 3.x 后端开发。提供了详细的请求与响应数据字典，供前后端开发人员联调使用。

- **后端技术**: Spring Boot 3.2.x, Spring Security, JWT, MyBatis Plus
- **接口风格**: RESTful
- **数据格式**: JSON
- **字符编码**: UTF-8

## 2. 全局规范

### 2.1 统一响应结构 `Result<T>`

所有接口的 HTTP 状态码均为 200，业务状态由响应体中的 `code` 字段判断。

| 字段名  | 类型    | 说明                           | 示例       |
| ------- | ------- | ------------------------------ | ---------- |
| code    | Integer | 业务状态码 (200成功, 其它失败) | 200        |
| message | String  | 提示消息                       | "操作成功" |
| data    | T       | 业务数据载体 (泛型)            | {}         |

### 2.2 鉴权机制 (JWT)

- **Header Name**: `Authorization`
- **Value Format**: `Bearer <token字符串>`
- **适用范围**: 除登录、注册、GET方式获取公开列表外，所有 POST/PUT/DELETE 接口均需携带。

### 2.3 分页参数约定

列表查询接口统一使用 Query Parameter（URL参数）：

| 参数名 | 类型    | 必填 | 默认值 | 说明         |
| ------ | ------- | ---- | ------ | ------------ |
| page   | Integer | 否   | 1      | 当前页码     |
| size   | Integer | 否   | 10     | 每页显示条数 |

### 2.4 结构体定义

#### 2.4.1 用户结构体

#####  SimpleUserVO (简要信息)

适用场景：博客列表作者、评论人、点赞列表。

特点：仅包含展示头像和跳转主页所需的最基础信息。

| **字段名** | **类型** | **必填** | **说明** | **来源/备注**  |
| ---------- | -------- | -------- | -------- | -------------- |
| id       | Long     | 是       | 用户ID   |                |
| nickname | String   | 是       | 昵称     | 用于显示名字 |
| avatar   | String   | 否       | 头像URL  | 用于显示头像 |

```
{
	"id": 1001,
    "nickname": "zhangsan",
	"avatar": "http//..."
}
```

##### PublicUserVO(公开资料)

适用场景：查看他人主页。

特点：包含 SimpleUserVO 的所有字段，增加社交属性信息，但不包含敏感数据（如手机、邮箱）。

| **字段名**              | **类型** | **必填** | **说明** | **来源/备注**                          |
| ----------------------- | -------- | -------- | -------- | -------------------------------------- |
| (SimpleUserVO 所有字段) | -        | -        | -        | 直接继承SimpleUserVO                   |
| bio                     | String   | 否       | 个人简介 |                                        |
| createTime              | String   | 是       | 注册时间 | ISO8601格式日期，"2026-01-06T12:00:00" |

```
{
	"id": 1001,
    "nickname": "zhangsan",
	"avatar": "http//..."
	"bio": "...",
	"createTime": "2026-01-06T12:00:00"
}
```

##### PrivateUserVO (私有详情)

适用场景：用户登录返回、获取当前用户信息、更新个人资料返回。

特点：包含 PublicUserVO 的所有字段，增加账号安全和管理相关字段。

| **字段名**              | **类型** | **必填** | **说明** | **来源/备注**          |
| ----------------------- | -------- | -------- | -------- | ---------------------- |
| (PublicUserVO 所有字段) | -        | -        | -        | 直接继承 PrivateUserVO |
| username                | String   | 是       | 用户名   | 登录账号               |
| email                   | String   | 否       | 邮箱     | 私密信息               |
| role                    | Integer  | 是       | 角色     | 0:管理员, 1:普通用户   |

```
{
	"id": 1001,
    "nickname": "zhangsan",
	"avatar": "http//..."
	"bio": "...",
	"createTime": "2026-01-06T12:00:00",
	"username": "zhangsan",
	"email": "",
	"role": 1
}
```

#### 2.4.2 Blog结构体

##### BlogListVO (列表/卡片视图)

适用场景: 首页列表、搜索结果、分类文章列表、用户个人主页的文章列表。

不包含 Markdown正文，避免列表页传输大量数据导致卡顿。

| **字段名**     | **类型**              | **说明** | **来源/备注**                 |
| -------------- | --------------------- | -------- | --------------------------------- |
| id           | Long                  | 博客ID   |                                   |
| title        | String                | 标题     |                                   |
| summary      | String                | 摘要     | 用于列表预览                      |
| coverImage   | String                | 封面图   |                                   |
| viewCount    | Integer               | 浏览量   |                                   |
| likeCount    | Integer               | 点赞量   |                                   |
| createTime   | String                | 发布时间 | ISO8601格式日期 |
| author   | SimpleUserVO     | 作者信息 | 统一使用 `{id, nickname, avatar}` |
| category | SimpleCategoryVO | 分类信息 | 统一结构 `{id, name}`             |
| tags     | `List<SimpleTagVO>` | 标签列表 | 统一结构 `[{id, name}, ...]`      |

```
{
    "id": 1,
    "title": "Blog 标题",
    "summary": "这是摘要...",
    "coverImage": "http//..."
    "viewCount": 100,
    "likeCount": 10,
    "createTime": "2026-01-06T12:00:00",
    "author": {
        "id": 1001,
        "nickname": "zhangsan",
        "avatar": "http//..."
	},
    "category": { "id": 1, "name": "后端" },
    "tags": [{ "id": 1, "name": "Java" }]
}
```

##### BlogDetailVO (详情视图)

适用场景: 文章详情页

继承列表结构，补充正文和状态信息。

| **字段名**              | **类型** | **说明**     | **来源/备注**                    |
| ----------------------- | -------- | ------------ | ------------------------------------- |
| (BlogListVO 所有字段) | -        | -            | 直接继承 BlogListVO                 |
| content           | String   | 正文内容 | 仅在详情接口返回，Markdown 格式       |
| updateTime            | String   | 最后更新时间 | 展示文章的时效性                      |
| status                | Integer  | 状态         | 1:已发布, 0:草稿 (作者本人查看时有用) |

```
{
    "id": 1,
    "title": "Blog 标题",
    "summary": "这是摘要...",
    "coverImage": "http//..."
    "viewCount": 100,
    "likeCount": 10,
    "createTime": "2026-01-06T12:00:00",
    "author": {
        "id": 1001,
        "nickname": "zhangsan",
        "avatar": "http//..."
	},
    "category": { "id": 1, "name": "后端" },
    "tags": [{ "id": 1, "name": "Java" }]
    
    // Detail 特有字段
    "content": "# 第一章\n...",
    "status": 1,
    "updateTime": "2026-01-07T10:00:00"
}
```

#### 2.4.3 评论结构体

##### CommentVO

| 字段名     | 类型         | 说明       | 示例/备注                                    |
| ---------- | ------------ | ---------- | -------------------------------------------- |
| id         | Long         | 评论ID     | 501                                          |
| content    | String       | 内容       | "评论内容"                                   |
| createTime | String       | 评论时间   | ISO8601格式                                  |
| user       | SimpleUserVO | 评论人信息 | `{id: 1002, nickname: "...", avatar: "..."}` |
| parentId   | Long         | 父评论ID   | null (一级评论)                              |
| children   | Array        | 子评论列表 | `List<CommentVO>` (递归结构)                 |

#### 2.4.4 分类与标签结构体

##### CategoryVO

| 字段名      | 类型    | 说明               | 示例             |
| ----------- | ------- | ------------------ | ---------------- |
| id          | Long    | 分类ID             | 1                |
| name        | String  | 分类名称           | "前端开发"       |
| description | String  | 描述               | "HTML/CSS/JS..." |
| blogCount   | Integer | 该分类下的文章数量 | 15               |

##### TagVO

| 字段名    | 类型    | 说明         | 示例          |
| --------- | ------- | ------------ | ------------- |
| id        | Long    | 标签ID       | 1             |
| name      | String  | 标签名称     | "Spring Boot" |
| blogCount | Integer | 关联文章数量 | 99            |

## 3. 接口详情与数据字典

### 3.1 认证模块 

**Base Path**: `/api/auth`

#### 3.1.1 用户注册

- **URL**: `/register`
- **Method**: `POST`
- **说明**: 注册新用户，密码在后端需加密存储。

**请求参数说明**

| 字段名   | 类型   | 必填 | 说明       | 规则/示例              |
| -------- | ------ | ---- | ---------- | ---------------------- |
| username | String | 是   | 用户名     | 唯一，4-20字符         |
| password | String | 是   | 密码       | 6-20字符               |
| email    | String | 否   | 邮箱       | 合法邮箱格式           |
| nickname | String | 否   | 昵称(可选) | 默认为用户名，4-20字符 |

**请求示例**

```
{
  "username": "zhangsan",
  "password": "password123",
  "email": "zhangsan@example.com",
  "nickname": "zhangsan"
}
```

**响应数据说明**

- 类型: `PrivateUserVO`

**响应示例**

```
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userInfo": {
   	  "id": 1001,
      "nickname": "zhangsan",
      "avatar": "http//..."
      "bio": "...",
      "createTime": "2026-01-06T12:00:00",
      "username": "zhangsan",
      "email": "",
      "role": 1
	}
  }
}
```

#### 3.1.2 用户登录

- **URL**: `/login`
- **Method**: `POST`
- **说明**: 验证身份并返回 JWT Token。

**请求参数说明 **

| 字段名   | 类型   | 必填 | 说明   | 示例          |
| -------- | ------ | ---- | ------ | ------------- |
| username | String | 是   | 用户名 | "zhangsan"    |
| password | String | 是   | 密码   | "password123" |

**响应数据说明 **

| 字段名    | 类型          | 说明        | 示例      |
| --------- | ------------- | ----------- | --------- |
| token     | String        | JWT认证令牌 |           |
| tokenHead | String        | 令牌前缀    | "Bearer " |
| userInfo  | PrivateUserVO |             |           |

**响应示例**

```
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "",
    "tokenHead": "Bearer ",
    "userInfo": {
   	  "id": 1001,
      "nickname": "zhangsan",
      "avatar": "http//..."
      "bio": "...",
      "createTime": "2026-01-06T12:00:00",
      "username": "zhangsan",
      "email": "",
      "role": 1
	}
  }
}
```

#### 3.1.3 用户登出

- **URL**: `/logout`
- **Method**: `POST`
- **Header**: `Authorization` (必填)

**响应示例**

```
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

#### 3.1.4 获取当前用户信息

- **URL**: `/info`
- **Method**: `GET`
- **Header**: `Authorization` (必填)

**响应数据说明**

-   类型: `PrivateUserVO`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": {
    "userInfo": {
   	  "id": 1001,
      "nickname": "zhangsan",
      "avatar": "http//..."
      "bio": "...",
      "createTime": "2026-01-06T12:00:00",
      "username": "zhangsan",
      "email": "",
      "role": 1
	}
  }
}
```

#### 3.1.5 刷新 Token

- **URL**: `/refresh`
- **Method**: `POST`
- **Header**: `Authorization` (必填，携带旧 Token)
- **说明**: 当 Token 即将过期但用户仍在活跃时使用。

**响应示例**

```
{
  "code": 200,
  "data": {
    "token": "...",
    "tokenHead": "Bearer "
  }
}
```

### 3.2 用户模块 (User)

**Base Path**: `/api/user`

**废弃**
#### 3.2.1 获取用户信息

- **URL**: `/{id}`
- **Method**: `GET`
- **Path Param**: `id` (用户ID)
- **说明**: 查看其他用户的个人主页时调用，仅返回公开信息。

**响应数据**

- 类型: `PublicUserVO`

**响应示例**

```
{
  "code": 200,
  "data": {
    "userInfo": {
   	  "id": 1001,
      "nickname": "zhangsan",
      "avatar": "http//..."
      "bio": "...",
      "createTime": "2026-01-06T12:00:00"
	}
  }
}
```

#### 3.2.2 更新个人信息

- **URL**: `/profile`
- **Method**: `PUT`
- **Header**: `Authorization` (必填)

**请求参数说明**

| 字段名   | 类型   | 必填 | 说明     | 规则/示例     |
| -------- | ------ | ---- | -------- | ------------- |
| nickname | String | 否   | 昵称     | 2-10字符      |
| bio      | String | 否   | 个人简介 | 不超过100字符 |
| email    | String | 否   | 邮箱     | 合法邮箱格式  |

**请求示例**

```
{
  "nickname": "ABC",
  "bio": "Hello World",
  "email": "ABC@qq.com"
}
```

**响应数据说明 **

- 类型: `PrivateUserVO`（通3.1.4）

#### 3.2.3 修改密码

- **URL**: `/password`
- **Method**: `PUT`
- **Header**: `Authorization` (必填)

**请求参数说明**

| 字段名      | 类型   | 必填 | 说明   |
| ----------- | ------ | ---- | ------ |
| oldPassword | String | 是   | 旧密码 |
| newPassword | String | 是   | 新密码 |

**响应数据说明**

- 类型: `Null` 

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 3.2.4 上传头像

- **URL**: `/avatar`
- **Method**: `POST`
- **Header**: `Authorization` (必填), `Content-Type: multipart/form-data`
- **说明**: 上传用户头像文件，返回文件访问URL。

**请求参数说明**

| 字段名 | 类型 | 必填 | 说明                        |
| ------ | ---- | ---- | --------------------------- |
| file   | File | 是   | 图片文件 (jpg/png, max 2MB) |

**响应示例**

```
{
  "code": 200,
  "message": "上传成功",
  "data": "http://..."
}
```

### 3.3 博客模块 (Blog)

**Base Path**: `/api/blog`

#### 3.3.1 获取博客列表 (分页)

- **URL**: `/list`
- **Method**: `GET`

**请求参数说明**

| 参数名     | 类型    | 必填 | 说明              | 示例 |
| ---------- | ------- | ---- | ----------------- | ---- |
| page       | Integer | 否   | 页码 (默认1)      | 1    |
| size       | Integer | 否   | 每页条数 (默认10) | 10   |
| categoryId | Long    | 否   | 按分类筛选        | 5    |
| tagId      | Long    | 否   | 按标签筛选        | 2    |
| userId     | Long    | 否   | 按作者筛选        | 1001 |

**响应数据说明**

| 字段名  | 类型  | 说明                            |
| ------- | ----- | ------------------------------- |
| total   | Long  | 总记录数                        |
| size    | Long  | 每页大小                        |
| current | Long  | 当前页码                        |
| pages   | Long  | 总页数                          |
| records | Array | 博客列表数据 (List<BlogListVO>) |

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "size": 10,
    "current": 1,
    "pages": 5,
    "records": [
      {
        "id": 1,
        "title": "Blog 标题",
        "summary": "这是摘要...",
        "coverImage": "http//..."
        "viewCount": 100,
        "likeCount": 10,
        "createTime": "2026-01-06T12:00:00",
        "author": {
          "id": 1001,
          "nickname": "zhangsan",
          "avatar": "http//..."
        },
        "category": { "id": 1, "name": "后端" },
        "tags": [{ "id": 1, "name": "Java" }]
	  }
    ]
  }
}
```

#### 3.3.2 获取博客详情

- **URL**: `/{id}`
- **Method**: `GET`
- **Path Param**: `id` (博客ID)

**响应数据说明**

- 类型: `BlogDetailVO`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Blog 标题",
    "summary": "这是摘要...",
    "coverImage": "http//..."
    "viewCount": 100,
    "likeCount": 10,
    "createTime": "2026-01-06T12:00:00",
    "author": {
        "id": 1001,
        "nickname": "zhangsan",
        "avatar": "http//..."
	},
    "category": { "id": 1, "name": "后端" },
    "tags": [{ "id": 1, "name": "Java" }]
    
    // Detail 特有字段
    "content": "# 第一章\n...",
    "status": 1,
    "updateTime": "2026-01-07T10:00:00"
  }
}
```

#### 3.3.3 发表博客

- **URL**: `/api/blog`
- **Method**: `POST`
- **Header**: `Authorization` (必填)

**请求参数说明**

| 字段名     | 类型    | 必填 | 说明       | 规则/示例        |
| ---------- | ------- | ---- | ---------- | ---------------- |
| title      | String  | 是   | 标题       | 1-100字符        |
| content    | String  | 是   | 内容       | Markdown格式     |
| summary    | String  | 否   | 摘要       | 若空则自动截取   |
| coverImage | String  | 否   | 封面图URL  |                  |
| categoryId | Long    | 是   | 分类ID     | 必须存在         |
| tagIds     | Array   | 否   | 标签ID数组 | `[1, 2, 3]`      |
| status     | Integer | 否   | 状态       | 0: 草稿, 1: 发布 |

**请求示例**

```
{
  "title": "Vue3 组合式API实战",
  "content": "## 引言\n今天我们学习Vue3...",
  "summary": "本文主要介绍Vue3的新特性",
  "categoryId": 2,
  "coverImage": "https://..."
  "tagIds": [3, 4],
  "status": 1
}
```

**响应数据说明**

- 类型: `Long` (返回新创建的博客ID)

**响应示例**

```
{
  "code": 200,
  "message": "发表成功",
  "data": 102
}
```

#### 3.3.4 更新博客

- **URL**: `/{id}`
- **Method**: `PUT`
- **Path Param**: `id` (博客ID)
- **Header**: `Authorization` (必填)

**请求参数说明**

| 字段名     | 类型   | 必填 | 说明       | 示例                |
| ---------- | ------ | ---- | ---------- | ------------------- |
| title      | String | 否   | 标题       | "新标题"            |
| content    | String | 否   | 内容       | "新内容..."         |
| summary    | String | 否   | 摘要       | "新摘要"            |
| coverImage | String | 否   | 封面       | "http://..."        |
| categoryId | Long   | 否   | 分类ID     | 2                   |
| tagIds     | Array  | 否   | 标签ID数组 | `[1, 5]` (全量覆盖) |

**请求示例**

```
{
  "title": "新标题",
  "content": "新内容...",
  "summary": "新摘要",
  "coverImage": "https://..."
  "categoryId": 2,
  "tagIds": [1, 5],
  "status": 1
}
```

**响应数据说明**

- 类型: `Null`

**响应示例**

```
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

#### 3.3.5 搜索博客

- **URL**: `/search`
- **Method**: `GET`
- **说明**: 根据关键词搜索博客标题或摘要。返回列表视图（不含正文）。

**请求参数说明**

| 参数名     | 类型    | 必填 | 说明              | 示例     |
| ---------- | ------- | ---- | ----------------- | -------- |
| keyword    | String  | 是   | 搜索关键词        | "Spring" |
| page       | Integer | 否   | 页码 (默认1)      | 1        |
| size       | Integer | 否   | 每页条数 (默认10) | 10       |
| categoryId | Long    | 否   | 按分类筛选        | 5        |

**响应数据说明**

- 类型: `PageResult<BlogListVO>` (同 3.3.1)

#### 3.3.6 删除博客

- **URL**: `/{id}`
- **Method**: `DELETE`
- **Path Param**: `id` (博客ID)
- **Header**: `Authorization` (必填)
- **说明**: 删除博客。仅作者本人或管理员可执行此操作。

**请求参数说明**

无（仅路径参数）

**响应数据说明**

- 类型: `Null` 

**响应示例**

```
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

#### 3.3.7 获取用户的博客

- **URL**: `/user/{userId}`
- **Method**: `GET`
- **Path Param**: `userId` (目标用户ID)
- **说明**: 获取指定用户发布的博客列表（用于"个人主页-文章"标签页）。返回列表视图，不含正文。

**请求参数说明**

| 参数名 | 类型    | 必填 | 说明                                         | 示例 |
| ------ | ------- | ---- | -------------------------------------------- | ---- |
| page   | Integer | 否   | 页码 (默认1)                                 | 1    |
| size   | Integer | 否   | 每页条数 (默认10)                            | 10   |
| status | Integer | 否   | 按状态筛选 (0:草稿, 1:已发布, 不传则查全部)  | 1    |

**响应数据说明**

- 类型: `PageResult<BlogListVO>` (同 3.3.1)

#### 3.3.8 点赞博客

- **URL**: `/{id}/like`
- **Method**: `POST`
- **Path Param**: `id` (博客ID)
- **Header**: `Authorization` (必填)
- **说明**: 切换点赞状态（点赞/取消点赞）。

**请求参数说明**

无

**响应数据说明**

- 类型: `Null` 

**响应示例**

```
{ "code": 200, "message": "success", "data": null }
```

#### 3.3.9 上传博客封面图片

- **URL**: `/cover`
- **Method**: `POST`
- **Header**: `Authorization` (必填), `Content-Type: multipart/form-data`
- **说明**: 上传博客封面图片文件，返回图片访问URL。此接口专用于博客封面图上传，与用户头像上传接口（3.2.4节）分开。

**请求参数说明**

| 字段名 | 类型 | 必填 | 说明                        |
| ------ | ---- | ---- | --------------------------- |
| file   | File | 是   | 图片文件 (jpg/png, max 5MB) |

**响应数据说明**

- 类型: `String`（图片访问URL地址）

**响应示例**

```
{
  "code": 200,
  "message": "上传成功",
  "data": "http://..."
}
```

### 3.4 评论模块 (Comment)

**Base Path**: `/api/comment`

#### 3.4.1 发表评论

- **URL**: `/api/comment`
- **Method**: `POST`
- **Header**: `Authorization` (必填)

**请求参数说明**

| 字段名   | 类型   | 必填 | 说明     | 示例/备注     |
| -------- | ------ | ---- | -------- | ------------- |
| blogId   | Long   | 是   | 博客ID   | 102           |
| content  | String | 是   | 评论内容 | 字数限制500字 |
| parentId | Long   | 否   | 父评论ID | null          |

**请求示例**

```
{
  "blogId": 102,
  "content": "真棒！",
  "parentId": null
}
```

**响应数据说明**

- 类型: `CommentVO`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 501,
    "content": "评论",
    "createTime": "2026-01-06T12:00:00",
    "user": { "id": 1001, "nickname": "zhangsan", "avatar": "..." }
  }
}
```

#### 3.4.2 删除评论

- **URL**: `/{id}`
- **Method**: `DELETE`
- **Path Param**: `id` (评论ID)
- **Header**: `Authorization` (必填)
- **说明**: 仅评论发布者或管理员可删除，删除父评论时，通常策略为连同子评论一起删除，或保留子评论。

**请求参数说明**

无

**响应数据说明**

- 类型: `Null`

**响应示例**

```
{ "code": 200, "message": "success", "data": null }
```

#### 3.4.3 点赞评论

- **URL**: `/{id}/like`
- **Method**: `POST`
- **Path Param**: `id` (评论ID)
- **Header**: `Authorization` (必填)
- **说明**: 对某条评论进行点赞/取消点赞操作。

**请求参数说明**

无

**响应数据说明**

- 类型: `Null`

**响应示例**

```
{ "code": 200, "message": "success", "data": null }
```

#### 3.4.4 获取博客评论

- **URL**: `/blog/{blogId}`
- **Method**: `GET`
- **Path Param**: `blogId` (博客ID)

**响应数据说明**

- 类型: `List<CommentVO>`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "content": "第一条评论",
      "user": { "nickname": "用户A", "avatar": "..." },
      "createTime": "2026-01-06T12:00:00",
      "children": [
        {
           "id": 2,
           "content": "回复第一条",
           "user": { "nickname": "用户B", "avatar": "..." },
           "parentId": 1,
           "createTime": "2026-01-06T12:00:00"
        }
      ]
    }
  ]
}
```

### 3.5 收藏模块 (Favorite)

**Base Path**: `/api/favorites`

#### 3.5.1 添加收藏

- **URL**: `/api/favorites`
- **Method**: `POST`
- **Header**: `Authorization` (必填)
- **说明**: 将博客添加到指定收藏夹。如果 `tagName` 对应的收藏夹不存在，后端将自动创建该收藏夹标签。

**请求参数说明**

| 字段名  | 类型   | 必填 | 说明                                                         | 示例         |
| ------- | ------ | ---- | ------------------------------------------------------------ | ------------ |
| blogId  | Long   | 是   | 博客ID                                                       | 102          |
| tagName | String | 否   | 收藏夹标签名，若不传则使用"默认收藏夹"；若标签不存在则自动创建 | "学习资料"   |

**请求示例**

```
{
  "blogId": 102,
  "tagName": "学习资料"
}
```

**响应数据说明**

- 类型: `Null`

**响应示例**

```
{
  "code": 200,
  "message": "收藏成功",
  "data": null
}
```

#### 3.5.2 取消收藏

- **URL**: `/{blogId}`
- **Method**: `DELETE`
- **Path Param**: `blogId` (博客ID)
- **Header**: `Authorization` (必填)
- **说明**: 取消收藏指定博客。

**请求参数说明**

无（仅路径参数）

**响应数据说明**

- 类型: `Null`

**响应示例**

```
{
  "code": 200,
  "message": "取消收藏成功",
  "data": null
}
```

#### 3.5.3 获取收藏列表

- **URL**: `/list`
- **Method**: `GET`
- **Header**: `Authorization` (必填)
- **说明**: 获取当前用户的收藏博客列表，支持按标签筛选和分页。

**请求参数说明**

| 参数名 | 类型    | 必填 | 说明                           | 示例   |
| ------ | ------- | ---- | ------------------------------ | ------ |
| page   | Integer | 否   | 页码 (默认1)                   | 1      |
| size   | Integer | 否   | 每页条数 (默认10)              | 10     |
| tag    | String  | 否   | 按收藏标签筛选（空表示查全部） | "前端" |

**响应数据说明**

| 字段名  | 类型  | 说明                            |
| ------- | ----- | ------------------------------- |
| total   | Long  | 总记录数                        |
| size    | Long  | 每页大小                        |
| current | Long  | 当前页码                        |
| pages   | Long  | 总页数                          |
| records | Array | 收藏博客列表 (List<BlogListVO>) |

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 20,
    "size": 10,
    "current": 1,
    "pages": 2,
    "records": [
      {
        "id": 1,
        "title": "Blog 标题",
        "summary": "这是摘要...",
        "coverImage": "http//..."
        "viewCount": 100,
        "likeCount": 10,
        "createTime": "2026-01-06T12:00:00",
        "author": {
          "id": 1001,
          "nickname": "zhangsan",
          "avatar": "http//..."
        },
        "category": { "id": 1, "name": "后端" },
        "tags": [{ "id": 1, "name": "Java" }]
      }
    ]
  }
}
```

#### 3.5.4 获取收藏标签列表

- **URL**: `/tags`
- **Method**: `GET`
- **Header**: `Authorization` (必填)
- **说明**: 获取当前用户收藏的博客所包含的标签列表及对应收藏数量。

**请求参数说明**

无

**响应数据说明**

| 字段名 | 类型    | 说明               |
| ------ | ------- | ------------------ |
| id     | Long    | 标签ID             |
| name   | String  | 标签名称           |
| count  | Integer | 该标签下的收藏数量 |

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": [
    { "id": 1, "name": "前端", "count": 3 },
    { "id": 2, "name": "后端", "count": 5 },
    { "id": 3, "name": "Java", "count": 8 }
  ]
}
```

#### 3.5.5 检查是否已收藏

- **URL**: `/check/{blogId}`
- **Method**: `GET`
- **Path Param**: `blogId` (博客ID)
- **Header**: `Authorization` (必填)
- **说明**: 检查当前用户是否已收藏指定博客。

**请求参数说明**

无（仅路径参数）

**响应数据说明**

- 类型: `Boolean`（true表示已收藏，false表示未收藏）

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": true
}
```

#### 3.5.6 创建新的收藏夹

- **URL**: `/folder`
- **Method**: `POST`
- **Header**: `Authorization` (必填)
- **说明**: 为当前用户创建新的收藏夹。


**请求参数说明**

| 参数名 | 类型    | 必填 | 说明                           | 示例   |
| ------ | ------- | ---- | ------------------------------ | ------ |
| folder_name | String | 是   | 创建的收藏夹的名字           | 默认收藏夹 |


**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 3.5.7 获取收藏夹列表

- **URL**: `/folders`
- **Method**: `GET`
- **Header**: `Authorization` (必填)
- **说明**: 获取当前用户的收藏夹列表。


**请求参数说明**

无

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": [
    {"id": 1, "folder_name": "前端"},
    {"id": 3, "folder_name": "后端"},
    {"id": 9, "folder_name": "运维"},
  ]
}
```

#### 3.5.8 根据收藏夹名称获取博客列表

- **URL**: `/folder/blog`
- **Method**: `GET`
- **Header**: `Authorization` (必填)
- **说明**: 获取当前用户的收藏夹列表。


**请求参数说明**


| 参数名 | 类型    | 必填 | 说明                           | 示例   |
| ------ | ------- | ---- | ------------------------------ | ------ |
| page   | Integer | 否   | 页码 (默认1)                   | 1      |
| size   | Integer | 否   | 每页条数 (默认10)              | 10     |
| folder_name | String | 是   | 收藏夹的名字           | 默认收藏夹 |

**响应数据说明**

| 字段名  | 类型  | 说明                            |
| ------- | ----- | ------------------------------- |
| total   | Long  | 总记录数                        |
| size    | Long  | 每页大小                        |
| current | Long  | 当前页码                        |
| pages   | Long  | 总页数                          |
| records | Array | 收藏博客列表 (List<BlogListVO>) |

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 20,
    "size": 10,
    "current": 1,
    "pages": 2,
    "records": [
      {
        "id": 1,
        "title": "Blog 标题",
        "summary": "这是摘要...",
        "coverImage": "http//..."
        "viewCount": 100,
        "likeCount": 10,
        "createTime": "2026-01-06T12:00:00",
        "author": {
          "id": 1001,
          "nickname": "zhangsan",
          "avatar": "http//..."
        },
        "category": { "id": 1, "name": "后端" },
        "tags": [{ "id": 1, "name": "Java" }]
      }
    ]
  }
}
```

### 3.6 分类与标签 (Common)

#### 3.6.1 获取分类列表

- **URL**: `/api/category/list`
- **Method**: `GET`

**响应数据说明**

- 类型: `List<CategoryVO>`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": [
    { "id": 1, "name": "Java", "description": "...", "blogCount": 10 },
    { "id": 2, "name": "前端", "description": "...", "blogCount": 5 }
  ]
}
```

#### 3.6.2 获取分类下的博客

- **URL**: `/api/category/{id}/blogs`
- **Method**: `GET`
- **Path Param**: `id` (分类ID)
- **说明**: 获取指定分类下的所有文章列表（分页）。

**请求参数说明**

| 参数名 | 类型    | 必填 | 说明              | 示例 |
| ------ | ------- | ---- | ----------------- | ---- |
| page   | Integer | 否   | 页码 (默认1)      | 1    |
| size   | Integer | 否   | 每页条数 (默认10) | 10   |

**响应数据说明**

- 类型: `PageResult<BlogListVO>` (同 3.3.1)

#### 3.6.3 获取标签列表

- **URL**: `/api/tag/list`
- **Method**: `GET`
- **说明**: 获取所有标签数据（通常用于标签云或发布文章时的标签选择）。

**请求参数说明**

无

**响应数据说明**

- 类型: `List<TagVO>`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": [
    { "id": 1, "name": "Java", "blogCount": 100 },
    { "id": 2, "name": "Python", "blogCount": 50 },
    { "id": 3, "name": "Vue3", "blogCount": 35 }
  ]
}
```

#### 3.6.4 获取热门标签

- **URL**: `/api/tag/hot`
- **Method**: `GET`
- **说明**: 获取使用频率最高的标签（通常取前10）。

**响应数据说明**

- 类型: `List<TagVO>`

**响应示例**

```
{
  "code": 200,
  "message": "success",
  "data": [
    { "id": 1, "name": "Java", "blogCount": 100 },
    { "id": 2, "name": "Vue", "blogCount": 88 }
  ]
}
```

## 4. 业务状态码

前端需根据 `code` 进行全局消息提示。

| Code | Message        | 含义         |
| ---- | -------------- | ------------ |
| 200  | success        | 成功         |
| 400  | bad request    | 参数错误     |
| 401  | unauthorized   | 未认证       |
| 403  | forbidden      | 权限不足     |
| 404  | not found      | 资源未找到   |
| 500  | error          | 服务器错误   |
| 1001 | username exist | 用户名已存在 |
| 1002 | user not found | 用户不存在   |
| 1003 | password error | 密码错误     |
