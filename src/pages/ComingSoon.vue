<template>
  <div class="coming-soon-page">
    <div class="card">
      <h1 class="title">Tính năng đang được phát triển</h1>
      <p class="desc">{{ message }}</p>
      <router-link class="home-link" to="/salarycomposition">Về trang chính</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const feature = (route.query.feature as string) || ''

const message = computed(() => {
  return 'Tính năng này đang được phát triển. Hãy quay lại sau.'
})
</script>

<style scoped>
.coming-soon-page {
  height: 100%;
  display: flex;
  padding-top: 70px;
  align-items: flex-start;
  justify-content: center;
  background: var(--ms-bg, #f7f8fa);
}
.card {
  text-align: center;
  padding: 28px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  min-width: 320px;
}
.title {
  font-size: 28px;
  margin: 0 0 8px 0;
  color: #333;
}
.desc {
  margin: 0 0 16px 0;
  color: #555;
}
.home-link {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  background: var(--ms-primary, #34b057);
  color: white;
  text-decoration: none;
}
</style>
