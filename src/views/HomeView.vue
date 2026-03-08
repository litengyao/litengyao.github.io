<script setup lang="ts">
import { computed } from 'vue'
import { AcademicCapIcon, ArrowRightIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { useNews } from '../composables/useNews'

// 1. 获取完整的数据列表、加载状态和错误信息
const { news: allNews, loading, error } = useNews()

// 2. 创建计算属性：排序并截取前 3 条
const recentNews = computed(() => {
  if (!allNews.value) return []
  
  // 复制一份数组以免修改原数据，然后按日期降序排序
  const sorted = [...allNews.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  // 截取前 3 条
  return sorted.slice(0, 3)
})

// 简单的日期格式化辅助
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="animate-fade-in-up">
    
    <!-- Hero Section (保持不变) -->
    <header class="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
      <!-- ... (Hero 部分代码省略，与之前相同) ... -->
      <div class="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div class="inline-flex items-center justify-center p-4 bg-accent/10 rounded-2xl mb-8 shadow-inner animate-bounce-slow" aria-hidden="true">
          <AcademicCapIcon class="w-16 h-16 text-accent" />
        </div>
        <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">Learn / Smile / Enjoy</h1>
        <p class="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
          Researchers @ <span class="font-semibold text-slate-800">Active Tracker Group</span>.<br class="hidden md:block" />
          Focusing on <span class="text-accent font-medium">Network Active Defense</span>, <span class="text-accent font-medium">Information Spread Dynamics</span>, and <span class="text-accent font-medium">Unmanned System Security</span>.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <router-link to="/publications" class="group px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 focus:ring-2 focus:ring-accent focus:ring-offset-2">
            View Publications <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </router-link>
          <router-link to="/projects" class="px-8 py-4 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-accent/30 hover:bg-slate-50 hover:shadow-md transition-all focus:ring-2 focus:ring-slate-200 focus:ring-offset-2">
            See Projects
          </router-link>
        </div>
      </div>
      <!-- Background Blobs (保持不变) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div class="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </header>

    <!-- Latest News Section -->
    <section class="py-16 bg-white border-t border-slate-100" aria-labelledby="news-heading">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex items-center justify-between mb-8">
          <h2 id="news-heading" class="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span class="w-1.5 h-8 bg-accent rounded-full"></span> 
            Latest News
          </h2>
          <!-- 链接指向 /news -->
          <router-link to="/news" class="text-sm font-medium text-accent hover:underline focus:underline focus:outline-none">
            View all &rarr;
          </router-link>
        </div>
        
        <div class="space-y-4">
          <!-- Loading State (Skeleton) -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex gap-4 items-start p-4 rounded-xl bg-slate-50 animate-pulse">
              <div class="shrink-0 flex items-center gap-2 min-w-[110px]">
                <div class="w-4 h-4 bg-slate-200 rounded"></div>
                <div class="h-4 bg-slate-200 rounded w-24"></div>
              </div>
              <div class="flex-1 space-y-2">
                <div class="h-5 bg-slate-200 rounded w-3/4"></div>
                <div class="h-4 bg-slate-200 rounded w-full"></div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-4 text-red-500 bg-red-50 rounded-xl text-center">
            {{ error }}
          </div>

          <!-- Data List: 使用 recentNews -->
          <article 
            v-else-if="recentNews.length > 0"
            v-for="item in recentNews" 
            :key="item.id" 
            class="flex flex-col sm:flex-row gap-4 sm:items-start items-center text-center sm:text-left p-5 rounded-xl hover:bg-slate-50 transition-colors group cursor-default"
          >
            <div class="shrink-0 flex items-center justify-center sm:justify-start gap-2 text-sm font-mono text-slate-400 min-w-[110px] bg-slate-50 sm:bg-transparent px-3 py-1 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
              <CalendarIcon class="w-4 h-4" aria-hidden="true" />
              <time :datetime="item.date">{{ formatDate(item.date) }}</time>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-accent transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-slate-600 text-sm mt-1 leading-relaxed">
                {{ item.excerpt }}
              </p>
            </div>
          </article>
          
          <!-- Empty State (如果连 3 条都没有) -->
          <div v-else class="text-center py-8 text-slate-500">
            No recent news available.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 动画样式保持不变 */
.animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
.animate-bounce-slow { animation: bounce 3s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } }
</style>