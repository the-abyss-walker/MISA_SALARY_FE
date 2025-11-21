<template>
  <div class="bg-white">
    <MSTableHeader
      v-model:left="leftDropdown"
      v-model:search="searchQuery"
      v-bind="headerBindings"
      :showRight="false"
      :selectedCount="selectedCount"
      actionMode="add"
      @left-select="onLeftSelect"
      @filter="onFilter"
      @config="onConfig"
      @search="onSearchInput"
      @deselect="onDeselect"
      @add-to-list="onAddToList"
    />

    <MSTable
      ref="tableRef"
      :data="pagedData"
      :columns="gridColumns"
      :show-selection="true"
      @selection-change="onSelectionChange"
    />

    <MSPagination
      :totalRecords="totalCount"
      v-model:currentPage="page"
      v-model:pageSize="pageSize"
      @page-change="onPageChange"
      @size-change="onSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MSTableHeader from '@/components/table/table-header/MSTableHeader.vue'
import MSTable from '@/components/table/MSTable.vue'
import MSPagination from '@/components/pagination/MSPagination.vue'
import { CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNatureLabel } from '@/enums/CompositionNature'
import { OptionShowPaycheckLabel } from '@/enums/OptionShowPaycheck'
import { StatusLabel, Status } from '@/enums/Status'
import { ValueTypeLabel } from '@/enums/ValueType'
import SalaryCompositionSystemApi from '@/apis/components/SalaryCompositionSystemApi'

const gridColumns = [
  { dataField: 'SalaryCompositionSystemCode', caption: 'Mã thành phần' },
  { dataField: 'SalaryCompositionSystemName', caption: 'Tên thành phần' },
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

const tableData = ref<any[]>([])
const totalCount = ref(0)

const selectedCount = ref(0)
const selectedItems = ref<any[]>([])
const tableRef = ref<any>(null)

const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Đang theo dõi', value: Status.Following },
  { label: 'Ngừng theo dõi', value: Status.Stopped },
]

const loadData = async () => {
  try {
    const payload = {
      query: searchQuery.value,
      status: leftDropdown.value,
      pageSize: pageSize.value,
      pageIndex: page.value,
    }
    const res = await SalaryCompositionSystemApi.paging(payload)
    const resData = res?.data?.data
    const items = resData?.items ?? []
    totalCount.value = resData?.totalCount ?? 0

    tableData.value = items.map((item: any) => {
      const newItem: { [key: string]: any } = {
        ...item,
        SalaryCompositionSystemCode: item.salaryCompositionSystemCode,
        SalaryCompositionSystemName: item.salaryCompositionSystemName,
        CompositionType:
          CompositionTypeLabel[item.compositionType as keyof typeof CompositionTypeLabel],
        CompositionNature:
          CompositionNatureLabel[item.compositionNature as keyof typeof CompositionNatureLabel],
        OptionShowPaycheck:
          OptionShowPaycheckLabel[item.optionShowPaycheck as keyof typeof OptionShowPaycheckLabel],
        Status: StatusLabel[item.status as keyof typeof StatusLabel],
        ValueType: ValueTypeLabel[item.valueType as keyof typeof ValueTypeLabel],
        Taxable: item.taxable ? 'Có' : 'Không',
        TaxDeduction: item.taxDeduction ? 'Có' : 'Không',
        QuotaFormula: item.quotaFormula,
        Formula: item.formula,
        Description: item.description,
      }
      for (const key in newItem) {
        if (newItem[key] === null || newItem[key] === undefined || newItem[key] === '') {
          newItem[key] = '-'
        }
      }
      return newItem
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadData()
})

const searchQuery = ref('')
const leftDropdown = ref(null as any)

const pageSize = ref(15)
const page = ref(1)

const headerBindings = computed(() => ({
  leftOptions: statusOptions,
}))

const pagedData = computed(() => tableData.value)

function onSearchInput(val: string) {
  searchQuery.value = val
  page.value = 1
  loadData()
}

function onLeftSelect(opt: any) {
  // store the option value so v-model bindings match MSDropdown's modelValue
  leftDropdown.value = opt && opt.value !== undefined ? opt.value : opt
  page.value = 1
  loadData()
}

function onPageChange(p: number) {
  page.value = p
  loadData()
}

function onSizeChange(s: number) {
  pageSize.value = s
  page.value = 1
  loadData()
}

function onFilter() {
  // bubble up or handle filter
}

function onConfig() {
  // handle export
}

function onSelectionChange(items: any[]) {
  selectedItems.value = items
  selectedCount.value = items.length
}

function onDeselect() {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

function onAddToList() {
  console.log('Add to list', selectedItems.value)
}
</script>
