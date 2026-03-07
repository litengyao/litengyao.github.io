<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon } from '@heroicons/vue/24/outline'
import { useBlog } from '../composables/useBlog'

const route = useRoute()
const router = useRouter()
const { getPostBySlug } = useBlog()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getPostBySlug(slug.value))

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
          <!-- 注意：生产环境建议使用 DOMPurify.sanitize(post.content) 防止 XSS -->
            <div 
    class="prose prose-slate prose-lg max-w-none 
           prose-headings:font-bold prose-headings:text-slate-900 
           prose-a:text-accent prose-a:no-underline hover:prose-a:underline
           prose-img:rounded-xl prose-img:shadow-md
           prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:rounded-lg
           prose-code:text-accent prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
    v-html="post.content"
  ></div>
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
</style>

<!-- 全局样式提示：你需要安装 @tailwindcss/typography 插件来让 'prose' 类生效 -->
<!-- npm install -D @tailwindcss/typography -->
<!-- 然后在 tailwind.config.js 中 plugins: [require('@tailwindcss/typography')] -->