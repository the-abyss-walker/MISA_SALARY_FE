<template>
  <div class="ms-input-item" :style="cssVars">
    <input
      ref="inputRef"
      class="ms-input__field"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      :disabled="disabled"
      @focus="onFocus"
      @blur="onBlur"
    />
    <p v-if="error" class="ms-input__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    width?: number | string
    height?: number
    borderColor?: string
    hoverColor?: string
    borderRadius?: string
    fontSize?: string
    disabled?: boolean
    required?: boolean
    maxLength?: number | undefined
    pattern?: string | RegExp | undefined
    errorMessage?: string | undefined
  }>(),
  {
    modelValue: '',
    placeholder: '',
    width: 300,
    height: 36,
    borderColor: '#D1D5DB', // gray-300
    hoverColor: '#198f3b',
    borderRadius: '4px',
    fontSize: '14px',
    disabled: false,
    required: false,
    maxLength: undefined,
    pattern: undefined,
    errorMessage: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'validation', valid: boolean): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const error = ref<string | null>(null)

const validate = (value?: string) => {
  if (props.disabled) {
    error.value = null
    emit('validation', true)
    return true
  }
  const v = value !== undefined ? value : (props.modelValue ?? '')
  if (props.required && (!v || v.trim() === '')) {
    error.value = props.errorMessage ?? 'Không được để trống.'
    emit('validation', false)
    return false
  }
  if (props.maxLength && v.length > props.maxLength) {
    error.value = props.errorMessage ?? `Tối đa ${props.maxLength} ký tự.`
    emit('validation', false)
    return false
  }
  if (props.pattern) {
    const re = typeof props.pattern === 'string' ? new RegExp(props.pattern) : props.pattern
    if (re && !re.test(v)) {
      error.value = props.errorMessage ?? 'Giá trị không đúng định dạng.'
      emit('validation', false)
      return false
    }
  }
  error.value = null
  emit('validation', true)
  return true
}

const cssVars = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  const border = error.value ? '#dc2626' : props.borderColor
  const hover = error.value ? '#dc2626' : props.hoverColor
  return {
    '--ms-input-border': border,
    '--ms-input-hover': hover,
    '--ms-input-radius': props.borderRadius,
    '--ms-input-height': `${props.height}px`,
    '--ms-input-font-size': props.fontSize,
    width: w,
  } as Record<string, string>
})

const onInput = (e: Event) => {
  const t = e.target as HTMLInputElement
  emit('update:modelValue', t.value)
  // validate new value
  validate(t.value)
}

const onFocus = (e: FocusEvent) => {
  emit('focus')
}

const onBlur = (e: FocusEvent) => {
  // validate on blur as well
  const val = (e.target as HTMLInputElement)?.value ?? ''
  validate(val)
  emit('blur')
}

defineExpose({ validate })
</script>

<style scoped>
.ms-input-item {
  display: block;
}

.ms-input__field {
  width: 100%;
  box-sizing: border-box;
  height: var(--ms-input-height);
  padding: 8px 12px;
  border: 1px solid var(--ms-input-border);
  border-radius: var(--ms-input-radius);
  font-size: var(--ms-input-font-size);
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;
  background: #fff;
}

.ms-input__field:hover {
  border-color: var(--ms-input-hover);
}

.ms-input__field:focus {
  outline: none;
  border-color: var(--ms-input-hover);
  box-shadow: 0 0 0 3px rgba(25, 143, 59, 0.08);
}

.ms-input__field:disabled {
  opacity: 0.6;
  pointer-events: none;
  background: #f8fafc;
}

.ms-input__error {
  color: #dc2626;
  margin-top: 6px;
  font-size: 12px;
}
</style>
