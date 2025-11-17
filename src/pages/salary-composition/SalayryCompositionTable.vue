<template>
  <div class="mstable w-full bg-white">
    <MSTableHeader
      v-model:left="leftDropdown"
      v-model:right="rightDropdown"
      v-model:search="searchQuery"
      v-bind="headerBindings"
      @left-select="onLeftSelect"
      @right-select="onRightSelect"
      @filter="onFilter"
      @config="onConfig"
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
  { dataField: 'SalaryCompositionCode', caption: 'Mã thành phần', width: 220 },
  { dataField: 'SalaryCompositionName', caption: 'Tên thành phần', width: 300 },
  { dataField: 'OrganizationUnitNames', caption: 'Đơn vị áp dụng', width: 250 },
  { dataField: 'CompositionType', caption: 'Loại thành phần', width: 150 },
  { dataField: 'CompositionNature', caption: 'Tính chất', width: 150 },
  { dataField: 'Taxable', caption: 'Chịu thuế', width: 100 },
  { dataField: 'TaxDeduction', caption: 'Giảm trừ khi tính thuế', width: 150 },
  { dataField: 'Quota', caption: 'Định mức', width: 120 },
  { dataField: 'ValueType', caption: 'Kiểu giá trị', width: 120 },
  { dataField: 'Value', caption: 'Giá trị', width: 120 },
  { dataField: 'Description', caption: 'Mô tả', width: 300 },
  { dataField: 'OptionShowPaycheck', caption: 'Hiển thị trên phiếu lương', width: 150 },
  { dataField: 'Formula', caption: 'Nguồn tạo', width: 150 },
  { dataField: 'Status', caption: 'Trạng thái', width: 150 },
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

function onFilter() {
  // bubble up or handle filter
}

function onConfig() {
  // handle export
}
</script>
