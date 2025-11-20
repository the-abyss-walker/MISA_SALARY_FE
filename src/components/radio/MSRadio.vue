<template>
  <label class="ms-radio" :class="{ 'ms-radio--disabled': disabled }">
    <input
      type="radio"
      class="ms-radio__input"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <div class="ms-radio__icon-container">
      <MSIcon
        :name="isChecked ? 'radio_check' : 'radio_uncheck'"
        :color="disabled ? '#e8eaef' : undefined"
      />
    </div>
    <span class="ms-radio__label" v-if="label || $slots.default">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'

const props = defineProps<{
  modelValue?: any
  value?: any
  name?: string
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  return props.modelValue === props.value
})

const onChange = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<style scoped>
.ms-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: fit-content;
}

.ms-radio--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ms-radio__input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.ms-radio__icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 4px;
  transition: background-color 0.2s;
}

/* Hover state - gray background */
.ms-radio:hover:not(.ms-radio--disabled) .ms-radio__icon-container {
  background-color: #e0e0e0;
}

/* Active/Press state - darker gray background */
.ms-radio:active:not(.ms-radio--disabled) .ms-radio__icon-container {
  background-color: #bdbdbd;
}

.ms-radio__label {
  margin-left: 8px;
}
</style>
