<template>
  <div class="settings-page">
    <div class="settings-container">
      <h1 class="page-title">个人设置</h1>

      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="profile">
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            class="settings-form"
          >
            <el-form-item label="头像">
              <div class="avatar-upload">
                <el-avatar :size="80" :src="profileForm.avatar">
                  {{ profileForm.nickname?.charAt(0) || 'U' }}
                </el-avatar>
                <el-upload
                  :show-file-list="false"
                  :http-request="handleAvatarUpload"
                  accept="image/*"
                >
                  <el-button size="small">更换头像</el-button>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="用户名">
              <el-input :value="userStore.userInfo?.username" disabled />
              <div class="form-tip">用户名不可修改</div>
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="profileForm.nickname" placeholder="请输入昵称" maxlength="20" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="个人简介" prop="bio">
              <el-input
                v-model="profileForm.bio"
                type="textarea"
                :rows="4"
                placeholder="介绍一下你自己吧"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="savingProfile" @click="saveProfile">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 修改密码 -->
        <el-tab-pane label="修改密码" name="password">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
            class="settings-form"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入当前密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码（至少6位）"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="savingPassword" @click="savePassword">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 账号安全 -->
        <el-tab-pane label="账号安全" name="security">
          <div class="security-section">
            <div class="security-item">
              <div class="security-info">
                <h3>退出登录</h3>
                <p>退出当前账号登录状态</p>
              </div>
              <el-button @click="handleLogout">退出登录</el-button>
            </div>

            <el-divider />

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { uploadImage } from '@/api/upload'
import { updatePassword, updateProfile } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('profile')
const profileFormRef = ref()
const passwordFormRef = ref()
const savingProfile = ref(false)
const savingPassword = ref(false)

// 个人信息表单
const profileForm = reactive({
  avatar: '',
  nickname: '',
  email: '',
  bio: ''
})

const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 初始化表单数据
const initFormData = () => {
  const user = userStore.userInfo
  if (user) {
    profileForm.avatar = user.avatar || ''
    profileForm.nickname = user.nickname || ''
    profileForm.email = user.email || ''
    profileForm.bio = user.bio || ''
  }
}

// 上传头像
const handleAvatarUpload = async ({ file }) => {
  try {
    const res = await uploadImage(file)
    profileForm.avatar = res.data.url
    ElMessage.success('头像上传成功')
  } catch (error) {
    ElMessage.error('头像上传失败')
  }
}

// 保存个人信息
const saveProfile = async () => {
  const valid = await profileFormRef.value.validate().catch(() => false)
  if (!valid) return

  savingProfile.value = true
  try {
    await updateProfile(profileForm)
    await userStore.fetchUserInfo()
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    savingProfile.value = false
  }
}

// 修改密码
const savePassword = async () => {
  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) return

  savingPassword.value = true
  try {
    await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功，请重新登录')
    await userStore.doLogout()
    router.push('/login')
  } catch (error) {
    ElMessage.error(error.message || '密码修改失败')
  } finally {
    savingPassword.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await userStore.doLogout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    // 用户取消操作，不做处理
  }
}

onMounted(() => {
  initFormData()
})
</script>

<style lang="scss" scoped>
.settings-page {
  padding: $spacing-3xl 0;
  min-height: calc(100vh - #{$nav-height});
  background-color: $bg-secondary;
}

.settings-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.page-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

:deep(.el-tabs__nav-wrap) {
  margin-bottom: $spacing-lg;
}

:deep(.el-tabs__content) {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.settings-form {
  max-width: 500px;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.form-tip {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin-top: $spacing-xs;
}

.security-section {
  max-width: 500px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md 0;

  &.danger {
    .security-info h3 {
      color: #F56C6C;
    }
  }
}

.security-info {
  h3 {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }

  p {
    font-size: $font-size-sm;
    color: $text-tertiary;
    margin: 0;
  }
}
</style>
