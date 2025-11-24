<template>
  <div class="bg-white h-full flex flex-col">
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
      :loading="isLoading"
      :show-selection="true"
      gridHeight="calc(100vh - 250px)"
      @selection-change="onSelectionChange"
    >
      <template #action-panel="{ data }">
        <div class="action-button" title="Đưa vào danh sách sử dụng" @click.stop="handleAdd(data)">
          <MSIcon name="plus" color="#34B057" />
        </div>
      </template>
    </MSTable>

    <MSPagination
      :totalRecords="totalCount"
      v-model:currentPage="page"
      v-model:pageSize="pageSize"
      @page-change="onPageChange"
      @size-change="onSizeChange"
    />

    <MSPopup
      v-model:visible="popup.visible"
      :title="popup.title"
      :content="popup.content"
      :buttons="popup.buttons"
      @action="onPopupAction"
    />
    <Transition name="toast-slide">
      <MSToast v-if="toast.show" :type="toast.type" :message="toast.message" @close="closeToast" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import MSTableHeader from '@/components/table/table-header/MSTableHeader.vue'
import MSTable from '@/components/table/MSTable.vue'
import MSPagination from '@/components/pagination/MSPagination.vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import MSPopup from '@/components/popup/MSPopup.vue'
import MSToast from '@/components/toast/MSToast.vue'
import { CompositionType, CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNatureLabel } from '@/enums/CompositionNature'
import { OptionShowPaycheckLabel } from '@/enums/OptionShowPaycheck'
import { ValueTypeLabel } from '@/enums/ValueType'
import SalaryCompositionSystemApi from '@/apis/components/SalaryCompositionSystemApi'
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'

//#region Table configuration
// Các cột hiển thị trên bảng (dataField tương ứng key của mỗi dòng dữ liệu)
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
//#endregion

//#region Reactive state
const tableData = ref<any[]>([])
const totalCount = ref(0)

// Selection state exposed to parent
const selectedCount = ref(0)
const selectedItems = ref<any[]>([])
const tableRef = ref<any>(null)
const isLoading = ref(false)
//#endregion

//#region Filter options
// Các option để lọc theo loại thành phần (dùng cho header dropdown)
const compositionTypeOptions = [
  { label: 'Tất cả thành phần', value: null },
  { label: 'Thông tin nhân viên', value: CompositionType.EmployeeInfomation },
  { label: 'Chấm công', value: CompositionType.Timekeeping },
  { label: 'Doanh số', value: CompositionType.Sales },
  { label: 'KPI', value: CompositionType.KPI },
  { label: 'Sản phẩm', value: CompositionType.Product },
  { label: 'Lương', value: CompositionType.Salary },
  { label: 'Thuế TNCN', value: CompositionType.PersonalIncomeTax },
  { label: 'Bảo hiểm - Công đoàn', value: CompositionType.Insurance },
  { label: 'Khác', value: CompositionType.Other },
]
//#endregion

//#region Data loading
/**
 * Tải dữ liệu paging từ API hệ thống và map sang định dạng hiển thị.
 * Thay thế giá trị null/undefined/'' bằng dấu '-' để bảng không hiển thị ô trống.
 */
const loadData = async () => {
  try {
    isLoading.value = true
    const payload = {
      query: searchQuery.value,
      compositionType: leftDropdown.value,
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
    const errMsg = 'Lỗi khi tải dữ liệu.'
    toast.message = String(errMsg)
    toast.type = 'failed'
    toast.show = true
  } finally {
    isLoading.value = false
  }
}
//#endregion

onMounted(() => {
  loadData()
})

//#region Filters / pagination state
const searchQuery = ref('')
const leftDropdown = ref(null as any)

const pageSize = ref(15)
const page = ref(1)

const headerBindings = computed(() => ({
  leftOptions: compositionTypeOptions,
}))

const pagedData = computed(() => tableData.value)
//#endregion

//#region User interactions (search / filter / paging)
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
  // bubble up or handle filter (placeholder for future logic)
}

function onConfig() {
  // handle export or configuration actions (placeholder)
}
//#endregion

//#region Selection helpers
function onSelectionChange(items: any[]) {
  selectedItems.value = items
  selectedCount.value = items.length
}

function onDeselect() {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}
//#endregion

//#region Add to list (single / multiple)
function onAddToList() {
  if (selectedItems.value.length === 0) return
  popup.itemsToAdd = selectedItems.value
  popup.mode = 'confirm_add'
  popup.title = 'Thông báo'
  if (selectedItems.value.length === 1) {
    popup.content = `Bạn có chắc chắn muốn đưa thành phần lương mặc định ${selectedItems.value[0].salaryCompositionSystemName} vào danh sách sử dụng không?`
  } else {
    popup.content =
      'Bạn có chắc chắn muốn đưa các thành phần lương mặc định đã chọn vào danh sách sử dụng không?'
  }
  popup.visible = true
}

function handleAdd(data: any) {
  // Called from the action button in the table row to add a single item
  popup.itemsToAdd = [data]
  popup.mode = 'confirm_add'
  popup.title = 'Thông báo'
  popup.content = `Bạn có chắc chắn muốn đưa thành phần lương mặc định ${data.data.salaryCompositionSystemName} vào danh sách sử dụng không?`
  popup.visible = true
}
//#endregion

//#region Popup + Toast state
const popup = reactive({
  visible: false,
  title: 'Thông báo',
  content: '',
  buttons: [
    { label: 'Hủy bỏ', variant: 'secondary' as const },
    { label: 'Đồng ý', variant: 'primary' as const },
  ],
  itemsToAdd: [] as any[],
  mode: 'confirm_add',
})

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'failed' | 'information' | 'warning',
  message: '',
})

const showToast = (type: 'success' | 'failed' | 'information' | 'warning', message: string) => {
  toast.type = type
  toast.message = message
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const closeToast = () => {
  toast.show = false
}
//#endregion

//#region Popup action handler
/**
 * Xử lý hành động khi người dùng click 'Đồng ý' trong popup.
 * Thực hiện thêm hoặc cập nhật các thành phần từ hệ thống vào danh sách sử dụng.
 */
async function onPopupAction({ index }: any) {
  if (index === 1) {
    try {
      const salaryCompositionSystemIds = popup.itemsToAdd.map((item) => {
        if (item.data) {
          return item.data.id
        } else {
          return item.id
        }
      })

      if (popup.mode === 'confirm_add') {
        const res = await SalaryCompositionApi.updateSalaryCompositionsFromSystem({
          salaryCompositionSystemIds,
        })
        const resData = res.data
        console.log(resData)

        if (resData?.data && resData.data.length > 0) {
          // Server returned conflicts: ask user to confirm update
          popup.mode = 'confirm_update'
          popup.title = 'Chuyển trạng thái'
          popup.content = `Đã tồn tại ${resData.data.length} thành phần lương trùng mã trên danh sách. Chương trình sẽ cập nhật thông tin của thành phần lương mặc định vào bản ghi hiện có. Bạn có muốn tiếp tục không?`
          return
        }
      } else if (popup.mode === 'confirm_update') {
        await SalaryCompositionApi.updateSalaryCompositionsFromSystem({
          salaryCompositionSystemIds,
          isAllowanceUpdate: true,
        })
      }

      showToast('success', 'Thêm thành công')
      selectedItems.value = []
      if (tableRef.value) {
        tableRef.value.clearSelection()
      }
      await loadData()
    } catch (error) {
      console.error(error)
      showToast('failed', 'Có lỗi xảy ra')
    }
  }
  popup.visible = false
}
//#endregion

// Expose selection to parent component
defineExpose({
  selectedItems,
})
</script>
