<template>
  <div class="notfound-page">
    <div class="card">
      <h1 class="code">404</h1>
      <p class="message">Trang không tìm thấy — Không thể truy cập đường dẫn này.</p>
      <router-link class="home-link" to="/salarycomposition">Về trang chính</router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.notfound-page {
  height: 100%;
  display: flex;
  padding-top: 70px;
  align-items: flex-start;
  justify-content: center;
  background: var(--ms-bg, #f7f8fa);
}
.card {
  text-align: center;
  padding: 32px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  min-width: 320px;
}
.code {
  font-size: 72px;
  margin: 0 0 8px 0;
  color: #ff6b6b;
}
.message {
  margin: 0 0 16px 0;
  color: #333;
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
