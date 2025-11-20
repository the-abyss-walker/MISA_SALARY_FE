<template>
  <div class="bg-white">
    <MSToast
      v-if="toastVisible"
      :type="toastType"
      :message="toastMessage"
      @close="toastVisible = false"
    />
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

    <MSTable
      v-if="tableData.length > 0"
      :data="pagedData"
      :columns="gridColumns"
      :show-selection="true"
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
import MSToast from '@/components/toast/MSToast.vue'
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'
import { CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNatureLabel } from '@/enums/CompositionNature'
import { OptionShowPaycheckLabel } from '@/enums/OptionShowPaycheck'
import { StatusLabel } from '@/enums/Status'
import { ValueTypeLabel } from '@/enums/ValueType'

const gridColumns = [
  { dataField: 'SalaryCompositionCode', caption: 'Mã thành phần' },
  { dataField: 'SalaryCompositionName', caption: 'Tên thành phần' },
  { dataField: 'OrganizationUnitNames', caption: 'Đơn vị áp dụng' },
  { dataField: 'CompositionType', caption: 'Loại thành phần' },
  { dataField: 'CompositionNature', caption: 'Tính chất' },
  { dataField: 'Taxable', caption: 'Chịu thuế', datatype: 'string' },
  { dataField: 'TaxDeduction', caption: 'Giảm trừ khi tính thuế', datatype: 'string' },
  { dataField: 'Quota', caption: 'Định mức' },
  { dataField: 'ValueType', caption: 'Kiểu giá trị' },
  { dataField: 'Value', caption: 'Giá trị' },
  { dataField: 'Description', caption: 'Mô tả' },
  { dataField: 'OptionShowPaycheck', caption: 'Hiển thị trên phiếu lương' },
  { dataField: 'Formula', caption: 'Nguồn tạo' },
  { dataField: 'Status', caption: 'Trạng thái' },
]

const tableData = ref<Array<Record<string, any>>>([])
const totalCount = ref(0)

// toast state
const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref<'information' | 'warning' | 'success' | 'failed'>('failed')

const searchQuery = ref('')
const leftDropdown = ref(null as any)
const rightDropdown = ref(null as any)

const pageSize = ref(15)
const page = ref(1)

const headerBindings = computed(() => ({
  // forward any header related settings (no options by default)
}))

const pagedData = computed(() => [...tableData.value])

async function loadData() {
  try {
    const res = await SalaryCompositionApi.paging(page.value, pageSize.value)
    const payload = res?.data?.data
    const items = payload?.items ?? []
    totalCount.value = payload?.totalCount ?? items.length

    tableData.value = items.map((item: any) => {
      const newItem: { [key: string]: any } = {
        ...item,
        SalaryCompositionCode: item.salaryCompositionCode,
        SalaryCompositionName: item.salaryCompositionName,
        OrganizationUnitNames: (item.organizationUnitNames || []).join(', '),
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
        Quota: item.quota,
        Value: item.value,
        Description: item.description,
        Formula: item.formula,
      }

      for (const key in newItem) {
        if (newItem[key] === null || newItem[key] === undefined || newItem[key] === '') {
          newItem[key] = '-'
        }
      }

      return newItem
    })
    // Hide any previous error toast if data loads successfully
    toastVisible.value = false
  } catch (error) {
    // show toast with error message
    const errMsg = 'Lỗi'
    toastMessage.value = String(errMsg)
    toastType.value = 'failed'
    toastVisible.value = true
  }
}

onMounted(() => {
  loadData()
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
</script>
