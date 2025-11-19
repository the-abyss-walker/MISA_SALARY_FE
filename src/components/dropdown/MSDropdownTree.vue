<template>
  <div class="dx-field-value">
    <DxDropDownBox
      v-model:value="treeBoxValue"
      :show-clear-button="true"
      :input-attr="{ 'aria-label': 'Owner' }"
      :data-source="treeDataSource"
      value-expr="ID"
      display-expr="name"
      placeholder="Select a value..."
      @value-changed="syncTreeViewSelection()"
    >
      <template #content="{ data }">
        <DxTreeView
          :data-source="treeDataSource"
          :select-by-click="true"
          :select-nodes-recursive="false"
          data-structure="plain"
          key-expr="ID"
          parent-id-expr="categoryId"
          selection-mode="multiple"
          show-check-boxes-mode="normal"
          display-expr="name"
          @content-ready="treeViewContentReady($event)"
          @item-selection-changed="treeViewItemSelectionChanged($event)"
        />
      </template>
    </DxDropDownBox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DxDropDownBox } from 'devextreme-vue/drop-down-box'
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view'

const treeBoxValue = ref(['1_1'])
let treeView: DxTreeView['instance']

const treeDataSource = [
  { ID: '1', name: 'Furniture' },
  { ID: '1_1', categoryId: '1', name: 'Tables & Chairs' },
  { ID: '1_2', categoryId: '1', name: 'Sofas' },
  { ID: '1_3', categoryId: '1', name: 'Occasional Furniture' },
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
  const value = treeBoxValue.value

  if (treeView) {
    if (value === null) {
      treeView.unselectAll()
    } else {
      value?.forEach((val: string) => {
        treeView?.selectItem(val)
      })
    }
  }
}

function treeViewItemSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent) {
  treeBoxValue.value = e.component.getSelectedNodeKeys()
}
</script>
