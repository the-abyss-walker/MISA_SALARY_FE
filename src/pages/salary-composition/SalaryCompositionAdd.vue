<template>
  <div class="bg-white rounded shadow add-form">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Mã thành phần</label>
          <MSInputItem
            ref="codeRef"
            v-model="form.code"
            :width="'100%'"
            :maxLength="20"
            required
            placeholder="Nhập mã"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tên thành phần</label>
          <MSInputItem
            ref="nameRef"
            v-model="form.name"
            :width="'100%'"
            :maxLength="100"
            required
            placeholder="Nhập tên"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Loại</label>
          <select v-model="form.type" class="w-full border rounded px-2 py-1">
            <option value="">-- Chọn loại --</option>
            <option value="fixed">Cố định</option>
            <option value="formula">Công thức</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Công thức</label>
          <MSInputItem
            ref="formulaRef"
            v-model="form.formula"
            :width="'100%'"
            :maxLength="200"
            placeholder="Nhập công thức (nếu có)"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import MSInputItem from '@/components/inputs/MSInputItem.vue'

const emit = defineEmits<{
  (e: 'saved', payload: any): void
  (e: 'cancel'): void
}>()

const form = reactive({
  code: '',
  name: '',
  type: '',
  formula: '',
})

const codeRef = ref<any>(null)
const nameRef = ref<any>(null)
const formulaRef = ref<any>(null)

const submit = () => {
  // validate fields before emitting
  const validCode = codeRef.value ? codeRef.value.validate() : true
  const validName = nameRef.value ? nameRef.value.validate() : true
  const validFormula = formulaRef.value ? formulaRef.value.validate() : true

  if (!validCode) {
    return
  }
  if (!validName) {
    return
  }
  if (!validFormula) {
    // formula is optional, but validate() may check pattern/maxLength; continue only if valid
    return
  }

  // TODO: replace with actual save call (API)
  console.log('Saving', { ...form })
  emit('saved', { ...form })
}

const onSubmit = () => {
  submit()
}

const onCancel = () => {
  emit('cancel')
}

const onReset = () => {
  form.code = ''
  form.name = ''
  form.type = ''
  form.formula = ''
}

defineExpose({ submit })
</script>

<style scoped>
.add-form {
  padding: 40px;
}
</style>
