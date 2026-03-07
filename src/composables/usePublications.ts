// src/composables/usePublications.ts
import { ref, onMounted } from 'vue'
import type { Publication } from '@/types'

export function usePublications() {
  const publications = ref<Publication[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchPublications = async () => {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 800)) // 模拟延迟

      publications.value = [
        {
          id: 1,
          title: "Efficient Transformers for Large Scale Vision",
          authors: ["San Zhang", "Li Si", "John Doe"],
          venue: "NeurIPS 2025 (Oral)",
          year: 2025,
          type: "Conference",
          pdf: "#",
          code: "#",
          highlight: true,
          bibtex: `@inproceedings{zhang2025efficient,
  title={Efficient Transformers for Large Scale Vision},
  author={Zhang, San and Si, Li and Doe, John},
  booktitle={NeurIPS},
  year={2025}
}`
        },
        {
          id: 2,
          title: "Generative Models in Scientific Computing",
          authors: ["San Zhang", "Alice Smith"],
          venue: "ICML 2024",
          year: 2024,
          type: "Conference",
          pdf: "#",
          code: "#",
          bibtex: `@inproceedings{zhang2024generative,
  title={Generative Models in Scientific Computing},
  author={Zhang, San and Smith, Alice},
  booktitle={ICML},
  year={2024}
}`
        },
        {
          id: 3,
          title: "A Survey on Deep Learning Optimization",
          authors: ["Bob Brown", "San Zhang"],
          venue: "IEEE TPAMI 2024",
          year: 2024,
          type: "Journal",
          pdf: "#",
          bibtex: `@article{brown2024survey,
  title={A Survey on Deep Learning Optimization},
  author={Brown, Bob and Zhang, San},
  journal={IEEE TPAMI},
  year={2024}
}`
        },
        {
          id: 4,
          title: "Self-Supervised Learning for 3D Reconstruction",
          authors: ["San Zhang"],
          venue: "CVPR 2023",
          year: 2023,
          type: "Conference",
          pdf: "#",
          code: "#",
          bibtex: `@inproceedings{zhang2023self,
  title={Self-Supervised Learning for 3D Reconstruction},
  author={Zhang, San},
  booktitle={CVPR},
  year={2023}
}`
        },
        {
          id: 5,
          title: "Introduction to Computer Vision",
          authors: ["San Zhang", "Li Si"],
          venue: "ArXiv Preprint",
          year: 2023,
          type: "Preprint",
          pdf: "#",
          bibtex: `@misc{zhang2023intro,
  title={Introduction to Computer Vision},
  author={Zhang, San and Si, Li},
  year={2023},
  eprint={2301.00000},
  archivePrefix={arXiv}
}`
        }
      ]
      
      // 默认按年份降序，同年份内按 ID 或标题排序（这里简单按 ID）
      publications.value.sort((a, b) => b.year - a.year || b.id - a.id)

    } catch (e) {
      error.value = "Failed to load publications."
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPublications()
  })

  return { publications, loading, error }
}