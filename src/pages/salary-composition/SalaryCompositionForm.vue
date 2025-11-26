<template>
  <div class="content">
    <div class="bg-white rounded shadow add-form">
      <form @submit.prevent="onSubmit" class="flex flex-col">
        <!-- Row 1: Tên thành phần (required) -->
        <div class="ms-row flex items-start">
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
            :maxLength="255"
            required
            @blur="checkExistCode"
          />
        </div>

        <!-- Row 2: Mã thành phần (required) -->
        <div class="ms-row flex items-start">
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
            :maxLength="255"
            required
            :disabled="!!props.id"
            placeholder="Nhập mã thành phần"
            pattern="^[A-Za-z0-9_]*$"
            errorMessage="Mã thành phần chỉ có thể chứa các kí tự chữ (A-Z a-z), số (0-9) và gạch dưới (_)."
            @blur="checkExistCode"
          />
        </div>

        <!-- Row 3: Đơn vị áp dụng (required) -->
        <div class="ms-row flex items-start">
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
            :max-displayed-tags="3"
            :show-inactive-option="false"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
            @loaded="onUnitLoaded"
          />
        </div>

        <!-- Row 4: Loại thành phần (required) -->
        <div class="ms-row flex items-start">
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
            :disabled="isDefault && !!props.id"
          />
        </div>

        <!-- Row 5: Tính chất (required) -->
        <div class="ms-row flex items-start">
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
            :width="237"
            :bordered="true"
            :hoverable="true"
            labelPosition="left"
            labelAlign="left"
            :disabled="isDefault && !!props.id"
          />
          <div v-if="form.nature === CompositionNature.Income" class="flex items-center ml-4 gap-4">
            <MSRadio
              v-model="form.taxType"
              value="taxable"
              label="Chịu thuế"
              :disabled="isDefault && !!props.id"
            />
            <MSRadio
              v-model="form.taxType"
              value="fully_exempt"
              label="Miễn thuế toàn phần"
              :disabled="isDefault && !!props.id"
            />
            <MSRadio
              v-model="form.taxType"
              value="partially_exempt"
              label="Miễn thuế một phần"
              :disabled="isDefault && !!props.id"
            />
          </div>
          <div v-if="form.nature === CompositionNature.Deduction" class="flex items-center ml-4">
            <MSCheckBox
              v-model="form.isTaxDeduction"
              label="Giảm trừ khi tính thuế"
              :disabled="isDefault && !!props.id"
            />
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
        <div class="ms-row flex items-start">
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
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <MSRadio
                    v-model="form.valueCalculationMethod"
                    :value="FormulaCompositionType.AutoSumFormula"
                    label="Tự động cộng tổng giá trị của các nhân viên"
                  />
                  <div
                    v-if="form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula"
                    class="flex items-center gap-2"
                  >
                    <MSDropdown
                      v-model="form.autoSumScope"
                      :options="autoSumScopeOptions"
                      width="fit-content"
                      :bordered="true"
                      :hoverable="true"
                      labelPosition="left"
                      labelAlign="left"
                    />
                    <MSDropdown
                      v-if="form.autoSumScope === AutoSumEmployeeType.BelongToOrganization"
                      v-model="form.autoSumLevel"
                      :options="levelOptions"
                      :width="110"
                      :bordered="true"
                      :hoverable="true"
                      placeholder="Chọn cấp"
                      labelPosition="left"
                      labelAlign="left"
                    />
                  </div>
                </div>
                <div
                  v-if="form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula"
                  class="mt-2"
                >
                  <MSDropdown
                    v-model="form.autoSumCompositionCode"
                    :options="salaryCompositions"
                    :width="'100%'"
                    :bordered="true"
                    :hoverable="true"
                    :searchable="true"
                    :inlineSearch="true"
                    searchPlaceholder="Chọn thành phần lương để cộng giá trị"
                    labelPosition="left"
                    labelAlign="left"
                  >
                    <template #option="{ option }">
                      <div class="truncate">
                        {{ option.name }} (<b>{{ option.code }}</b
                        >)
                      </div>
                    </template>
                  </MSDropdown>
                </div>
              </div>
              <div class="flex items-center mt-2">
                <MSRadio
                  v-model="form.valueCalculationMethod"
                  :value="FormulaCompositionType.CustomFormula"
                  label="Tính theo công thức tự đặt"
                />
              </div>
            </div>
            <MSInputItem
              v-if="
                ![ValueType.Number, ValueType.Money].includes(form.valueType) ||
                form.valueCalculationMethod === FormulaCompositionType.CustomFormula
              "
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
        <div class="ms-row flex items-center">
          <div class="width-186px">
            <label class="pd-r-8"><b>Nguồn tạo</b></label>
          </div>

          <div class="source">{{ isDefault ? 'Mặc định' : 'Tự thêm' }}</div>
        </div>
      </form>
    </div>
    <Transition name="toast-slide">
      <MSToast v-if="toast.show" :type="toast.type" :message="toast.message" @close="closeToast" />
    </Transition>

    <MSPopup
      v-model:visible="showSystemMatchPopup"
      title="Thông báo"
      width="500px"
      :buttons="popupButtons"
      @action="onPopupAction"
    >
      <div>
        <div class="mb-4">
          Đã tìm thấy một thành phần lương mặc định của hệ thống có cùng tên
          <b>{{ systemMatchData?.salaryCompositionSystemName }}</b
          >. Chọn thao tác bạn muốn thực hiện với đối tượng này:
        </div>
        <div class="flex flex-col gap-2">
          <MSRadio
            v-model="systemMatchOption"
            value="use_default"
            label="Sử dụng thành phần lương mặc định"
          />
          <MSRadio
            v-model="systemMatchOption"
            value="continue_new"
            label="Tiếp tục thêm mới thành phần lương này"
          />
        </div>
      </div>
    </MSPopup>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import MSInputItem from '@/components/inputs/MSInputItem.vue'
