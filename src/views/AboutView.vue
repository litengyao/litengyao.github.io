<script setup lang="ts">
import { UserCircleIcon, AcademicCapIcon, BriefcaseIcon, HeartIcon } from '@heroicons/vue/24/outline'

const education = [
  { degree: "Ph.D. in Computer Science", school: "University of AI Research", year: "2023 - Present", desc: "Focus on Deep Learning efficiency." },
  { degree: "M.S. in Data Science", school: "Tech Institute", year: "2021 - 2023", desc: "Thesis on Computer Vision applications." },
  { degree: "B.S. in Mathematics", school: "Science University", year: "2017 - 2021", desc: "Graduated with Honors." }
]

const skills = [
  "Python", "PyTorch", "TensorFlow", "TypeScript", "Vue.js", "Node.js", "CUDA", "Docker", "AWS"
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="inline-flex p-4 bg-white rounded-full shadow-md mb-6">
        <UserCircleIcon class="w-20 h-20 text-slate-300" />
      </div>
      <h1 class="text-4xl font-bold text-slate-900 mb-4">About Me</h1>
      <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
        Hello! I'm a researcher passionate about bridging the gap between theoretical AI and practical scientific applications. 
        When I'm not training models, you can find me hiking, reading sci-fi, or brewing specialty coffee.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-12">
      <!-- Education Column -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <AcademicCapIcon class="w-6 h-6 text-accent" />
          Education
        </h2>
        <div class="space-y-6 relative border-l-2 border-slate-200 pl-6 ml-2">
          <div v-for="(edu, index) in education" :key="index" class="relative">
            <!-- Timeline Dot -->
            <span class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-sm"></span>
            
            <h3 class="text-lg font-bold text-slate-900">{{ edu.degree }}</h3>
            <p class="text-accent font-medium text-sm">{{ edu.school }}</p>
            <p class="text-slate-400 text-xs mb-2">{{ edu.year }}</p>
            <p class="text-slate-600 text-sm">{{ edu.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Skills & Interests Column -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BriefcaseIcon class="w-6 h-6 text-accent" />
          Technical Skills
        </h2>
        <div class="flex flex-wrap gap-2 mb-8">
          <span 
            v-for="skill in skills" 
            :key="skill"
            class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm hover:border-accent hover:text-accent transition-colors cursor-default"
          >
            {{ skill }}
          </span>
        </div>

        <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HeartIcon class="w-6 h-6 text-accent" />
          Interests
        </h2>
        <ul class="space-y-2 text-slate-600">
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-accent rounded-full"></span>
            Efficient Deep Learning Architectures
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-accent rounded-full"></span>
            AI for Scientific Discovery
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-accent rounded-full"></span>
            Open Source Software Development
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Contact CTA -->
    <div class="mt-16 text-center p-8 bg-accent/5 rounded-2xl border border-accent/10">
      <h3 class="text-xl font-bold text-slate-900 mb-2">Let's Connect</h3>
      <p class="text-slate-600 mb-6">Interested in collaboration or have a question? Feel free to reach out!</p>
      <a href="mailto:san.zhang@example.edu.cn" class="inline-block px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all hover:-translate-y-1">
        Send an Email
      </a>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>