<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  DocumentTextIcon, 
  CodeBracketIcon, 
  LinkIcon, 
  ClipboardDocumentIcon, 
  CheckIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'
import { usePublications } from '../composables/usePublications'
import type { Publication } from '@/types'

const { publications: allPubs, loading, error } = usePublications()

// 状态
const searchQuery = ref('')
const selectedYear = ref<number | 'All'>('All')
const copiedId = ref<number | null>(null)

// 当前用户名字 (用于高亮)
const currentUser = "San Zhang"

// 提取所有唯一年份
const years = computed(() => {
  if (!allPubs.value) return []
  const uniqueYears = Array.from(new Set(allPubs.value.map(p => p.year)))
  return ['All', ...uniqueYears.sort((a, b) => b - a)] as (number | 'All')[]
})

// 过滤逻辑
const filteredPubs = computed(() => {
  if (!allPubs.value) return []
  
  const result = allPubs.value.filter(pub => {
    const matchesYear = selectedYear.value === 'All' || pub.year === selectedYear.value
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = 
      pub.title.toLowerCase().includes(query) ||
      pub.venue.toLowerCase().includes(query) ||
      pub.authors.some(a => a.toLowerCase().includes(query))
    
    return matchesYear && matchesSearch
  })

  return result
})

// 按年份分组 (为了展示)
// 修改 groupedPubs 的返回类型为数组
const groupedPubs = computed(() => {
  const groups: Record<number, Publication[]> = {}
  
  // 1. 先填充数据
  filteredPubs.value.forEach(pub => {
    if (!groups[pub.year]) groups[pub.year] = []
    groups[pub.year]!.push(pub)
  })

  // 2. 获取所有年份并降序排序
  const sortedYears = Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
  
  // 3. 【关键修改】返回数组而不是对象
  return sortedYears.map(year => ({
    year,
    pubs: groups[year]
  }))
})

// 格式化作者列表，高亮当前用户
const formatAuthors = (authors: string[]) => {
  return authors.map((author, index) => {
    const isMe = author.includes(currentUser)
    return { name: author, isMe, index }
  })
}

// 复制 BibTeX
const copyBibtex = (pub: Publication) => {
  if (!pub.bibtex) return
  navigator.clipboard.writeText(pub.bibtex).then(() => {
    copiedId.value = pub.id
    setTimeout(() => copiedId.value = null, 2000)
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12 animate-fade-in-up">
    <div class="max-w-5xl mx-auto px-6">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <AcademicCapIcon class="w-10 h-10 text-accent" />
          Publications
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Selected research papers, preprints, and technical reports.
        </p>
      </div>

      <!-- Controls -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-10 sticky top-24 z-20 backdrop-blur-md bg-white/90">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <!-- Year Filter -->
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="year in years"
              :key="year"
              @click="selectedYear = year"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                selectedYear === year 
                  ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              ]"
            >
              {{ year }}
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full md:w-72">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, author, or venue..."
              class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-accent transition sm:text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-12">
        
        <!-- Loading -->
        <div v-if="loading" class="space-y-8">
          <div v-for="i in 2" :key="i" class="animate-pulse">
            <div class="h-8 bg-slate-200 rounded w-24 mb-4"></div>
            <div class="bg-white p-6 rounded-xl shadow-sm h-32"></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 bg-red-50 inline-block px-4 py-2 rounded-lg">{{ error }}</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredPubs.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 class="text-lg font-medium text-slate-900">No publications found</h3>
          <p class="mt-1 text-slate-500">Try adjusting your filters.</p>
          <button @click="selectedYear = 'All'; searchQuery = ''" class="mt-4 text-accent font-medium hover:underline">
            Clear filters
          </button>
        </div>

        <!-- Grouped List -->
        <div v-else v-for="group in groupedPubs" :key="group.year" class="relative">
  <!-- Year Badge -->
  <div class="sticky top-40 z-10 mb-6 flex items-center gap-4">
    <h2 class="text-2xl font-bold text-slate-800 bg-slate-50/90 backdrop-blur px-3 py-1 rounded-lg shadow-sm">
      {{ group.year }}
    </h2>
    <div class="h-px bg-slate-200 flex-1"></div>
  </div>

          <!-- Items -->
          <div class="space-y-6">
            <article 
              v-for="pub in group.pubs" 
              :key="pub.id" 
              class="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 relative overflow-hidden"
              :class="{ 'border-l-4 border-l-accent': pub.highlight }"
            >
              <!-- Highlight Badge -->
              <div v-if="pub.highlight" class="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Highlight
              </div>

              <div class="flex flex-col gap-4">
                <!-- Title & Venue -->
                <div>
                  <h3 class="text-xl font-bold text-slate-900 group-hover:text-accent transition-colors leading-snug">
                    {{ pub.title }}
                  </h3>
                  <p class="text-slate-600 font-medium mt-1">
                    {{ pub.venue }}
                  </p>
                </div>

                <!-- Authors -->
                <p class="text-slate-600 text-sm leading-relaxed">
                  <template v-for="(authorObj, idx) in formatAuthors(pub.authors)" :key="idx">
                    <span 
                      :class="authorObj.isMe ? 'font-bold text-slate-900 underline decoration-accent decoration-2 underline-offset-2' : 'text-slate-600'"
                    >
                      {{ authorObj.name }}
                    </span>
                    <span v-if="idx < pub.authors.length - 1" class="text-slate-400 mx-1">,</span>
                  </template>
                </p>

                <!-- Actions -->
                <div class="flex flex-wrap gap-3 pt-2">
                  <a 
                    v-if="pub.pdf" 
                    :href="pub.pdf" 
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-accent hover:text-white transition-colors"
                  >
                    <DocumentTextIcon class="w-4 h-4" /> PDF
                  </a>
                  <a 
                    v-if="pub.code" 
                    :href="pub.code" 
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-accent hover:text-white transition-colors"
                  >
                    <CodeBracketIcon class="w-4 h-4" /> Code
                  </a>
                  <a 
                    v-if="pub.link" 
                    :href="pub.link" 
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-accent hover:text-white transition-colors"
                  >
                    <LinkIcon class="w-4 h-4" /> Project
                  </a>
                  <button 
                    v-if="pub.bibtex"
                    @click="copyBibtex(pub)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
                  >
                    <component :is="copiedId === pub.id ? CheckIcon : ClipboardDocumentIcon" class="w-4 h-4" />
                    {{ copiedId === pub.id ? 'Copied!' : 'BibTeX' }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

      </div>
      
      <!-- Footer Count -->
      <div v-if="!loading && filteredPubs.length > 0" class="mt-16 text-center text-sm text-slate-500 border-t border-slate-200 pt-8">
        Total: {{ filteredPubs.length }} publications listed.
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>