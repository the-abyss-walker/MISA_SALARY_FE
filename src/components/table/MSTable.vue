<template>
  <div class="mstable w-full bg-white">
    <MSTableHeader
      v-model:left="leftDropdown"
      v-model:right="rightDropdown"
      v-model:search="searchQuery"
      v-bind="headerBindings"
      @left-select="onLeftSelect"
      @right-select="onRightSelect"
      @add="$emit('add')"
      @export="$emit('export')"
      @search="onSearchInput"
    />
    <!-- Temporary: show pagination for visual check -->
    <MSPagination
      :totalRecords="tableData.length"
      v-model:currentPage="page"
      v-model:pageSize="pageSize"
      @page-change="onPageChange"
      @size-change="onSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxButton,
  DxPaging,
  DxLookup,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid'

import MSTableHeader from './table-header/MSTableHeader.vue'
import MSPagination from '@/components/pagination/MSPagination.vue'
import salaryData from '../../data/salarycomposition.json'

import type { DropdownOption } from '@/types/dropdown'
import { employees as defaultEmployees, states, getMaxID, type Employee } from '../../data/data.ts'

const props = withDefaults(
  defineProps<{
    data?: any[]
    columns?: Array<Record<string, any>>
    pageSize?: number
    leftOptions?: DropdownOption[]
    rightOptions?: DropdownOption[]
    leftPlaceholder?: string
    rightPlaceholder?: string
    searchPlaceholder?: string
    gridHeight?: number | string
    remoteOperations?: boolean
  }>(),
  {
    data: () => [],
    columns: () => [],
    pageSize: 15,
    // NOTE: intentionally do NOT provide defaults for header-related props here
    // so `MSTableHeader` can use its own defaults. If a parent of `MSTable`
    // passes these props, they will be forwarded below.
    gridHeight: '400px',
    remoteOperations: false,
  },
)

const emit = defineEmits([
  'search',
  'filter-change',
  'row-click',
  'page-change',
  'add',
  'export',
  'selection-change',
])

const searchQuery = ref('')
const leftDropdown = ref(null as any)
const rightDropdown = ref(null as any)
const pageSize = ref(props.pageSize)
const page = ref(1)

const headerBindings = computed(() => {
  const b: Record<string, any> = {}
  if (props.leftOptions !== undefined) b.leftOptions = props.leftOptions
  if (props.rightOptions !== undefined) b.rightOptions = props.rightOptions
  if (props.leftPlaceholder !== undefined) b.leftPlaceholder = props.leftPlaceholder
  if (props.rightPlaceholder !== undefined) b.rightPlaceholder = props.rightPlaceholder
  if (props.searchPlaceholder !== undefined) b.searchPlaceholder = props.searchPlaceholder
  return b
})

// Columns requested by the user, mapped to data fields in the temporary JSON
const gridColumns = [
  { dataField: 'SalaryCompositionCode', caption: 'Mã thành phần' },
  { dataField: 'SalaryCompositionName', caption: 'Tên thành phần' },
  { dataField: 'OrganizationUnitNames', caption: 'Đơn vị áp dụng' },
  { dataField: 'CompositionType', caption: 'Loại thành phần' },
  { dataField: 'CompositionNature', caption: 'Tính chất' },
  { dataField: 'Taxable', caption: 'Chịu thuế' },
  { dataField: 'TaxDeduction', caption: 'Giảm trừ khi tính thuế' },
  { dataField: 'Quota', caption: 'Định mức' },
  { dataField: 'ValueType', caption: 'Kiểu giá trị' },
  { dataField: 'Value', caption: 'Giá trị' },
  { dataField: 'Description', caption: 'Mô tả' },
  { dataField: 'OptionShowPaycheck', caption: 'Hiển thị trên phiếu lương' },
  { dataField: 'Formula', caption: 'Nguồn tạo' },
  { dataField: 'Status', caption: 'Trạng thái' },
]

const tableData = ref(props.data && props.data.length ? props.data : (salaryData as any))

const actionButtons = [
  {
    hint: 'Nhân bản',
    icon: 'repeat',
    onClick: (e: any) => {
      alert('Clone ' + e.row.data.name)
    },
  },
  {
    hint: 'Sửa',
    icon: 'edit',
    onClick: (e: any) => {
      alert('Edit ' + e.row.data.name)
    },
  },
  {
    hint: 'Xóa',
    icon: 'trash',
    onClick: (e: any) => {
      alert('Delete ' + e.row.data.name)
    },
  },
]

const employees = ref(defaultEmployees)

function onSearchInput(val: string) {
  emit('search', val)
}

function onLeftSelect(opt: any) {
  emit('filter-change', { left: opt, right: rightDropdown.value })
}

function onRightSelect(opt: any) {
  emit('filter-change', { left: leftDropdown.value, right: opt })
}

function onPageChange(p: number) {
  page.value = p
  // emit to parent if needed
  emit('page-change', p)
}

function onSizeChange(s: number) {
  pageSize.value = s
  // when size changes, reset page to 1 for visual check
  page.value = 1
  emit('page-change', 1)
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
  border: 1px solid #e5e7eb;
}

/* Ensure horizontal scrolling for the grid content (DevExtreme uses nested scrollable containers) */
.mstable .dx-datagrid .dx-scrollable,
.mstable .dx-datagrid .dx-scrollable-wrapper,
.mstable .dx-datagrid .dx-scrollable-container,
.mstable .dx-datagrid .dx-datagrid-rowsview {
  overflow: auto !important;
}

/* Give the inner tables a minimum width so horizontal scrollbar appears when needed */
.mstable .dx-datagrid .dx-datagrid-headers .dx-datagrid-table,
.mstable .dx-datagrid .dx-datagrid-rowsview .dx-datagrid-table {
  min-width: 1200px;
  table-layout: fixed;
}

/* Make grid cells and header show clear borders */
.mstable .dx-datagrid .dx-datagrid-headers .dx-row,
.mstable .dx-datagrid .dx-datagrid-rowsview .dx-row {
  border-bottom: 1px solid #e5e7eb;
}

.mstable .dx-datagrid .dx-datagrid-table th,
.mstable .dx-datagrid .dx-datagrid-table td {
  border-right: 1px solid #e5e7eb;
  padding: 8px 12px;
  vertical-align: middle;
  white-space: normal;
}

/* Ensure scrollbars are visible on Windows (override any hiding) */
.mstable .dx-scrollable::-webkit-scrollbar {
  height: 12px;
  background: transparent;
}

.mstable .dx-scrollable::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
}
</style>
