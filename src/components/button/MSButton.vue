<template>
  <MSButtonCombo
    v-if="props.variant === 'combo'"
    :variant="props.variant === 'combo' ? 'primary' : props.variant"
    :combo-variant="props.comboVariant"
    :icon="props.icon"
    :dropdown-icon="props.dropdownIcon"
    :disabled="props.disabled"
    :height="props.height"
    @main-click="$emit('click')"
    @dropdown-click="$emit('dropdown')"
  >
    <slot />
  </MSButtonCombo>

  <button
    v-else
    :type="type"
    :class="['msbtn', variantClass, { 'msbtn--disabled': disabled }]"
    :style="btnStyle"
    :disabled="disabled"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span v-if="icon" class="msbtn__icon" :style="iconWrapperStyle">
      <MSIcon :name="icon" />
    </span>

    <span v-if="props.variant !== 'icon'" class="msbtn__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import MSButtonCombo from './MSButtonCombo.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'combo' | 'icon'
    comboVariant?: 'primary' | 'secondary'
    icon?: string
    dropdownIcon?: string
    dropdownWidth?: number
    disabled?: boolean
    iconColor?: string
    iconColorHover?: string
    type?: 'button' | 'submit' | 'reset'
    height?: number
    width?: number | null
  }>(),
  {
    variant: 'primary',
    comboVariant: undefined,
    icon: undefined,
    dropdownIcon: undefined,
    dropdownWidth: 40,
    disabled: false,
    iconColor: undefined,
    iconColorHover: undefined,
    type: 'button',
    height: 36,
    width: null,
  },
)

const variantClass = computed(() => {
  if (props.variant === 'icon') return 'msbtn--icon'
  return props.variant === 'primary' ? 'msbtn--primary' : 'msbtn--secondary'
})

const btnStyle = computed(() => {
  const s: Record<string, string | number> = {
    height: `${props.height}px`,
    borderRadius: '4px',
    paddingLeft: props.icon ? '12px' : '16px',
    paddingRight: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: '36px',
  }

  if (props.variant === 'primary') {
    s.minWidth = '80px'
    s.justifyContent = 'center'
  }

  if (props.width) s.width = `${props.width}px`
  // if width is small (icon-only dropdown e.g. 40px) center content and remove paddings
  if (props.width && typeof props.width === 'number' && props.width <= 40) {
    s.paddingLeft = '0px'
    s.paddingRight = '0px'
    s.justifyContent = 'center'
    s.gap = '0px'
    s.minWidth = `${props.width}px`
  }
  // icon-only variant: fixed 36x36 with specific padding (top/bottom 6px, left/right 5px)
  if (props.variant === 'icon') {
    s.height = '36px'
    s.width = '36px'
    s.paddingTop = '6px'
    s.paddingBottom = '6px'
    s.paddingLeft = '5px'
    s.paddingRight = '5px'
    s.justifyContent = 'center'
    s.gap = '0px'
    s.minWidth = '36px'
  }
  return s
})

// icon wrapper padding rules: padding-left 12px (handled above on button), but internal wrapper uses right padding 4px
const isHovered = ref(false)

const iconWrapperStyle = computed(() => {
  const base: Record<string, string | number> = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  // Do not force a fixed width/height here so MSIcon can apply its own size (e.g. 24x24)
  // Keep the wrapper centered; spacing is handled by button padding.
  // if user provided explicit colors for icon, set CSS variable so MSIcon picks it up
  if (props.iconColor) base['--ms-icon-color'] = props.iconColor
  if (isHovered.value && props.iconColorHover) base['--ms-icon-color'] = props.iconColorHover
  return base
})
</script>

<style scoped>
.msbtn {
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  border-width: 1px;
  color: #212121;
  border-style: solid;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    transform 80ms ease,
    color 120ms ease;
}

.msbtn--primary {
  background: #34b057;
  color: #ffffff;
  border-color: transparent;
  --ms-icon-color: #ffffff;
}
.msbtn--primary:hover:not(.msbtn--disabled) {
  background: #02b936;
  --ms-icon-color: #ffffff;
}
.msbtn--primary:active:not(.msbtn--disabled) {
  background: #198f3b;
}
.msbtn--secondary {
  background: #ffffff;
  color: #212121;
  border-color: white; /* gray-300 */
}
.msbtn--secondary:hover:not(.msbtn--disabled) {
  color: #02b936;
  border-color: #02b936;
  --ms-icon-color: #02b936;
}
.msbtn--secondary:active:not(.msbtn--disabled) {
  border-color: #198f3b;
  color: #198f3b;
  --ms-icon-color: #198f3b;
}

.msbtn--icon {
  background: #ffffff;
  color: #212121;
  border-color: #d1d5db;
}
.msbtn--icon:hover:not(.msbtn--disabled) {
  color: #02b936;
  border-color: #02b936;
  --ms-icon-color: #02b936;
}
.msbtn--icon:active:not(.msbtn--disabled) {
  border-color: #198f3b;
  color: #198f3b;
  --ms-icon-color: #198f3b;
}

.msbtn--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.msbtn__icon {
  box-sizing: content-box;
}

.msbtn__icon :deep(span) {
  transition: color 120ms ease;
}

.msbtn__content {
  padding-top: 2px;
}
</style>
