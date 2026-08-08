<template>
  <SiteChrome>
    <section class="inner-hero">
      <div class="container">
        <span class="section-tag">教育与经历</span>
        <h1 class="page-title">教育与经历</h1>
        <p class="page-intro">包括教育背景，以及在厦门一中、微软亚洲研究院等机构的教学与研究经历。</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container narrow">
        <div class="experience-group">
          <div class="panel-head">
            <span class="section-tag">教育经历</span>
          </div>
          <div class="experience-list">
            <article class="experience-card" v-for="item in educationExperiences" :key="item.period + item.title">
              <div class="experience-period">{{ item.period }}</div>
              <div class="experience-body">
                <h3 class="experience-title">{{ item.title }}</h3>
                <p class="experience-org">{{ item.org }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="experience-group">
          <div class="panel-head">
            <span class="section-tag">工作经历</span>
          </div>
          <div class="experience-list">
            <article class="experience-card" v-for="item in workExperiences" :key="item.period + item.title">
              <div class="experience-period">{{ item.period }}</div>
              <div class="experience-body">
                <h3 class="experience-title">{{ item.title }}</h3>
                <p class="experience-org">{{ item.org }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </SiteChrome>
</template>

<script setup lang="ts">
import SiteChrome from '../components/SiteChrome.vue'
import { experiences } from '../data/siteContent'

// 按时间段起始时间降序（最新在前），避免手动维护顺序出错
const startValue = (period: string) => {
  const start = period.split(' - ')[0]
  const [y, m] = start.split('.').map(Number)
  return y * 12 + (m - 1)
}
const educationExperiences = experiences
  .filter((item) => item.type === 'education')
  .sort((a, b) => startValue(b.period) - startValue(a.period))
const workExperiences = experiences
  .filter((item) => item.type === 'work')
  .sort((a, b) => startValue(b.period) - startValue(a.period))
</script>
