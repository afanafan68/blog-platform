<template>
  <div class="detail-page" v-loading="loading">
    <article class="article" v-if="blog">
      <!-- 文章头部 -->
      <header class="article-header">
        <div class="article-meta">
          <span class="category" v-if="blog.categoryName">{{ blog.categoryName }}</span>
          <span class="date">{{ formatDate(blog.createdAt) }}</span>
          <span class="views"><el-icon><View /></el-icon> {{ blog.viewCount }} 阅读</span>
        </div>
        <h1 class="article-title">{{ blog.title }}</h1>
        <div class="author-info">
          <el-avatar :size="48" :src="blog.author?.avatar">
            {{ blog.author?.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="author-detail">
            <span class="author-name">{{ blog.author?.nickname || '匿名用户' }}</span>
            <span class="author-bio">{{ blog.author?.bio || '这个人很懒，什么都没写' }}</span>
          </div>
        </div>
      </header>

      <!-- 封面图 -->
      <div class="article-cover" v-if="blog.coverImage">
        <img :src="blog.coverImage" :alt="blog.title" />
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <MdPreview :modelValue="blog.content" />
      </div>

      <!-- 标签 -->
      <div class="article-tags" v-if="blog.tags?.length">
        <el-tag v-for="tag in blog.tags" :key="tag.id" type="info" effect="plain">
          {{ tag.name }}
        </el-tag>
      </div>

      <!-- 操作按钮 -->
      <div class="article-actions">
        <el-button
          :type="isLiked ? 'primary' : 'default'"
          :icon="StarFilled"
          @click="handleLike"
        >
          {{ isLiked ? '已点赞' : '点赞' }} {{ blog.likeCount }}
        </el-button>

        <template v-if="isAuthor">
          <el-button :icon="Edit" @click="handleEdit">编辑</el-button>
          <el-button :icon="Delete" type="danger" plain @click="handleDelete">删除</el-button>
        </template>
      </div>

      <!-- 分隔线 -->
      <el-divider />

      <!-- 评论区 -->
      <section class="comments-section">
        <h3 class="section-title">评论 ({{ comments.length }})</h3>

        <!-- 评论输入框 -->
        <div class="comment-form" v-if="userStore.isLoggedIn">
          <el-avatar :size="40" :src="userStore.userInfo?.avatar">
            {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="comment-input-wrapper">
            <el-input
              v-model="commentContent"
              type="textarea"
              :rows="3"
              placeholder="写下你的评论..."
              maxlength="500"
              show-word-limit
            />
            <el-button
              type="primary"
              :loading="submittingComment"
              :disabled="!commentContent.trim()"
              @click="submitComment"
            >
              发表评论
            </el-button>
          </div>
        </div>
        <div class="login-tip" v-else>
          <router-link to="/login">登录</router-link> 后参与评论
        </div>

        <!-- 评论列表 -->
        <div class="comment-list">
          <div class="comment-item" v-for="comment in comments" :key="comment.id">
            <el-avatar :size="40" :src="comment.user?.avatar">
              {{ comment.user?.nickname?.charAt(0) || 'U' }}
            </el-avatar>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{{ comment.user?.nickname || '匿名用户' }}</span>
                <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
              <div class="comment-actions">
                <button class="action-btn" @click="handleCommentLike(comment)">
                  <el-icon><Star /></el-icon>
                  {{ comment.likeCount || 0 }}
                </button>
                <button
                  class="action-btn"
                  v-if="comment.user?.id === userStore.userInfo?.id"
                  @click="handleDeleteComment(comment.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>

          <el-empty v-if="comments.length === 0" description="暂无评论，来抢沙发吧！" />
        </div>
      </section>
    </article>

    <!-- 404 状态 -->
    <div class="not-found" v-if="!loading && !blog">
      <el-empty description="文章不存在或已被删除">
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { View, StarFilled, Star, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import { getBlogDetail, deleteBlog, likeBlog } from '@/api/blog'
import { getComments, createComment, deleteComment, likeComment } from '@/api/comment'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const blog = ref(null)
const comments = ref([])
const isLiked = ref(false)
const commentContent = ref('')
const submittingComment = ref(false)

// 是否为作者
const isAuthor = computed(() => {
  return userStore.isLoggedIn && blog.value?.author?.id === userStore.userInfo?.id
})

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm')
}

// 获取文章详情
const fetchBlogDetail = async () => {
  loading.value = true
  try {
    const res = await getBlogDetail(route.params.id)
    blog.value = res.data
    isLiked.value = res.data.isLiked || false
  } catch (error) {
    blog.value = null
  } finally {
    loading.value = false
  }
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const res = await getComments(route.params.id)
    comments.value = res.data
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
}

// 点赞文章
const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    await likeBlog(blog.value.id)
    isLiked.value = !isLiked.value
    blog.value.likeCount += isLiked.value ? 1 : -1
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 编辑文章
const handleEdit = () => {
  router.push(`/edit/${blog.value.id}`)
}

// 删除文章
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？此操作不可恢复。', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteBlog(blog.value.id)
    ElMessage.success('删除成功')
    router.push('/')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 发表评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return

  submittingComment.value = true
  try {
    await createComment({
      blogId: blog.value.id,
      content: commentContent.value
    })
    ElMessage.success('评论成功')
    commentContent.value = ''
    fetchComments()
    blog.value.commentCount++
  } catch (error) {
    ElMessage.error('评论失败')
  } finally {
    submittingComment.value = false
  }
}

// 点赞评论
const handleCommentLike = async (comment) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    await likeComment(comment.id)
    comment.likeCount = (comment.likeCount || 0) + 1
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除评论
const handleDeleteComment = async (commentId) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteComment(commentId)
    ElMessage.success('删除成功')
    fetchComments()
    blog.value.commentCount--
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchBlogDetail()
  fetchComments()
})
</script>

