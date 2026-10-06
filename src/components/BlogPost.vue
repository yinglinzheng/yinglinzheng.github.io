<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container narrow">
        <router-link :to="listLink" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回{{ post ? post.category : '博客' }}
        </router-link>

        <div v-if="post" class="post-meta-header">
          <span class="post-category">{{ post.category }}</span>
          <span v-if="post.author" class="post-author">作者：{{ post.author }}</span>
          <span class="post-date">{{ formatDate(post.date) }}</span>
        </div>

        <h1 v-if="post" class="post-title">{{ post.title }}</h1>

        <div v-if="post && post.tags && post.tags.length" class="post-tags">
          <router-link
            v-for="tag in post.tags"
            :key="tag"
            :to="tagLink(tag)"
            class="post-tag"
          >#{{ tag }}</router-link>
        </div>

        <div v-if="post && post.excerpt" class="post-lede-block">
          <span class="post-lede-label">导言</span>
          <p class="post-lede">{{ post.excerpt }}</p>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container narrow">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载文章中...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>文章加载失败</p>
          <button @click="loadPost" class="retry-btn">重试</button>
        </div>

        <template v-else-if="post">
          <article class="post-content" v-html="renderedContent"></article>

          <nav class="post-nav" v-if="prevPost || nextPost">
            <router-link
              v-if="prevPost"
              :to="`/blog/${prevPost.id}`"
              class="post-nav-item"
            >
              <span class="post-nav-label">← 上一篇 · 更早</span>
              <span class="post-nav-title">{{ prevPost.title }}</span>
            </router-link>
            <span v-else class="post-nav-spacer" aria-hidden="true"></span>

            <router-link
              v-if="nextPost"
              :to="`/blog/${nextPost.id}`"
              class="post-nav-item next"
            >
              <span class="post-nav-label">下一篇 · 更新 →</span>
              <span class="post-nav-title">{{ nextPost.title }}</span>
            </router-link>
            <span v-else class="post-nav-spacer" aria-hidden="true"></span>
          </nav>
        </template>

        <div v-else class="not-found">
          <p>文章不存在</p>
          <router-link to="/blog" class="back-btn">返回博客列表</router-link>
        </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
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

// 去掉文件开头的 YAML frontmatter：元信息已在页头展示，否则会被渲染成一坨原文
const stripFrontmatter = (src: string) =>
  src.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')

const renderedContent = computed(() => {
  return md.render(stripFrontmatter(content.value))
})

const listLink = computed(() => ({
  path: '/blog',
  query: post.value ? { column: post.value.category } : {}
}))

const tagLink = (tag: string) => ({
  path: '/blog',
  query: { column: post.value?.category, tag }
})

// 上/下篇：posts.json 新的在前，所以 index+1 是更早的「上一篇」，index-1 是更新的「下一篇」
const orderedPosts = computed(() =>
  [...postsList.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
)

const currentIndex = computed(() =>
  orderedPosts.value.findIndex(item => item.id === post.value?.id)
)

const prevPost = computed(() =>
  currentIndex.value >= 0 ? orderedPosts.value[currentIndex.value + 1] : undefined
)

const nextPost = computed(() =>
  currentIndex.value > 0 ? orderedPosts.value[currentIndex.value - 1] : undefined
)

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
    // 文章标题要等 posts.json 拿到才知道，这里覆盖路由里写的占位标题
    setPageTitle(foundPost.title, foundPost.category)
    
    // 加载 Markdown 内容
    const response = await fetch(`/blog/${foundPost.file}`)
    if (!response.ok) throw new Error('Failed to load post content')
    const text = await response.text()

    // 期间可能又点了别的文章，丢弃过期响应，避免旧正文盖掉新正文
    if (postId !== route.params.id) return
    content.value = text
    
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

// /blog/:id 之间跳转复用的是同一个组件实例，onMounted 不会再执行，
// 必须自己监听 params.id，否则点了上/下篇 URL 变了但正文不刷新
watch(() => route.params.id, id => {
  if (id) loadPost()
})

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
/* 无面板：页头与正文之间留出明确的一段距离，让正文看起来是新的一块 */
.content-section {
  padding-top: 28px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 28px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--primary);
}

.post-meta-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-bottom: 18px;
}

.post-category {
  padding: 4px 12px;
  background: rgba(214, 109, 66, 0.08);
  border: 1px solid rgba(214, 109, 66, 0.18);
  border-radius: 50px;
  font-size: 0.8rem;
  color: var(--primary);
}

