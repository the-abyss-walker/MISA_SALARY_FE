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
            </label>
          </div>
          <MSDropdownTree
            ref="unitRef"
            v-model="form.unit"
            :searchable="true"
            :inlineSearch="true"
            :searchPlaceholder="''"
            :required="true"
            :width="675"
            :bordered="true"
            :max-displayed-tags="4"
            :show-inactive-option="false"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
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
            v-model="form.compositionType"
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
          <div v-if="form.nature === CompositionNature.Income" class="flex items-center ml-4 gap-4">
            <MSRadio v-model="form.taxType" value="taxable" label="Chịu thuế" />
            <MSRadio v-model="form.taxType" value="fully_exempt" label="Miễn thuế toàn phần" />
            <MSRadio v-model="form.taxType" value="partially_exempt" label="Miễn thuế một phần" />
          </div>
          <div v-if="form.nature === CompositionNature.Deduction" class="flex items-center ml-4">
            <MSCheckBox v-model="form.isTaxDeduction" label="Giảm trừ khi tính thuế" />
          </div>
        </div>

        <!-- Row 6: Định mức -->
        <div class="ms-row flex items-start" v-if="form.nature !== CompositionNature.Other">
          <div class="width-186px">
            <label class="pd-r-8"><b>Định mức</b></label>
          </div>
          <div class="flex flex-col">
            <MSInputItem
              ref="normRef"
              v-model="form.quota"
              :width="675"
              :height="86"
              :maxLength="50"
              :placeholderTop="20"
              placeholder="Tự động gợi ý công thức và tham số khi gõ"
              isTextarea
            />
            <div class="mt-2">
              <MSCheckBox
                v-model="form.allowExceedNorm"
                label="Cho phép giá trị vượt quá định mức"
              />
            </div>
          </div>
        </div>

        <!-- Row 7: Kiểu giá trị -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Kiểu giá trị</b></label>
          </div>
          <MSDropdown
            ref="valueTypeRef"
            v-model="form.valueType"
            :disabled="
              form.nature === CompositionNature.Income ||
              form.nature === CompositionNature.Deduction
            "
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
        <div class="ms-row flex items-start">
          <div class="width-186px">
            <label class="pd-r-8"><b>Giá trị</b></label>
          </div>
          <div class="flex flex-col">
            <div
              v-if="[ValueType.Number, ValueType.Money].includes(form.valueType)"
              class="flex flex-col mb-2 gap-2"
            >
              <div class="flex items-center gap-2">
                <MSRadio
                  v-model="form.valueCalculationMethod"
                  :value="FormulaCompositionType.AutoSumFormula"
                  label="Tự động cộng giá trị của nhân viên"
                />
                <MSDropdown
                  v-model="form.autoSumScope"
                  :options="autoSumScopeOptions"
                  :disabled="form.valueCalculationMethod !== FormulaCompositionType.AutoSumFormula"
                  :width="250"
                  :bordered="true"
                  :hoverable="true"
                  labelPosition="left"
                  labelAlign="left"
                />
              </div>
              <MSRadio
                v-model="form.valueCalculationMethod"
                :value="FormulaCompositionType.CustomFormula"
                label="Tính theo công thức tự đặt"
              />
            </div>
            <MSInputItem
              ref="valueRef"
              v-model="form.value"
              :width="675"
              :height="86"
              :maxLength="100"
              :placeholderTop="20"
              placeholder="Tự động nhập gợi ý công thức và tham số khi gõ"
              isTextarea
            />
          </div>
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
            isTextarea
          />
        </div>

        <!-- Row 10: Hiển thị trên phiếu lương (radio) -->
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Hiển thị trên phiếu lương</b></label>
          </div>
          <div class="flex items-center gap-4">
            <MSRadio v-model="form.optionShowPaycheck" :value="OptionShowPaycheck.Yes" label="Có" />
            <MSRadio
              v-model="form.optionShowPaycheck"
              :value="OptionShowPaycheck.No"
              label="Không"
            />
            <MSRadio
              v-model="form.optionShowPaycheck"
              :value="OptionShowPaycheck.ShowWhenNonZero"
              label="Chỉ hiển thị nếu giá trị khác 0"
            />
          </div>
        </div>

        <!-- Row 11: Nguồn tạo (fixed label) -->
        <div class="ms-row flex items-center gap-4">
          <b>Nguồn tạo</b>
          <div class="px-3 py-2 border rounded bg-gray-50">Tự thêm</div>
        </div>
      </form>
    </div>
    <div v-if="toast.show" class="fixed top-4 right-4 z-50">
      <MSToast :type="toast.type" :message="toast.message" @close="closeToast" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import MSInputItem from '@/components/inputs/MSInputItem.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'
import MSDropdownTree from '@/components/dropdown/MSDropdownTree.vue'
import MSRadio from '@/components/radio/MSRadio.vue'
import MSCheckBox from '@/components/checkbox/MSCheckBox.vue'
import MSToast from '@/components/toast/MSToast.vue'
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'
import { CompositionType, CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNature, CompositionNatureLabel } from '@/enums/CompositionNature'
import { ValueType, ValueTypeLabel } from '@/enums/ValueType'
import { AutoSumEmployeeType, AutoSumEmployeeTypeLabel } from '@/enums/AutoSumEmployeeType'
import { OptionShowPaycheck } from '@/enums/OptionShowPaycheck'
import { Status } from '@/enums/Status'
import { FormulaCompositionType } from '@/enums/FormulaCompositionType'

