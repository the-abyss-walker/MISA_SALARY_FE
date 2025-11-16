<template>
  <div class="mstable w-full bg-white">
    <MSTableHeader
      v-model:left="leftDropdown"
      v-model:right="rightDropdown"
      v-model:search="searchQuery"
      :leftOptions="props.leftOptions"
      :rightOptions="props.rightOptions"
      :leftPlaceholder="props.leftPlaceholder"
      :rightPlaceholder="props.rightPlaceholder"
      :searchPlaceholder="props.searchPlaceholder"
      @left-select="onLeftSelect"
      @right-select="onRightSelect"
      @add="$emit('add')"
      @export="$emit('export')"
      @search="onSearchInput"
    />

    <!-- Body: DevExtreme DataGrid -->
    <div>
      <DxDataGrid
        :dataSource="data"
        :showBorders="true"
        :wordWrapEnabled="true"
        :height="gridHeight"
        :remoteOperations="remoteOperations"
        @option-changed="onOptionChanged"
        @row-click="onRowClick"
      >
        <DxColumn
          v-for="col in columns"
          :key="col.dataField || col.field || col.dataIndex"
          :dataField="col.dataField || col.field || col.dataIndex"
          :caption="col.caption"
          :width="col.width"
          :cellTemplate="col.cellTemplate"
        />

        <DxPaging :enabled="true" :pageSize="pageSize" />
        <DxPager
          :visible="true"
          :showPageSizeSelector="true"
          :allowedPageSizes="allowedPageSizes"
          :showInfo="true"
        />
      </DxDataGrid>
    </div>

    <!-- Footer: handled by DevExtreme Pager inside grid (slot kept for extension) -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MSTableHeader from './table-header/MSTableHeader.vue'

import DxDataGrid, { DxColumn, DxPaging, DxPager } from 'devextreme-vue/data-grid'

type Opt = { label: string; value: any; disabled?: boolean }

const props = withDefaults(
  defineProps<{
    data?: any[]
    columns?: Array<Record<string, any>>
    pageSize?: number
    allowedPageSizes?: number[]
    leftOptions?: Opt[]
    rightOptions?: Opt[]
    leftPlaceholder?: string
    rightPlaceholder?: string
    searchPlaceholder?: string
    gridHeight?: number | string
    remoteOperations?: boolean
  }>(),
  {
    data: () => [],
    columns: () => [],
    pageSize: 5,
    allowedPageSizes: () => [5, 10, 20],
    leftOptions: () => [],
    rightOptions: () => [],
    leftPlaceholder: 'Lọc 1',
    rightPlaceholder: 'Lọc 2',
    searchPlaceholder: 'Tìm kiếm',
    gridHeight: '400px',
    remoteOperations: false,
  },
)

const emit = defineEmits(['search', 'filter-change', 'row-click', 'page-change', 'add', 'export'])

const searchQuery = ref('')
const leftDropdown = ref(null as any)
const rightDropdown = ref(null as any)
const pageSize = ref(props.pageSize)

const data = computed(() => props.data || [])
const columns = computed(() => props.columns || [])
const allowedPageSizes = computed(() => props.allowedPageSizes || [5, 10, 20])

function onSearchInput(val: string) {
  emit('search', val)
}

function onLeftSelect(opt: any) {
  emit('filter-change', { left: opt, right: rightDropdown.value })
}

function onRightSelect(opt: any) {
  emit('filter-change', { left: leftDropdown.value, right: opt })
}

function onRowClick(e: any) {
  emit('row-click', e)
}

function onOptionChanged(e: any) {
  // listen for paging changes
  try {
    const name = e?.fullName || ''
    if (name.includes('paging.pageIndex') || name.includes('paging.pageSize')) {
      emit('page-change', e)
    }
  } catch (err) {
    // ignore
  }
}

watch(
  () => props.pageSize,
  (v) => {
    pageSize.value = v
  },
)
</script>

<style scoped>
.mstable .dx-datagrid {
  background: white;
}
</style>
