<template>
  <div class="mstable__grid">
    <div v-if="loading" class="mstable-loading-overlay">
      <div class="mstable-spinner"></div>
    </div>
    <DxDataGrid
      ref="gridRef"
      :data-source="tableDataSource"
      :allow-column-resizing="true"
      :column-resizing-mode="'widget'"
      :height="gridHeight"
      :remote-operations="props.remoteOperations"
      @row-click="(e) => emit('row-click', e)"
      @selection-changed="(e) => emit('selection-change', e.selectedRowsData)"
      :hover-state-enabled="true"
      :column-width="props.columnWidth"
      :column-min-width="60"
    >
      <DxPaging :enabled="false" />
      <DxScrolling column-rendering-mode="virtual" />

      <DxSelection
        v-if="props.showSelection"
        select-all-mode="page"
        mode="multiple"
        show-check-boxes-mode="always"
      />

      <DxColumn
        v-for="col in usedColumns"
        :key="col.dataField"
        :data-field="col.dataField"
        :caption="col.caption"
        :width="col.width"
        :allow-resizing="col.allowResizing !== true"
        :cell-template="col.cellTemplate"
        :header-cell-template="col.headerTemplate"
      />
      <template
        v-for="col in columnsWithTemplates"
        :key="col.dataField"
        #[col.cellTemplate]="cellInfo"
      >
        <slot :name="col.cellTemplate" :data="cellInfo"></slot>
      </template>
      <template
        v-for="col in columnsWithHeaderTemplates"
        :key="col.dataField"
        #[col.headerTemplate]="headerInfo"
      >
        <slot :name="col.headerTemplate" :data="headerInfo"></slot>
      </template>
      <DxColumn
        v-if="props.showActionColumn"
        width="auto"
        :fixed="true"
        fixed-position="right"
        cell-template="actionTemplate"
        alignment="center"
      />
      <template #actionTemplate="{ data }">
        <div class="action-buttons">
          <slot name="action-panel" :data="data">
            <div class="action-button" title="Ngừng theo dõi" @click.stop="handleStopFlowing(data)">
              <MSIcon name="minus_circle" />
            </div>
            <div class="action-button" title="Nhân bản" @click.stop="handleClone(data)">
              <MSIcon name="copy" />
            </div>
            <div class="action-button" title="Sửa" @click.stop="handleEdit(data)">
              <MSIcon name="pencil" />
            </div>
            <div class="action-button" title="Xóa" @click.stop="handleDelete(data)">
              <MSIcon name="trash" />
            </div>
          </slot>
        </div>
      </template>
    </DxDataGrid>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DxDataGrid, DxColumn, DxScrolling, DxPaging, DxSelection } from 'devextreme-vue/data-grid'
import MSIcon from '../icons/MSIcon.vue'

const props = withDefaults(
  defineProps<{
    data?: any[]
    columns?: Array<Record<string, any>>
    gridHeight?: number | string
    columnWidth?: number
    remoteOperations?: boolean
    pageSize?: number
    showSelection?: boolean
    showActionColumn?: boolean
    loading?: boolean
  }>(),
  {
    data: () => [],
    columns: () => [],
    gridHeight: 'calc(100vh - 270px)',
    columnWidth: 200,
    remoteOperations: false,
    showSelection: false,
    showActionColumn: true,
    loading: false,
  },
)

const emit = defineEmits(['row-click', 'page-change', 'selection-change'])

const handleStopFlowing = (e: any) => {
  alert('Stop Flowing ' + e.data.name)
}

const handleClone = (e: any) => {
  alert('Clone ' + e.data.name)
}

const handleEdit = (e: any) => {
  alert('Edit ' + e.data.name)
}

const handleDelete = (e: any) => {
  alert('Delete ' + e.data.name)
}

const usedColumns = computed(() => {
  return props.columns && props.columns.length ? props.columns : []
})

