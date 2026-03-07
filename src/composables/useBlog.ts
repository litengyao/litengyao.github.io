// src/composables/useBlog.ts
import { ref, computed } from 'vue'
import { marked } from 'marked'
import yaml from 'js-yaml'

// 假设你有这个类型定义，如果没有可以暂时注释掉或定义为 any
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

// 【关键修改】
// 1. 使用 ?raw 获取原始字符串
// 2. import: 'default' 确保获取的是文件内容字符串
const mdModules = import.meta.glob<string>(
  '/src/content/blog/*.md', 
  { eager: true, query: '?raw', import: 'default' }
)

const parseMdFile = (raw: string, path: string): { frontmatter: Frontmatter; content: string } | null => {
  const lines = raw.split('\n')
  
  // 检查是否以 --- 开头
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

  // 如果没有结束的 ---，则视为没有 frontmatter
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
    console.warn(`Failed to parse frontmatter for ${path}:`, e)
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

    // 如果明确标记为未发布，则跳过
    if (frontmatter.published === false) return

    const slug = path.split('/').pop()?.replace('.md', '') || ''
    
    // 解析 Markdown 为 HTML
    const htmlContent = marked(content) as string

    // 生成摘要
    let excerpt = frontmatter.excerpt || ''
    if (!excerpt) {
      const textOnly = content.replace(/[#*_`[\]]/g, '').split('\n').filter(l => l.trim()).join(' ')
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

  // 按日期排序
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
    refresh: () => {
      // 如果需要热更新触发重新解析，可以在这里添加逻辑
      // 但 import.meta.glob eager 通常在保存时自动刷新
    }
  }
}