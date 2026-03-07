<script setup lang="ts">
import { ref } from 'vue'
import { 
  CalendarIcon, 
  ClockIcon, 
  TagIcon, 
  MagnifyingGlassIcon, 
  ArrowRightIcon,
  DocumentTextIcon,
  ChevronDownIcon, // 新增：下拉箭头图标
  CheckIcon       // 新增：选中标记图标
} from '@heroicons/vue/24/outline'
import { useBlog } from '../composables/useBlog'
import { useRouter } from 'vue-router'

const router = useRouter()
const { posts, allTags, loading, error, searchQuery, selectedTag, refresh } = useBlog()

// 控制下拉菜单的显示状态
const isTagMenuOpen = ref(false)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const goToDetail = (slug: string) => {
  router.push(`/blog/${slug}`)
}

// 点击外部关闭下拉菜单 (可选优化，防止菜单一直开着)
// const closeMenu = () => {
//   isTagMenuOpen.value = false
// }

const hideTagMenu = () => {
  setTimeout(() => {
    isTagMenuOpen.value = false
  }, 200)
}

// 选择标签
const selectTag = (tag: string) => {
  selectedTag.value = tag
  isTagMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12 animate-fade-in-up">
    <div class="max-w-5xl mx-auto px-6">
      
      <!-- Header (保持不变) -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <DocumentTextIcon class="w-10 h-10 text-accent" />
          Blog
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Insights on technology, development, and innovation.
        </p>
      </div>

      <!-- Controls (修改为下拉菜单) -->
      <div class="sticky top-24 z-30 mb-10">
        <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <!-- 【修改点】Tag Filter Dropdown -->
            <div class="relative w-full md:w-48 flex-shrink-0">
              <!-- 触发按钮 -->
              <button 
                @click="isTagMenuOpen = !isTagMenuOpen"
                @blur="hideTagMenu" 
                class="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                :class="{ 'bg-slate-100 border-accent/30': isTagMenuOpen }"
              >
                <div class="flex items-center gap-2 truncate">
                  <TagIcon class="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span class="truncate">{{ selectedTag === 'All' ? 'All Topics' : selectedTag }}</span>
                </div>
                <ChevronDownIcon 
                  class="w-4 h-4 text-slate-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isTagMenuOpen }"
                />
              </button>

              <!-- 下拉菜单列表 -->
              <div 
                v-show="isTagMenuOpen"
                class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-scale-in origin-top"
              >
                <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                  <li 
                    v-for="tag in allTags" 
                    :key="tag"
                    @click="selectTag(tag)"
                    class="px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between group hover:bg-slate-50 transition-colors"
                    :class="{ 'bg-accent/5 text-accent font-medium': selectedTag === tag }"
                  >
                    <span class="truncate">{{ tag }}</span>
                    <CheckIcon 
                      v-if="selectedTag === tag" 
                      class="w-4 h-4 text-accent flex-shrink-0" 
                    />
                  </li>
                </ul>
              </div>
            </div>

            <!-- Search (保持不变) -->
            <div class="relative w-full md:flex-1 max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search articles..."
                class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-accent transition sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Content List (保持不变) -->
      <div class="space-y-8">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="space-y-8">
          <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 animate-pulse">
            <div class="w-full md:w-1/3 h-48 bg-slate-200 rounded-xl"></div>
            <div class="flex-1 space-y-4 py-2">
              <div class="h-4 bg-slate-200 rounded w-1/4"></div>
              <div class="h-6 bg-slate-200 rounded w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        <!-- Error / Empty States -->
        <div v-else-if="error" class="text-center py-12 bg-white rounded-2xl border border-red-100">
          <p class="text-red-500">{{ error }}</p>
          <button @click="refresh" class="mt-4 text-accent font-medium hover:underline">Retry</button>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 class="text-lg font-medium text-slate-900">No articles found</h3>
          <p class="mt-1 text-slate-500">Try adjusting your filters.</p>
          <button @click="selectedTag = 'All'; searchQuery = ''" class="mt-4 text-accent hover:underline">Clear all</button>
        </div>

        <!-- Post Cards -->
        <article 
          v-else
          v-for="post in posts" 
          :key="post.id" 
          class="group bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col md:flex-row cursor-pointer"
          @click="goToDetail(post.slug)"
        >
          <div v-if="post.coverImage" class="md:w-1/3 overflow-hidden relative">
            <img 
              :src="post.coverImage" 
              :alt="post.title" 
              class="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          <div class="p-6 md:p-8 flex flex-col flex-1 justify-between">
            <div>
              <div class="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span class="flex items-center gap-1.5">
                  <CalendarIcon class="w-4 h-4" />
                  {{ formatDate(post.date) }}
                </span>
                <span class="flex items-center gap-1.5">
                  <ClockIcon class="w-4 h-4" />
                  {{ post.readTime }} min read
                </span>
              </div>

              <h2 class="text-2xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors line-clamp-2">
                {{ post.title }}
              </h2>

              <p class="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {{ post.excerpt }}
              </p>

              <div class="flex flex-wrap gap-2 mt-4">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 group-hover:bg-accent/10 group-hover:text-accent transition-colors"
                >
                  <TagIcon class="w-3 h-3" />
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="mt-6 flex items-center text-accent font-semibold text-sm group/link">
              Read Article 
              <ArrowRightIcon class="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </div>

      <div v-if="!loading && posts.length > 0" class="mt-16 text-center text-sm text-slate-500 border-t border-slate-200 pt-8">
        Showing {{ posts.length }} article{{ posts.length !== 1 ? 's' : '' }}.
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* 下拉菜单展开动画 */
.animate-scale-in {
  animation: scaleIn 0.2s ease-out forwards;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scaleY(0.95); }
  to { opacity: 1; transform: scaleY(1); }
}

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>