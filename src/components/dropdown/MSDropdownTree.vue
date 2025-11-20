<template>
  <div class="dx-field-value">
    <DxDropDownBox
      v-model:value="treeBoxValue"
      :show-clear-button="false"
      :input-attr="{ 'aria-label': 'Owner' }"
      :data-source="treeDataSource"
      value-expr="ID"
      display-expr="name"
      :placeholder="'Hello'"
      :width="width"
      :height="height"
      class="custom-dropdown-box"
      field-template="field"
      @value-changed="syncTreeViewSelection()"
    >
      <template #field>
        <DxTagBox
          v-model:value="treeBoxValue"
          :data-source="treeDataSource"
          value-expr="ID"
          display-expr="name"
          :placeholder="placeholder"
          :show-selection-controls="false"
          :max-displayed-tags="actualMaxDisplayedTags"
          :show-multi-tag-only="false"
          :open-on-field-click="false"
          :accept-custom-value="false"
          class="w-full"
          @value-changed="syncTreeViewSelection()"
        />
      </template>

      <template #content="{ data }">
        <div class="flex flex-col h-full">
          <div class="pb-2">
            <MSInputSearch
              v-model="searchValue"
              :height="36"
              width="100%"
              :base-class="'bg-white border-gray-300'"
              :placeholder="'Tìm kiếm'"
              class="input"
            ></MSInputSearch>
          </div>
          <div class="overflow-y-auto max-h-80">
            <DxTreeView
              :data-source="treeDataSource"
              :select-by-click="true"
              :select-nodes-recursive="true"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="multiple"
              show-check-boxes-mode="normal"
              display-expr="name"
              :search-enabled="true"
              :search-value="searchValue"
              :no-data-text="'Không có dữ liệu'"
              @content-ready="treeViewContentReady($event)"
              @item-selection-changed="treeViewItemSelectionChanged($event)"
            />
          </div>

          <div
            v-if="showInactiveOption"
            class="h-10 bg-[#EAFBF2] flex items-center px-3 cursor-pointer"
          >
            <input
              type="checkbox"
              id="show-inactive"
              class="w-5 h-5 mr-2 accent-[#34B057] cursor-pointer border-2px"
            />
            <label
              for="show-inactive"
              class="cursor-pointer select-none text-sm font-normal flex items-center"
              >Hiển thị đơn vị ngừng theo dõi</label
            >
          </div>
        </div>
      </template>
    </DxDropDownBox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DxDropDownBox } from 'devextreme-vue/drop-down-box'
import { DxTagBox } from 'devextreme-vue/tag-box'
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view'
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'

interface Props {
  width?: string | number
  height?: string | number
  placeholder?: string
  maxDisplayedTags?: number | null
  showInactiveOption?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '36',
  placeholder: 'Tất cả đơn vị',
  maxDisplayedTags: 2,
  showInactiveOption: true,
})

const actualMaxDisplayedTags = computed(() => {
  return props.maxDisplayedTags === null ? undefined : props.maxDisplayedTags
})

const treeBoxValue = ref()
const searchValue = ref('')
let treeView: DxTreeView['instance']

const treeDataSource = [
  { ID: '1', name: 'Công ty ABC' },
  { ID: '1_1', categoryId: '1', name: 'Chi nhánh miền Bắc' },
  { ID: '1_2', categoryId: '1', name: 'Chi nhánh miền Nam' },
  { ID: '1_1_1', categoryId: '1_1', name: 'Khối sản xuất' },
  { ID: 'a', categoryId: '1_1_1', name: 'Dự án Core' },
  { ID: 'b', categoryId: '1_1_1', name: 'Dự án C&B' },
  { ID: 'c', categoryId: '1_1_1', name: 'Dự án C&B' },
  { ID: 'd', categoryId: '1_1', name: 'Khối kinh doanh' },
  { ID: 'e', categoryId: '1_2', name: 'Khối sản xuất' },
  { ID: 'f', categoryId: '1_2', name: 'Khối kinh doanh' },
  { ID: '2', name: 'Decor' },
  { ID: '2_1', categoryId: '2', name: 'Bed Linen' },
  { ID: '2_2', categoryId: '2', name: 'Curtains & Blinds' },
  { ID: '2_3', categoryId: '2', name: 'Carpets' },
]

function treeViewContentReady({ component }: DxTreeViewTypes.ContentReadyEvent) {
  treeView = component
  syncTreeViewSelection()
}

