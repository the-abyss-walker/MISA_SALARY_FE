<template>
  <div class="ms-pagination">
    <div class="left">
      <span class="total"
        >Tổng số bản ghi: <strong>{{ totalRecords }}</strong></span
      >
    </div>

    <div class="right">
      <div class="page-size">
        <label for="ps-select">Số bản ghi / trang</label>

        <MSDropdown
          :options="pageSizeOptions.map((o) => ({ label: String(o), value: o }))"
          v-model="localPageSize"
          :width="80"
          placement="top"
          labelAlign="left"
        />
      </div>

      <div class="range">
        <strong>{{ rangeStart }} - {{ rangeEnd }}</strong> bản ghi
      </div>

      <div class="controls">
        <button class="btn" :disabled="isFirst" @click="goPrev" aria-label="Trang trước">
          <MSIcon name="chevron_left" />
        </button>
        <button class="btn" :disabled="isLast" @click="goNext" aria-label="Trang sau">
          <MSIcon name="chevron_right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'

interface Props {
  totalRecords?: number
  pageSize?: number
  currentPage?: number
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  totalRecords: 0,
  pageSize: 15,
  currentPage: 1,
  pageSizeOptions: () => [15, 25, 50, 100],
})

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

const localPageSize = ref(props.pageSize)
const localPage = ref(props.currentPage)

watch(
  () => props.pageSize,
  (v) => {
    localPageSize.value = v
  },
)

watch(
  () => props.currentPage,
  (v) => {
    localPage.value = v
  },
)

watch(localPageSize, (newSize, old) => {
  // when page size changes, reset to page 1
  localPage.value = 1
  emit('update:pageSize', newSize)
  emit('size-change', newSize)
  emit('update:currentPage', 1)
  emit('page-change', 1)
})

const totalPages = computed(() => {
  return props.totalRecords > 0
    ? Math.max(1, Math.ceil(props.totalRecords / localPageSize.value))
    : 1
})

const isFirst = computed(() => localPage.value <= 1)
const isLast = computed(() => localPage.value >= totalPages.value)

const rangeStart = computed(() => {
  if (props.totalRecords === 0) return 0
  return (localPage.value - 1) * localPageSize.value + 1
})

const rangeEnd = computed(() => Math.min(localPage.value * localPageSize.value, props.totalRecords))

function onSizeChange() {
  // handled by watcher on localPageSize
}

function goPrev() {
  if (isFirst.value) return
  localPage.value = Math.max(1, localPage.value - 1)
  emit('update:currentPage', localPage.value)
  emit('page-change', localPage.value)
}

function goNext() {
  if (isLast.value) return
  localPage.value = Math.min(totalPages.value, localPage.value + 1)
  emit('update:currentPage', localPage.value)
  emit('page-change', localPage.value)
}
</script>

<style scoped>
.ms-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-top: 1px solid #e0e0e0;
  background: #f6f6f6;
  z-index: 10;
}
.ms-pagination .left {
  font-size: 14px;
}
.ms-pagination .right {
  display: flex;
  gap: 24px;
  align-items: center;
}
.page-size label {
  margin-right: 6px;
  font-size: 14px;
}
/* dropdown uses shared `MSDropdown` component styles */
.range {
  font-size: 14px;
  /* font-weight: bold; */
  color: #374151;
}
.controls {
  display: flex;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
