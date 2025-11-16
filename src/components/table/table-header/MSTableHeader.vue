<template>
  <div class="theader flex items-center justify-between">
    <div class="flex items-center gap-2 w-1/2">
      <MSInputSearch
        :height="36"
        :base-class="'bg-white border-gray-300'"
        v-model="searchModel"
        :placeholder="searchPlaceholder"
      />
    </div>

    <div class="flex items-center gap-2">
      <MSDropdown
        v-model="leftModel"
        :options="leftOptions"
        :placeholder="leftPlaceholder"
        @select="onLeftSelect"
      />

      <MSDropdown
        v-model="rightModel"
        :options="rightOptions"
        :placeholder="rightPlaceholder"
        @select="onRightSelect"
      />

      <MSButton variant="icon" icon="filter" @click="$emit('filter')" />
      <MSButton variant="icon" icon="setting" @click="$emit('config')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownOption } from '@/types/dropdown'
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'
import MSButton from '@/components/button/MSButton.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'

const props = withDefaults(
  defineProps<{
    left?: any
    right?: any
    search?: string
    leftOptions?: DropdownOption[]
    rightOptions?: DropdownOption[]
    leftPlaceholder?: string
    rightPlaceholder?: string
    searchPlaceholder?: string
  }>(),
  {
    left: undefined,
    right: undefined,
    search: undefined,
    leftOptions: () => [
      { label: 'Tất cả trạng thái', value: null },
      { label: 'Đang hoạt động', value: 'active' },
      { label: 'Ngừng hoạt động', value: 'inactive' },
    ],
    rightOptions: () => [
      { label: 'Phòng nhân sự', value: 'hr' },
      { label: 'Phòng kế toán', value: 'accounting' },
      { label: 'Phòng IT', value: 'it' },
    ],
    leftPlaceholder: 'Tất cả trạng thái',
    rightPlaceholder: 'Tất cả đơn vị',
    searchPlaceholder: 'Tìm kiếm',
  },
)

const emit = defineEmits([
  'update:left',
  'update:right',
  'update:search',
  'left-select',
  'right-select',
  'config',
  'filter',
  'search',
])

const searchModel = computed({
  get: () => props.search,
  set: (v: string) => {
    emit('update:search', v)
    emit('search', v)
  },
})

const leftModel = computed({
  get: () => props.left,
  set: (v: any) => emit('update:left', v),
})

const rightModel = computed({
  get: () => props.right,
  set: (v: any) => emit('update:right', v),
})

function onLeftSelect(opt: any) {
  emit('left-select', opt)
}

function onRightSelect(opt: any) {
  emit('right-select', opt)
}
</script>

<style scoped>
.theader {
  padding: 12px 20px;
}
</style>
