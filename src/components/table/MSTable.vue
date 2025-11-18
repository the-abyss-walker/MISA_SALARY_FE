<template>
  <div class="mstable__grid">
    <DxDataGrid
      :data-source="tableDataSource"
      show-borders
      :allow-column-resizing="true"
      :height="gridHeight"
      :remote-operations="props.remoteOperations"
      @row-click="(e) => emit('row-click', e)"
      :hover-state-enabled="true"
      :column-width="props.columnWidth"
    >
      <DxPaging :enabled="false" />
      <DxScrolling column-rendering-mode="virtual" />

      <DxColumn
        v-for="col in usedColumns"
        :key="col.dataField"
        :data-field="col.dataField"
        :caption="col.caption"
        :width="col.width"
        :allow-resizing="col.allowResizing !== true"
      />
      <DxColumn
        class="custom-column custom-button"
        width="120"
        type="buttons"
        :fixed="true"
        fixed-position="right"
        :buttons="actionButtons"
      />
    </DxDataGrid>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DxDataGrid, DxColumn, DxScrolling, DxPaging } from 'devextreme-vue/data-grid'
import salaryData from '../../data/salarycomposition.json'

const props = withDefaults(
  defineProps<{
    data?: any[]
    columns?: Array<Record<string, any>>
    gridHeight?: number | string
    columnWidth?: number
    remoteOperations?: boolean
    pageSize?: number
  }>(),
  {
    data: () => [],
    columns: () => [],
    gridHeight: 'calc(100vh - 250px)',
    columnWidth: 200,
    remoteOperations: false,
  },
)

const emit = defineEmits(['row-click', 'page-change'])

const actionButtons = [
  {
    hint: 'Nhân bản',
    icon: 'repeat',
    onClick: (e: any) => {
      alert('Clone ' + e.row.data.name)
    },
  },
  {
    hint: 'Sửa',
    icon: 'edit',
    onClick: (e: any) => {
      alert('Edit ' + e.row.data.name)
    },
  },
  {
    hint: 'Xóa',
    icon: 'trash',
    onClick: (e: any) => {
      alert('Delete ' + e.row.data.name)
    },
  },
]

const usedColumns = computed(() => {
  return props.columns && props.columns.length ? props.columns : []
})

const tableDataSource = computed(() => {
  return props.data && props.data.length ? props.data : (salaryData as any)
})
</script>

<style>
.dx-command-edit {
  border-left: none !important;
}
.dx-command-edit a {
  display: none !important;
}
.dx-state-hover .dx-command-edit a {
  display: inline-block !important;
}
.dx-datagrid .dx-datagrid-sticky-column-right {
  background: transparent !important;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-bottom: none !important;
}

.dx-widget {
  font-family: inherit !important;
}

.dx-datagrid > .dx-datagrid-headers {
  background-color: #f6f6f6 !important;
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  /* padding-inline: 16px !important; */
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
}
</style>
