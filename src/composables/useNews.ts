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
          title: "Paper Accepted at NeurIPS 2025", 
          date: "2025-12-10", 
          excerpt: "Our work on efficient transformers was accepted as an Oral presentation.",
          category: 'Papers'
        },
        { 
          id: 2, 
          title: "Started PhD at University of AI", 
          date: "2023-09-01", 
          excerpt: "Excited to begin my journey in deep learning research.",
          category: 'Others'
        },
        { 
          id: 3, 
          title: "Invited Talk at CVPR Workshop", 
          date: "2024-06-15", 
          excerpt: "Presented our latest findings on generative models to the community.",
          category: 'Talks'
        },
        { 
          id: 4, 
          title: "Received Best Paper Award", 
          date: "2024-03-10", 
          excerpt: "Honored to receive the Best Paper Award at ICCV for our work on 3D reconstruction.",
          category: 'Awards'
        },
        { 
          id: 5, 
          title: "New Preprint on ArXiv", 
          date: "2024-01-20", 
          excerpt: "Released a new preprint regarding efficient attention mechanisms for long sequences.",
          category: 'Papers'
        },
        {
          id: 6,
          title: "Teaching Assistant for CS231n",
          date: "2023-09-15",
          excerpt: "Serving as a head TA for the Introduction to Computer Vision course.",
          category: 'Teaching' // 演示新添加的类别
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