<template>
  <SiteChrome>
    <section class="hero home-hero">
      <div class="container hero-shell">
        <div class="hero-content motion-rise motion-delay-1">
          <div class="hero-orbits" aria-hidden="true">
            <span class="hero-orbit hero-orbit-a"></span>
            <span class="hero-orbit hero-orbit-b"></span>
            <span class="hero-orbit hero-orbit-c"></span>
          </div>
          <div class="hero-badge">Xiamen No.1 High School · AI</div>
          <h1 class="hero-title">
            <span class="name-cn">{{ profile.nameCn }}</span>
            <span class="name-en">{{ profile.nameEn }}</span>
          </h1>
          <p class="hero-desc">
            {{ profile.title }}。
            关注中学人工智能教育、社团实践与开源工具在教学中的应用。
          </p>
          <div class="hero-tags">
            <span class="tag motion-float" style="--tag-tilt:1; --float-delay:.2s;">计算机科学与技术博士</span>
            <span class="tag motion-float" style="--tag-tilt:2; --float-delay:0s;">AI教育</span>
            <span class="tag motion-float" style="--tag-tilt:-1; --float-delay:.8s;">社团指导</span>
            <span class="tag motion-float" style="--tag-tilt:1; --float-delay:1.1s;">AYES2026 指导</span>
            <span class="tag motion-float" style="--tag-tilt:1; --float-delay:1.4s;">开源实践</span>
          </div>
          <div class="hero-buttons">
            <router-link to="/publications" class="btn btn-primary">查看论文</router-link>
            <router-link to="/news" class="btn btn-outline">最新动态</router-link>
          </div>
        </div>
        <div class="hero-note motion-rise motion-delay-2">
          <p>
            在学术研究之外，也持续维护一系列开源工具，
            涵盖翻译辅助、科研效率、智能办公与多媒体处理等方向。
          </p>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <p>向下浏览</p>
      </div>
    </section>

    <section class="about">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">个人简介</span>
          <h2 class="section-title">个人简介</h2>
          <p class="section-desc">人工智能教育 · 社团实践 · 开源工具</p>
        </div>

        <div class="about-profile">
          <div class="profile-image profile-image-stage">
            <span class="profile-aura profile-aura-a" aria-hidden="true"></span>
            <span class="profile-aura profile-aura-b" aria-hidden="true"></span>
            <picture>
              <source srcset="/profile.webp" type="image/webp" />
              <img src="/profile-opt.jpg" :alt="profile.nameCn" width="480" height="480" loading="eager" decoding="async" />
            </picture>
          </div>
          <div class="profile-info">
            <h3>{{ profile.nameCn }}</h3>
            <p class="profile-title">厦门一中 AI 实验室负责人｜信息组教师｜AI 社指导教师｜首届中学生 AI 精英峰会（AYES2026）技术指导</p>
            <p class="profile-desc">{{ profile.summary }}</p>
            <div class="profile-links">
              <a :href="profile.github" target="_blank" class="profile-link">GitHub</a>
              <a :href="'mailto:' + profile.emailUser + String.fromCharCode(64) + profile.emailDomain" class="profile-link">{{ profile.emailUser }} [at] {{ profile.emailDomain }}</a>
            </div>
          </div>
        </div>

        <div class="skills-section">
          <h3>技术栈</h3>
          <div class="skills-cloud">
            <span class="skill-item" v-for="skill in skills" :key="skill.name" :class="{ highlight: skill.highlight }">
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container home-grid">
        <article class="summary-panel summary-panel-wide motion-rise motion-delay-1">
          <div class="panel-head">
            <span class="section-tag">近期动态</span>
            <router-link to="/news" class="panel-link">查看全部</router-link>
          </div>
          <h2 class="panel-title">近期动态</h2>
          <div class="mini-list">
            <div class="mini-item" v-for="item in news.slice(0, 5)" :key="item.date + item.title">
              <span class="mini-date">{{ item.date }}</span>
              <p class="mini-copy">{{ item.title }}</p>
            </div>
          </div>
        </article>

        <article class="summary-panel summary-panel-paper motion-rise motion-delay-2">
          <div class="panel-head">
            <span class="section-tag">论文发表</span>
            <router-link to="/publications" class="panel-link">查看全部</router-link>
          </div>
          <h2 class="panel-title">代表论文</h2>
          <div class="mini-list">
            <div class="mini-item" v-for="paper in publications.slice(0, 5)" :key="paper.year + paper.title">
              <span class="mini-date">{{ paper.year }}</span>
              <p class="mini-copy">{{ paper.title }}</p>
            </div>
          </div>
        </article>

        <article class="summary-panel summary-panel-project motion-rise motion-delay-3">
          <div class="panel-head">
            <span class="section-tag">开源项目</span>
            <router-link to="/projects" class="panel-link">查看全部</router-link>
          </div>
          <h2 class="panel-title">精选项目</h2>
          <div class="mini-list mini-list-projects">
            <div class="mini-item" v-for="project in projects.slice(0, 5)" :key="project.name">
              <span class="mini-date">{{ project.name }}</span>
              <p class="mini-copy">{{ project.desc }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import SiteChrome from '../components/SiteChrome.vue'
import { news, profile, projects, publications, skills } from '../data/siteContent'
</script>
