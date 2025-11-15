<template>
  <header class="w-full h-14 flex items-center mx-4">
    <!-- LEFT -->
    <div class="flex items-center h-full flex-none">
      <div class="flex items-center w-[210px] gap-4">
        <div class="switch-icon" />
        <div class="logo" />
        <span class="font-semibold text-[18px] whitespace-nowrap">Tiền lương</span>
      </div>

      <!-- Search input -->
      <div class="w-[300px] h-8">
        <MSInputSearch icon="search" placeholder="Tìm kiếm…" />
      </div>
    </div>

    <!-- RIGHT -->
    <div class="flex items-center justify-end flex-1 pr-1 space-x-6">
      <!-- Group 1 -->
      <div class="icon-notification-version" />

      <!-- Group 2 -->
      <div class="icon-store" />

      <!-- Group 3 -->
      <div class="flex items-center space-x-4">
        <div class="icon-invite" />
        <div class="icon-message" />
        <div class="icon-notification-user" />
        <div class="icon-more-menu" />
        <div class="icon-knowledge" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import MSIcon from '@/components/icons/MSIcon.vue'
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'
</script>

<style scoped>
@import './css/header-icon.css';
</style>
