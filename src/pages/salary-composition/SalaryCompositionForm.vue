<template>
  <div class="content">
    <div class="bg-white rounded shadow add-form">
      <form @submit.prevent="onSubmit" class="flex flex-col">
        <!-- Row 1: Tên thành phần (required) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8">
              <b>Tên thành phần</b>
              <span class="text-red-600 star">*</span>
            </label>
          </div>

          <MSInputItem
            ref="nameRef"
            v-model="form.name"
            :width="675"
            :maxLength="100"
            required
            placeholder="Nhập tên thành phần"
          />
        </div>

        <!-- Row 2: Mã thành phần (required) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8">
              <b>Mã thành phần</b>
              <span class="text-red-600 star">*</span>
            </label>
          </div>
          <MSInputItem
            ref="codeRef"
            v-model="form.code"
            :width="675"
            :maxLength="20"
            required
            placeholder="Nhập mã thành phần"
          />
        </div>

        <!-- Row 3: Đơn vị áp dụng (required) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8">
              <b>Đơn vị áp dụng</b>
              <span class="text-red-600 star">*</span>
            </label>
          </div>
          <MSDropdownTree
            ref="unitRef"
            v-model="form.unit"
            :options="unitOptions"
            :searchable="true"
            :inlineSearch="true"
            :searchPlaceholder="''"
            :required="true"
            :width="675"
            :height="36"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
            :max-displayed-tags="4"
          />
        </div>

        <!-- Row 4: Loại thành phần (required) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8">
              <b>Loại thành phần</b>
              <span class="text-red-600 star">*</span>
            </label>
          </div>
          <MSDropdown
            ref="typeRef"
            v-model="form.type"
            :options="typeOptions"
            :searchable="true"
            :inlineSearch="true"
            :searchPlaceholder="''"
            :required="true"
            :width="237"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
          />
        </div>

        <!-- Row 5: Tính chất (required) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8">
              <b>Tính chất</b>
              <span class="text-red-600 star">*</span>
            </label>
          </div>
          <MSDropdown
            ref="natureRef"
            v-model="form.nature"
            :options="natureOptions"
            :searchable="true"
            :inlineSearch="true"
            :searchPlaceholder="''"
            :required="true"
            placeholder="Thu nhập"
            :width="237"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
          />
        </div>

        <!-- Row 6: Định mức -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Định mức</b></label>
          </div>
          <MSInputItem
            ref="normRef"
            v-model="form.norm"
            :width="675"
            :height="86"
            :maxLength="50"
            :placeholderTop="20"
            placeholder="Tự động gợi ý công thức và tham số khi gõ"
          />
        </div>

        <!-- Row 7: Kiểu giá trị -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Kiểu giá trị</b></label>
          </div>
          <MSDropdown
            ref="valueTypeRef"
            v-model="form.valueType"
            :options="valueTypeOptions"
            :searchable="true"
            :inlineSearch="true"
            :searchPlaceholder="''"
            placeholder="Tiền tệ"
            :width="237"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
          />
        </div>

        <!-- Row 8: Giá trị -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Giá trị</b></label>
          </div>
          <MSInputItem
            ref="valueRef"
            v-model="form.value"
            :width="675"
            :height="86"
            :maxLength="100"
            :placeholderTop="20"
            placeholder="Tự động nhập gợi ý công thức và tham số khi gõ"
          />
        </div>

        <!-- Row 9: Mô tả -->
        <div class="ms-row flex items-start">
          <div class="width-186px">
            <label class="pd-r-8"><b>Mô tả</b></label>
          </div>
          <MSInputItem
            ref="descriptionRef"
            v-model="form.description"
            :width="676"
            :height="72.6"
            :maxLength="500"
          />
        </div>

        <!-- Row 10: Hiển thị trên phiếu lương (radio) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Hiển thị trên phiếu lương</b></label>
          </div>
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
        <div class="ms-row flex items-center gap-4">
          <b>Nguồn tạo</b>
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
import MSPopup from '@/components/popup/MSPopup.vue'
import MSDropdownTree from '@/components/dropdown/MSDropdownTree.vue'

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
  const validType = typeRef.value
    ? (typeRef.value.validate?.() ?? form.type !== '')
    : form.type !== ''
  const validNature = natureRef.value
    ? (natureRef.value.validate?.() ?? form.nature !== '')
    : form.nature !== ''

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
  max-height: calc(100vh - 130px);
  overflow-y: auto;
  box-sizing: border-box;
}

.ms-row {
  width: 100%;
  margin-bottom: 16px;
}

.pd-r-8 {
  padding-right: 8px;
}

.width-186px {
  width: 186px;
  line-height: 35px;
}

.star {
  padding-inline-start: 2px;
}
</style>
