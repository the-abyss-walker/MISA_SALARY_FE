<template>
  <div class="flex flex-col gap-4">
    <!-- Header: title + actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h2 class="text-[20px] font-semibold">Thành phần lương</h2>
      </div>

      <div class="flex items-center gap-3">
        <MSButton variant="secondary" icon="rule">Danh của mục hệ thống</MSButton>

        <MSButton variant="combo" icon="plus">Thêm mới</MSButton>
      </div>
    </div>

    <!-- Body: table -->
    <MSTable></MSTable>
  </div>
</template>
<script setup lang="ts">
import MSButton from '@/components/button/MSButton.vue'
import MSTable from '@/components/table/MSTable.vue'
</script>

<style scoped>
.text {
  font-size: 18px;
}
</style>
