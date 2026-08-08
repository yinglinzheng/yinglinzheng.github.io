<template>
  <div class="site-shell">
    <div class="animated-bg">
      <div class="bg-circle" v-for="n in 5" :key="n"></div>
    </div>

    <header class="header" :class="{ scrolled: isScrolled }">
      <nav class="nav">
        <router-link to="/" class="logo">
          <span class="logo-text">
            <strong>Yinglin Zheng</strong>
            <small>AI Education</small>
          </span>
        </router-link>
        <ul class="nav-links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/news">动态</router-link></li>
          <li><router-link to="/publications">论文</router-link></li>
          <li><router-link to="/awards">荣誉</router-link></li>
          <li><router-link to="/experience">经历</router-link></li>
          <li><router-link to="/projects">开源</router-link></li>
          <li><router-link to="/blog">博客</router-link></li>
          <li><a href="/diffusion-model-tutorial/" target="_blank" rel="noopener">Diffusion 教程</a></li>
        </ul>
        <div class="nav-social">
          <a :href="profile.github" target="_blank" class="social-link" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3 class="footer-title">Yinglin Zheng</h3>
            <p>关注人工智能教育与开源工具，也乐于把研究经验转化为可落地的教学与实践。</p>
          </div>
          <div class="footer-links">
            <h4>链接</h4>
            <a :href="profile.github" target="_blank">GitHub</a>
            <a :href="profile.oldSite" target="_blank">旧版主页</a>
          </div>
          <div class="footer-contact">
            <h4>联系</h4>
            <a class="footer-mail" :href="'mailto:' + profile.emailUser + String.fromCharCode(64) + profile.emailDomain">{{ profile.emailUser }} [at] {{ profile.emailDomain }}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} {{ profile.nameEn }}. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { profile } from '../data/siteContent'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
