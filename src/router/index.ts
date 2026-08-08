import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/NewsView.vue')
  },
  {
    path: '/publications',
    name: 'Publications',
    component: () => import('../views/PublicationsView.vue')
  },
  {
    path: '/awards',
    name: 'Awards',
    component: () => import('../views/AwardsView.vue')
  },
  {
    path: '/experience',
    name: 'Experience',
    component: () => import('../views/ExperienceView.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue')
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: () => import('../components/BlogList.vue')
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
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

export default router
