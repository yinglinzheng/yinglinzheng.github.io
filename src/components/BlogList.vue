<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container">
        <router-link to="/" class="mobile-back">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回首页
        </router-link>
        <span class="section-tag">文章专栏</span>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-intro">{{ pageSubtitle }}</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">

      <div class="filter-bar" v-if="showFilters">
        <div class="filter-row" v-if="columns.length > 1">
          <span class="filter-label">专栏</span>
          <button
            v-for="col in columns"
            :key="col"
            class="chip"
            :class="{ active: col === activeColumn }"
            @click="toggleColumn(col)"
          >{{ col }}</button>
        </div>
        <div class="filter-row" v-if="allTags.length > 0">
          <span class="filter-label">标签</span>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="chip"
            :class="{ active: tag === activeTag }"
            @click="toggleTag(tag)"
          >{{ tag }}</button>
        </div>
        <button
          v-if="activeColumn || activeTag"
          class="clear-filter"
          @click="clearFilters"
        >清除筛选（{{ filtered.length }} / {{ posts.length }}）</button>
      </div>

      <div class="blog-grid" v-if="filtered.length > 0">
        <article 
          v-for="post in filtered" 
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
          <div class="card-tags" v-if="post.tags && post.tags.length">
            <button
              v-for="tag in post.tags"
              :key="tag"
              class="tag-mini"
              :class="{ active: tag === activeTag }"
              title="按此标签筛选"
              @click.stop="toggleTag(tag)"
            >{{ tag }}</button>
          </div>
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

      <div v-else-if="posts.length > 0" class="no-result">
        <p>这个专栏与标签的组合下暂时没有文章</p>
        <button @click="clearFilters" class="retry-btn">清除筛选</button>
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
        <p class="hint">如需发布文章，可在 <code>public/blog/</code> 添加 Markdown，并运行 <code>bun run blog:generate</code> 生成索引。</p>
      </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteChrome from './SiteChrome.vue'
import { setPageTitle } from '../router'

interface BlogPost {
  id: string
  title: string
  date: string
  author?: string
  category: string
  tags?: string[]
  excerpt: string
  file: string
}

const route = useRoute()
const router = useRouter()
const posts = ref<BlogPost[]>([])
const loading = ref(false)
const error = ref(false)

// 专栏与标签都从文章里聚合出来，posts.json 是唯一数据源，不额外维护清单
const columns = computed(() => {
  const seen = new Set<string>()
  posts.value.forEach(post => { if (post.category) seen.add(post.category) })
  return [...seen]
})