function syncTreeViewSelection() {
  if (!treeView) return
  const component = treeView

  const values = treeBoxValue.value || []
  const selectedNodes = component.getSelectedNodes()

  selectedNodes.forEach((node: any) => {
    if (values.includes(node.key)) return

    let parent = node.parent
    let isImplied = false
    while (parent) {
      if (values.includes(parent.key)) {
        isImplied = true
        break
      }
      parent = parent.parent
    }

    if (!isImplied) {
      component.unselectItem(node.key)
    }
  })

  const currentSelectedKeys = component.getSelectedNodeKeys()
  values.forEach((val: string) => {
    if (!currentSelectedKeys.includes(val)) {
      component.selectItem(val)
    }
  })
}

function treeViewItemSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent) {
  const nodes = e.component.getSelectedNodes()
  const roots = nodes.filter((node: any) => !node.parent || !node.parent.selected)
  treeBoxValue.value = roots.map((node: any) => node.key)
}
</script>

<style>
.custom-dropdown-box.dx-dropdownbox {
  border: 1px solid #ddd !important;
  border-radius: 4px;
  background: white;
}

.custom-dropdown-box.dx-dropdownbox.dx-state-hover {
  border-color: #34b057 !important;
  background-color: white !important;
}

.custom-dropdown-box.dx-dropdownbox.dx-state-focused {
  border-color: #34b057 !important;
  box-shadow: none !important;
}

/* Style for the inner TagBox to remove its borders so it blends in */
.custom-dropdown-box .dx-tagbox {
  border: none !important;
}

.dx-popup-content {
  padding: 20px !important;
}

.dx-texteditor::after {
  content: unset !important;
}

/* Hide default DevExtreme TreeView search input (we use MSInputSearch instead) */
.dx-treeview-search {
  display: none !important;
}

.dx-dropdowneditor-field-template-wrapper {
  align-items: center;
}

.dx-texteditor::before {
  content: unset;
}

.dx-tagbox .dx-tag-container {
  padding-top: 12px;
  gap: 2px;
}

.dx-field-value:not(.dx-switch):not(.dx-checkbox):not(.dx-button) {
  width: unset;
}

.dx-dropdowneditor-icon::before {
  content: unset !important;
}

.dx-dropdowneditor-icon::before {
  width: 20px !important;
  height: 20px !important;
}
.dx-dropdowneditor.dx-dropdowneditor-active .dx-dropdowneditor-icon {
  width: 20px !important;
  height: 20px !important;
}

.dx-dropdowneditor-icon {
  mask-image: url('@/assets/icons/ICON.svg') !important;
  mask-repeat: no-repeat;
  mask-position: -100px 0;
  width: 20px;
  height: 20px;
  margin-right: 0px;
  background: #6e737a !important;
}

.dx-tagbox.dx-editor-filled .dx-tag-container {
  padding-inline-start: 8px;
}

.dx-tag-content {
  border-radius: 4px;
  background: #e8eaef;
  color: #212121;
}

.dx-tag-remove-button::before {
  content: unset;
}

.dx-tag-remove-button {
  mask-image: url('@/assets/icons/ICON.svg') !important;
  mask-repeat: no-repeat;
  mask-position: -140px -80px;
  width: 20px;
  height: 20px;
  margin-right: 0px;
  background-color: #666 !important;
}

.dx-texteditor.dx-editor-filled {
  background-color: white;
  border: solid 1px gray;
  border-radius: 4px;
}

.dx-texteditor.dx-editor-filled {
  background-color: transparent;
}

.dx-treeview-item {
  padding: 8px 0px !important;
  gap: 8px !important;
}

.dx-checkbox-icon::after {
  content: unset !important;
}

.dx-checkbox-icon {
  width: 16px;
  height: 16px;
  font-size: 18px;
  border: 2px solid #666;
  border-radius: 4px;
}

.dx-checkbox-checked .dx-checkbox-icon {
  background-color: #34b057 !important;
  color: #ffffff !important;
}

.dx-treeview-toggle-item-visibility {
  mask-image: url('@/assets/icons/ICON.svg') !important;
  mask-repeat: no-repeat;
  mask-position: -120px -40px;
  width: 20px;
  height: 20px;
  margin-right: 0px;
  background-color: #666 !important;
}

.dx-treeview-toggle-item-visibility.dx-treeview-toggle-item-visibility-opened {
  mask-image: url('@/assets/icons/ICON.svg') !important;
  mask-repeat: no-repeat;
  mask-position: -100px -40px;
  width: 20px;
  height: 20px;
  margin-right: 0px;
  background-color: #616161 !important;
}

.dx-treeview-toggle-item-visibility::before {
  content: unset !important;
}

.dx-checkbox-indeterminate .dx-checkbox-icon {
  width: 16px;
  height: 16px;
  font-size: 18px;
  border: 2px solid #616161;
  border-radius: 4px;
  background-color: white;
  color: white;
}
</style>
