<template>
  <div class="flex flex-col gap-4 relative">
    <!-- Header: changes depending on child route -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button v-if="isAdd" class="m-2 rounded flex items-center" @click="goBack">
          <MSIcon name="arrow_left" />
        </button>

        <h2 v-if="isAdd">{{ editId ? editItemName : 'Thêm thành phần' }}</h2>
        <h2 v-else>Thành phần lương</h2>
      </div>

      <div class="flex items-center gap-3">
        <MSButton v-if="!isAdd" variant="secondary" icon="rule" @click="goToSystemCategory"
          >Danh mục của hệ thống</MSButton
        >

        <div class="relative" v-if="!isAdd">
          <MSButton variant="combo" icon="plus" @click="openAdd" @dropdown="toggleAddDropdown">
            Thêm mới
          </MSButton>
          <div
            v-if="showAddDropdown"
            class="fixed inset-0 z-10"
            @click="showAddDropdown = false"
          ></div>
          <div
            v-if="showAddDropdown"
            class="ms-page-dropdown absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded z-20 w-max"
          >
            <div
              class="ms-page-dropdown-item hover:bg-[#EAFBF2] cursor-pointer text-normal"
              @click="handleSelectFromSystem"
            >
              Chọn từ danh mục của hệ thống
            </div>
          </div>
        </div>

        <template v-if="isAdd">
          <MSButton variant="secondary" @click="goBack">Hủy bỏ</MSButton>
          <template v-if="!editId">
            <MSButton variant="secondary" @click="onSaveAndAddFromHeader">Lưu và thêm</MSButton>
            <MSButton variant="primary" @click="onSaveFromHeader">Lưu</MSButton>
          </template>
          <template v-else>
            <MSButton variant="primary" @click="onSaveFromHeader">Lưu</MSButton>
            <div class="relative">
              <MSButton variant="icon" icon="threedot" @click="toggleEditDropdown" />
              <div
                v-if="showEditDropdown"
                class="fixed inset-0 z-10"
                @click="showEditDropdown = false"
              ></div>
              <div
                v-if="showEditDropdown"
                class="ms-page-dropdown absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded z-20"
              >
                <div
                  class="flex items-center ms-page-dropdown-item hover:bg-[#EAFBF2] cursor-pointer text-normal"
                  @click="handleDuplicate"
                >
                  <MSIcon name="copy" class="mr-2" />
                  Nhân bản
                </div>
                <div
                  class="flex items-center ms-page-dropdown-item hover:bg-[#EAFBF2] cursor-pointer text-normal"
                  @click="handleDelete"
                >
                  <MSIcon name="trash" class="mr-2" />
                  Xóa
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Body: render list or add form via children -->
    <div v-if="!isAdd">
      <SalayryCompositionTable @edit="handleEdit" />
    </div>

    <div v-else>
      <SalaryCompositionForm
        :id="editId"
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

    <!-- System Category Popup -->
    <SalaryCompositionPopup
      v-model:visible="showSystemCategoryPopup"
      @save="onSystemCategorySave"
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
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'
import SalaryCompositionForm from './SalaryCompositionForm.vue'
import SalayryCompositionTable from './SalayryCompositionTable.vue'
import SalaryCompositionPopup from './SalaryCompositionPopup.vue'

const isAdd = ref(false)
const addComp = ref<any>(null)
const router = useRouter()
const showConfirmPopup = ref(false)
const showAddDropdown = ref(false)
const showEditDropdown = ref(false)
const showSystemCategoryPopup = ref(false)
const editId = ref<string | null>(null)
const editItemName = ref('')

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
}

const closeToast = () => {
  toast.show = false
}

const goToSystemCategory = () => {
  router.push({ name: 'SystemCategory' })
}

const toggleAddDropdown = () => {
  showAddDropdown.value = !showAddDropdown.value
}

const toggleEditDropdown = () => {
  showEditDropdown.value = !showEditDropdown.value
}

const handleDelete = async () => {
  if (!editId.value) return
  try {
    await SalaryCompositionApi.delete(editId.value)
    showToast('success', 'Xóa thành công')
    isAdd.value = false
    editId.value = null
    editItemName.value = ''
    showEditDropdown.value = false
  } catch (e) {
    showToast('failed', 'Xóa thất bại')
  }
}

const handleDuplicate = async () => {
  if (!editId.value) return
  try {
    const res = await SalaryCompositionApi.getById(editId.value)
    const data = res.data.data

    isAdd.value = true
    editId.value = null
    editItemName.value = ''
    showEditDropdown.value = false

    setTimeout(() => {
      if (addComp.value) {
        addComp.value.setFormData(data)
      }
    }, 100)
  } catch (e) {
    showToast('failed', 'Không thể nhân bản')
  }
}

const handleSelectFromSystem = () => {
  showAddDropdown.value = false
  showSystemCategoryPopup.value = true
}

const onSystemCategorySave = (items: any[]) => {
  console.log('Selected from system:', items)
}

const openAdd = () => {
  isAdd.value = true
  editId.value = null
  editItemName.value = ''
}

const handleEdit = (item: any) => {
  editId.value = item.id
  editItemName.value = item.SalaryCompositionName
  isAdd.value = true
}

const goBack = () => {
  if (addComp.value && addComp.value.isDirty) {
    showConfirmPopup.value = true
  } else {
    isAdd.value = false
    editId.value = null
    editItemName.value = ''
  }
}

const onConfirmAction = ({ button }: { button?: any }) => {
  if (!button) return
  if (button.id === 'cancel') {
    showConfirmPopup.value = false
  } else if (button.id === 'no-save') {
    showConfirmPopup.value = false
    isAdd.value = false
    editId.value = null
    editItemName.value = ''
  } else if (button.id === 'save') {
    showConfirmPopup.value = false
    onSaveFromHeader()
  }
}

const onSaved = (payload?: any) => {
  // payload can contain saved item; for now return to list
  const message = editId.value ? 'Cập nhật thành công' : 'Thêm thành công'
  isAdd.value = false
  editId.value = null
  editItemName.value = ''
  showToast('success', message)
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

.ms-page-dropdown {
  padding-inline: 6px;
  padding-block: 8px;
  width: 175px;
  height: 90px;
  border-radius: 4px;
}

.ms-page-dropdown-item {
  padding-inline: 8px;
  padding-block: 8px;
}
</style>
