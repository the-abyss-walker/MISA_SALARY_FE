<template>
  <div class="flex flex-col gap-4 relative">
    <!-- Header: changes depending on child route -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button v-if="isAdd" class="m-2 rounded flex items-center" @click="goBack">
          <MSIcon name="arrow_left" />
        </button>

        <h2 v-if="isAdd">Thêm thành phần</h2>
        <h2 v-else>Thành phần lương</h2>
      </div>

      <div class="flex items-center gap-3">
        <MSButton v-if="!isAdd" variant="secondary" icon="rule" @click="goToSystemCategory"
          >Danh mục của hệ thống</MSButton
        >

        <MSButton v-if="!isAdd" variant="combo" icon="plus" @click="openAdd"> Thêm mới </MSButton>

        <template v-if="isAdd">
          <MSButton variant="secondary" @click="goBack">Hủy bỏ</MSButton>
          <MSButton variant="secondary" @click="onSaveAndAddFromHeader">Lưu và thêm</MSButton>
          <MSButton variant="primary" @click="onSaveFromHeader">Lưu</MSButton>
        </template>
      </div>
    </div>

    <!-- Body: render list or add form via children -->
    <div v-if="!isAdd">
      <SalayryCompositionTable />
    </div>

    <div v-else>
      <SalaryCompositionAdd
        @saved="onSaved"
        @savedAndAdd="onSavedAndAdd"
        @cancel="goBack"
        ref="addComp"
      />
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed top-4 right-4 z-50">
      <MSToast :type="toast.type" :message="toast.message" @close="closeToast" />
    </div>

    <!-- Confirmation Popup -->
    <MSPopup
      v-model:visible="showConfirmPopup"
      title="Thông báo"
      content="Thông tin đã được thay đổi. Bạn có muốn lưu lại không?"
      :buttons="confirmButtons"
      @action="onConfirmAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import MSButton from '@/components/button/MSButton.vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import MSToast from '@/components/toast/MSToast.vue'
import MSPopup from '@/components/popup/MSPopup.vue'
import SalaryCompositionAdd from './SalaryCompositionForm.vue'
import SalayryCompositionTable from './SalayryCompositionTable.vue'

const isAdd = ref(false)
const addComp = ref<any>(null)
const router = useRouter()
const showConfirmPopup = ref(false)

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'information' | 'warning' | 'failed',
  message: '',
})

const confirmButtons = [
  { label: 'Hủy', variant: 'secondary' as const, id: 'cancel' },
  { label: 'Không lưu', variant: 'secondary' as const, id: 'no-save' },
  { label: 'Lưu', variant: 'primary' as const, id: 'save' },
]

const showToast = (type: 'success' | 'information' | 'warning' | 'failed', message: string) => {
  toast.type = type
  toast.message = message
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const closeToast = () => {
  toast.show = false
}

const goToSystemCategory = () => {
  router.push({ name: 'SystemCategory' })
}

const openAdd = () => {
  isAdd.value = true
}

const goBack = () => {
  if (addComp.value && addComp.value.isDirty) {
    showConfirmPopup.value = true
  } else {
    isAdd.value = false
  }
}

const onConfirmAction = ({ button }: { button?: any }) => {
  if (!button) return
  if (button.id === 'cancel') {
    showConfirmPopup.value = false
  } else if (button.id === 'no-save') {
    showConfirmPopup.value = false
    isAdd.value = false
  } else if (button.id === 'save') {
    showConfirmPopup.value = false
    onSaveFromHeader()
  }
}

const onSaved = (payload?: any) => {
  // payload can contain saved item; for now return to list
  isAdd.value = false
  showToast('success', 'Thêm thành công')
}

const onSavedAndAdd = (payload?: any) => {
  showToast('success', 'Thêm thành công')
}

const onSaveFromHeader = () => {
  // call save on the child component if available
  if (addComp.value && typeof addComp.value.submit === 'function') {
    addComp.value.submit('save')
  }
}

const onSaveAndAddFromHeader = () => {
  if (addComp.value && typeof addComp.value.submit === 'function') {
    addComp.value.submit('saveAndAdd')
  }
}
</script>

<style scoped>
.text {
  font-size: 18px;
}

h2 {
  font-weight: 700;
  font-size: 20px;
}
</style>