import MSDropdown from '@/components/dropdown/MSDropdown.vue'
import MSDropdownTree from '@/components/dropdown/MSDropdownTree.vue'
import MSRadio from '@/components/radio/MSRadio.vue'
import MSCheckBox from '@/components/checkbox/MSCheckBox.vue'
import MSToast from '@/components/toast/MSToast.vue'
import MSPopup from '@/components/popup/MSPopup.vue'
import SalaryCompositionApi from '@/apis/components/SalaryCompositionApi'
import SalaryCompositionSystemApi from '@/apis/components/SalaryCompositionSystemApi'
import { CompositionType, CompositionTypeLabel } from '@/enums/CompositionType'
import { CompositionNature, CompositionNatureLabel } from '@/enums/CompositionNature'
import { ValueType, ValueTypeLabel } from '@/enums/ValueType'
import { AutoSumEmployeeType, AutoSumEmployeeTypeLabel } from '@/enums/AutoSumEmployeeType'
import { OptionShowPaycheck } from '@/enums/OptionShowPaycheck'
import { Status } from '@/enums/Status'
import { FormulaCompositionType } from '@/enums/FormulaCompositionType'
import { AutoSumOrgLevel, AutoSumOrgLevelLabel } from '@/enums/AutoSumOrgLevel'

const props = defineProps<{
  id?: string | null
}>()

//#region Emits
const emit = defineEmits<{
  (e: 'saved', payload: any): void
  (e: 'savedAndAdd', payload: any): void
  (e: 'cancel'): void
}>()
//#endregion

//#region Data
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
  autoSumLevel: AutoSumOrgLevel.Level1,
  autoSumCompositionCode: null,
})

const salaryCompositions = ref<any[]>([])
const isDefault = ref(false)
//#endregion

//#region Methods
/** Hàm xử lý sự kiện khi dữ liệu đơn vị được load thành công */
SalaryCompositionApi.getAll().then((res) => {
  if (res.data.data) {
    salaryCompositions.value = res.data.data.map((item: any) => ({
      label: item.salaryCompositionName + ' (' + item.salaryCompositionCode + ')',
      value: item.salaryCompositionCode,
      name: item.salaryCompositionName,
      code: item.salaryCompositionCode,
    }))
  }
})
//#endregion

//#region Toast
const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'information' | 'warning' | 'failed',
  message: '',
})
//#endregion

//#region Dirty Check
// Biến theo dõi trạng thái chỉnh sửa form
const isDirty = ref(false)
//#endregion

