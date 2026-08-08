<template>
  <div class="blog-post-page">
    <div class="container">
      <div class="post-header">
        <router-link to="/blog" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回博客列表
        </router-link>
        
        <div v-if="post" class="post-meta-header">
          <span class="post-category">{{ post.category }}</span>
          <span class="post-date">{{ formatDate(post.date) }}</span>
        </div>
        
        <h1 v-if="post" class="post-title">{{ post.title }}</h1>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载文章中...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>文章加载失败</p>
        <button @click="loadPost" class="retry-btn">重试</button>
      </div>

      <article v-else-if="post" class="post-content" v-html="renderedContent"></article>

      <div v-else class="not-found">
        <p>文章不存在</p>
        <router-link to="/blog" class="back-btn">返回博客列表</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  file: string
}

const route = useRoute()
const router = useRouter()
const post = ref<BlogPost | null>(null)
const content = ref('')
const loading = ref(false)
const error = ref(false)
const postsList = ref<BlogPost[]>([])

// 配置 Markdown 渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return ''
  }
})

const renderedContent = computed(() => {
  return md.render(content.value)
})

const loadPostsList = async () => {
  try {
    const response = await fetch('/blog/posts.json')
    if (!response.ok) throw new Error('Failed to load posts')
    const data = await response.json()
    postsList.value = data.posts
  } catch (err) {
    console.error('Error loading posts list:', err)
  }
}

const loadPost = async () => {
  loading.value = true
  error.value = false
  
  const postId = route.params.id as string
  
  try {
    // 先加载文章列表找到对应文章
    if (postsList.value.length === 0) {
      await loadPostsList()
    }
    
    const foundPost = postsList.value.find(p => p.id === postId)
    if (!foundPost) {
      error.value = true
      loading.value = false
      return
    }
    
    post.value = foundPost
    
    // 加载 Markdown 内容
    const response = await fetch(`/blog/${foundPost.file}`)
    if (!response.ok) throw new Error('Failed to load post content')
    content.value = await response.text()
    
    // 滚动到顶部
    window.scrollTo(0, 0)
  } catch (err) {
    console.error('Error loading post:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  padding: 120px 0 80px;
  background: var(--bg-dark);
}

.post-header {
  max-width: 800px;
  margin: 0 auto 60px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--primary);
}

.post-meta-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.post-category {
  padding: 4px 12px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 50px;
  font-size: 0.85rem;
  color: var(--accent);
}

.post-date {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.post-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Markdown 样式 */
.post-content :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 48px 0 24px;
  color: var(--text-primary);
}

.post-content :deep(h2) {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 40px 0 20px;
  color: var(--text-primary);
}

.post-content :deep(h3) {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 32px 0 16px;
  color: var(--text-primary);
}

.post-content :deep(p) {
  margin-bottom: 20px;
}

.post-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.post-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.post-content :deep(a:hover) {
  border-bottom-color: var(--primary);
}

.post-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
  color: var(--accent);
}

.post-content :deep(pre) {
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  overflow-x: auto;
  margin: 24px 0;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 20px 0;
  padding-left: 24px;
}

.post-content :deep(li) {
  margin-bottom: 8px;
}

.post-content :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 20px;
  margin: 24px 0;
  color: var(--text-muted);
  font-style: italic;
}

.post-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 40px 0;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}

.post-content :deep(th),
.post-content :deep(td) {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.post-content :deep(th) {
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.post-content :deep(tr:hover) {
  background: rgba(255, 255, 255, 0.02);
}

.loading-state {
  text-align: center;
  padding: 60px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
}

.error-state {
  text-align: center;
  padding: 60px 0;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.not-found {
  text-align: center;
  padding: 60px 0;
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.back-btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .post-title {
    font-size: 1.8rem;
  }
  
  .post-content {
    font-size: 1rem;
  }
  
  .post-content :deep(h1) {
    font-size: 1.6rem;
  }
  
  .post-content :deep(h2) {
    font-size: 1.3rem;
  }
  
  .post-content :deep(pre) {
    padding: 16px;
  }
}
</style>