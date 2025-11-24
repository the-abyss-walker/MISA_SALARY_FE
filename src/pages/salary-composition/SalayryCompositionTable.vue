<template>
  <div class="bg-white">
    <Transition name="toast-slide">
      <MSToast
        v-if="toastVisible"
        :type="toastType"
        :message="toastMessage"
        @close="toastVisible = false"
      />
    </Transition>
    <MSPopup
      v-if="popupVisible"
      :visible="popupVisible"
      :title="popupTitle"
      :buttons="popupButtons"
      @action="onPopupAction"
      @update:visible="(val) => (popupVisible = val)"
    >
      <div v-html="popupContent"></div>
    </MSPopup>
    <MSTableHeader
      v-model:left="leftDropdown"
      v-model:right="rightDropdown"
      v-model:search="searchQuery"
      v-bind="headerBindings"
      :selectedCount="selectedCount"
      :canFollow="showFollowButton"
      :canUnfollow="showUnfollowButton"
      @left-select="onLeftSelect"
      @search="onSearchInput"
      @unfollow="onUnfollow"
      @follow="onFollow"
      @delete="onDelete"
      @deselect="onDeselect"
    />

    <MSTable
      v-if="tableData.length >= 0"
      ref="tableRef"
      :data="pagedData"
      :columns="gridColumns"
      :show-selection="true"
      :loading="isLoading"
      @selection-change="onSelectionChange"
      @row-click="onRowClick"
    >
      <template #statusTemplate="{ data }">
        <div class="status-cell">
          <div
            class="status-dot"
            :style="{
              backgroundColor: data.data.value === 'Đang theo dõi' ? '#34B057' : '#FF9900',
            }"
          ></div>
          <span :style="{ color: data.data.value === 'Đang theo dõi' ? '#34B057' : '#FF9900' }">
            {{ data.data.value }}
          </span>
        </div>
      </template>
      <template #action-panel="{ data }">
        <div
          class="action-button"
          :title="getActionTitle(data.data)"
          @click.stop="onActionClick(data.data)"
        >
          <MSIcon :name="getActionIcon(data.data)" />
        </div>
        <div class="action-button" title="Nhân bản" @click.stop="onCloneItem(data.data)">
          <MSIcon name="copy" />
        </div>
        <div class="action-button" title="Sửa" @click.stop="onEditItem(data.data)">
          <MSIcon name="pencil" />
        </div>
        <div class="action-button" title="Xóa" @click.stop="onDeleteItem(data.data)">
          <MSIcon name="trash" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MSTableHeader from '@/components/table/table-header/MSTableHeader.vue'
import MSTable from '@/components/table/MSTable.vue'
import MSPagination from '@/components/pagination/MSPagination.vue'
import MSToast from '@/components/toast/MSToast.vue'
import MSPopup from '@/components/popup/MSPopup.vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'
import { CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNatureLabel } from '@/enums/CompositionNature'
import { OptionShowPaycheckLabel } from '@/enums/OptionShowPaycheck'
import { StatusLabel, Status } from '@/enums/Status'
import { ValueTypeLabel } from '@/enums/ValueType'

//#region Emits
// Sự kiện được emit ra cho parent (edit, delete, delete-multiple, clone)
const emit = defineEmits(['edit', 'delete', 'delete-multiple', 'clone'])
//#endregion

//#region Table configuration
// Cấu hình cột cho MSTable (dataField tương ứng với key của mỗi row)
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
  { dataField: 'IsDefault', caption: 'Nguồn tạo' },
  { dataField: 'Status', caption: 'Trạng thái', cellTemplate: 'statusTemplate' },
]
//#endregion

//#region Reactive state
const tableData = ref<Array<Record<string, any>>>([])
const totalCount = ref(0)

// Toast state used for inline notifications
const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref<'information' | 'warning' | 'success' | 'failed'>('failed')

const isLoading = ref(false)

// Filters / UI bindings
const searchQuery = ref('')
const leftDropdown = ref(null as any)
const rightDropdown = ref([])

// Pagination
const pageSize = ref(15)
const page = ref(1)

// Selection state
const selectedCount = ref(0)
const selectedItems = ref<any[]>([])

// Reference to the table component (used to clear selection)
const tableRef = ref<any>(null)
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

//#region Header action visibility
// Hiển thị/ẩn nút Theo dõi / Ngừng theo dõi dựa trên selection
const showFollowButton = computed(() => {
  return selectedItems.value.some((item) => item.status === Status.UnFollowing)
})

const showUnfollowButton = computed(() => {
  return selectedItems.value.some((item) => item.status === Status.Following)
})
//#endregion

//#region Bulk actions (follow/unfollow/delete)
function onFollow() {
  if (selectedItems.value.length === 0) return
  currentActionItem.value = { status: Status.Following }
  popupActionType.value = 'status-multiple'
  popupTitle.value = 'Chuyển trạng thái'
  popupContent.value =
    'Bạn có chắc chắn muốn chuyển trạng thái các thành phần lương đã chọn sang đang theo dõi không?'
  popupButtons.value = [
    { label: 'Hủy bỏ', variant: 'secondary' },
    { label: 'Đồng ý', variant: 'primary' },
  ]
  popupVisible.value = true
}

function onUnfollow() {
  if (selectedItems.value.length === 0) return
  currentActionItem.value = { status: Status.UnFollowing }
  popupActionType.value = 'status-multiple'
  popupTitle.value = 'Chuyển trạng thái'
  popupContent.value =
    'Bạn có chắc chắn muốn chuyển trạng thái các thành phần lương đã chọn sang ngừng theo dõi không?'
  popupButtons.value = [
    { label: 'Hủy bỏ', variant: 'secondary' },
    { label: 'Đồng ý', variant: 'primary' },
  ]
  popupVisible.value = true
}

