<!-- src/views/BlogEdit.vue - 文章编辑页 -->
<template>
  <div class="edit-page">
    <div class="edit-container">
      <!-- 顶部操作栏 -->
      <header class="edit-header">
        <el-input
          v-model="form.title"
          placeholder="请输入文章标题..."
          class="title-input"
          maxlength="100"
        />
        <div class="header-actions">
          <el-button @click="handleSaveDraft" :loading="saving">
            保存草稿
          </el-button>
          <el-button type="primary" @click="handlePublish" :loading="publishing">
            发布文章
          </el-button>
        </div>
      </header>

      <!-- 编辑器区域 -->
      <div class="edit-content">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="请输入文章内容（支持 Markdown 格式）..."
          :autosize="{ minRows: 20, maxRows: 40 }"
          class="content-textarea"
        />
      </div>

      <!-- 发布设置弹窗 -->
      <el-dialog
        v-model="showPublishDialog"
        title="发布文章"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form :model="form" label-width="80px">
          <el-form-item label="文章分类">
            <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="文章标签">
            <el-select
              v-model="form.tagIds"
              multiple
              filterable
              allow-create
              placeholder="请选择或输入标签"
              style="width: 100%"
            >
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="文章摘要">
            <el-input
              v-model="form.summary"
              type="textarea"
              :rows="3"
              placeholder="请输入文章摘要（选填，不填则自动截取）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="封面图片">
            <div class="cover-uploader">
              <el-input
                v-model="form.coverImage"
                placeholder="请输入封面图片URL"
                clearable
              />
              <p class="cover-tip">可使用 https://picsum.photos/800/400 作为随机封面</p>
            </div>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="showPublishDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmPublish" :loading="publishing">
            确认发布
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { createBlog, getBlogDetail, updateBlog } from '@/api/blog'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const blogId = ref(null)
const saving = ref(false)
const publishing = ref(false)
const showPublishDialog = ref(false)
const categories = ref([])
const tags = ref([])

const form = reactive({
  title: '',
  content: '',
  summary: '',
  categoryId: null,
  tagIds: [],
  coverImage: '',
  status: 0 // 0-草稿 1-发布
})

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    if (res.code === 200) {
      categories.value = res.data || []
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const res = await getTags()
    if (res.code === 200) {
      tags.value = res.data || []
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

// 获取文章详情（编辑模式）
const fetchBlogDetail = async (id) => {
  try {
    const res = await getBlogDetail(id)
    if (res.code === 200) {
      const blog = res.data
      form.title = blog.title
      form.content = blog.content
      form.summary = blog.summary
      form.categoryId = blog.category?.id || null
      form.tagIds = blog.tags?.map(t => t.id) || []
      form.coverImage = blog.coverImage
      form.status = blog.status
    }
  } catch (error) {
    ElMessage.error('获取文章失败')
    router.push('/')
  }
}

// 验证表单
const validateForm = () => {
  if (!form.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return false
  }
  if (!form.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return false
  }
  return true
}

// 保存草稿
const handleSaveDraft = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const data = {
      ...form,
      status: 0 // 草稿状态
    }

    if (isEdit.value) {
      await updateBlog(blogId.value, data)
    } else {
      const res = await createBlog(data)
      if (res.code === 200) {
        blogId.value = res.data
        isEdit.value = true
        // 更新 URL
        router.replace(`/edit/${blogId.value}`)
      }
    }
    ElMessage.success('草稿保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 打开发布弹窗
const handlePublish = () => {
  if (!validateForm()) return
  showPublishDialog.value = true
}

// 确认发布
const confirmPublish = async () => {
  publishing.value = true
  try {
    const data = {
      ...form,
      status: 1 // 发布状态
    }

    // 如果没有填写摘要，自动截取
    if (!data.summary) {
      data.summary = form.content.replace(/[#*`>\-\[\]]/g, '').substring(0, 150)
    }

    // 如果没有封面，使用随机图片
    if (!data.coverImage) {
      data.coverImage = `https://picsum.photos/seed/${Date.now()}/800/400`
    }

    if (isEdit.value) {
      await updateBlog(blogId.value, data)
    } else {
      const res = await createBlog(data)
      if (res.code === 200) {
        blogId.value = res.data
      }
    }

    ElMessage.success('发布成功')
    showPublishDialog.value = false
    router.push(`/blog/${blogId.value}`)
  } catch (error) {
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

// 自动保存（每60秒）
let autoSaveTimer = null
const startAutoSave = () => {
  autoSaveTimer = setInterval(() => {
    if (form.title || form.content) {
      // 静默自动保存
      console.log('Auto saving...')
    }
  }, 60000)
}

// 离开页面提示
const handleBeforeUnload = (e) => {
  if (form.title || form.content) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  fetchCategories()
  fetchTags()

  // 判断是新建还是编辑
  if (route.params.id) {
    isEdit.value = true
    blogId.value = route.params.id
    fetchBlogDetail(route.params.id)
  }

  startAutoSave()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style lang="scss" scoped>
.edit-page {
  min-height: 100vh;
  background-color: $bg-primary;
}

.edit-container {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-lg;
}

.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md 0;
  margin-bottom: $spacing-lg;
  border-bottom: 1px solid $border-color;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    gap: $spacing-md;
  }
}

.title-input {
  flex: 1;
  max-width: 600px;

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent;
    padding: 0;
  }

  :deep(.el-input__inner) {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $text-primary;

    &::placeholder {
      color: $text-tertiary;
    }
  }
}

.header-actions {
  display: flex;
  gap: $spacing-sm;
}

.edit-content {
  background-color: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.content-textarea {
  :deep(.el-textarea__inner) {
    font-size: $font-size-base;
    line-height: 1.8;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background-color: transparent;
    border: none;
    box-shadow: none !important;
    resize: none;
  }
}

.cover-uploader {
  width: 100%;
}

.cover-tip {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin-top: $spacing-xs;
}
</style>
