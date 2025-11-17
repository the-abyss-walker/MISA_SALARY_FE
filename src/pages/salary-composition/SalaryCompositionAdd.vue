<template>
  <div class="content">
    <div class="bg-white rounded shadow add-form">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <!-- Row 1: Tên thành phần (required) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium"
            >Tên thành phần <span class="text-red-600">*</span></label
          >
          <MSInputItem
            ref="nameRef"
            v-model="form.name"
            :width="'100%'"
            :maxLength="100"
            required
            placeholder="Nhập tên thành phần"
          />
        </div>

        <!-- Row 2: Mã thành phần (required) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium"
            >Mã thành phần <span class="text-red-600">*</span></label
          >
          <MSInputItem
            ref="codeRef"
            v-model="form.code"
            :width="'100%'"
            :maxLength="20"
            required
            placeholder="Nhập mã thành phần"
          />
        </div>

        <!-- Row 3: Đơn vị áp dụng (required) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium"
            >Đơn vị áp dụng <span class="text-red-600">*</span></label
          >
          <MSCombobox
            ref="unitRef"
            v-model="form.unit"
            :options="unitOptions"
            placeholder="Chọn đơn vị"
          />
        </div>

        <!-- Row 4: Loại thành phần (required) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium"
            >Loại thành phần <span class="text-red-600">*</span></label
          >
          <MSDropdown
            ref="typeRef"
            v-model="form.type"
            :options="typeOptions"
            placeholder="Chọn loại"
            :width="320"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
          />
        </div>

        <!-- Row 5: Tính chất (required) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium"
            >Tính chất <span class="text-red-600">*</span></label
          >
          <MSDropdown
            ref="natureRef"
            v-model="form.nature"
            :options="natureOptions"
            placeholder="Chọn tính chất"
            :width="320"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
          />
        </div>

        <!-- Row 6: Định mức -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium">Định mức</label>
          <MSInputItem
            ref="normRef"
            v-model="form.norm"
            :width="'100%'"
            :maxLength="50"
            placeholder="Nhập định mức"
          />
        </div>

        <!-- Row 7: Kiểu giá trị -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium">Kiểu giá trị</label>
          <MSDropdown
            ref="valueTypeRef"
            v-model="form.valueType"
            :options="valueTypeOptions"
            placeholder="Chọn kiểu giá trị"
            :width="320"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
          />
        </div>

        <!-- Row 8: Giá trị -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium">Giá trị</label>
          <MSInputItem
            ref="valueRef"
            v-model="form.value"
            :width="'100%'"
            :maxLength="100"
            placeholder="Nhập giá trị"
          />
        </div>

        <!-- Row 9: Mô tả -->
        <div class="flex items-start gap-4">
          <label class="w-40 text-sm font-medium">Mô tả</label>
          <MSInputItem
            ref="descriptionRef"
            v-model="form.description"
            :width="'100%'"
            :maxLength="500"
            placeholder="Nhập mô tả"
          />
        </div>

        <!-- Row 10: Hiển thị trên phiếu lương (radio) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium">Hiển thị trên phiếu lương</label>
          <div class="flex items-center gap-4">
            <label class="inline-flex items-center">
              <input type="radio" value="yes" v-model="form.showOnPayslip" class="mr-2" /> Có
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="no" v-model="form.showOnPayslip" class="mr-2" /> Không
            </label>
          </div>
        </div>

        <!-- Row 11: Nguồn tạo (fixed label) -->
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-medium">Nguồn tạo</label>
          <div class="px-3 py-2 border rounded bg-gray-50">Tự thêm</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import MSInputItem from '@/components/inputs/MSInputItem.vue'
import MSCombobox from '@/components/combobox/MSCombobox.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'

const emit = defineEmits<{
  (e: 'saved', payload: any): void
  (e: 'cancel'): void
}>()

const form = reactive({
  code: '',
  name: '',
  type: '',
  unit: '',
  nature: '',
  norm: '',
  valueType: '',
  value: '',
  description: '',
  showOnPayslip: 'yes',
  formula: '',
})

const codeRef = ref<any>(null)
const nameRef = ref<any>(null)
const formulaRef = ref<any>(null)
const unitRef = ref<any>(null)
const typeRef = ref<any>(null)
const natureRef = ref<any>(null)
const normRef = ref<any>(null)
const valueTypeRef = ref<any>(null)
const valueRef = ref<any>(null)
const descriptionRef = ref<any>(null)

// Simple options for comboboxes. Adjust labels/values as needed.
const unitOptions = [
  { label: 'Toàn công ty', value: 'company' },
  { label: 'Phòng ban', value: 'department' },
  { label: 'Cá nhân', value: 'individual' },
]

// Loại thành phần
const typeOptions = [
  { label: 'Thông tin nhân viên', value: 'employee_info' },
  { label: 'Chấm công', value: 'attendance' },
  { label: 'Doanh số', value: 'revenue' },
  { label: 'KPI', value: 'kpi' },
  { label: 'Sản phẩm', value: 'product' },
  { label: 'Lương', value: 'salary' },
  { label: 'Thuế TNCN', value: 'personal_tax' },
  { label: 'Bảo hiểm - công đoàn', value: 'insurance_union' },
  { label: 'Khác', value: 'other' },
]

// Tính chất
const natureOptions = [
  { label: 'Thu nhập', value: 'income' },
  { label: 'Khấu trừ', value: 'deduction' },
  { label: 'Khác', value: 'other' },
]

// Kiểu giá trị
const valueTypeOptions = [
  { label: 'Số', value: 'number' },
  { label: 'Tiền tệ', value: 'currency' },
  { label: 'Phần trăm', value: 'percent' },
  { label: 'Chữ', value: 'string' },
  { label: 'Ngày', value: 'date' },
]

const submit = () => {
  // validate fields before emitting
  const validCode = codeRef.value ? codeRef.value.validate() : true
  const validName = nameRef.value ? nameRef.value.validate() : true
  const validFormula = formulaRef.value ? formulaRef.value.validate() : true
  const validUnit = unitRef.value ? (unitRef.value.validate?.() ?? true) : true
  const validType = form.type !== ''
  const validNature = form.nature !== ''

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
  if (!validUnit) return
  if (!validType) return
  if (!validNature) return

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
