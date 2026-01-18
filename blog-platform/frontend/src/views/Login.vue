<!-- src/views/Login.vue - 登录页（居中小窗口样式） -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- 居中登录卡片 -->
      <div class="auth-card">
        <!-- Logo 和标题 -->
        <div class="auth-header">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 class="brand-title">C-Blog</h1>
          <p class="auth-subtitle">欢迎回来，请登录您的账号</p>
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
import { useUserStore } from '@/stores/user'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: '123456',
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
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: $spacing-xl;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: $radius-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: $spacing-2xl;
  border: 1px solid #eaeaea;
}

.auth-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.brand-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto $spacing-md;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 32px;
    height: 32px;
  }
}

.brand-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.auth-subtitle {
  color: $text-secondary;
  font-size: $font-size-sm;
  margin: 0;
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
    color: $color-primary;
    font-weight: 500;
    margin-left: $spacing-xs;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