const columnsWithTemplates = computed(() => {
  return usedColumns.value.filter((col) => col.cellTemplate)
})

const columnsWithHeaderTemplates = computed(() => {
  return usedColumns.value.filter((col) => col.headerTemplate)
})

const tableDataSource = computed(() => {
  return props.data && props.data.length ? props.data : []
})

const gridRef = ref<any>(null)

const clearSelection = () => {
  if (gridRef.value && gridRef.value.instance) {
    gridRef.value.instance.clearSelection()
  }
}

defineExpose({
  clearSelection,
})
</script>

<style>
.dx-command-edit {
  border-left: none !important;
  background: transparent !important;
}
.dx-command-edit a {
  display: none !important;
}
.dx-state-hover .dx-command-edit a {
  display: inline-block !important;
}
.dx-datagrid .dx-datagrid-sticky-column-right {
  background: transparent !important;
  border-left: none !important;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-bottom: none !important;
}

.dx-datagrid .dx-datagrid-sticky-column-right {
  background-color: transparent !important;
}

.dx-widget {
  font-family: inherit !important;
}

.dx-datagrid > .dx-datagrid-headers {
  background-color: #f6f6f6 !important;
  height: 38px !important;
  color: #212121 !important;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  line-height: 16px;
  font-weight: 700;
}

.dx-datagrid-headers
  .dx-datagrid-table
  .dx-row
  > td:hover:not(.dx-command-select):not(.dx-command-expand):not(.dx-editor-cell):not(
    .dx-command-edit
  ):not(.dx-datagrid-group-space) {
  background-color: transparent !important;
}

.dx-datagrid .dx-datagrid-table .dx-header-row > td {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.dx-datagrid td {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 36px !important;
  vertical-align: middle !important;
}

.dx-datagrid td:not(.dx-command-select) {
  padding-inline: 16px !important;
}

.dx-datagrid-rowsview .dx-data-row > td {
  background-color: #ffffff !important;
}

.dx-datagrid-rowsview .dx-data-row.dx-state-hover > td {
  background-color: #eafbf2 !important;
  cursor: pointer;
}

.dx-datagrid .dx-row > .dx-command-select {
  border-right: none !important;
}

.mstable__grid .dx-checkbox-icon {
  border-radius: 4px !important;
  width: 16px !important;
  height: 16px !important;
}

.mstable__grid .dx-checkbox-checked .dx-checkbox-icon {
  background-color: #34b057 !important;
  border-color: #34b057 !important;
  color: #ffffff !important;
}

.mstable__grid .dx-datagrid-headers .dx-checkbox-icon {
  background-color: #ffffff !important;
}

.dx-datagrid .dx-header-row > .dx-command-select {
  background-color: #f6f6f6 !important;
}

.mstable__grid .dx-datagrid-headers .dx-checkbox-checked .dx-checkbox-icon {
  background-color: #34b057 !important;
}

.dx-row.dx-selection,
.dx-datagrid
  .dx-datagrid-sticky-columns
  .dx-datagrid-table
  .dx-row.dx-state-hover.dx-selection
  td.dx-datagrid-sticky-column-border-left,
.mstable__grid .dx-datagrid-rowsview .dx-selection.dx-row > td,
.mstable__grid .dx-datagrid-rowsview .dx-selection.dx-row:hover > td {
  background-color: #eafbf2 !important;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 14px;
  visibility: hidden;
}

.dx-data-row.dx-state-hover .action-buttons {
  visibility: visible;
}

.action-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.action-button:hover {
  background-color: #eff1f6;
}

.dx-datagrid
  .dx-datagrid-sticky-columns
  .dx-datagrid-table
  .dx-row
  td.dx-datagrid-sticky-column-border-left {
  background-color: transparent !important;
}

.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(
    .dx-edit-row
  ):not(.dx-row-focused)
  > td {
  background-color: #f2f9ff !important;
}

.mstable__grid {
  position: relative;
}

.mstable-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mstable-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #34b057;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
