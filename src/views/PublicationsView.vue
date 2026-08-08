<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container">
        <span class="section-tag">论文发表</span>
        <h1 class="page-title">论文发表</h1>
        <p class="page-intro">主要研究成果发表于计算机视觉、图形学与多媒体相关会议及期刊。</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container narrow">
        <div class="publication-list">
          <article class="publication-card" v-for="paper in publications" :key="paper.year + paper.title">
            <div class="publication-year">{{ paper.year }}</div>
            <div class="publication-body">
              <h3 class="publication-title">{{ paper.title }}</h3>
              <p class="publication-authors">{{ paper.authors }}</p>
              <p v-if="paper.note" class="publication-note">{{ paper.note }}</p>
              <p class="publication-venue">{{ paper.venue }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import SiteChrome from '../components/SiteChrome.vue'
import { publications } from '../data/siteContent'
</script>
