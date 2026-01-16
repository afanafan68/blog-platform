<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">欢迎回来</h1>
          <p class="auth-subtitle">登录以继续访问</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="auth-form"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名或邮箱"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="form.remember">记住我</el-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              native-type="submit"
              class="submit-btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.doLogin({
      username: form.username,
      password: form.password
    })
    ElMessage.success('登录成功')

    // 跳转到之前的页面或首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: calc(100vh - #{$nav-height});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  background-color: $bg-secondary;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background-color: $bg-primary;
  border-radius: $radius-xl;
  padding: $spacing-2xl;
  box-shadow: $shadow-lg;
}

.auth-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.auth-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.auth-subtitle {
  color: $text-secondary;
  font-size: $font-size-sm;
}

.auth-form {
  .el-form-item {
    margin-bottom: $spacing-md;
  }

  :deep(.el-input__wrapper) {
    padding: 12px 15px;
    border-radius: $radius-md;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;

  .forgot-link {
    color: $text-secondary;
    font-size: $font-size-sm;

    &:hover {
      color: $color-accent;
    }
  }
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: $font-size-base;
  border-radius: $radius-md;
}

.auth-footer {
  text-align: center;
  margin-top: $spacing-lg;
  color: $text-secondary;
  font-size: $font-size-sm;

  .link {
    color: $color-accent;
    font-weight: 500;
    margin-left: $spacing-xs;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