const emit = defineEmits<{
  (e: 'saved', payload: any): void
  (e: 'savedAndAdd', payload: any): void
  (e: 'cancel'): void
}>()

const form = reactive({
  code: '',
  name: '',
  compositionType: null as CompositionType | null,
  unit: [] as string[],
  nature: CompositionNature.Income,
  quota: '',
  valueType: ValueType.Money,
  value: '',
  description: '',
  optionShowPaycheck: OptionShowPaycheck.Yes,
  formula: '',
  taxType: 'taxable',
  isTaxDeduction: false,
  valueCalculationMethod: FormulaCompositionType.CustomFormula,
  allowExceedNorm: false,
  autoSumScope: AutoSumEmployeeType.SameWorkingUnit,
})

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'information' | 'warning' | 'failed',
  message: '',
})

const isDirty = ref(false)

watch(
  form,
  () => {
    isDirty.value = true
  },
  { deep: true },
)

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

// Loại thành phần
const typeOptions = Object.values(CompositionType)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: CompositionTypeLabel[v as CompositionType],
    value: v,
  }))

// Tính chất
const natureOptions = Object.values(CompositionNature)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: CompositionNatureLabel[v as CompositionNature],
    value: v,
  }))

// Kiểu giá trị
const valueTypeOptions = Object.values(ValueType)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: ValueTypeLabel[v as ValueType],
    value: v,
  }))

const autoSumScopeOptions = Object.values(AutoSumEmployeeType)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: AutoSumEmployeeTypeLabel[v as AutoSumEmployeeType],
    value: v,
  }))

watch(
  () => form.compositionType,
  (newType) => {
    const incomeTypes = [
      CompositionType.EmployeeInfomation,
      CompositionType.Sales,
      CompositionType.Salary,
      CompositionType.PersonalIncomeTax,
      CompositionType.Insurance,
      CompositionType.Other,
    ]
    const otherTypes = [CompositionType.Timekeeping, CompositionType.KPI, CompositionType.Product]

    if (newType && incomeTypes.includes(newType)) {
      form.nature = CompositionNature.Income
    } else if (newType && otherTypes.includes(newType)) {
      form.nature = CompositionNature.Other
    }
  },
)

watch(
  () => form.nature,
  (newNature) => {
    if (newNature === CompositionNature.Income || newNature === CompositionNature.Deduction) {
      form.valueType = ValueType.Money
    }
  },
)

const submit = (mode: 'save' | 'saveAndAdd' = 'save') => {
  // validate fields before emitting
  const validCode = codeRef.value ? codeRef.value.validate() : true
  const validName = nameRef.value ? nameRef.value.validate() : true
  const validFormula = formulaRef.value ? formulaRef.value.validate() : true
  const validUnit = unitRef.value ? (unitRef.value.validate?.() ?? true) : true
  const validType = typeRef.value
    ? (typeRef.value.validate?.() ?? form.compositionType !== null)
    : form.compositionType !== null
  const validNature = natureRef.value ? (natureRef.value.validate?.() ?? true) : true

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

  const payload = {
    SalaryCompositionName: form.name,
    SalaryCompositionCode: form.code,
    CompositionType: form.compositionType,
    CompositionNature: form.nature,
    Taxable:
      form.nature === CompositionNature.Income
        ? ['taxable', 'partially_exempt'].includes(form.taxType)
        : null,
    TaxDeduction:
      form.nature === CompositionNature.Income
        ? form.taxType === 'fully_exempt'
        : form.nature === CompositionNature.Deduction
          ? form.isTaxDeduction
          : null,
    Quota: form.quota,
    Formula:
      form.valueCalculationMethod === FormulaCompositionType.CustomFormula ? form.value : null,
    ValueType: form.valueType,
    Description: form.description,
    Status: Status.Following,
    OptionShowPaycheck: form.optionShowPaycheck,
    IsNotAllowDelete: false,
    OrganizationUnitIds: form.unit?.map(String) || [],
    IsDefault: false,
    AutoSumCompositionCode: null,
    IsAutoSumEmployee: form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula,
    AutoSumEmployeeType:
      form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula
        ? form.autoSumScope
        : null,
    FormulaCompositionType: form.valueCalculationMethod,
  }
  SalaryCompositionApi.create(payload)
    .then((res) => {
      if (mode === 'save') {
        emit('saved', res)
      } else {
        emit('savedAndAdd', res)
        onReset()
      }
    })
    .catch((err) => {
      console.error(err)
      showToast('failed', err.response.data.errors[0].message || 'Có lỗi xảy ra vui lòng thử lại.')
    })
}

const onSubmit = () => {
  submit('save')
}

const onCancel = () => {
  emit('cancel')
}

const onReset = () => {
  form.code = ''
  form.name = ''
  form.compositionType = null
  form.unit = []
  form.nature = CompositionNature.Income
  form.quota = ''
  form.valueType = ValueType.Money
  form.value = ''
  form.description = ''
  form.optionShowPaycheck = OptionShowPaycheck.Yes
  form.formula = ''
  form.taxType = 'taxable'
  form.isTaxDeduction = false
  form.valueCalculationMethod = FormulaCompositionType.CustomFormula
  form.allowExceedNorm = false
  form.autoSumScope = AutoSumEmployeeType.SameWorkingUnit

  // Reset dirty state after reset
  setTimeout(() => {
    isDirty.value = false
  }, 0)
}

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

defineExpose({ submit, isDirty })
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

:deep(.ms-dropdown-btn.pointer-events-none) {
  background-color: #e0e0e0 !important;
}
</style>
