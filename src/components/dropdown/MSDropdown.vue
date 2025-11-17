<template>
  <div ref="root" :style="containerStyle" class="relative inline-block">
    <button
      type="button"
      class="w-full flex items-center justify-between px-3 py-2 rounded bg-white text-left cursor-pointer"
      :class="{ 'opacity-60 pointer-events-none': disabled }"
      @click="toggle"
      :aria-expanded="open"
      :aria-disabled="disabled"
    >
      <span
        class="truncate flex-1 pr-1"
        :class="props && props.labelAlign === 'right' ? 'text-right' : 'text-left'"
        :title="selectedLabel || placeholder"
      >
        {{ selectedLabel || placeholder }}
      </span>
      <span class="ml-1 flex items-center">
        <MSIcon name="dropdown" color="#6e737a" />
      </span>
    </button>

    <div
      v-if="open"
      class="absolute left-0 mt-1 bg-white rounded shadow z-50"
      :style="panelStyle"
      role="listbox"
    >
      <div v-if="searchable" class="p-2">
        <input
          v-model="search"
          class="w-full px-2 py-1 border rounded text-sm"
          type="search"
          :placeholder="searchPlaceholder"
          @keydown.enter.prevent="onEnter"
        />
      </div>

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
    labelAlign?: 'left' | 'right'
    searchable?: boolean
    searchPlaceholder?: string
    width?: number
    maxHeight?: number
  }>(),
  {
    options: () => [],
    modelValue: undefined,
    placeholder: 'Chọn',
    disabled: false,
    labelAlign: 'right',
    searchable: false,
    searchPlaceholder: 'Tìm kiếm...',
    width: 240,
    maxHeight: 240,
  },
)

const emit = defineEmits(['update:modelValue', 'select', 'open', 'close'])

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const search = ref('')

const containerStyle = computed(() => ({ width: `${props.width}px` }))
const panelStyle = computed(() => ({
  minWidth: `${props.width}px`,
  maxHeight: `${props.maxHeight}px`,
}))

const options = computed(() => props.options || [])

const filteredOptions = computed(() => {
  if (!props.searchable || !search.value) return options.value
  const q = search.value.toLowerCase()
  return options.value.filter((o) => o.label.toLowerCase().includes(q))
})

const selectedLabel = computed(() => {
  const found = options.value.find((o) => o.value === props.modelValue)
  return found ? found.label : ''
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
  close()
}

function isSelected(opt: Opt) {
  return opt.value === props.modelValue
}

function onDocumentClick(e: MouseEvent) {
  if (!root.value) return
  if (!(e.target instanceof Node)) return
  if (!root.value.contains(e.target)) close()
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
    // clear search when selection changes
    search.value = ''
  },
)
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
</style>
