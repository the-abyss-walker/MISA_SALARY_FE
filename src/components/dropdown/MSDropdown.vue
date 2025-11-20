<template>
  <div ref="root" :style="containerStyle" class="relative inline-block">
    <button
      type="button"
      class="w-full flex items-center justify-between px-3 py-2 rounded bg-white text-left cursor-pointer ms-dropdown-btn"
      :class="[
        { 'opacity-60 pointer-events-none': disabled },
        buttonClasses,
        { 'border-red-500': error },
      ]"
      @click="toggle"
      :aria-expanded="open"
      :aria-disabled="disabled"
    >
      <template v-if="props.inlineSearch">
        <input
          v-model="search"
          class="w-full px-0 py-0 bg-transparent text-left outline-none"
          style="font-size: 14px"
          type="text"
          :placeholder="props.searchPlaceholder"
          @click.stop
          @keydown.enter.prevent="onEnter"
        />
      </template>
      <template v-else>
        <span :class="labelClasses" :title="selectedLabel || placeholder">
          {{ selectedLabel || placeholder }}
        </span>
      </template>
      <span class="ml-1 flex items-center">
        <MSIcon name="dropdown" color="#6e737a" />
      </span>
    </button>

    <div v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</div>

    <div
      v-if="open"
      class="absolute left-0 bg-white rounded shadow z-50"
      :style="panelStyle"
      role="listbox"
    >
      <!-- Panel-level search removed: inline search is used instead -->

      <ul class="max-h-60 overflow-auto p-2">
        <li
          v-for="opt in filteredOptions"
          :key="opt.value"
          class="option-item p-2 cursor-pointer flex items-center gap-2"
          :class="{ 'opacity-60 pointer-events-none': opt.disabled, selected: isSelected(opt) }"
          @click="select(opt)"
          role="option"
          :aria-selected="isSelected(opt)"
        >
          <slot name="option" :option="opt">
            <span class="truncate">{{ opt.label }}</span>
          </slot>

          <span class="option-icon w-7 shrink-0 flex items-center justify-center ml-auto">
            <MSIcon v-if="isSelected(opt)" name="check" color="#34B057" />
          </span>
        </li>

        <li v-if="filteredOptions.length === 0" class="py-2 text-sm text-gray-500">
          Không có kết quả
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'

type Opt = { label: string; value: any; disabled?: boolean }

const props = withDefaults(
  defineProps<{
    options?: Opt[]
    modelValue?: any
    placeholder?: string
    disabled?: boolean
    placement?: 'bottom' | 'top'
    labelAlign?: 'left' | 'right'
    searchable?: boolean
    searchPlaceholder?: string
    width?: number
    maxHeight?: number
    labelPosition?: 'left' | 'right'
    bordered?: boolean
    hoverable?: boolean
    inlineSearch?: boolean
    required?: boolean
    requiredMessage?: string
  }>(),
  {
    options: () => [],
    modelValue: undefined,
    placeholder: '',
    disabled: false,
    placement: 'bottom',
    labelAlign: 'left',
    searchable: false,
    inlineSearch: false,
    width: 240,
    maxHeight: 240,
    labelPosition: 'left',
    bordered: false,
    hoverable: true,
    required: false,
    requiredMessage: 'Không được để trống',
  },
)

const emit = defineEmits(['update:modelValue', 'select', 'open', 'close'])

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const search = ref('')
const error = ref('')
const suppressOpen = ref(false)

const labelClasses = computed(() => {
  const alignClass = props && props.labelAlign === 'right' ? 'text-right' : 'text-left'
  if (props && props.labelPosition === 'right') {
    return `truncate mr-1 ml-auto ${alignClass}`
  }
  return `truncate flex-1 pr-1 ${alignClass}`
})

const buttonClasses = computed(() => ({
  'ms-dropdown-btn': true,
  bordered: !!props.bordered,
  hoverable: !!props.hoverable,
}))

const containerStyle = computed(() => ({ width: `${props.width}px` }))
const panelStyle = computed(() => {
  const base: Record<string, string> = {
    minWidth: `${props.width}px`,
    maxHeight: `${props.maxHeight}px`,
  }

  if (props.placement === 'top') {
    base.bottom = '100%'
    base.marginBottom = '4px'
  } else {
    base.top = '100%'
    base.marginTop = '4px'
  }

  return base
})

const options = computed(() => props.options || [])

const selectedLabel = computed(() => {
  const found = options.value.find((o) => o.value === props.modelValue)
  return found ? found.label : ''
})

const filteredOptions = computed(() => {
  if (props.inlineSearch && open.value && search.value && search.value === selectedLabel.value) {
    return options.value
  }

  if (!search.value) return options.value
  const q = search.value.toLowerCase()
  return options.value.filter((o) => o.label.toLowerCase().includes(q))
})

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  emit(open.value ? 'open' : 'close')
}

function close() {
  open.value = false
  emit('close')
}

function select(opt: Opt) {
  if (opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('select', opt)
  if (props.inlineSearch) {
    // Prevent the search watcher from reopening the panel when we set
    // the input to the selected label.
    suppressOpen.value = true
    search.value = opt.label
    // Restore suppression shortly after to allow normal behavior.
    setTimeout(() => (suppressOpen.value = false), 0)
  } else {
    clearSearch()
  }
  close()
}

function clearSearch() {
  search.value = ''
}

// when searching inline, open the panel to show results
watch(search, (v) => {
  if (props.inlineSearch) {
    if (v && v.length > 0 && !suppressOpen.value) open.value = true
  }
})

function validate() {
  if (props.required) {
    const val = props.modelValue
    if (val === undefined || val === null || val === '') {
      error.value = props.requiredMessage || 'Không được để trống'
      return false
    }
  }
  error.value = ''
  return true
}

function isSelected(opt: Opt) {
  return opt.value === props.modelValue
}

function onDocumentClick(e: MouseEvent) {
  if (!root.value) return
  if (!(e.target instanceof Node)) return
  if (!root.value.contains(e.target)) {
    if (props.inlineSearch) {
      if (search.value && search.value !== selectedLabel.value) {
        clearSearch()
      }
    }
    close()
  }
}

function onEnter() {
  const first = filteredOptions.value[0]
  if (first) select(first)
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

watch(
  () => props.modelValue,
  () => {
    if (error.value) error.value = ''
  },
)

watch(
  selectedLabel,
  (val) => {
    if (props.inlineSearch) {
      search.value = val
    }
  },
  { immediate: true },
)

defineExpose({ validate })
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.max-h-60 {
  max-height: 15rem;
}

/* Dropdown option hover and selected styles */
.option-item:hover {
  background: #eafbf2;
}
.option-item.selected {
  background: #eafbf2;
  color: #34b057;
}
.option-item.selected .truncate {
  color: #34b057;
}
.option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Button border and hover control */
.ms-dropdown-btn.bordered {
  border: 1px solid #e5e7eb;
}
.ms-dropdown-btn.bordered.hoverable:hover {
  border-color: #34b057;
}
</style>
