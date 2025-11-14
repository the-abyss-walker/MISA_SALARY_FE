<template>
  <div
    class="left-side-bar h-full pt-7 bg-[#161a17] flex flex-col transition-all duration-300"
    :class="collapsed ? 'w-[60px]' : 'w-[220px]'"
  >
    <!-- MENU -->
    <div class="flex-1 flex flex-col gap-2 px-2">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="flex items-center gap-3 h-10 rounded-lg cursor-pointer hover:bg-[#198f3b] transition"
        :class="collapsed ? 'justify-center px-0' : 'px-4'"
        @click="onItemClick(item)"
      >
        <MSIcon :name="item.icon" :color="'#FFFFFFB2'" />
        <span v-if="!collapsed" class="text-[#FFFFFFB2] whitespace-nowrap">
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- WRAPPER DIV NÚT THU GỌN -->
    <div
      class="flex justify-center mb-4 mt-auto transition-all duration-300 mx-auto"
      :style="{ width: collapsed ? '36px' : '176px', height: '36px' }"
    >
      <DxButton
        :height="36"
        :width="collapsed ? 36 : 176"
        stylingMode="contained"
        type="default"
        class="flex items-center justify-center bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.14)] transition-colors rounded-lg"
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
            <span v-if="!collapsed" class="text-[#FFFFFFB2]">Thu gọn</span>
          </div>
        </template>
      </DxButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import MSIcon from '@/components/icons/MSIcon.vue'
import { DxButton } from 'devextreme-vue/button'

const props = defineProps({
  collapsed: Boolean,
})

const menuItems = [
  { label: 'Tổng quan', id: 'dashboard', icon: 'dashboard' },
  { label: 'Thành phần lương', id: 'salary_composition', icon: 'salary_composition' },
  { label: 'Mẫu bảng lương', id: 'salary_template', icon: 'salary_template' },
  { label: 'Dữ liệu tính lương', id: 'salary_data', icon: 'salary_data' },
  { label: 'Tính lương', id: 'salary_table', icon: 'salary_table' },
  { label: 'Chi trả', id: 'payment', icon: 'payment' },
  { label: 'Báo cáo', id: 'report', icon: 'report' },
  { label: 'Thiết lập', id: 'settings', icon: 'settings' },
]

function onItemClick(item: any) {
  console.log('Clicked:', item)
}
</script>

<style scoped>
.left-side-bar {
  overflow: visible;
}
</style>
