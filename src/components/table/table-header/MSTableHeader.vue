<template>
  <div class="theader flex items-center justify-between" v-if="!selectedCount">
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
        :label-position="'right'"
      />

      <MSDropdownTree
        v-if="showRight"
        width="350px"
        height="36px"
        v-model="rightModel"
        :options="rightOptions"
        :placeholder="rightPlaceholder"
        @select="onRightSelect"
      />
      <MSButton variant="icon" icon="filter" @click="$emit('filter')" />
      <MSButton variant="icon" icon="setting" @click="$emit('config')" />
    </div>
  </div>
  <div class="theader flex items-center gap-4" v-else>
    <div class="flex items-center gap-2">
      <span class="text-base">Đã chọn</span>
      <span class="font-bold text-base">{{ selectedCount }}</span>
      <span class="deselect-btn cursor-pointer ml-2" @click="$emit('deselect')">Bỏ chọn</span>
    </div>
    <template v-if="actionMode === 'manage'">
      <MSButton
        v-if="canFollow"
        variant="secondary"
        class="btn-follow"
        icon="check_circle"
        @click="$emit('follow')"
      >
        Đang theo dõi
      </MSButton>
      <MSButton
        v-if="canUnfollow"
        variant="secondary"
        class="btn-unfollow"
        icon="minus_circle"
        @click="$emit('unfollow')"
      >
        Ngừng theo dõi
      </MSButton>
      <MSButton variant="secondary" class="btn-delete" icon="trash" @click="$emit('delete')">
        Xóa
      </MSButton>
    </template>
    <template v-else-if="actionMode === 'add'">
      <MSButton
        variant="secondary"
        class="btn-add-to-list"
        icon="plus"
        @click="$emit('add-to-list')"
      >
        Đưa vào danh sách sử dụng
      </MSButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownOption } from '@/types/dropdown'
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'
import MSButton from '@/components/button/MSButton.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'
import MSDropdownTree from '@/components/dropdown/MSDropdownTree.vue'

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
    showRight?: boolean
    selectedCount?: number
    actionMode?: 'manage' | 'add'
    canFollow?: boolean
    canUnfollow?: boolean
  }>(),
  {
    left: undefined,
    right: undefined,
    search: undefined,
    leftOptions: () => [
      { label: 'Tất cả trạng thái', value: null },
      { label: 'Đang hoạt động', value: 'active' },
      { label: 'Ngừng theo dõi', value: 'inactive' },
    ],
    rightOptions: () => [
      { label: 'Phòng nhân sự', value: 'hr' },
      { label: 'Phòng kế toán', value: 'accounting' },
      { label: 'Phòng IT', value: 'it' },
    ],
    leftPlaceholder: 'Tất cả trạng thái',
    rightPlaceholder: 'Tất cả đơn vị',
    searchPlaceholder: 'Tìm kiếm',
    showRight: true,
    selectedCount: 0,
    actionMode: 'manage',
    canFollow: false,
    canUnfollow: true,
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
  'unfollow',
  'follow',
  'delete',
  'deselect',
  'add-to-list',
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
  height: 61px;
  padding: 12px 20px;
}

.btn-unfollow {
  background-color: white !important;
  border: 1px solid #ff9900 !important;
  color: #ff9900 !important;
  --ms-icon-color: #ff9900 !important;
}

.btn-unfollow:hover {
  color: #ff9900 !important;
  --ms-icon-color: #ff9900 !important;
}

.btn-follow {
  background-color: white !important;
  border: 1px solid #34b057 !important;
  color: #34b057 !important;
  --ms-icon-color: #34b057 !important;
}

.btn-follow:hover {
  color: #34b057 !important;
  --ms-icon-color: #34b057 !important;
}

.btn-delete {
  background-color: white !important;
  border: 1px solid #ef292f !important;
  color: #ef292f !important;
  --ms-icon-color: #ef292f !important;
}

.btn-delete:hover {
  background-color: #fee8e7 !important;
  color: #ef292f !important;
  --ms-icon-color: #ef292f !important;
}

.deselect-btn {
  color: #34b057;
  font-weight: 700;
}

.btn-add-to-list {
  background-color: white !important;
  border: 1px solid #e0e0e0 !important;
  color: #212121 !important;
  --ms-icon-color: #6e737a !important;
}

.btn-add-to-list:hover {
  border-color: #34b057 !important;
  color: #34b057 !important;
  --ms-icon-color: #34b057 !important;
}
</style>
