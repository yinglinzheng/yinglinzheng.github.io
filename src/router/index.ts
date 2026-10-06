import { createRouter, createWebHashHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 页面标题；留空则用站点默认标题
    title?: string
  }
}

const SITE_TITLE = 'Yinglin Zheng'

// 统一在这里拼标题。默认后缀是 Yinglin；文章页会传专栏名进来，变成「文章名 - 专栏名」
export const setPageTitle = (pageTitle?: string, suffix = 'Yinglin') => {
  // 用 || 兜底而不是只靠默认值：显式传空字符串时默认值不生效，否则会留下「标题 - 」的尾巴
  document.title = pageTitle ? `${pageTitle} - ${suffix || 'Yinglin'}` : SITE_TITLE
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/news',
    name: 'News',
    meta: { title: '最新动态' },
    component: () => import('../views/NewsView.vue')
  },
  {
    path: '/publications',
    name: 'Publications',
    meta: { title: '论文成果' },
    component: () => import('../views/PublicationsView.vue')
  },
  {
    path: '/awards',
    name: 'Awards',
    meta: { title: '荣誉奖项' },
    component: () => import('../views/AwardsView.vue')
  },
  {
    path: '/experience',
    name: 'Experience',
    meta: { title: '个人经历' },
    component: () => import('../views/ExperienceView.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    meta: { title: '开源项目' },
    component: () => import('../views/ProjectsView.vue')
  },
  {
    path: '/blog',
    name: 'BlogList',
    meta: { title: '博客' },
    component: () => import('../components/BlogList.vue')
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    meta: { title: '文章' },
    component: () => import('../components/BlogPost.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach(to => {
  setPageTitle(to.meta.title)
})

export default router