//#region Watchers
/** Watcher để theo dõi thay đổi form và đánh dấu là đã chỉnh sửa */
watch(
  form,
  () => {
    isDirty.value = true
  },
  { deep: true },
)
//#endregion

//#region Refs
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
//#endregion

//#region Composition Type Options
// Loại thành phần
const typeOptions = Object.values(CompositionType)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: CompositionTypeLabel[v as CompositionType],
    value: v,
  }))
//#endregion

//#region Nature Options
// Tính chất
const natureOptions = Object.values(CompositionNature)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: CompositionNatureLabel[v as CompositionNature],
    value: v,
  }))
//#endregion

//#region Value Type Options
// Kiểu giá trị
const valueTypeOptions = Object.values(ValueType)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: ValueTypeLabel[v as ValueType],
    value: v,
  }))
//#endregion

//#region Auto Sum Scope Options
const autoSumScopeOptions = Object.values(AutoSumEmployeeType)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: AutoSumEmployeeTypeLabel[v as AutoSumEmployeeType],
    value: v,
  }))
//#endregion

//#region Level Options
const levelOptions = Object.values(AutoSumOrgLevel)
  .filter((v) => typeof v === 'number')
  .map((v) => ({
    label: AutoSumOrgLevelLabel[v as AutoSumOrgLevel],
    value: v,
  }))
//#endregion

//#region Watchers for Dependent Fields
/** Watcher để tự động điều chỉnh Tính chất dựa trên Loại thành phần */
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
//#endregion

//#region Watchers for Dependent Fields
/** Watcher để tự động điều chỉnh Kiểu giá trị dựa trên Tính chất */
watch(
  () => form.nature,
  (newNature) => {
    if (newNature === CompositionNature.Income || newNature === CompositionNature.Deduction) {
      form.valueType = ValueType.Money
    }
  },
)
//#endregion

//#region Loading State
const isLoading = ref(false)
//#endregion

//#region Utility Functions
const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
  str = str.replace(/\u02C6|\u0306|\u031B/g, '')
  return str
}
//#endregion

//#region Watcher để tự động tạo Mã thành phần từ Tên thành phần nếu không phải là chỉnh sửa
watch(
  () => form.name,
  (newVal) => {
    if (props.id) return
    if (newVal) {
      let code = removeVietnameseTones(newVal)
      code = code.toUpperCase()
      code = code.replace(/\s+/g, '_')
      code = code.replace(/[^A-Z0-9_]/g, '')
      form.code = code
    } else {
      form.code = ''
    }
  },
)
//#endregion

//#region Value Type Options
// Kiểu giá trị
const unitOptions = ref<any[]>([])
//#endregion

//#region Methods
/** Hàm xử lý khi dữ liệu đơn vị được load thành công */
const onUnitLoaded = (data: any[]) => {
  unitOptions.value = data
  if (!props.id && data && data.length > 0 && (!form.unit || form.unit.length === 0)) {
    const wasDirty = isDirty.value
    form.unit = [data[0].id]
    if (!wasDirty) {
      setTimeout(() => {
        isDirty.value = false
      }, 0)
    }
  }
}
//#endregion

//#region Load Existing Data on Edit
/** Hàm tải dữ liệu thành phần lương khi chỉnh sửa */
onMounted(async () => {
  if (props.id) {
    isLoading.value = true
    try {
      const res = await SalaryCompositionApi.getById(props.id)
      const data = res.data.data
      form.code = data.salaryCompositionCode
      form.name = data.salaryCompositionName
      form.compositionType = data.compositionType
      form.unit = data.organizationUnitIds
      form.nature = data.compositionNature
      form.quota = data.quota
      form.valueType = data.valueType
      form.description = data.description
      form.optionShowPaycheck = data.optionShowPaycheck
      form.valueCalculationMethod =
        data.formulaCompositionType ?? FormulaCompositionType.CustomFormula

      if (form.valueCalculationMethod === FormulaCompositionType.CustomFormula) {
        form.value = data.formula
      } else {
        form.autoSumCompositionCode = data.autoSumCompositionCode
        form.autoSumScope = data.autoSumEmployeeType
        form.autoSumLevel = data.autoSumOrgLevel
      }

      if (data.compositionNature === CompositionNature.Income) {
        if (data.taxDeduction) {
          form.taxType = 'fully_exempt'
        } else if (data.taxable) {
          form.taxType = 'taxable'
        } else {
          // Default or handle other cases
          form.taxType = 'taxable'
        }
      } else if (data.compositionNature === CompositionNature.Deduction) {
        form.isTaxDeduction = data.taxDeduction
      }

      isDefault.value = data.isDefault
    } catch (e) {
      console.error(e)
      showToast('failed', 'Không thể tải dữ liệu')
    } finally {
      isLoading.value = false
      setTimeout(() => {
        isDirty.value = false
      }, 0)
    }
  }
  setTimeout(() => {
    nameRef.value?.focus()
  }, 100)
})
//#endregion

