<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
      :hover-state-enabled="true"
    >
      <DxPaging :enabled="false" />
      <DxColumn data-field="Prefix" caption="Title" />
      <DxColumn data-field="FirstName" />
      <DxColumn data-field="LastName" />
      <DxColumn :width="130" data-field="Position" />
      <DxColumn :width="125" data-field="StateID" caption="State" />
      <!-- Fixed action column -->
      <DxColumn
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
import { ref } from 'vue'
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxButton,
  DxPaging,
  DxLookup,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid'
import { employees as defaultEmployees, states, getMaxID, type Employee } from '@/data/data.ts'

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

const employees = ref(defaultEmployees)
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
</style>
