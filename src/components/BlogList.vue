<template>
  <div class="blog-list-page">
    <div class="container">
      <div class="page-header">
        <router-link to="/" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回首页
        </router-link>
        <h1>博客文章</h1>
        <p class="subtitle">记录技术、分享经验</p>
      </div>

      <div class="blog-grid" v-if="posts.length > 0">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="blog-card"
          @click="goToPost(post.id)"
        >
          <div class="blog-meta">
            <span class="blog-date">{{ formatDate(post.date) }}</span>
            <span class="blog-category">{{ post.category }}</span>
          </div>
          <h2 class="blog-title">{{ post.title }}</h2>
          <p class="blog-excerpt">{{ post.excerpt }}</p>
          <div class="blog-footer">
            <span class="read-more">
              阅读全文
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </span>
          </div>
        </article>
      </div>

      <div v-else-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>加载失败，请稍后重试</p>
        <button @click="loadPosts" class="retry-btn">重试</button>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2h9l5 5v15H6z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h8M9 16h8M9 19h5" />
          </svg>
        </div>
        <h2>博客即将上线</h2>
        <p>这里将分享人工智能教育与开源实践的文章，敬请期待。</p>
        <p class="hint">如需发布文章，可在 <code>public/blog/</code> 添加 Markdown，并运行 <code>npm run blog:generate</code> 生成索引。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  file: string
}

const router = useRouter()
const posts = ref<BlogPost[]>([])
const loading = ref(false)
const error = ref(false)

const loadPosts = async () => {
  loading.value = true
  error.value = false
  
  try {
    const response = await fetch('/blog/posts.json')
    if (!response.ok) throw new Error('Failed to load posts')
    const data = await response.json()
    posts.value = data.posts.sort((a: BlogPost, b: BlogPost) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (err) {
    console.error('Error loading posts:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const goToPost = (id: string) => {
  router.push(`/blog/${id}`)
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.blog-list-page {
  min-height: 100vh;
  padding: 120px 0 80px;
  background: var(--bg-dark);
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--primary);
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.blog-card {
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.blog-card:hover {
  background: var(--bg-card-hover);
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.blog-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.blog-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.blog-category {
  padding: 2px 10px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 50px;
  font-size: 0.75rem;
  color: var(--accent);
}

.blog-title {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: var(--text-primary);
  line-height: 1.4;
}

.blog-excerpt {
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.7;
}

.blog-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-weight: 500;
  transition: gap 0.3s ease;
}

.blog-card:hover .read-more {
  gap: 8px;
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

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  color: var(--primary);
  margin-bottom: 24px;
  opacity: 0.85;
}

.empty-state h2 {
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.empty-state p {
  max-width: 480px;
  margin: 0 auto 12px;
  line-height: 1.7;
}

.empty-state .hint {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.empty-state code {
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--accent);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>