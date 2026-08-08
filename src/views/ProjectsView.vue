<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container">
        <span class="section-tag">开源项目</span>
        <h1 class="page-title">开源项目</h1>
        <p class="page-intro">这里整理了我长期维护的一些开源软件、效率工具与研究辅助项目。</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="projects-grid">
          <div class="project-card" v-for="project in projects" :key="project.name">
            <div class="project-header">
              <div class="project-icon">{{ project.icon }}</div>
              <div class="project-stats" v-if="project.stars || project.forks">
                <span class="stat" v-if="project.stars">{{ project.stars }}</span>
                <span class="stat" v-if="project.forks">{{ project.forks }}</span>
              </div>
            </div>
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-desc">{{ project.desc }}</p>
            <div class="project-tags">
              <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <a :href="project.link" target="_blank" class="project-btn">去 GitHub 看看</a>
          </div>
        </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import SiteChrome from '../components/SiteChrome.vue'
import { projects } from '../data/siteContent'
</script>
