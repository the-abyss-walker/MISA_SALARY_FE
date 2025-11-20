<template>
  <div class="dx-field-value">
    <DxDropDownBox
      v-model:value="treeBoxValue"
      :show-clear-button="true"
      :input-attr="{ 'aria-label': 'Owner' }"
      :data-source="treeDataSource"
      value-expr="ID"
      display-expr="name"
      :placeholder="placeholder"
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
          :max-displayed-tags="2"
          :show-multi-tag-only="false"
          :open-on-field-click="false"
          :accept-custom-value="false"
          class="w-full"
          @value-changed="syncTreeViewSelection()"
        />
      </template>

      <template #content="{ data }">
        <div class="flex flex-col h-full">
          <div class="flex-1 overflow-auto">
            <div class="pb-2">
              <MSInputSearch
                v-model="searchValue"
                :height="36"
                :width="310"
                :base-class="'bg-white border-gray-300'"
                :placeholder="'Tìm kiếm'"
                class="input"
              ></MSInputSearch>
            </div>
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
              @content-ready="treeViewContentReady($event)"
              @item-selection-changed="treeViewItemSelectionChanged($event)"
            />
          </div>

          <div class="h-10 bg-[#EAFBF2] flex items-center px-3 cursor-pointer">
            <input
              type="checkbox"
              id="show-inactive"
              class="w-4 h-4 mr-2 accent-[#34B057] cursor-pointer"
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
import { ref } from 'vue'
import { DxDropDownBox } from 'devextreme-vue/drop-down-box'
import { DxTagBox } from 'devextreme-vue/tag-box'
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view'
import MSInputSearch from '@/components/inputs/MSInputSearch.vue'

interface Props {
  width?: string | number
  height?: string | number
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 'auto',
  placeholder: 'Tất cả đơn vị',
})

const treeBoxValue = ref()
const searchValue = ref('')
let treeView: DxTreeView['instance']

const treeDataSource = [
  { ID: '1', name: 'Furniture' },
  { ID: '1_1', categoryId: '1', name: 'Tables & Chairs' },
  { ID: '1_2', categoryId: '1', name: 'Sofas' },
  { ID: '1_3', categoryId: '1', name: 'Occasional Furniture' },
  { ID: '1_3_1', categoryId: '1_3', name: 'Dark soul' },
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
.input {
  border: solid 1px #34b057;
}

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

.dx-show-clear-button .dx-icon-clear {
  display: none !important;
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

.dx-overlay-content.dx-popup-normal.dx-resizable.dx-popup-flex-height {
  transform: translate(0px, 40px) !important;
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
