<template>
  <div class="flex flex-col gap-4">
    <!-- Header: changes depending on child route -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button v-if="isAdd" class="m-2 rounded flex items-center" @click="goBack">
          <MSIcon name="arrow_left" />
        </button>

        <h2 class="text-[20px] font-semibold">{{ title }}</h2>
      </div>

      <div class="flex items-center gap-3">
        <MSButton v-if="!isAdd" variant="secondary" icon="rule">Danh của mục hệ thống</MSButton>

        <MSButton v-if="!isAdd" variant="combo" icon="plus" @click="openAdd"> Thêm mới </MSButton>

        <template v-if="isAdd">
          <MSButton variant="secondary" @click="goBack">Hủy bỏ</MSButton>
          <MSButton variant="secondary">Lưu và thêm</MSButton>
          <MSButton variant="primary" @click="onSaveFromHeader">Lưu</MSButton>
        </template>
      </div>
    </div>

    <!-- Body: render list or add form via children -->
    <div v-if="!isAdd">
      <SalayryCompositionTable />
    </div>

    <div v-else>
      <SalaryCompositionAdd @saved="onSaved" @cancel="goBack" ref="addComp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MSButton from '@/components/button/MSButton.vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import SalaryCompositionAdd from './SalaryCompositionAdd.vue'
import SalayryCompositionTable from './SalayryCompositionTable.vue'

const isAdd = ref(false)
const title = ref('Thành phần lương')
const addComp = ref<any>(null)

const openAdd = () => {
  isAdd.value = true
  title.value = 'Thêm thành phần'
}

const goBack = () => {
  isAdd.value = false
  title.value = 'Thành phần lương'
}

const onSaved = (payload?: any) => {
  // payload can contain saved item; for now return to list
  isAdd.value = false
  title.value = 'Thành phần lương'
}

const onSaveFromHeader = () => {
  // call save on the child component if available
  if (addComp.value && typeof addComp.value.submit === 'function') {
    addComp.value.submit()
  }
}
</script>

<style scoped>
.text {
  font-size: 18px;
}
</style>