async function onDelete() {
  if (selectedItems.value.length === 0) return
  emit('delete-multiple', selectedItems.value)
}
//#endregion

//#region Header bindings / paging
const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Đang theo dõi', value: Status.Following },
  { label: 'Ngừng theo dõi', value: Status.UnFollowing },
]

const headerBindings = computed(() => ({
  leftOptions: statusOptions,
  showRight: true,
  rightPlaceholder: 'Tất cả đơn vị',
}))

const pagedData = computed(() => [...tableData.value])
//#endregion

//#region Data loading & mapping
/**
 * Tải dữ liệu từ API và map sang định dạng hiển thị trong table.
 * Thay thế giá trị null/undefined/'' bằng dấu '-' để bảng hiển thị gọn.
 */
async function loadData() {
  try {
    isLoading.value = true
    const payload = {
      query: searchQuery.value,
      status: leftDropdown.value,
      pageSize: pageSize.value,
      pageIndex: page.value,
      organizationUnitIds: rightDropdown.value,
    }
    const res = await SalaryCompositionApi.paging(payload)
    const resData = res?.data?.data
    const items = resData?.items ?? []
    totalCount.value = resData?.totalCount ?? items.length

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
        IsDefault: item.isDefault ? 'Mặc định' : 'Tự thêm',
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
    const errMsg = 'Lỗi khi tải dữ liệu.'
    toastMessage.value = String(errMsg)
    toastType.value = 'failed'
    toastVisible.value = true
  } finally {
    isLoading.value = false
  }
}
//#endregion

onMounted(() => {
  loadData()
})

//#region User interactions (search/filter/paging)
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

watch(
  rightDropdown,
  () => {
    page.value = 1
    loadData()
  },
  { deep: true },
)

function onPageChange(p: number) {
  page.value = p
  loadData()
}

function onSizeChange(s: number) {
  pageSize.value = s
  page.value = 1
  loadData()
}
//#endregion

//#region Popup state and actions
// State used by confirmation popup for single/multiple actions
const popupVisible = ref(false)
const popupTitle = ref('')
const popupContent = ref('')
const currentActionItem = ref<any>(null)
const popupActionType = ref<'status' | 'delete' | 'delete-multiple' | 'status-multiple' | null>(
  null,
)
const popupButtons = ref<{ label: string; variant: 'primary' | 'secondary'; class?: string }[]>([
  { label: 'Không', variant: 'secondary' },
  { label: 'Có', variant: 'primary' },
])

function getActionIcon(item: any) {
  return item.status === Status.Following ? 'minus_circle' : 'check_circle'
}

function getActionTitle(item: any) {
  return item.status === Status.Following ? 'Ngừng theo dõi' : 'Theo dõi'
}

function onActionClick(item: any) {
  currentActionItem.value = item
  popupActionType.value = 'status'
  popupButtons.value = [
    { label: 'Không', variant: 'secondary' },
    { label: 'Có', variant: 'primary' },
  ]
  popupTitle.value = 'Chuyển trạng thái'
  const actionText = item.status === Status.Following ? 'ngừng theo dõi' : 'theo dõi'
  popupContent.value = `Bạn có chắc chắn muốn chuyển trạng thái thành phần lương <b>${item.SalaryCompositionName}</b> sang ${actionText} không?`
  popupVisible.value = true
}

async function onPopupAction({ button }: any) {
  if (popupActionType.value === 'status' && button.label === 'Có') {
    try {
      const newStatus =
        currentActionItem.value.status === Status.Following ? Status.UnFollowing : Status.Following
      console.log(currentActionItem.value.id, newStatus)
      await SalaryCompositionApi.updateStatus(currentActionItem.value.id, newStatus)

      await loadData()

      toastMessage.value = 'Cập nhật thành phần lương thành công'
      toastType.value = 'success'
      toastVisible.value = true
    } catch (error) {
      toastMessage.value = 'Cập nhật thành phần lương thất bại'
      toastType.value = 'failed'
      toastVisible.value = true
    }
  } else if (popupActionType.value === 'status-multiple' && button.label === 'Đồng ý') {
    try {
      const ids = selectedItems.value.map((i: any) => i.id)
      await SalaryCompositionApi.updateListStatus(ids, currentActionItem.value.status)
      await loadData()
      toastMessage.value = 'Cập nhật thành công'
      toastType.value = 'success'
      toastVisible.value = true
      if (tableRef.value) {
        tableRef.value.clearSelection()
      }
      selectedItems.value = []
      selectedCount.value = 0
    } catch (error) {
      toastMessage.value = 'Cập nhật thất bại'
      toastType.value = 'failed'
      toastVisible.value = true
    }
  }
  popupVisible.value = false
}
//#endregion

//#region Row actions
function onRowClick(e: any) {
  if (e && e.data) {
    onEditItem(e.data)
  }
}

function onCloneItem(item: any) {
  emit('clone', item)
}

function onEditItem(item: any) {
  emit('edit', item)
}

async function onDeleteItem(item: any) {
  emit('delete', item)
}
//#endregion

// Expose helper functions to parent (loadData, clearSelection)
defineExpose({
  loadData,
  clearSelection: onDeselect,
})
</script>

<style>
.status-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.btn-popup-delete {
  background-color: #ef292f !important;
  color: white !important;
  border: none !important;
}

.btn-popup-delete:hover {
  background-color: #d91b20 !important;
}
</style>
