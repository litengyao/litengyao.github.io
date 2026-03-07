<script setup lang="ts">
import { ref, computed } from 'vue'
import { CalendarIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useNews } from '../composables/useNews'
// 👇 导入类型（主要用于开发时的类型提示和一致性检查）
import type { NewsCategory } from '@/types'

const { news: allNews, loading, error } = useNews()

const activeCategory = ref<NewsCategory | 'All'>('All')
const searchQuery = ref('')

// 动态生成分类列表
const categories = computed<(NewsCategory | 'All')[]>(() => {
  if (!allNews.value) return ['All']
  const cats = new Set(allNews.value.map(n => n.category))
  return ['All', ...Array.from(cats)]
})

const filteredNews = computed(() => {
  if (!allNews.value) return []
  
  return allNews.value.filter(item => {
    const matchesCategory = activeCategory.value === 'All' || item.category === activeCategory.value
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<!-- Template 部分保持不变，因为 Vue 会自动推断 v-for 中的 item 类型 -->
<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12 animate-fade-in-up">
    <div class="max-w-5xl mx-auto px-6">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">News & Updates</h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Stay up to date with my latest research publications, conference talks, awards, and other activities.
        </p>
      </div>

      <!-- Controls -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 sticky top-24 z-20 backdrop-blur-md bg-white/90 transition-all">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <!-- Categories -->
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeCategory === cat 
                  ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              ]"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full md:w-64">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search news..."
              class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-accent transition duration-150 ease-in-out sm:text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Content List -->
      <div class="space-y-6">
        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-xl shadow-sm animate-pulse h-32"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 bg-red-50 inline-block px-4 py-2 rounded-lg">{{ error }}</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredNews.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <TagIcon class="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 class="text-lg font-medium text-slate-900">No news found</h3>
          <p class="mt-1 text-slate-500">Try adjusting your search or filter criteria.</p>
          <button @click="activeCategory = 'All'; searchQuery = ''" class="mt-4 text-accent font-medium hover:underline">
            Clear filters
          </button>
        </div>

        <!-- Items -->
        <article
          v-else
          v-for="item in filteredNews"
          :key="item.id"
          class="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col sm:flex-row gap-6"
        >
          <div class="sm:w-32 shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 text-slate-500">
            <CalendarIcon class="w-5 h-5 text-accent/80" aria-hidden="true" />
            <time :datetime="item.date" class="text-sm font-mono font-medium whitespace-nowrap">
              {{ formatDate(item.date) }}
            </time>
            <span class="sm:hidden inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
              {{ item.category }}
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <span class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                {{ item.category }}
              </span>
              <h2 class="text-xl font-bold text-slate-900 group-hover:text-accent transition-colors truncate">
                {{ item.title }}
              </h2>
            </div>
            <p class="text-slate-600 leading-relaxed">
              {{ item.excerpt }}
            </p>
          </div>
        </article>
      </div>
      
      <div v-if="!loading && filteredNews.length > 0" class="mt-12 text-center text-sm text-slate-500">
        Showing {{ filteredNews.length }} of {{ allNews?.length }} updates
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>