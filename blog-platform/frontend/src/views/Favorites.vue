<!-- src/views/Favorites.vue - 收藏页（按标签分类） -->
<template>
  <div class="favorites-page page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">我的收藏</h1>
      <p class="page-subtitle">收藏的精彩文章</p>
    </header>

    <!-- 收藏标签分类 -->
    <div class="favorites-tags">
      <el-scrollbar>
        <div class="tags-wrapper">
          <el-button
            v-for="tag in allTags"
            :key="tag.id"
            :type="activeTag === tag.name ? 'primary' : 'default'"
            :class="['tag-btn', { active: activeTag === tag.name }]"
            @click="handleTagChange(tag.name)"
            round
          >
            {{ tag.name }}
            <span class="tag-count" v-if="tag.count">({{ tag.count }})</span>
          </el-button>
        </div>
      </el-scrollbar>
    </div>

    <!-- 收藏列表 -->
    <div class="blog-grid" v-loading="loading">
      <BlogCard v-for="blog in favoriteList" :key="blog.id" :blog="blog" />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && favoriteList.length === 0" class="empty-state">
      <el-empty :description="emptyDescription">
        <el-button type="primary" @click="router.push('/')">
          去发现精彩内容
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
import request from '@/api/index'
import BlogCard from '@/components/blog/BlogCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const favoriteList = ref([])
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const activeTag = ref('全部')
const tagsList = ref([])

// 合并"全部"选项和标签列表
const allTags = computed(() => {
  const totalCount = tagsList.value.reduce((sum, tag) => sum + tag.count, 0)
  return [
    { id: 0, name: '全部', count: totalCount },
    ...tagsList.value
  ]
})

// 空状态描述
const emptyDescription = computed(() => {
  return activeTag.value === '全部' ? '暂无收藏' : activeTag.value + ' 分类暂无收藏'
})

// 获取收藏标签列表
const fetchTags = async () => {
  try {
    const res = await request.get('/api/favorites/tags')
    if (res.code === 200) {
      tagsList.value = res.data || []
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

// 获取收藏列表
const fetchFavorites = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    if (activeTag.value !== '全部') {
      params.tag = activeTag.value
    }
    
    const res = await request.get('/api/favorites/list', { params })
    if (res.code === 200) {
      favoriteList.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    favoriteList.value = []
  } finally {
    loading.value = false
  }
}

// 切换标签
const handleTagChange = (tagName) => {
  activeTag.value = tagName
  currentPage.value = 1
  fetchFavorites()
}

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page
  fetchFavorites()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchTags()
  fetchFavorites()
})
</script>

<style lang="scss" scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: $spacing-lg;
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

.favorites-tags {
  margin-bottom: $spacing-xl;
  background-color: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-md;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  padding: $spacing-xs 0;
}

.tag-btn {
  flex-shrink: 0;
  font-size: $font-size-sm;
  
  &.active {
    font-weight: 600;
  }
  
  .tag-count {
    margin-left: 4px;
    opacity: 0.8;
    font-size: 12px;
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
