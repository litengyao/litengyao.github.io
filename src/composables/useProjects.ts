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
          title: "NeuroVision: Real-time Brain-Computer Interface",
          description: "A low-latency BCI system using EEG signals to control robotic arms with deep learning.",
          longDescription: "NeuroVision is a cutting-edge Brain-Computer Interface (BCI) system designed to translate EEG signals into robotic control commands in real-time. By leveraging a novel Transformer-based architecture, we achieved a latency of under 50ms, enabling smooth and intuitive control. The system was tested on 20+ subjects and demonstrated a 95% accuracy in command recognition.",
          image: "https://images.unsplash.com/photo-1555255719-0a8f4666395b?auto=format&fit=crop&q=80&w=800", // 示例图
          tags: ["PyTorch", "EEG", "Robotics", "Transformers"],
          link: "#",
          github: "https://github.com/sanzhang/neurovision",
          status: "Active",
          year: 2024,
          stars: 128
        },
        {
          id: 2,
          title: "EcoScan: AI for Environmental Monitoring",
          description: "Computer vision pipeline for analyzing satellite imagery to detect deforestation and wildfires.",
          longDescription: "EcoScan automates the detection of environmental changes using multi-spectral satellite imagery. Our model segments forest cover and identifies early signs of wildfires or illegal logging activities. It processes terabytes of data daily and provides alerts to conservation agencies.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
          tags: ["Computer Vision", "Satellite Imagery", "Python", "AWS"],
          link: "https://ecoscan.demo.com",
          github: "https://github.com/sanzhang/ecoscan",
          status: "Completed",
          year: 2023,
          stars: 85
        },
        {
          id: 3,
          title: "FastRender: Neural Radiance Fields Acceleration",
          description: "Optimized implementation of NeRF for real-time rendering on consumer GPUs.",
          longDescription: "This project focuses on accelerating Neural Radiance Fields (NeRF) training and inference. By introducing a sparse voxel grid structure and custom CUDA kernels, we reduced training time by 10x and achieved 60 FPS rendering on an RTX 3090.",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
          tags: ["CUDA", "C++", "NeRF", "Graphics"],
          github: "https://github.com/sanzhang/fastnerf",
          status: "Active",
          year: 2024,
          stars: 342
        },
        {
          id: 4,
          title: "ScholarMatch: Academic Collaboration Platform",
          description: "A recommendation system connecting researchers based on publication history and interests.",
          tags: ["React", "Node.js", "Graph Neural Networks", "Neo4j"],
          link: "#",
          status: "Archived",
          year: 2022
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