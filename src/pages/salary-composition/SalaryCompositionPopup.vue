<template>
  <div>
    <MSPopup
      :visible="visible"
      title="Thêm từ danh mục của hệ thống"
      :buttons="popupButtons"
      @action="onPopupAction"
      @update:visible="updateVisible"
      width="1146px"
    >
      <div class="flex flex-col h-full overflow-hidden gap-4">
        <div class="flex items-center justify-between">
          <div class="w-1/3">
            <MSInputSearch
              :height="36"
              :base-class="'bg-white border-gray-300'"
              v-model="searchQuery"
              placeholder="Tìm kiếm"
            />
          </div>
          <div class="w-1/4">
            <MSDropdown
              v-model="compositionType"
              :options="compositionTypeOptions"
              placeholder="Tất cả thành phần"
              label-position="right"
              @select="onCompositionTypeSelect"
            />
          </div>
        </div>

        <MSTable
          ref="tableRef"
          :data="tableData"
          :columns="gridColumns"
          :loading="isLoading"
          :show-selection="true"
          :show-action-column="false"
          gridHeight="calc(100vh - 390px)"
          @selection-change="onSelectionChange"
          class="flex-1 min-h-0"
        >
        </MSTable>

        <MSPagination
          :totalRecords="totalCount"
          v-model:currentPage="pageIndex"
          v-model:pageSize="pageSize"
          @page-change="onPageChange"
          @size-change="onSizeChange"
        />
      </div>
    </MSPopup>
    <MSPopup
      v-model:visible="confirmPopup.visible"
      :title="confirmPopup.title"
      :content="confirmPopup.content"
      :buttons="confirmPopup.buttons"
      @action="onConfirmPopupAction"
    />

    <Transition name="toast-slide">
      <MSToast v-if="toast.show" :type="toast.type" :message="toast.message" @close="closeToast" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import MSPopup from '@/components/popup/MSPopup.vue'
import MSTable from '@/components/table/MSTable.vue'
import MSPagination from '@/components/pagination/MSPagination.vue'
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'
import MSToast from '@/components/toast/MSToast.vue'
import SalaryCompositionSystemApi from '@/apis/components/SalaryCompositionSystemApi'
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'
import { CompositionType, CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNatureLabel } from '@/enums/CompositionNature'
import { OptionShowPaycheckLabel } from '@/enums/OptionShowPaycheck'
import { ValueTypeLabel } from '@/enums/ValueType'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', items: any[]): void
}>()

const tableData = ref<any[]>([])
const totalCount = ref(0)
const pageIndex = ref(1)
const pageSize = ref(15)
const searchQuery = ref('')
const isLoading = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pageIndex.value = 1
    loadData()
  }, 200)
})

const compositionType = ref(null)
const selectedItems = ref<any[]>([])
const toast = ref<{
  show: boolean
  type: 'success' | 'failed' | 'warning' | 'information'
  message: string
}>({ show: false, type: 'success', message: '' })
const closeToast = () => {
  toast.value.show = false
}

const confirmPopup = reactive({
  visible: false,
  title: 'Thông báo',
  content: '',
  buttons: [
    { label: 'Hủy bỏ', variant: 'secondary' as const },
    { label: 'Đồng ý', variant: 'primary' as const },
  ],
})

async function onConfirmPopupAction({ index }: any) {
  if (index === 1) {
    try {
      const salaryCompositionSystemIds = selectedItems.value.map((item) => item.id)
      await SalaryCompositionApi.updateSalaryCompositionsFromSystem({
        salaryCompositionSystemIds,
        isAllowanceUpdate: true,
      })
      emit('save', selectedItems.value)
      updateVisible(false)
      toast.value = { show: true, type: 'success', message: 'Thêm thành công' }
    } catch (error) {
      toast.value = { show: true, type: 'failed', message: 'Thêm thất bại' }
    }
  }
  confirmPopup.visible = false
}

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

const popupButtons = computed(() => [
  { label: 'Hủy bỏ', variant: 'secondary' as const, id: 'cancel' },
  {
    label: 'Đồng ý',
    variant: 'primary' as const,
    id: 'agree',
    disabled: selectedItems.value.length === 0,
  },
])

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

const loadData = async () => {
  try {
    isLoading.value = true
    const payload = {
      query: searchQuery.value,
      compositionType: compositionType.value,
      pageSize: pageSize.value,
      pageIndex: pageIndex.value,
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
    toast.value = { show: true, type: 'failed', message: errMsg }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      loadData()
    }
  },
)

function updateVisible(val: boolean) {
  emit('update:visible', val)
}

async function onPopupAction({ button }: { button: any }) {
  if (button.id === 'cancel') {
    updateVisible(false)
  } else if (button.id === 'agree') {
    try {
      const salaryCompositionSystemIds = selectedItems.value.map((item) => item.id)
      const res = await SalaryCompositionApi.updateSalaryCompositionsFromSystem({
        salaryCompositionSystemIds,
      })
      const resData = res?.data

      if (resData?.data && resData.data.length > 0) {
        confirmPopup.title = 'Chuyển trạng thái'
        confirmPopup.content = `Đã tồn tại ${resData.data.length} thành phần lương trùng mã trên danh sách. Chương trình sẽ cập nhật thông tin của thành phần lương mặc định vào bản ghi hiện có. Bạn có muốn tiếp tục không?`
        confirmPopup.visible = true
        return
      }

      emit('save', selectedItems.value)
      setTimeout(() => {
        updateVisible(false)
      }, 0)
      toast.value = { show: true, type: 'success', message: 'Thêm thành công' }
    } catch (error) {
      toast.value = { show: true, type: 'failed', message: 'Thêm thất bại' }
    }
  }
}

function onCompositionTypeSelect(opt: any) {
  compositionType.value = opt && opt.value !== undefined ? opt.value : opt
  pageIndex.value = 1
  loadData()
}

function onPageChange(p: number) {
  pageIndex.value = p
  loadData()
}

function onSizeChange(s: number) {
  pageSize.value = s
  pageIndex.value = 1
  loadData()
}

function onSelectionChange(items: any[]) {
  selectedItems.value = items
}
</script>

<style scoped>
:deep(.ms-popup__title) {
  font-size: 20px;
}
</style>
