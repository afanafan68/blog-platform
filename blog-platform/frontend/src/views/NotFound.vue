<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面不存在</h2>
      <p class="error-description">抱歉，您访问的页面不存在或已被删除</p>
      <div class="error-actions">
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
        <el-button @click="router.back()">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: calc(100vh - #{$nav-height});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.not-found-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: $border-color;
  line-height: 1;
  margin-bottom: $spacing-md;
}

.error-title {
  font-size: $font-size-2xl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.error-description {
  color: $text-secondary;
  margin-bottom: $spacing-xl;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
}
</style>
