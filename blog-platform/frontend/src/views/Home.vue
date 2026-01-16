<!--src/views/Home.vue - 首页-->
<template>
  <div class="home-page page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">最新文章</h1>
      <p class="page-subtitle">发现精彩内容，分享你的故事</p>
    </header>

    <!-- 文章列表 -->
    <div class="blog-grid" v-loading="loading">
      <BlogCard v-for="blog in blogList" :key="blog.id" :blog="blog" />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && blogList.length === 0" class="empty-state">
      <el-empty description="暂无文章">
        <el-button type="primary" @click="router.push('/write')" v-if="userStore.isLoggedIn">
          写第一篇文章
        </el-button>
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
        background
      />
    </div>
  </div>
</template>

<script setup>
import { getBlogList } from '@/api/blog'
import BlogCard from '@/components/blog/BlogCard.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const blogList = ref([])
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const fetchBlogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    // 分类筛选（从侧边栏传来）
    if (route.query.category) {
      params.categoryId = route.query.category
    }

    const res = await getBlogList(params)
    blogList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
    blogList.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchBlogs()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听分类变化
watch(() => route.query.category, () => {
  currentPage.value = 1
  fetchBlogs()
})

onMounted(() => {
  fetchBlogs()
})
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: $spacing-xl;
  text-align: center;

  @media (max-width: $breakpoint-md) {
    text-align: left;
  }
}

.page-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xs;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

.page-subtitle {
  color: $text-secondary;
  font-size: $font-size-base;
  margin: 0;
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
    gap: $spacing-md;
  }
}

.empty-state {
  padding: $spacing-3xl 0;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: $spacing-2xl;
}
</style>
