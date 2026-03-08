// src/composables/useBlog.ts
import { ref, computed } from 'vue'
import { marked } from 'marked'
import yaml from 'js-yaml'
// 1. 引入 highlight.js 核心
import hljs from 'highlight.js'
// 2. 引入 GitHub 浅色风格 CSS (如果想用深色，改为 'github-dark.css')
import 'highlight.js/styles/github.css' 

import type { BlogPost } from '@/types' 

interface Frontmatter {
  title?: string
  date?: string
  tags?: string[]
  readTime?: number
  coverImage?: string
  published?: boolean
  excerpt?: string
}

// 配置 marked 使用 highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    // 如果指定了语言且 highlight.js 支持该语言
    if (lang && hljs.getLanguage(lang)) {
      try {
        // 返回高亮后的 HTML
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {
        console.warn('Highlight error:', e)
      }
    }
    // 如果没有指定语言或出错，返回转义后的纯文本（防止 XSS）
    return hljs.highlightAuto(code).value
  },
  // 可选：让代码块包裹在带有 class="hljs" 的 pre 标签中，方便 CSS 定位
  renderer: new marked.Renderer() // 保持默认渲染器，highlight 选项会自动生效
})

const mdModules = import.meta.glob<string>(
  '/src/content/blog/*.md', 
  { eager: true, query: '?raw', import: 'default' }
)

const parseMdFile = (raw: string, path: string): { frontmatter: Frontmatter; content: string } | null => {
  const lines = raw.split('\n')
  
  if (!lines.length || !lines[0]?.trim().startsWith('---')) {
    return { frontmatter: {}, content: raw }
  }

  let endIndex = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      endIndex = i
      break
    }
  }

  if (endIndex === -1) {
    return { frontmatter: {}, content: raw }
  }

  const yamlStr = lines.slice(1, endIndex).join('\n')
  const content = lines.slice(endIndex + 1).join('\n')

  let frontmatter: Frontmatter = {}
  try {
    const parsed = yaml.load(yamlStr)
    if (parsed && typeof parsed === 'object') {
      frontmatter = parsed as Frontmatter
    }
  } catch (e) {
    console.warn(`Failed to parse frontmatter for  $ {path}:`, e)
  }

  return { frontmatter, content }
}

const parsePosts = (): BlogPost[] => {
  const posts: BlogPost[] = []

  Object.entries(mdModules).forEach(([path, rawContent]) => {
    if (typeof rawContent !== 'string') return

    const parsed = parseMdFile(rawContent, path)
    if (!parsed) return

    const { frontmatter, content } = parsed

    if (frontmatter.published === false) return

    const slug = path.split('/').pop()?.replace('.md', '') || ''
    
    // 【关键】这里调用 marked(content) 时，会自动触发上面配置的 highlight 函数
    const htmlContent = marked(content) as string

    let excerpt = frontmatter.excerpt || ''
    if (!excerpt) {
      const textOnly = content.replace(/[#*_`[ $  ]/g, '').split('\n').filter(l => l.trim()).join(' ')
      excerpt = textOnly.slice(0, 200) + (textOnly.length > 200 ? '...' : '')
    }

    posts.push({
      id: Date.now() + Math.random(),
      slug,
      title: frontmatter.title || 'Untitled Post',
      excerpt,
      content: htmlContent,
      date: frontmatter.date || new Date().toISOString(),
      tags: frontmatter.tags || [],
      readTime: frontmatter.readTime || 5,
      coverImage: frontmatter.coverImage,
      published: true
    })
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const allPosts = parsePosts()

export function useBlog() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedTag = ref<string | 'All'>('All')

  const allTags = computed(() => {
    const tags = Array.from(new Set(allPosts.flatMap(p => p.tags)))
    return ['All', ...tags.sort()]
  })

  const filteredPosts = computed(() => {
    let result = [...allPosts]

    if (selectedTag.value !== 'All') {
      result = result.filter(p => p.tags.includes(selectedTag.value))
    }

    const query = searchQuery.value.toLowerCase()
    if (query) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      )
    }

    return result
  })

  const getPostBySlug = (slug: string) => {
    return allPosts.find(p => p.slug === slug)
  }

  return {
    posts: filteredPosts,
    allTags,
    loading,
    error,
    searchQuery,
    selectedTag,
    getPostBySlug,
    refresh: () => {}
  }
}