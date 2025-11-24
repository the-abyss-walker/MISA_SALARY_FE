<template>
  <div>
    <select
      :value="internalValue"
      @change="onChange($event)"
      :class="['w-full border rounded px-2 py-1', { 'bg-white': true }]"
      :aria-label="placeholder || 'combobox'"
    >
      <option value="" disabled selected hidden v-if="placeholder">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue'

//#region Props
const props = defineProps<{
  modelValue?: any
  options?: Array<{ label: string; value: any }>
  placeholder?: string
  required?: boolean
}>()
//#endregion

//#region Emits
const emit = defineEmits(['update:modelValue'])
//#endregion

//#region Data
const internalValue = ref(props.modelValue ?? '')
//#endregion

//#region Watchers
watch(
  () => props.modelValue,
  (v) => {
    internalValue.value = v ?? ''
  },
)
//#endregion

//#region Methods
/**
 * Hàm xử lý sự kiện thay đổi giá trị combobox
 * @param e Event đối tượng sự kiện
 */
const onChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value
  internalValue.value = val
  emit('update:modelValue', val)
}

/**
 * Hàm validate giá trị combobox
 * @returns true nếu hợp lệ, false nếu không hợp lệ
 */
function validate() {
  if (props.required) {
    return (
      internalValue.value !== '' &&
      internalValue.value !== null &&
      internalValue.value !== undefined
    )
  }
  return true
}
//#endregion

defineExpose({ validate })
</script>

<style scoped>
/* minimal styling, component relies on global utility classes */
</style>