//#region method to submit the form
/** Hàm xử lý gửi form */
const submit = (mode: 'save' | 'saveAndAdd' = 'save') => {
  // validate fields before emitting
  let firstErrorInput: any = null

  // Validate từng trường và lưu trữ tham chiếu đến trường đầu tiên có lỗi
  const validName = nameRef.value ? nameRef.value.validate() : true
  if (!validName && !firstErrorInput) firstErrorInput = nameRef.value

  const validCode = codeRef.value ? codeRef.value.validate() : true
  if (!validCode && !firstErrorInput) firstErrorInput = codeRef.value

  const validUnit = unitRef.value ? (unitRef.value.validate?.() ?? true) : true
  if (!validUnit && !firstErrorInput) firstErrorInput = unitRef.value

  const validType = typeRef.value
    ? (typeRef.value.validate?.() ?? form.compositionType !== null)
    : form.compositionType !== null
  if (!validType && !firstErrorInput) firstErrorInput = typeRef.value

  const validNature = natureRef.value ? (natureRef.value.validate?.() ?? true) : true
  if (!validNature && !firstErrorInput) firstErrorInput = natureRef.value

  const validFormula = formulaRef.value ? formulaRef.value.validate() : true
  if (!validFormula && !firstErrorInput) firstErrorInput = formulaRef.value

  if (firstErrorInput) {
    firstErrorInput.focus?.()
    return
  }

  // Payload để gửi lên API
  const payload = {
    id: props.id,
    salaryCompositionName: form.name,
    ...(props.id ? {} : { SalaryCompositionCode: form.code }),
    compositionType: form.compositionType,
    compositionNature: form.nature,
    taxable:
      form.nature === CompositionNature.Income
        ? ['taxable', 'partially_exempt'].includes(form.taxType)
        : null,
    taxDeduction:
      form.nature === CompositionNature.Income
        ? form.taxType === 'fully_exempt'
        : form.nature === CompositionNature.Deduction
          ? form.isTaxDeduction
          : null,
    quota: form.quota,
    formula:
      form.valueCalculationMethod === FormulaCompositionType.CustomFormula ? form.value : null,
    valueType: form.valueType,
    description: form.description,
    status: Status.Following,
    optionShowPaycheck: form.optionShowPaycheck,
    isNotAllowDelete: false,
    OrganizationUnitIds: form.unit?.map(String) || [],
    OrganizationUnitNames:
      form.unit?.map((id) => {
        const unit = unitOptions.value.find((u: any) => u.id === id)
        return unit ? unit.organizationName : ''
      }) || [],
    ...(props.id ? {} : { isDefault: false }),
    autoSumCompositionCode:
      form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula
        ? form.autoSumCompositionCode
        : null,
    isAutoSumEmployee: form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula,
    autoSumEmployeeType:
      form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula
        ? form.autoSumScope
        : null,
    autoSumOrgLevel:
      form.valueCalculationMethod === FormulaCompositionType.AutoSumFormula &&
      form.autoSumScope === AutoSumEmployeeType.BelongToOrganization
        ? form.autoSumLevel
        : null,
    formulaCompositionType: form.valueCalculationMethod,
  }
  isLoading.value = true
  const apiCall = props.id
    ? SalaryCompositionApi.update(payload)
    : SalaryCompositionApi.create(payload)

  apiCall
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
      const message =
        err.response?.data?.userMsg ||
        err.response?.data?.errors?.[0]?.message ||
        'Có lỗi xảy ra vui lòng thử lại.'
      showToast('failed', message)
    })
    .finally(() => {
      isLoading.value = false
    })
}

