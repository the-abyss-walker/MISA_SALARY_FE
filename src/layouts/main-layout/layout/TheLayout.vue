<template>
  <div id="layout" class="flex flex-col">
    <div id="header" class="bg-white flex items-center">
      <TheHeader />
    </div>

    <div class="flex flex-1">
      <TheSideBar :collapsed="isCollapsed" @toggle="toggleSidebar" />

      <div class="content flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from '../header/TheHeader.vue'
import TheSideBar from '../sidebar/TheSideBar.vue'

const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
#layout {
  height: 100%;
}

#header {
  height: 48px;
}

.content {
  padding: 16px 24px;
  background-color: #f2f2f2;
}
</style>
