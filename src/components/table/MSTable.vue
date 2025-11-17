<template>
  <div class="mstable w-full bg-white">
    <div class="mstable__grid">
      <DxDataGrid
        :data-source="tableDataSource"
        show-borders
        :column-auto-width="false"
        :allow-column-resizing="true"
        :column-resizing-mode="'widget'"
        :height="gridHeight"
        :remote-operations="props.remoteOperations"
        @row-click="(e) => emit('row-click', e)"
      >
        <DxScrolling mode="virtual" :scroll-by-content="true" show-scrollbar="always" />

        <DxColumn
          v-for="col in usedColumns"
          :key="col.dataField"
          :data-field="col.dataField"
          :caption="col.caption"
          :width="col.width"
          :allow-resizing="col.allowResizing !== false"
        />
        <DxColumn
          width="120"
          type="buttons"
          :fixed="true"
          fixed-position="right"
          :buttons="actionButtons"
        />
      </DxDataGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DxDataGrid, DxColumn, DxScrolling } from 'devextreme-vue/data-grid'
import salaryData from '../../data/salarycomposition.json'

const props = withDefaults(
  defineProps<{
    data?: any[]
    columns?: Array<Record<string, any>>
    gridHeight?: number | string
    remoteOperations?: boolean
    pageSize?: number
  }>(),
  {
    data: () => [],
    columns: () => [],
    gridHeight: '500px',
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
