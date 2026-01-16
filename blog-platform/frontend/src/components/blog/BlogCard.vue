<!-- src/components/blog/BlogCard.vue - 博客卡片 -->
<template>
  <article class="blog-card" @click="goToDetail">
    <div class="card-cover" v-if="blog.coverImage">
      <img :src="blog.coverImage" :alt="blog.title" loading="lazy" />
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="category" v-if="blog.categoryName">{{ blog.categoryName }}</span>
        <span class="date">{{ formatDate(blog.createdAt) }}</span>
      </div>
      <h2 class="card-title">{{ blog.title }}</h2>
      <p class="card-summary">{{ blog.summary }}</p>
      <div class="card-footer">
        <div class="author">
          <el-avatar :size="24" :src="blog.author?.avatar">
            {{ blog.author?.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <span class="author-name">{{ blog.author?.nickname || '匿名' }}</span>
        </div>
        <div class="stats">
          <span class="stat-item">
            <el-icon><View /></el-icon>
            {{ formatNumber(blog.viewCount) }}
          </span>
          <span class="stat-item">
            <el-icon><ChatDotRound /></el-icon>
            {{ formatNumber(blog.commentCount) }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ChatDotRound, View } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formatDate = (date) => {
  const now = dayjs()
  const target = dayjs(date)
  const diffDays = now.diff(target, 'day')

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return target.format('MM-DD')
  }
}

const formatNumber = (num) => {
  if (!num) return 0
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

const goToDetail = () => {
  router.push(`/blog/${props.blog.id}`)
}
</script>

<style lang="scss" scoped>
.blog-card {
  background-color: $bg-primary;
  border-radius: $radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;
  box-shadow: $shadow-sm;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;

    .card-title {
      color: $color-primary;
    }

    .card-cover img {
      transform: scale(1.05);
    }
  }
}

.card-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-normal;
  }
}

.card-content {
  padding: $spacing-lg;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;

  .category {
    padding: 2px 8px;
    background-color: $color-primary-light;
    color: $color-primary;
    font-size: $font-size-xs;
    border-radius: $radius-sm;
    font-weight: 500;
  }

  .date {
    color: $text-tertiary;
    font-size: $font-size-xs;
  }
}

.card-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: $line-height-tight;
  transition: color $transition-fast;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  color: $text-secondary;
  font-size: $font-size-sm;
  line-height: $line-height-relaxed;
  margin-bottom: $spacing-md;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color-light;
}

.author {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .author-name {
    color: $text-secondary;
    font-size: $font-size-sm;
  }
}

.stats {
  display: flex;
  gap: $spacing-md;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: $text-tertiary;
  font-size: $font-size-xs;
}
</style>
