<template>
  <div class="home-page">
    <div class="container">
      <!-- 页面标题 -->
      <header class="page-header">
        <h1 class="page-title">最新文章</h1>
        <p class="page-subtitle">发现精彩内容，分享你的故事</p>
      </header>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <button
          class="filter-btn"
          :class="{ active: !selectedCategory }"
          @click="selectedCategory = null"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          class="filter-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- 文章列表 -->
      <div class="blog-grid" v-loading="loading">
        <BlogCard v-for="blog in blogList" :key="blog.id" :blog="blog" />
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && blogList.length === 0" class="empty-state">
        <el-empty description="暂无文章" />
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import { getBlogList, getCategories } from '@/api/blog'

const loading = ref(false)
const blogList = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const fetchBlogs = async () => {
  loading.value = true
  try {
    const res = await getBlogList({
      page: currentPage.value,
      size: pageSize.value,
      categoryId: selectedCategory.value
    })
    blogList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchBlogs()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(selectedCategory, () => {
  currentPage.value = 1
  fetchBlogs()
})

onMounted(() => {
  fetchBlogs()
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.home-page {
  padding: $spacing-3xl 0;
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-2xl;
}

.page-title {
  font-size: $font-size-4xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  color: $text-secondary;
  font-size: $font-size-lg;
}

.category-filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-2xl;
}

.filter-btn {
  padding: $spacing-sm $spacing-lg;
  background-color: transparent;
  border: 1px solid $border-color;
  border-radius: 20px;
  color: $text-secondary;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-accent;
    color: $text-primary;
  }

  &.active {
    background-color: $color-accent;
    border-color: $color-accent;
    color: $text-inverse;
  }
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  min-height: 300px;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  padding: $spacing-3xl 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: $spacing-2xl;
}
</style>
