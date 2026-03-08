<script setup lang="ts">
import { computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon } from '@heroicons/vue/24/outline'
import { useBlog } from '../composables/useBlog'

// --- Highlight.js 配置开始 ---
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml' // 用于 Vue 模板高亮
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)

// 导入深色主题
import 'highlight.js/styles/github-dark.css'
// --- Highlight.js 配置结束 ---

const route = useRoute()
const router = useRouter()
const { getPostBySlug } = useBlog()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getPostBySlug(slug.value))

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.push('/blog')
}

// 核心函数：执行高亮 (已修复重复调用警告)
const applyHighlighting = () => {
  nextTick(() => {
    const blocks = document.querySelectorAll('pre code')
    
    blocks.forEach((block) => {
      const el = block as HTMLElement
      
      // 【关键修复】检查是否已经高亮过
      // highlight.js 在高亮完成后会自动添加 data-highlighted="yes"
      // 如果已存在该属性，说明已经处理过，直接跳过以避免警告和重复操作
      if (el.getAttribute('data-highlighted') === 'yes') {
        return
      }
      
      hljs.highlightElement(el)
    })
  })
}

// 监听 post 变化：当路由切换或数据加载完成时触发高亮
watch(post, (newPost) => {
  if (newPost) {
    applyHighlighting()
  }
}, { immediate: true }) // immediate: true 确保组件初始化时如果有数据也执行

// 兜底：组件挂载时也尝试执行一次
// 即使 watch 已经执行过，由于 applyHighlighting 内部有去重检查，这里再次调用也是安全的
onMounted(() => {
  if (post.value) {
    applyHighlighting()
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12 animate-fade-in-up">
    <div class="max-w-4xl mx-auto px-6">
      
      <!-- Back Button -->
      <button 
        @click="goBack" 
        class="group flex items-center gap-2 text-slate-500 hover:text-accent transition-colors mb-8 font-medium"
      >
        <ArrowLeftIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </button>

      <article v-if="post" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <!-- Cover Image -->
        <div v-if="post.coverImage" class="w-full h-64 md:h-96 overflow-hidden">
          <img :src="post.coverImage" :alt="post.title" class="w-full h-full object-cover" />
        </div>

        <!-- Header Info -->
        <div class="p-8 md:p-12">
          <div class="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <span class="flex items-center gap-1.5">
              <CalendarIcon class="w-4 h-4" />
              {{ formatDate(post.date) }}
            </span>
            <span class="flex items-center gap-1.5">
              <ClockIcon class="w-4 h-4" />
              {{ post.readTime }} min read
            </span>
          </div>

          <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            {{ post.title }}
          </h1>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-10">
            <span 
              v-for="tag in post.tags" 
              :key="tag"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
            >
              <TagIcon class="w-3 h-3" />
              {{ tag }}
            </span>
          </div>

          <!-- Markdown Content Rendered -->
          <div 
            class="prose prose-slate prose-lg max-w-none 
                   prose-headings:font-bold 
                   prose-a:text-accent 
                   prose-img:rounded-xl 
                   prose-pre:bg-transparent 
                   prose-pre:text-inherit 
                   prose-pre:border-0 
                   prose-pre:rounded-lg 
                   prose-code:bg-slate-100 
                   prose-code:text-slate-800 
                   prose-code:px-1.5 
                   prose-code:py-0.5 
                   prose-code:rounded-md"
            v-html="post.content"
          />
        </div>
      </article>

      <!-- 404 State -->
      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-slate-900">Article not found</h2>
        <p class="text-slate-500 mt-2">The article you are looking for does not exist.</p>
        <button @click="goBack" class="mt-6 text-accent font-medium hover:underline">Return Home</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* --- 代码块自动换行核心样式 --- */

/* 1. 强制 pre 标签允许换行 */
:deep(pre) {
  white-space: pre-wrap !important; /* 关键：允许自动换行 */
  word-break: break-word !important; /* 关键：在单词边界处换行 */
  overflow-x: auto; /* 如果屏幕太窄，仍然保留横向滚动能力 */
  background-color: #0d1117 !important; /* 保持深色背景 */
}

/* 2. 确保 code 标签继承换行设置 */
:deep(pre code) {
  white-space: pre-wrap !important;
  word-break: break-word !important;
  display: block; /* 确保 code 占满 pre 的宽度 */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* 3. 针对行内代码 code 不做换行处理，保持原样 */
:deep(p code), :deep(li code) {
  white-space: nowrap;
  word-break: normal;
}
</style>