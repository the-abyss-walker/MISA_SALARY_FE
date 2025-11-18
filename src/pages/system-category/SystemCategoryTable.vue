<template>
  <div class="bg-white">
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

    <MSTable :data="pagedData" :columns="gridColumns" />

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
import systemData from '@/data/systemcomposition.json'
import { CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNatureLabel } from '@/enums/CompositionNature'
import { OptionShowPaycheckLabel } from '@/enums/OptionShowPaycheck'
import { StatusLabel } from '@/enums/Status'
import { ValueTypeLabel } from '@/enums/ValueType'

const gridColumns = [
  { dataField: 'SalaryCompositionCode', caption: 'Mã thành phần' },
  { dataField: 'SalaryCompositionName', caption: 'Tên thành phần' },
  { dataField: 'CompositionType', caption: 'Loại thành phần' },
  { dataField: 'CompositionNature', caption: 'Tính chất' },
  { dataField: 'Taxable', caption: 'Chịu thuế' },
  { dataField: 'TaxDeduction', caption: 'Giảm trừ khi tính thuế' },
  { dataField: 'QuotaFormula', caption: 'Định mức' },
  { dataField: 'ValueType', caption: 'Kiểu giá trị' },
  { dataField: 'Formula', caption: 'Giá trị' },
  { dataField: 'Description', caption: 'Mô tả' },
  { dataField: 'OptionShowPaycheck', caption: 'Hiển thị trên phiếu lương' },
]

const tableData = ref(
  (systemData as any).map((item: any) => {
    const newItem: { [key: string]: any } = {
      ...item,
      CompositionType:
        CompositionTypeLabel[item.CompositionType as keyof typeof CompositionTypeLabel],
      CompositionNature:
        CompositionNatureLabel[item.CompositionNature as keyof typeof CompositionNatureLabel],
      OptionShowPaycheck:
        OptionShowPaycheckLabel[item.OptionShowPaycheck as keyof typeof OptionShowPaycheckLabel],
      Status: StatusLabel[item.Status as keyof typeof StatusLabel],
      ValueType: ValueTypeLabel[item.ValueType as keyof typeof ValueTypeLabel],
      Taxable: item.Taxable ? 'Có' : 'Không',
      TaxDeduction: item.TaxDeduction ? 'Có' : 'Không',
    }
    for (const key in newItem) {
      if (newItem[key] === null || newItem[key] === undefined || newItem[key] === '') {
        newItem[key] = '-'
      }
    }
    return newItem
  }),
)

const searchQuery = ref('')
const leftDropdown = ref(null as any)
const rightDropdown = ref(null as any)

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
  // store the option value so v-model bindings match MSDropdown's modelValue
  leftDropdown.value = opt && opt.value !== undefined ? opt.value : opt
}

function onRightSelect(opt: any) {
  // store the option value so v-model bindings match MSDropdown's modelValue
  rightDropdown.value = opt && opt.value !== undefined ? opt.value : opt
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
