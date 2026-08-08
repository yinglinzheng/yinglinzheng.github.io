<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container">
        <span class="section-tag">近期动态</span>
        <h1 class="page-title">最新动态</h1>
        <p class="page-intro">记录近期论文发表、开源发布与阶段性研究进展。</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container narrow">
        <div class="news-list">
          <article class="news-item" v-for="item in news" :key="item.date + item.title">
            <div class="news-date">{{ item.date }}</div>
            <div class="news-content">
              <h3 class="news-title">{{ item.title }}</h3>
            </div>
          </article>
        </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import SiteChrome from '../components/SiteChrome.vue'
import { news } from '../data/siteContent'
</script>
