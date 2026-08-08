import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsView from '../views/NewsView.vue'
import PublicationsView from '../views/PublicationsView.vue'
import AwardsView from '../views/AwardsView.vue'
import ExperienceView from '../views/ExperienceView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import BlogList from '../components/BlogList.vue'
import BlogPost from '../components/BlogPost.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/news',
    name: 'News',
    component: NewsView
  },
  {
    path: '/publications',
    name: 'Publications',
    component: PublicationsView
  },
  {
    path: '/awards',
    name: 'Awards',
    component: AwardsView
  },
  {
    path: '/experience',
    name: 'Experience',
    component: ExperienceView
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: BlogList
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: BlogPost
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
