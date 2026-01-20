<!-- src/views/Search.vue - 搜索页 -->
<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索头部 -->
      <header class="search-header">
        <h1 class="search-title">
          <template v-if="keyword">
            搜索 <span class="keyword">"{{ keyword }}"</span> 的结果
          </template>
          <template v-else>
            搜索文章
          </template>
        </h1>
        <p class="search-count" v-if="!loading && keyword">
          共找到 <strong>{{ total }}</strong> 篇相关文章
        </p>
      </header>

      <!-- 搜索过滤器 -->
      <div class="search-filters">
        <el-input
          v-model="searchInput"
          placeholder="输入关键词搜索..."
          :prefix-icon="Search"
          size="large"
          @keyup.enter="handleSearch"
          clearable
          class="search-input"
        />
        <div class="filter-options">
          <el-select v-model="sortBy" placeholder="排序方式" @change="fetchResults">
            <el-option label="最新发布" value="time" />
            <el-option label="最多浏览" value="views" />
            <el-option label="最多点赞" value="likes" />
          </el-select>
          <el-select
            v-model="categoryFilter"
            placeholder="选择分类"
            clearable
            @change="fetchResults"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-loading="loading">
        <div class="result-list" v-if="results.length > 0">
          <article
            class="result-item"
            v-for="blog in results"
            :key="blog.id"
            @click="goToDetail(blog.id)"
          >
            <div class="result-cover" v-if="blog.coverImage">
              <img :src="blog.coverImage" :alt="blog.title" />
            </div>
            <div class="result-content">
              <h2 class="result-title" v-html="highlightKeyword(blog.title)"></h2>
              <p class="result-summary" v-html="highlightKeyword(blog.summary)"></p>
              <div class="result-meta">
                <span class="author">
                  <el-avatar :size="20" :src="blog.author?.avatar">
                    {{ blog.author?.nickname?.charAt(0) || 'U' }}
                  </el-avatar>
                  {{ blog.author?.nickname || '匿名' }}
                </span>
                <span class="date">{{ formatDate(blog.createTime) }}</span>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ blog.viewCount || 0 }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-if="!loading && results.length === 0 && keyword"
          description="未找到相关文章"
        >
          <el-button type="primary" @click="router.push('/')">浏览全部文章</el-button>
        </el-empty>

        <!-- 初始状态 -->
        <div v-if="!loading && !keyword" class="search-tips">
          <el-icon :size="48" color="#ddd"><Search /></el-icon>
          <p>输入关键词搜索文章</p>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { searchBlog } from '@/api/blog'
import { getCategories } from '@/api/category'
import { Search, View } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const keyword = ref('')
const searchInput = ref('')
const results = ref([])
const categories = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref('time')
const categoryFilter = ref(null)

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 高亮关键词
const highlightKeyword = (text) => {
  if (!keyword.value || !text) return text
  const regex = new RegExp(`(${escapeRegExp(keyword.value)})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 转义正则特殊字符
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 搜索
const fetchResults = async () => {
  if (!keyword.value.trim()) {
    results.value = []
    total.value = 0
    return
  }

  loading.value = true
  try {
    const params = {
      q: keyword.value,
      page: currentPage.value,
      size: pageSize.value,
      sort: sortBy.value
    }
    if (categoryFilter.value) {
      params.categoryId = categoryFilter.value
    }

    const res = await searchBlog(params)
    results.value = res.data.list || res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('Search failed:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

// 获取分类
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 处理搜索
const handleSearch = () => {
  const q = searchInput.value.trim()
  if (q) {
    router.push({ path: '/search', query: { q } })
  }
}

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page
  fetchResults()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 跳转详情
const goToDetail = (id) => {
  router.push(`/blog/${id}`)
}

// 监听路由参数变化
watch(
  () => route.query.q,
  (newVal) => {
    keyword.value = newVal || ''
    searchInput.value = newVal || ''
    currentPage.value = 1
    if (newVal) {
      fetchResults()
    } else {
      results.value = []
      total.value = 0
    }
  },
  { immediate: true }
)

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.search-page {
  padding: $spacing-3xl 0;
  min-height: calc(100vh - #{$nav-height});
}

.search-header {
  margin-bottom: $spacing-xl;
}

.search-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-sm;

  .keyword {
    color: $color-accent;
  }
}

.search-count {
  color: $text-secondary;
  font-size: $font-size-base;
  margin: 0;

  strong {
    color: $text-primary;
    font-weight: 600;
  }
}

.search-filters {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.search-input {
  flex: 1;
  min-width: 300px;

  @media (max-width: $breakpoint-md) {
    min-width: 100%;
  }
}

.filter-options {
  display: flex;
  gap: $spacing-sm;
}

.search-results {
  min-height: 400px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.result-item {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.result-cover {
  flex-shrink: 0;
  width: 200px;
  height: 140px;
  border-radius: $radius-md;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: $breakpoint-md) {
    width: 100%;
    height: 180px;
  }
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: $line-height-tight;

  :deep(mark) {
    background-color: #FEF08A;
    color: inherit;
    padding: 0 2px;
    border-radius: 2px;
  }
}

.result-summary {
  flex: 1;
  color: $text-secondary;
  font-size: $font-size-sm;
  line-height: $line-height-relaxed;
  margin-bottom: $spacing-md;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  :deep(mark) {
    background-color: #FEF08A;
    color: inherit;
    padding: 0 2px;
    border-radius: 2px;
  }
}

.result-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  color: $text-tertiary;
  font-size: $font-size-xs;

  .author {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .views {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.search-tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-3xl;
  color: $text-tertiary;

  p {
    margin-top: $spacing-md;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: $spacing-2xl;
}
</style>
