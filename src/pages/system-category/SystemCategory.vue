<template>
  <div class="flex flex-col gap-4">
    <!-- Header: changes depending on child route -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button class="rounded flex items-center btn-container" @click="goBack">
          <MSIcon name="arrow_left" />
        </button>

        <h2 class="text-[20px] font-bold">Danh mục thành phần lương của hệ thống</h2>
      </div>
    </div>

    <!-- Body: render list or add form via children -->
    <SystemCategoryTable />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MSIcon from '@/components/icons/MSIcon.vue'
import SystemCategoryTable from './SystemCategoryTable.vue'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'SalaryComposition' })
}
</script>

<style scoped>
.btn-container {
  width: 32px;
  height: 32px;
  padding: 6px;
}

.btn-container:hover {
  background-color: #dadce3;
  border-radius: 50%;
  cursor: pointer;
}
</style>
