<template>
  <div
    class="flex items-center rounded-md border transition-all duration-150 cursor-text"
    :class="[isHover ? hoverClass : baseClass, disabled ? 'opacity-50 pointer-events-none' : '']"
    :style="sizeStyle"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @click="focusInput"
  >
    <span class="icon-span flex items-center justify-center box-content">
      <MSIcon v-if="icon" :name="icon" :color="'#6E737A'" />
    </span>

    <input
      ref="inputRef"
      :placeholder="placeholder"
      class="flex-1 bg-transparent outline-none text-[14px] font-normal px-3"
      :class="placeholderClass"
      v-model="modelValueLocal"
      @input="$emit('update:modelValue', modelValueLocal)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'

interface Props {
  modelValue?: string
  icon?: string
  placeholder?: string
  width?: number | string
  height?: number | string
  baseClass?: string
  hoverClass?: string
  placeholderClass?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  icon: 'search',
  placeholder: 'Search…',
  width: 300,
  height: 32,
  baseClass: 'bg-[#F6F6F6] border-none',
  hoverClass: 'border-[#34b057] ',
  placeholderClass: 'placeholder-gray-500',
  disabled: false,
})

const isHover = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const modelValueLocal = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    modelValueLocal.value = newVal
  },
)

const sizeStyle = computed(() => {
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  }
})

const focusInput = () => {
  inputRef.value?.focus()
}
</script>

<style scoped>
.icon-span {
  width: 24px;
  height: 24px;
  padding-left: 4px;
}
</style>
