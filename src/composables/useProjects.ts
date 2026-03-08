// src/composables/useProjects.ts
import { ref, onMounted } from 'vue'
import type { Project } from '@/types'

export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 600))

      projects.value = [
        {
          id: 1,
          title: "ADS-B Attack Data Generator",
          description: "Generate ADS-B Attack Data for Classical Attack Patterns",
          longDescription: "The scripts are designed to reproduce the data disruptions for ADS-B data attack, which are the simulation codes for the paper 'Threat Model and Construction Strategy on ADS-B Attack Data'.",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", // 示例图
          tags: ["ADS-B", "Data", "Air Traffic"],
          link: "#",
          github: "https://github.com/litengyao/adsb-attack-data-generator",
          status: "Archived",
          year: 2020,
          stars: 8
        }
      ]
      
      // 排序：Active 在前，然后按年份降序
      projects.value.sort((a, b) => {
        const statusOrder = { 'Active': 0, 'Completed': 1, 'Archived': 2 }
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status]
        }
        return (b.year || 0) - (a.year || 0)
      })

    } catch (e) {
      error.value = "Failed to load projects."
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchProjects()
  })

  return { projects, loading, error }
}