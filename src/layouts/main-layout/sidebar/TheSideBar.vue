<template>
  <div
    class="left-side-bar h-full pt-7 bg-[#161a17] flex flex-col transition-all duration-300"
    :class="collapsed ? 'collapsed' : ''"
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
      <button
        class="sidebar-collapse-btn flex items-center justify-center transition-colors rounded-lg cursor-pointer"
        :style="{ width: collapsed ? '36px' : '176px', height: '36px' }"
        @click="$emit('toggle')"
        aria-label="Thu gọn sidebar"
      >
        <div class="flex items-center gap-2 justify-center">
          <MSIcon
            name="sidebar_zoom"
            color="#FFFFFFB2"
            class="transition-transform duration-300 sidebar-collapse-icon"
            :style="{ transform: collapsed ? 'none' : 'scaleX(-1)' }"
          />
          <span v-if="!collapsed" class="sidebar-collapse-label transition-opacity duration-300">
            Thu gọn
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MSIcon from '@/components/icons/MSIcon.vue'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  collapsed: Boolean,
})

const activeId = ref<string | null>(null)
const router = useRouter()
const route = useRoute()

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

watch(
  () => route.path,
  (newPath) => {
    const found = menuItems.find((item) => item.path && newPath.startsWith(item.path))
    if (found) {
      activeId.value = found.id
    }
  },
  { immediate: true },
)

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

.sidebar-collapse-btn {
  background: #ffffff1d;
  border: none;
  color: #ffffffb2;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sidebar-collapse-btn:hover {
  background: #ffffff1f;
}
.sidebar-collapse-btn:hover .sidebar-collapse-label,
.sidebar-collapse-btn:hover .sidebar-collapse-icon {
  color: #ffffff !important;
}

/* ensure svg inside button becomes white on hover */
.sidebar-collapse-btn:hover :deep(svg) {
  color: #ffffff !important;
  fill: #ffffff !important;
}

.sidebar-collapse-label {
  color: #ffffffb2;
}
.sidebar-collapse-icon {
  color: #ffffffb2;
}

/* enforce exact sidebar widths and center icons when collapsed */
.left-side-bar {
  flex: 0 0 220px;
  min-width: 220px;
  max-width: 220px;
}
.left-side-bar.collapsed {
  flex: 0 0 60px;
  min-width: 60px;
  max-width: 60px;
}

/* center icons and remove extra gaps when collapsed */
.left-side-bar.collapsed .sidebar-item {
  justify-content: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  gap: 0 !important;
}

/* make each item a 36x36 square and centered when collapsed */
.left-side-bar.collapsed .sidebar-item {
  width: 36px !important;
  height: 36px !important;
  border-radius: 6px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* force vertical list container to center items horizontally when collapsed */
.left-side-bar.collapsed .flex-1 {
  align-items: center;
}

/* shrink svg/icon inside collapsed items to fit 36x36 */
.left-side-bar.collapsed .sidebar-item :deep(svg) {
  width: 20px !important;
  height: 20px !important;
  display: block;
  margin: 0 auto !important;
}

/* hide labels completely when collapsed for perfect centering */
.left-side-bar.collapsed .sidebar-label {
  opacity: 0 !important;
  width: 0 !important;
  transform: translateX(-10px) !important;
  pointer-events: none;
}

/* ensure the icon centers inside the small sidebar - force svg and icon wrapper to center */
.left-side-bar.collapsed .sidebar-item > * {
  margin: 0 auto !important;
}
.left-side-bar.collapsed .sidebar-item :deep(svg) {
  display: block;
  margin: 0 auto !important;
}
</style>
