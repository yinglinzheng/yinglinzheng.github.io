<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container">
        <span class="section-tag">荣誉奖项</span>
        <h1 class="page-title">荣誉奖项</h1>
        <p class="page-intro">这里整理了学习、科研与竞赛中的部分代表性荣誉。</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="awards-grid">
          <article class="award-card" v-for="award in awards" :key="award.year + award.title">
            <div class="award-year">{{ award.year }}</div>
            <div class="award-content">
              <h3 class="award-title">{{ award.title }}</h3>
              <p class="award-desc">{{ award.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import SiteChrome from '../components/SiteChrome.vue'
import { awards } from '../data/siteContent'
</script>
