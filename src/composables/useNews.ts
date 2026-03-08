// src/composables/useLatestNews.ts
import { ref, onMounted } from 'vue'
// 👇 导入统一定义的类型
import type { NewsItem } from '@/types'

export function useNews() {
  const news = ref<NewsItem[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchNews = async () => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 网络延迟
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // 数据源
      news.value = [
        { 
          id: 1, 
          title: "Our Research Page Site is Established!", 
          date: "2026-03-07", 
          excerpt: "The site is a place for us to share our research progresses.",
          category: 'Others'
        }      
      ]
      
      // 确保数据始终按日期降序排列
      news.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    } catch (e) {
      error.value = "Failed to load latest news. Please try again later."
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchNews()
  })

  return { news, loading, error }
}