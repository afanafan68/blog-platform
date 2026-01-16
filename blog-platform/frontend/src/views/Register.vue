<!-- src/views/Register.vue - 注册页（独立布局） -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- 左侧品牌区域 -->
      <div class="auth-brand">
        <div class="brand-content">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 class="brand-title">Blog Platform</h1>
          <p class="brand-desc">加入我们，开始你的创作之旅</p>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="auth-form-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">创建账号</h2>
            <p class="auth-subtitle">填写信息完成注册</p>
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
                placeholder="用户名"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="form.email"
                placeholder="邮箱"
                size="large"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码（至少6位）"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="确认密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                native-type="submit"
                class="submit-btn"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>

          <div class="auth-footer">
            <span>已有账号？</span>
            <router-link to="/login" class="link">立即登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { Lock, Message, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.doRegister({
      username: form.username,
      email: form.email,
      password: form.password
    })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('Register failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  background-color: $bg-secondary;
}

.auth-container {
  display: flex;
  min-height: 100vh;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.auth-brand {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: $spacing-2xl;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-xl;
    min-height: 200px;
  }
}

.brand-content {
  text-align: center;
  color: white;
}

.brand-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto $spacing-lg;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: $radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
  }

  @media (max-width: $breakpoint-md) {
    width: 60px;
    height: 60px;
    margin-bottom: $spacing-md;

    svg {
      width: 30px;
      height: 30px;
    }
  }
}

.brand-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  margin-bottom: $spacing-sm;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

.brand-desc {
  font-size: $font-size-base;
  opacity: 0.8;
  max-width: 300px;
  margin: 0 auto;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-sm;
  }
}

.auth-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  background-color: $bg-primary;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-xl;
  }
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-header {
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
