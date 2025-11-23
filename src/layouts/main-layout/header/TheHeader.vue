<template>
  <header class="header flex items-center shadow-md">
    <div class="flex items-center h-full flex-none pl-4">
      <div class="flex items-center w-[205px] gap-4.5">
        <div class="switch-icon" />
        <div class="logo" />
        <span class="title whitespace-nowrap">Tiền lương</span>
      </div>

      <MSInputSearch icon="search" placeholder="Tìm kiếm" />
    </div>

    <div class="flex items-center justify-end flex-1 space-x-6 pr-4">
      <div class="icon-notification-version" />

      <div class="icon-store" />

      <div class="flex items-center space-x-6">
        <div class="icon-invite" />
        <div class="icon-message" />
        <div class="icon-notification-user" />
        <div class="icon-help" />
        <div class="icon-more-menu" />
        <div class="icon-knowledge" />
        <div class="user-avatar">
          <img src="@/assets/images/Avatar.svg" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'
</script>

<style scoped>
@import './css/header-icon.css';

.title {
  font-size: 18px;
  font-weight: 700;
}

.header {
  height: 100%;
  width: 100%;
}
</style>
