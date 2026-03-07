// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { fileURLToPath, URL } from 'node:url'

// const repoName = 'litengyao.github.io' 

export default defineConfig({

  base: '/', 

  plugins: [
    vue({
      // 让 Vue 插件也能处理 .md 文件，以便在组件中直接 <import MyMd from './file.md' />
      include: [/\.vue$/, /\.md$/], 
    }),
    Markdown({
      // 基础配置，通常默认即可
      wrapperClasses: 'prose mx-auto', 
    }),
    tailwindcss(), // 👈 启用 Tailwind v4
    Icons({ 
      compiler: 'vue3', 
      autoInstall: true // 👈 自动下载图标
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境通常不需要 source map，减小体积
  }
})