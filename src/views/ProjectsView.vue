<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  CommandLineIcon, 
  XMarkIcon, 
  CodeBracketIcon, 
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import { useProjects } from '../composables/useProjects'
import type { Project, ProjectStatus } from '@/types'

const { projects: allProjects, loading, error } = useProjects()

// 状态
const selectedStatus = ref<ProjectStatus | 'All'>('All')
const selectedTag = ref<string | 'All'>('All')
const activeProject = ref<Project | null>(null) // 控制模态框

// 提取所有唯一的标签
const allTags = computed(() => {
  if (!allProjects.value) return []
  const tags = new Set<string>()
  allProjects.value.forEach(p => p.tags.forEach(t => tags.add(t)))
  return ['All', ...Array.from(tags).sort()]
})

// 提取所有状态
const statuses: (ProjectStatus | 'All')[] = ['All', 'Active', 'Completed', 'Archived']

// 过滤逻辑
const filteredProjects = computed(() => {
  if (!allProjects.value) return []
  
  return allProjects.value.filter(project => {
    const matchesStatus = selectedStatus.value === 'All' || project.status === selectedStatus.value
    const matchesTag = selectedTag.value === 'All' || project.tags.includes(selectedTag.value)
    return matchesStatus && matchesTag
  })
})

// 打开/关闭模态框
const openModal = (project: Project) => {
  activeProject.value = project
  document.body.style.overflow = 'hidden' // 禁止背景滚动
}

const closeModal = () => {
  activeProject.value = null
  document.body.style.overflow = ''
}

// 状态颜色映射
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700 border-green-200'
    case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Archived': return 'bg-slate-100 text-slate-600 border-slate-200'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12 animate-fade-in-up">
    <div class="max-w-7xl mx-auto px-6">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <CpuChipIcon class="w-10 h-10 text-accent" />
          Projects
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          A collection of our research prototypes, open-source tools, and creative experiments.
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-10 sticky top-24 z-20 backdrop-blur-md bg-white/90">
        <div class="flex flex-col gap-4">
          
          <!-- Status Filter -->
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="status in statuses"
              :key="status"
              @click="selectedStatus = status"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                selectedStatus === status 
                  ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              ]"
            >
              {{ status }}
            </button>
          </div>

          <!-- Tags Filter (Scrollable if too many) -->
          <div class="flex flex-wrap justify-center gap-2 max-h-24 overflow-y-auto custom-scrollbar">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="selectedTag = tag"
              :class="[
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                selectedTag === tag 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-accent hover:text-accent'
              ]"
            >
              # {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- Grid Layout -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl h-80 animate-pulse"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 bg-red-50 inline-block px-4 py-2 rounded-lg">{{ error }}</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <CodeBracketIcon class="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-900">No projects found</h3>
        <p class="mt-1 text-slate-500">Try changing your filters.</p>
        <button @click="selectedStatus = 'All'; selectedTag = 'All'" class="mt-4 text-accent font-medium hover:underline">
          Clear filters
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="project in filteredProjects" 
          :key="project.id"
          @click="openModal(project)"
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full"
        >
          <!-- Image Container -->
          <div class="relative h-48 overflow-hidden bg-slate-200">
            <img 
              v-if="project.image" 
              :src="project.image" 
              :alt="project.title" 
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-400">
              <CodeBracketIcon class="w-16 h-16" />
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm', getStatusColor(project.status)]">
                {{ project.status }}
              </span>
            </div>
            
            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="px-6 py-2 bg-white text-slate-900 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View Details
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold text-slate-900 group-hover:text-accent transition-colors line-clamp-1">
                {{ project.title }}
              </h3>
              <span v-if="project.year" class="text-xs font-mono text-slate-400 shrink-0 ml-2">{{ project.year }}</span>
            </div>
            
            <p class="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
              {{ project.description }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in project.tags.slice(0, 3)" 
                :key="tag" 
                class="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100"
              >
                {{ tag }}
              </span>
              <span v-if="project.tags.length > 3" class="px-2 py-1 text-xs text-slate-400">
                +{{ project.tags.length - 3 }}
              </span>
            </div>

            <!-- Links Preview -->
            <div class="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
              <a 
                v-if="project.github" 
                :href="project.github" 
                target="_blank"
                @click.stop
                class="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm transition-colors"
              >
                <CommandLineIcon class="w-4 h-4" />
                <span v-if="project.stars" class="flex items-center gap-0.5">
                  <StarSolidIcon class="w-3 h-3 text-yellow-400" /> {{ project.stars }}
                </span>
              </a>
              <a 
                v-if="project.link" 
                :href="project.link" target="_blank"
                @click.stop
                @click.prevent="project.link === '#' ? null : void 0"
                :class="{ 'pointer-events-none opacity-50 cursor-not-allowed': project.link === '#' }"
                class="flex items-center gap-1 text-slate-500 hover:text-accent text-sm transition-colors">
                <GlobeAltIcon class="w-4 h-4" /> Demo
              </a>
            </div>
          </div>
        </article>
      </div>

    </div>

    <!-- Modal (Details View) -->
    <div 
      v-if="activeProject" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        @click="closeModal"
      ></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <!-- Close Button -->
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <XMarkIcon class="w-6 h-6 text-slate-600" />
        </button>

        <div v-if="activeProject.image" class="h-64 sm:h-80 w-full relative">
          <img :src="activeProject.image" :alt="activeProject.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-6 text-white">
            <span :class="['px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block', getStatusColor(activeProject.status)]">
              {{ activeProject.status }}
            </span>
            <h2 class="text-3xl font-bold">{{ activeProject.title }}</h2>
          </div>
        </div>
        
        <div v-else class="p-8 pb-4">
           <span :class="['px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block', getStatusColor(activeProject.status)]">
              {{ activeProject.status }}
            </span>
            <h2 class="text-3xl font-bold text-slate-900">{{ activeProject.title }}</h2>
        </div>

        <div class="p-6 sm:p-8">
          <div class="flex flex-wrap gap-2 mb-6">
            <span 
              v-for="tag in activeProject.tags" 
              :key="tag" 
              class="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium"
            >
              {{ tag }}
            </span>
          </div>

          <div class="prose prose-slate max-w-none mb-8">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Overview</h3>
            <p class="text-slate-600 leading-relaxed">
              {{ activeProject.longDescription || activeProject.description }}
            </p>
          </div>

          <div class="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
            <a 
              v-if="activeProject.github" 
              :href="activeProject.github" 
              target="_blank"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
            >
              <CommandLineIcon class="w-5 h-5" /> 
              View Code 
              <span v-if="activeProject.stars" class="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs flex items-center gap-1">
                <StarSolidIcon class="w-3 h-3 text-yellow-300" /> {{ activeProject.stars }}
              </span>
            </a>
            <a 
              v-if="activeProject.link" 
              :href="activeProject.link" 
              target="_blank"
              @click.prevent="activeProject.link === '#' ? null : void 0"
              :class="{ 'pointer-events-none opacity-50 cursor-not-allowed': activeProject.link === '#' }"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
            >
              <GlobeAltIcon class="w-5 h-5" /> Live Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

/* Custom Scrollbar for tags */
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>