.post-author {
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.post-date {
  font-size: 0.92rem;
  color: var(--text-muted);
}

.post-title {
  font-size: clamp(1.9rem, 4.2vw, 2.9rem);
  font-weight: 700;
  line-height: 1.35;
  max-width: 22em;
  color: var(--text-primary);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.post-tag {
  padding: 4px 12px;
  font-size: 0.85rem;
  color: var(--secondary);
  background: rgba(90, 163, 163, 0.12);
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.post-tag:hover {
  background: var(--secondary);
  color: #fff;
}

.post-lede-block {
  /* 字号基准与正文一致，好让 42em 的行宽和正文列完全对齐 */
  font-size: 1.0625rem;
  max-width: 42em;
  margin-top: 34px;
  padding: 20px 26px 22px;
  background: linear-gradient(135deg, rgba(255, 238, 216, 0.6), rgba(255, 248, 238, 0.42));
  border: 1px solid rgba(214, 109, 66, 0.12);
  border-radius: 18px;
}

/* 标签做成胶囊，明确命名这块内容是什么；
   引用块是「左竖条 + 暖底 + 无标签」，两者不会混 */
.post-lede-label {
  display: inline-block;
  margin-bottom: 12px;
  padding: 3px 11px;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--primary);
  background: rgba(214, 109, 66, 0.1);
  border-radius: 50px;
}

.post-lede {
  font-size: 1.12rem;
  line-height: 1.9;
  color: var(--text-secondary);
}

.post-content {
  /* 没有面板撑宽度了，行宽得自己锁住：42em ≈ 714px，约 42 个汉字一行，
     不锁的话正文会铺满 900px 容器，一行 50 字读起来眼睛要跑回来 */
  max-width: 42em;
  font-size: 1.0625rem;
  line-height: 1.95;
  color: var(--text-secondary);
  overflow-wrap: break-word;
  animation: fadeInUp 0.7s ease both;
}

/* Markdown 正文排版 */
.post-content :deep(> :first-child) {
  margin-top: 0;
}

.post-content :deep(h1) {
  font-size: 1.7rem;
  font-weight: 700;
  margin: 44px 0 20px;
  line-height: 1.45;
  color: var(--text-primary);
}

.post-content :deep(h2) {
  position: relative;
  font-size: 1.42rem;
  font-weight: 700;
  margin: 52px 0 20px;
  padding-left: 16px;
  line-height: 1.5;
  color: var(--text-primary);
}

/* 小标题左侧主色条，长文扫读时靠它定位段落边界 */
.post-content :deep(h2::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.28em;
  width: 4px;
  height: 1.05em;
  border-radius: 4px;
  background: var(--gradient-1);
}

.post-content :deep(h3) {
  font-size: 1.18rem;
  font-weight: 600;
  margin: 36px 0 14px;
  color: var(--text-primary);
}

.post-content :deep(p) {
  margin-bottom: 1.35em;
}

.post-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 700;
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
  background: rgba(214, 109, 66, 0.08);
  padding: 2px 7px;
  border-radius: 6px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
  color: var(--primary-dark);
}

.post-content :deep(pre) {
  background: var(--surface-strong);
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  padding: 22px 24px;
  overflow-x: auto;
  margin: 26px 0;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 1.3em 0;
  padding-left: 1.6em;
}

.post-content :deep(li) {
  margin-bottom: 0.6em;
  line-height: 1.9;
}

.post-content :deep(li::marker) {
  color: var(--primary);
}

/* 引用块不再用斜体：中文字体没有真斜体，浏览器拉伸出来的很毛糙 */
.post-content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  background: rgba(255, 246, 233, 0.7);
  padding: 14px 20px;
  border-radius: 0 14px 14px 0;
  margin: 26px 0;
  color: var(--text-secondary);
  font-style: normal;
}

.post-content :deep(blockquote p) {
  margin-bottom: 0;
}

.post-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--line-soft);
  margin: 40px 0;
}

.post-content :deep(table) {
  /* 没有面板的 overflow 兜底了，宽表在手机上要能横向滚动 */
  display: block;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-collapse: collapse;
  margin: 26px 0;
}

.post-content :deep(th),
.post-content :deep(td) {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid var(--line-soft);
}

.post-content :deep(th) {
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(214, 109, 66, 0.06);
}

.post-content :deep(tr:hover) {
  background: rgba(214, 109, 66, 0.04);
}

.post-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  margin: 24px 0;
}

/* 上/下篇导航 */
.post-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 28px;
}

.post-nav-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 26px;
  background: rgba(255, 252, 245, 0.5);
  border: 1px solid rgba(214, 109, 66, 0.14);
  border-radius: 22px;
  text-decoration: none;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.post-nav-item:hover {
  border-color: rgba(214, 109, 66, 0.4);
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.post-nav-item.next {
  align-items: flex-end;
  text-align: right;
}

.post-nav-label {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.post-nav-title {
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.55;
  max-width: 30em;
}

.post-nav-item:hover .post-nav-title {
  color: var(--primary);
}

.post-nav-spacer {
  display: block;
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
  /* 手机端固定头部矮很多，160px 顶部留白会白掉两成屏幕 */
  .inner-hero {
    padding-top: 108px;
  }

  /* 没有卡片内边距后，手机端把容器留白收一点，换回每行多两三个字的宽度 */
  .container.narrow {
    padding: 0 20px;
  }

  .post-lede-block {
    padding: 16px 18px 18px;
  }

  .post-lede {
    font-size: 1.02rem;
  }

  .post-content {
    font-size: 1rem;
  }

  .post-content :deep(h1) {
    font-size: 1.45rem;
  }

  .post-content :deep(h2) {
    font-size: 1.24rem;
    margin: 40px 0 16px;
  }

  .post-content :deep(pre) {
    padding: 16px;
  }

  .post-nav {
    grid-template-columns: 1fr;
  }

  .post-nav-item.next {
    align-items: flex-start;
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .post-content {
    animation: none;
  }
}
</style>