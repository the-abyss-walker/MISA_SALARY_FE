<template>
  <div class="mstable w-full bg-white">
    <MSTableHeader
      v-model:left="leftDropdown"
      v-model:right="rightDropdown"
      v-model:search="searchQuery"
      v-bind="headerBindings"
      @left-select="onLeftSelect"
      @right-select="onRightSelect"
      @add="onAdd"
      @export="onExport"
      @search="onSearchInput"
    />

    <div class="mstable__grid">
      <MSTable :data="pagedData" :columns="gridColumns" :grid-height="gridHeight" />
    </div>

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
import { ref, computed } from 'vue'
import MSTableHeader from '@/components/table/table-header/MSTableHeader.vue'
import MSTable from '@/components/table/MSTable.vue'
import MSPagination from '@/components/pagination/MSPagination.vue'
import salaryData from '@/data/salarycomposition.json'

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

const tableData = ref(salaryData as any)

const searchQuery = ref('')
const leftDropdown = ref(null as any)
const rightDropdown = ref(null as any)
const gridHeight = ref('500px')

const pageSize = ref(15)
const page = ref(1)

const headerBindings = computed(() => ({
  // forward any header related settings (no options by default)
}))

const pagedData = computed(() => {
  const s = pageSize.value
  const p = page.value
  if (!s) return tableData.value
  const start = (p - 1) * s
  return tableData.value.slice(start, start + s)
})

function onSearchInput(val: string) {
  searchQuery.value = val
}

function onLeftSelect(opt: any) {
  leftDropdown.value = opt
}

function onRightSelect(opt: any) {
  rightDropdown.value = opt
}

function onPageChange(p: number) {
  page.value = p
}

function onSizeChange(s: number) {
  pageSize.value = s
  page.value = 1
}

function onAdd() {
  // bubble up or handle add
}

function onExport() {
  // handle export
}
</script>

<style scoped>
.mstable .dx-datagrid {
  background: white;
  border: 1px solid #e5e7eb;
}

.mstable .dx-datagrid .dx-scrollable,
.mstable .dx-datagrid .dx-scrollable-wrapper,
.mstable .dx-datagrid .dx-scrollable-container,
.mstable .dx-datagrid .dx-datagrid-rowsview {
  overflow: auto !important;
}

.mstable .dx-datagrid .dx-datagrid-headers .dx-datagrid-table,
.mstable .dx-datagrid .dx-datagrid-rowsview .dx-datagrid-table {
  min-width: 1200px;
  table-layout: fixed;
}

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

.mstable .dx-scrollable::-webkit-scrollbar {
  height: 12px;
  background: transparent;
}

.mstable .dx-scrollable::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
}
</style>
