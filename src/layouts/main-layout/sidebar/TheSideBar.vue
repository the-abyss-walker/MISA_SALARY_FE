<template>
  <div
    class="left-side-bar h-full pt-7 bg-[#161a17] flex flex-col transition-all duration-300"
    :class="collapsed ? 'collapsed w-[60px]' : 'w-[220px]'"
  >
    <!-- MENU -->
    <div class="flex-1 flex flex-col gap-2 px-2">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="sidebar-item flex items-center gap-3 h-10 rounded-lg cursor-pointer hover:bg-[#34b05740] transition-all"
        :class="[collapsed ? 'justify-center px-0' : 'px-4', activeId === item.id ? 'active' : '']"
        @click="onItemClick(item)"
      >
        <MSIcon
          :name="item.icon"
          class="transition-all duration-300"
          :class="collapsed ? 'mx-auto' : ''"
          :color="activeId === item.id ? '#FFFFFF' : '#FFFFFFB2'"
        />

        <!-- LABEL -->
        <span
          class="text-[#FFFFFFB2] whitespace-nowrap transition-all duration-300 sidebar-label"
          :class="[
            collapsed ? 'opacity-0 -translate-x-2.5 w-0' : 'opacity-100 translate-x-0 w-auto',
            activeId === item.id ? 'text-white' : '',
          ]"
        >
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- NÚT THU GỌN -->
    <div class="flex justify-center mb-4 mt-auto mx-auto">
      <DxButton
        :height="36"
        :width="collapsed ? 36 : 176"
        stylingMode="contained"
        type="default"
        class="button flex items-center justify-center bg-[#ffffff1f] hover:bg-[#FFFFFF)] transition-colors rounded-lg cursor-pointer"
        @click="$emit('toggle')"
      >
        <template #content>
          <div class="flex items-center gap-2 justify-center">
            <MSIcon
              name="sidebar_zoom"
              color="#FFFFFFB2"
              class="transition-transform duration-300"
              :style="{ transform: collapsed ? 'none' : 'scaleX(-1)' }"
            />
            <span v-if="!collapsed" class="text-[#FFFFFFB2] transition-opacity duration-300">
              Thu gọn
            </span>
          </div>
        </template>
      </DxButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import MSIcon from '@/components/icons/MSIcon.vue'
import { DxButton } from 'devextreme-vue/button'
import { ref } from 'vue'

const props = defineProps({
  collapsed: Boolean,
})

const activeId = ref<string | null>(null)

const menuItems = [
  { label: 'Tổng quan', id: 'dashboard', icon: 'dashboard', path: '/dashboard' },
  {
    label: 'Thành phần lương',
    id: 'salary_composition',
    icon: 'salary_composition',
    path: '/salarycomposition',
  },
  { label: 'Mẫu bảng lương', id: 'salary_template', icon: 'salary_template' },
  { label: 'Dữ liệu tính lương', id: 'salary_data', icon: 'salary_data' },
  { label: 'Tính lương', id: 'salary_table', icon: 'salary_table' },
  { label: 'Chi trả', id: 'payment', icon: 'payment' },
  { label: 'Báo cáo', id: 'report', icon: 'report' },
  { label: 'Thiết lập', id: 'settings', icon: 'settings' },
]

import { useRouter } from 'vue-router'
const router = useRouter()

function onItemClick(item: any) {
  activeId.value = item.id
  if (item.path) {
    router.push(item.path)
  } else {
    console.log('Clicked (no route):', item)
  }
}
</script>

<style scoped>
.sidebar-item:hover :deep(span) {
  color: #ffffff !important;
}

.sidebar-item.active {
  background-color: #34b057 !important;
}

.sidebar-item.active :deep(span) {
  color: #ffffff !important;
}

.sidebar-item.active :deep(svg) {
  color: #ffffff !important;
  fill: #ffffff !important;
}
</style>
