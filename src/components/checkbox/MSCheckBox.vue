<template>
  <label class="ms-checkbox" :class="{ 'ms-checkbox--disabled': disabled }">
    <input
      type="checkbox"
      class="ms-checkbox__input"
      :name="name"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <div :class="isChecked ? 'ms-square-checked' : 'ms-square'"></div>
    <span class="ms-checkbox__label" v-if="label || $slots.default">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: boolean | any[]
  value?: any
  name?: string
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === true
})

const onChange = (event: Event) => {
  if (props.disabled) return

  const isCheckedNew = (event.target as HTMLInputElement).checked

  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]
    if (isCheckedNew) {
      newValue.push(props.value)
    } else {
      newValue.splice(newValue.indexOf(props.value), 1)
    }
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', isCheckedNew)
  }
}
</script>

<style scoped>
.ms-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: fit-content;
}

.ms-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ms-checkbox__input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.ms-checkbox__label {
  margin-left: 8px;
}

.ms-square {
  background-image: url('@/assets/icons/ICON.svg');
  background-repeat: no-repeat;
  background-position: -240px 0;
  width: 20px;
  height: 20px;
}

.ms-square-checked {
  background-image: url('@/assets/icons/ICON.svg');
  background-repeat: no-repeat;
  background-position: -260px 0;
  width: 20px;
  height: 20px;
}
</style>
