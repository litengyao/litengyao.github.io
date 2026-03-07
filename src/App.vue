<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { AcademicCapIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { NavItem } from './types'

const isMobileMenuOpen = ref<boolean>(false)
const isScrolled = ref<boolean>(false)

const navLinks: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Publications', path: '/publications' },
  { name: 'Projects', path: '/projects' },
  { name: 'News', path: '/news' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' }
]

const email: string = "san.zhang@example.edu.cn"

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
    <!-- 导航栏 (逻辑不变，TS 不影响模板) -->
    <nav 
      class="sticky top-0 z-50 w-full transition-all duration-300 border-b"
      :class="isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-slate-200' : 'bg-white/80 backdrop-blur-sm border-transparent'"
    >
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold text-slate-900 hover:text-accent transition-colors flex items-center gap-2 group">
          <div class="p-1.5 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
            <AcademicCapIcon class="w-6 h-6 text-accent" />
          </div>
          <span>SZ</span>
        </router-link>

        <div class="hidden md:flex items-center gap-1">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name"
            :to="link.path"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            active-class="bg-accent/10 text-accent"
            inactive-class="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {{ link.name }}
          </router-link>
          
          <a 
            :href="`mailto:${email}`"
            class="ml-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5"
          >
            Contact
          </a>
        </div>

        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-slate-600">
          <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>

      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2 shadow-xl">
        <router-link 
          v-for="link in navLinks" 
          :key="link.name"
          :to="link.path"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-accent"
          active-class="bg-accent/10 text-accent"
        >
          {{ link.name }}
        </router-link>
        <a :href="`mailto:${email}`" @click="isMobileMenuOpen = false" class="block w-full text-center mt-2 px-4 py-2 rounded-lg bg-accent text-white font-semibold">
          Contact Me
        </a>
      </div>
    </nav>

    <main class="flex-grow">
      <RouterView v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" />
        </transition>
      </RouterView>
    </main>

    <footer class="bg-white border-t border-slate-200 py-8 mt-12">
      <div class="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 San Zhang. Built with Vue 3, TS & Tailwind CSS v4.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>