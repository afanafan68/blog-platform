import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// 引入全局样式
import '@/styles/global.scss'

// 根据环境变量决定是否启用 Mock
// 设置 VITE_USE_MOCK=true 启用 Mock 数据，否则使用真实后端 API
if (import.meta.env.VITE_USE_MOCK === 'true') {
  import('./mock').then(() => {
    console.log('Mock 数据已启用')
  })
} else {
  console.log('使用真实后端 API')
}

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
