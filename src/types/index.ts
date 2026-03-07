// src/types/index.ts

// 👇 更新 Publication 接口
export interface Publication {
  id: number
  title: string
  authors: string[] // 作者列表
  venue: string     // 会议或期刊名称
  year: number
  type?: 'Journal' | 'Conference' | 'Preprint' // 可选类型，用于图标区分
  link?: string     // 项目主页
  pdf?: string      // PDF 链接
  code?: string     // 代码链接
  bibtex?: string   // BibTeX 引用格式
  highlight?: boolean // 是否高亮显示 (如最佳论文)
}

export type ProjectStatus = 'Active' | 'Completed' | 'Archived';

export interface Project {
  id: number
  title: string
  description: string      // 简短描述 (用于卡片)
  longDescription?: string // 详细描述 (用于模态框，可选，默认同 description)
  image?: string           // 封面图 URL
  tags: string[]           // 技术栈标签
  link?: string            // 演示链接/Demo
  github?: string          // GitHub 仓库链接
  status: ProjectStatus    // 项目状态
  year?: number            // 开始年份或主要年份
  stars?: number           // GitHub Stars (可选，用于展示热度)
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  readTime: number
  coverImage?: string
  published: boolean
}

// 👇 新增：新闻分类联合类型
export type NewsCategory = 'Papers' | 'Awards' | 'Talks' | 'Others' | 'Workshops' | 'Teaching'; 
// 注：可以在这里随时添加新的类别，所有引用此类型的地方都会自动获得提示

// 👇 新增：新闻项接口
export interface NewsItem {
  id: number
  title: string
  date: string // ISO format YYYY-MM-DD
  excerpt: string
  category: NewsCategory
}

export interface NavItem {
  name: string;
  path: string;
}