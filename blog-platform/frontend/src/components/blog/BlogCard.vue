<template>
  <article class="blog-card" @click="goToDetail">
    <div class="card-cover" v-if="blog.coverImage">
      <img :src="blog.coverImage" :alt="blog.title" />
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
          <span><el-icon><View /></el-icon> {{ blog.viewCount || 0 }}</span>
          <span><el-icon><ChatDotRound /></el-icon> {{ blog.commentCount || 0 }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { View, ChatDotRound } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

const goToDetail = () => {
  router.push(`/blog/${props.blog.id}`)
}
</script>

<style lang="scss" scoped>
.blog-card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;

    .card-title {
      color: $color-accent;
    }
  }
}

.card-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-normal;
  }

  &:hover img {
    transform: scale(1.05);
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
    background-color: $bg-secondary;
    color: $text-secondary;
    font-size: $font-size-xs;
    border-radius: $radius-sm;
  }

  .date {
    color: $text-tertiary;
    font-size: $font-size-xs;
  }
}

.card-title {
  font-size: $font-size-xl;
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
  -webkit-line-clamp: 3;
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
  color: $text-tertiary;
  font-size: $font-size-xs;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
