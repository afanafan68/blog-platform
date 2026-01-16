<template>
  <div class="profile-page">
    <div class="container">
      <!-- 用户信息卡片 -->
      <section class="profile-card">
        <div class="profile-header">
          <el-avatar :size="100" :src="userStore.userInfo?.avatar">
            {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="profile-info">
            <h1 class="profile-name">{{ userStore.userInfo?.nickname || '未设置昵称' }}</h1>
            <p class="profile-bio">{{ userStore.userInfo?.bio || '这个人很懒，什么都没写~' }}</p>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.blogCount }}</span>
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.viewCount }}</span>
                <span class="stat-label">浏览</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.likeCount }}</span>
                <span class="stat-label">获赞</span>
              </div>
            </div>
          </div>
          <router-link to="/user/settings" class="edit-profile-btn">
            <el-button :icon="Edit">编辑资料</el-button>
          </router-link>
        </div>
      </section>

      <!-- 文章管理 -->
      <section class="articles-section">
        <div class="section-header">
          <h2 class="section-title">我的文章</h2>
          <el-radio-group v-model="articleStatus" @change="fetchMyBlogs">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="published">已发布</el-radio-button>
            <el-radio-button label="draft">草稿</el-radio-button>
          </el-radio-group>
        </div>

        <div class="articles-list" v-loading="loading">
          <div class="article-item" v-for="blog in blogs" :key="blog.id">
            <div class="article-cover" v-if="blog.coverImage">
              <img :src="blog.coverImage" :alt="blog.title" />
            </div>
            <div class="article-content">
              <div class="article-status">
                <el-tag :type="blog.status === 1 ? 'success' : 'info'" size="small">
                  {{ blog.status === 1 ? '已发布' : '草稿' }}
                </el-tag>
              </div>
              <h3 class="article-title" @click="goToDetail(blog)">{{ blog.title }}</h3>
              <p class="article-summary">{{ blog.summary }}</p>
              <div class="article-meta">
                <span class="date">{{ formatDate(blog.createdAt) }}</span>
                <span class="views" v-if="blog.status === 1">
                  <el-icon><View /></el-icon> {{ blog.viewCount }}
                </span>
                <span class="likes" v-if="blog.status === 1">
                  <el-icon><Star /></el-icon> {{ blog.likeCount }}
                </span>
              </div>
            </div>
            <div class="article-actions">
              <el-button text :icon="Edit" @click="handleEdit(blog.id)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" @click="handleDelete(blog.id)">
                删除
              </el-button>
            </div>
          </div>

          <el-empty v-if="!loading && blogs.length === 0" description="还没有文章，快去写一篇吧！">
            <el-button type="primary" @click="router.push('/write')">写文章</el-button>
          </el-empty>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Edit, Delete, View, Star } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import { getUserBlogs, deleteBlog } from '@/api/blog'
import { getUserStats } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const blogs = ref([])
const articleStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const stats = reactive({
  blogCount: 0,
  viewCount: 0,
  likeCount: 0
})

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 获取用户统计
const fetchUserStats = async () => {
  try {
    const res = await getUserStats()
    Object.assign(stats, res.data)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

// 获取我的文章
const fetchMyBlogs = async () => {
  loading.value = true
  try {
    const statusMap = {
      all: null,
      published: 1,
      draft: 0
    }
    const res = await getUserBlogs(userStore.userInfo.id, {
      page: currentPage.value,
      size: pageSize.value,
      status: statusMap[articleStatus.value]
    })
    blogs.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  } finally {
    loading.value = false
  }
}

// 跳转详情
const goToDetail = (blog) => {
  if (blog.status === 1) {
    router.push(`/blog/${blog.id}`)
  } else {
    router.push(`/edit/${blog.id}`)
  }
}

// 编辑文章
const handleEdit = (id) => {
  router.push(`/edit/${id}`)
}

// 删除文章
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？此操作不可恢复。', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteBlog(id)
    ElMessage.success('删除成功')
    fetchMyBlogs()
    fetchUserStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 分页
const handlePageChange = (page) => {
  currentPage.value = page
  fetchMyBlogs()
}

onMounted(() => {
  fetchUserStats()
  fetchMyBlogs()
})
</script>

<style lang="scss" scoped>
.profile-page {
  padding: $spacing-3xl 0;
}

.profile-card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $radius-xl;
  padding: $spacing-2xl;
  margin-bottom: $spacing-2xl;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.profile-bio {
  color: $text-secondary;
  margin-bottom: $spacing-lg;
}

.profile-stats {
  display: flex;
  gap: $spacing-xl;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-value {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $text-primary;
  }

  .stat-label {
    font-size: $font-size-sm;
    color: $text-tertiary;
  }
}

.edit-profile-btn {
  @media (max-width: $breakpoint-md) {
    margin-top: $spacing-md;
  }
}

.articles-section {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $radius-xl;
  padding: $spacing-2xl;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.section-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-primary;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  min-height: 200px;
}

.article-item {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
  border: 1px solid $border-color-light;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    border-color: $border-color;
    background-color: $bg-secondary;
  }

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.article-cover {
  flex-shrink: 0;
  width: 160px;
  height: 100px;
  border-radius: $radius-sm;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: $breakpoint-md) {
    width: 100%;
    height: 150px;
  }
}

.article-content {
  flex: 1;
  min-width: 0;
}

.article-status {
  margin-bottom: $spacing-xs;
}

.article-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-xs;
  cursor: pointer;

  &:hover {
    color: $color-accent;
  }

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-summary {
  color: $text-secondary;
  font-size: $font-size-sm;
  margin-bottom: $spacing-sm;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: $spacing-md;
  color: $text-tertiary;
  font-size: $font-size-xs;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.article-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  @media (max-width: $breakpoint-md) {
    flex-direction: row;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: $spacing-xl;
}
</style>
