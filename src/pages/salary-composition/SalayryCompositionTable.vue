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
      @right-select="onRightSelect"
      @filter="onFilter"
      @config="onConfig"
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
      @selection-change="onSelectionChange"
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
import { ref, computed, onMounted } from 'vue'
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

const selectedCount = ref(0)
const selectedItems = ref<any[]>([])

const tableRef = ref<any>(null)

function onSelectionChange(items: any[]) {
  selectedItems.value = items
  selectedCount.value = items.length
}

function onDeselect() {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

const showFollowButton = computed(() => {
  return selectedItems.value.some((item) => item.status === Status.UnFollowing)
})

const showUnfollowButton = computed(() => {
  return selectedItems.value.some((item) => item.status === Status.Following)
})

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

  try {
    const ids = selectedItems.value.map((item) => item.id)
    const res = await SalaryCompositionApi.defaultComposition(ids)
    const { defaultComposition, normalComposition } = res.data.data

    if (defaultComposition && defaultComposition.length > 0) {
      const names = defaultComposition.map((i: any) => i.salaryCompositionName).join(', ')

      popupTitle.value = 'Xóa thành phần lương'
      popupContent.value = `<b>${names}</b> là giá trị mặc định của hệ thống nên không thể xóa. Bạn có muốn xoá các thành phần còn lại không?`

      if (normalComposition && normalComposition.length > 0) {
        popupButtons.value = [
          { label: 'Đóng', variant: 'primary' },
          { label: 'Xóa', variant: 'secondary', class: 'btn-popup-delete' },
        ]
        currentActionItem.value = normalComposition
        popupActionType.value = 'delete-multiple'
      } else {
        popupContent.value = `<b>${names}</b> là giá trị mặc định của hệ thống nên không thể xóa.`
        popupButtons.value = [{ label: 'Đóng', variant: 'primary' }]
        popupActionType.value = null
      }
      popupVisible.value = true
    } else {
      currentActionItem.value = normalComposition
      popupActionType.value = 'delete-multiple'
      popupTitle.value = 'Xóa thành phần lương'
      popupContent.value = `Bạn có chắc chắn muốn xóa ${selectedItems.value.length} thành phần lương đã chọn không?`
      popupButtons.value = [
        { label: 'Không', variant: 'secondary' },
        { label: 'Có', variant: 'primary' },
      ]
      popupVisible.value = true
    }
  } catch (error) {
    console.error(error)
    toastMessage.value = 'Có lỗi xảy ra khi kiểm tra dữ liệu.'
    toastType.value = 'failed'
    toastVisible.value = true
  }
}

const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Đang theo dõi', value: Status.Following },
  { label: 'Ngừng theo dõi', value: Status.UnFollowing },
]

const headerBindings = computed(() => ({
  leftOptions: statusOptions,
}))

const pagedData = computed(() => [...tableData.value])

async function loadData() {
  try {
    const payload = {
      query: searchQuery.value,
      status: leftDropdown.value,
      pageSize: pageSize.value,
      pageIndex: page.value,
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
  }
}

onMounted(() => {
  loadData()
})

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

// Popup state
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
  } else if (popupActionType.value === 'delete' && button.label === 'Xóa') {
    try {
      await SalaryCompositionApi.delete(currentActionItem.value.id)
      await loadData()
      toastMessage.value = 'Xóa thành phần lương thành công'
      toastType.value = 'success'
      toastVisible.value = true
    } catch (error) {
      toastMessage.value = 'Xóa thành phần lương thất bại'
      toastType.value = 'failed'
      toastVisible.value = true
    }
  } else if (
    popupActionType.value === 'delete-multiple' &&
    (button.label === 'Xóa' || button.label === 'Có')
  ) {
    try {
      const ids = currentActionItem.value.map((i: any) => i.id)
      await SalaryCompositionApi.bulkDelete(ids)
      await loadData()
      toastMessage.value = 'Xóa thành phần lương thành công'
      toastType.value = 'success'
      toastVisible.value = true
      if (tableRef.value) {
        tableRef.value.clearSelection()
      }
      selectedItems.value = []
      selectedCount.value = 0
    } catch (error) {
      toastMessage.value = 'Xóa thành phần lương thất bại'
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

function onCloneItem(item: any) {
  console.log('Clone item', item)
}

function onEditItem(item: any) {
  console.log('Edit item', item)
}

async function onDeleteItem(item: any) {
  try {
    const res = await SalaryCompositionApi.defaultComposition([item.id])
    const { defaultComposition, normalComposition } = res.data.data

    if (normalComposition && normalComposition.length > 0) {
      currentActionItem.value = item
      popupActionType.value = 'delete'
      popupTitle.value = 'Thông báo'
      popupContent.value = `Bạn có chắc chắn muốn xóa thành phần lương <b>${item.SalaryCompositionName}</b> không?`
      popupButtons.value = [
        { label: 'Hủy', variant: 'secondary' },
        { label: 'Xóa', variant: 'primary' },
      ]
      popupVisible.value = true
    } else if (defaultComposition && defaultComposition.length > 0) {
      popupActionType.value = null
      popupTitle.value = 'Thông báo'
      popupContent.value =
        'Đây là thành phần lương mặc định của hệ thống nên không thể xóa. Vui lòng kiểm tra lại.'
      popupButtons.value = [{ label: 'Đóng', variant: 'primary' }]
      popupVisible.value = true
    }
  } catch (error) {
    console.error(error)
  }
}
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

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.5s ease;
}

.toast-slide-enter-from {
  transform: translate(-100vw, -50%) !important;
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translate(100vw, -50%) !important;
  opacity: 0;
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