const allTags = computed(() => {
  const seen = new Set<string>()
  posts.value.forEach(post => (post.tags || []).forEach(tag => seen.add(tag)))
  return [...seen].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

// 筛选状态放在 URL query 里（hash 路由下形如 #/blog?column=AI沉思录&tag=RLHF），链接可直接分享
// 重复参数会被 vue-router 解析成数组，这里统一取第一个，避免手改链接时筛不出结果
const firstQuery = (value: unknown) => {
  if (Array.isArray(value)) return String(value[0] ?? '')
  return String(value ?? '')
}

const activeColumn = computed(() => firstQuery(route.query.column))
const activeTag = computed(() => firstQuery(route.query.tag))

const filtered = computed(() =>
  posts.value.filter(post =>
    (!activeColumn.value || post.category === activeColumn.value) &&
    (!activeTag.value || (post.tags || []).includes(activeTag.value))
  )
)

const showFilters = computed(() =>
  posts.value.length > 0 && (columns.value.length > 1 || allTags.value.length > 0)
)

// 只有一个专栏时直接把专栏名当页头，避免出现一行只有一个按钮的无意义筛选条
const pageTitle = computed(() =>
  activeColumn.value || (columns.value.length === 1 ? columns.value[0] : '博客')
)

// 标签页标题跟页头保持一致（文章数加载完后会从「博客」变成实际专栏名）
watch(pageTitle, title => setPageTitle(title), { immediate: true })

const pageSubtitle = computed(() => {
  if (!activeColumn.value && !activeTag.value) return '按专栏与标签筛选文章'
  const scope = [
    activeColumn.value,
    activeTag.value ? `#${activeTag.value}` : ''
  ].filter(Boolean).join(' · ')
  return `当前筛选：${scope}（${filtered.value.length} / ${posts.value.length} 篇）`
})

const setQuery = (next: Record<string, string>) => {
  const query: Record<string, string> = {}
  Object.entries(next).forEach(([key, value]) => {
    if (value) query[key] = value
  })
  router.replace({ query })
}

const toggleColumn = (col: string) =>
  setQuery({ column: activeColumn.value === col ? '' : col, tag: activeTag.value })

const toggleTag = (tag: string) =>
  setQuery({ tag: activeTag.value === tag ? '' : tag, column: activeColumn.value })

const clearFilters = () => setQuery({})

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
/* 手机端整站导航是隐藏的（style.css 里 .nav-links display:none），
   列表页必须自带一个出口；桌面端有导航栏，这里不显示 */
.mobile-back {
  display: none;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 28px;
  margin-bottom: 40px;
  padding: 18px 24px;
  background: var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-right: 4px;
}

.chip {
  padding: 6px 14px;
  font-family: inherit;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: var(--surface-strong);
  border: 1px solid var(--line-soft);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.chip:hover {
  border-color: var(--primary);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.clear-filter {
  margin-left: auto;
  padding: 6px 4px;
  font-family: inherit;
  font-size: 0.85rem;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 1px dashed var(--line-soft);
  cursor: pointer;
  transition: color 0.25s ease;
}

.clear-filter:hover {
  color: var(--primary);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.blog-card {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 250, 244, 0.76)),
    var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: 26px;
  padding: 30px;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.32s ease, box-shadow 0.32s ease, background 0.32s ease;
  animation: fadeInUp 0.7s ease both;
}

.blog-grid .blog-card:nth-child(2) { animation-delay: 0.08s; }
.blog-grid .blog-card:nth-child(3) { animation-delay: 0.16s; }
.blog-grid .blog-card:nth-child(4) { animation-delay: 0.24s; }
.blog-grid .blog-card:nth-child(5) { animation-delay: 0.32s; }
.blog-grid .blog-card:nth-child(6) { animation-delay: 0.4s; }

.blog-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--gradient-1);
  opacity: 0;
  transition: opacity 0.32s ease;
}

.blog-card:hover {
  background: var(--bg-card-hover);
  transform: translateY(-6px);
  box-shadow: 0 26px 54px -30px rgba(186, 132, 79, 0.4);
}

.blog-card:hover::before {
  opacity: 1;
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
  padding: 3px 11px;
  background: rgba(214, 109, 66, 0.08);
  border: 1px solid rgba(214, 109, 66, 0.18);
  border-radius: 50px;
  font-size: 0.75rem;
  color: var(--primary);
}

.blog-title {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: var(--text-primary);
  line-height: 1.45;
  transition: color 0.3s ease;
}

.blog-card:hover .blog-title {
  color: var(--primary);
}

.blog-excerpt {
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.7;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag-mini {
  padding: 3px 10px;
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--secondary);
  background: rgba(90, 163, 163, 0.12);
  border: 1px solid transparent;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tag-mini:hover {
  border-color: var(--secondary);
}

.tag-mini.active {
  background: var(--secondary);
  color: #fff;
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
  border: 3px solid rgba(149, 120, 82, 0.16);
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
  background: rgba(214, 109, 66, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--primary-dark);
}

.no-result {
  text-align: center;
  padding: 60px 20px;
}

.no-result p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  /* 手机端固定头部矮很多，160px 顶部留白会白掉两成屏幕 */
  .inner-hero {
    padding-top: 108px;
  }

  .mobile-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 18px;
    font-weight: 600;
    color: var(--text-secondary);
    text-decoration: none;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }

  .blog-card {
    padding: 24px 22px;
    border-radius: 22px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .clear-filter {
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-card {
    animation: none;
  }
}
</style>