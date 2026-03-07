import { createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PublicationsView from '../views/PublicationsView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import AboutView from '../views/AboutView.vue'
import BlogView from '../views/BlogView.vue'
import NewsView from '../views/NewsView.vue'
import BlogPostView from '../views/BlogPostView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/publications',
    name: 'publications',
    component: PublicationsView,
    meta: { title: 'Publications' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView,
    meta: { title: 'Projects' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
    meta: { title: 'Blog' }
  },
  {
    path: '/blog/:slug', // 动态路径
    name: 'BlogPost',
    component: BlogPostView,
    meta: { title: 'Blog Post' },
  },
  {
    path: '/news',
    name: 'News',
    component: NewsView,
    meta: { title: 'News' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 动态设置页面标题
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | San Zhang` : 'San Zhang'
  next()
})

export default router