//#region Handle form submission
const onSubmit = () => {
  submit('save')
}
//#endregion

//#region Reset form to initial state
const onReset = () => {
  form.code = ''
  form.name = ''
  form.compositionType = null
  if (unitOptions.value && unitOptions.value.length > 0) {
    form.unit = [unitOptions.value[0].id]
  } else {
    form.unit = []
  }
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
  form.autoSumLevel = 1
  form.autoSumCompositionCode = null

  // Reset dirty state after reset
  setTimeout(() => {
    isDirty.value = false
    nameRef.value?.focus()
  }, 0)
}
//#endregion

//#region Toast functions
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
//#endregion

//#region Set form data function
// Hàm thiết lập dữ liệu cho form (dùng khi chỉnh sửa hoặc nhân bản)
const setFormData = (data: any, isClone: boolean = false) => {
  form.name = isClone ? '' : data.salaryCompositionName
  form.code = isClone ? '' : data.salaryCompositionCode
  form.compositionType = data.compositionType
  form.unit = data.organizationUnitIds
  form.nature = data.compositionNature
  form.quota = data.quota
  form.valueType = data.valueType
  form.description = data.description
  form.optionShowPaycheck = data.optionShowPaycheck
  form.valueCalculationMethod = data.formulaCompositionType ?? FormulaCompositionType.CustomFormula

  if (form.valueCalculationMethod === FormulaCompositionType.CustomFormula) {
    form.value = data.formula
  } else {
    form.autoSumCompositionCode = data.autoSumCompositionCode
    form.autoSumScope = data.autoSumEmployeeType
    form.autoSumLevel = data.autoSumOrgLevel
  }

  if (data.compositionNature === CompositionNature.Income) {
    if (data.taxDeduction) {
      form.taxType = 'fully_exempt'
    } else if (data.taxable) {
      form.taxType = 'taxable'
    } else {
      form.taxType = 'taxable'
    }
  } else if (data.compositionNature === CompositionNature.Deduction) {
    form.isTaxDeduction = data.taxDeduction
  }
  isDefault.value = isClone ? false : data.isDefault
  setTimeout(() => {
    isDirty.value = false
  }, 0)
}
//#endregion

//#region data
const showSystemMatchPopup = ref(false)
const systemMatchData = ref<any>(null)
const systemMatchOption = ref('use_default')
//#endregion

//#region Popup buttons
const popupButtons = [
  { label: 'Hủy', variant: 'secondary' as const },
  { label: 'Đồng ý', variant: 'primary' as const },
]
//#endregion

//#region methods
/** Hàm kiểm tra mã thành phần có tồn tại trong hệ thống không */
const checkExistCode = async () => {
  if (props.id) return
  if (!form.code) return

  try {
    const res = await SalaryCompositionSystemApi.existCompositionCode(form.code)
    if (res.data.data) {
      systemMatchData.value = res.data.data
      systemMatchOption.value = 'use_default'
      showSystemMatchPopup.value = true
    }
  } catch (e) {
    console.error(e)
  }
}
//#endregion

//#region methods
/** Hàm xử lý sự kiện khi người dùng chọn hành động trong popup */
const onPopupAction = ({ button }: any) => {
  if (button.label === 'Hủy') {
    showSystemMatchPopup.value = false
  } else if (button.label === 'Đồng ý') {
    if (systemMatchOption.value === 'use_default') {
      isLoading.value = true
      SalaryCompositionApi.createFromSystem([systemMatchData.value.id])
        .then((res) => {
          emit('saved', res)
          showSystemMatchPopup.value = false
        })
        .catch((err) => {
          console.error(err)
          showToast('failed', 'Có lỗi xảy ra khi tạo từ hệ thống.')
        })
        .finally(() => {
          isLoading.value = false
        })
    } else {
      showSystemMatchPopup.value = false
    }
  }
}
//#endregion

defineExpose({ submit, isDirty, setFormData })
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

.source {
  width: 675px;
  border-bottom: 1px solid #e3e5ee;
}
</style>