<style lang="scss" scoped>
.detail-page {
  padding: $spacing-3xl 0;
}

.article {
  max-width: $content-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.article-header {
  margin-bottom: $spacing-xl;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
  color: $text-tertiary;
  font-size: $font-size-sm;

  .category {
    padding: 2px 10px;
    background-color: $bg-secondary;
    border-radius: $radius-sm;
    color: $text-secondary;
  }

  .views {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.article-title {
  font-size: $font-size-4xl;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.3;
  margin-bottom: $spacing-lg;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

.author-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.author-detail {
  display: flex;
  flex-direction: column;

  .author-name {
    font-weight: 600;
    color: $text-primary;
  }

  .author-bio {
    font-size: $font-size-sm;
    color: $text-tertiary;
  }
}

.article-cover {
  margin-bottom: $spacing-xl;
  border-radius: $radius-lg;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.article-content {
  margin-bottom: $spacing-xl;

  :deep(.md-editor-preview-wrapper) {
    padding: 0;

    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: $text-primary;
    }

    p {
      margin-bottom: 1em;
      line-height: 1.8;
      color: $text-secondary;
    }

    pre {
      background-color: $bg-secondary;
      border-radius: $radius-md;
      padding: $spacing-md;
    }

    blockquote {
      border-left: 4px solid $border-color;
      padding-left: $spacing-md;
      color: $text-tertiary;
      margin: $spacing-md 0;
    }

    img {
      max-width: 100%;
      border-radius: $radius-md;
    }
  }
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-xl;
}

.article-actions {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

// 评论区样式
.comments-section {
  margin-top: $spacing-xl;
}

.section-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.comment-form {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.comment-input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  align-items: flex-end;
}

.login-tip {
  padding: $spacing-lg;
  background-color: $bg-secondary;
  border-radius: $radius-md;
  text-align: center;
  color: $text-secondary;
  margin-bottom: $spacing-xl;

  a {
    color: $color-accent;
    font-weight: 500;
  }
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.comment-item {
  display: flex;
  gap: $spacing-md;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xs;

  .comment-author {
    font-weight: 600;
    color: $text-primary;
  }

  .comment-time {
    font-size: $font-size-xs;
    color: $text-tertiary;
  }
}

.comment-content {
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-sm;
}

.comment-actions {
  display: flex;
  gap: $spacing-md;

  .action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    background: none;
    border: none;
    color: $text-tertiary;
    font-size: $font-size-sm;
    cursor: pointer;

    &:hover {
      color: $text-primary;
    }
  }
}

.not-found {
  padding: $spacing-3xl 0;
}
</style>
