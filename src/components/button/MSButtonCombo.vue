<template>
  <div class="msbtn-combo" role="group">
    <button
      type="button"
      :class="['msbtn', `msbtn--${variant}`]"
      :style="mainStyle"
      @click="$emit('main-click')"
      :disabled="disabled"
    >
      <span v-if="icon" class="msbtn__icon">
        <MSIcon :name="icon" />
      </span>
      <span class="msbtn__content"><slot /></span>
    </button>

    <button
      type="button"
      :class="['msbtn', `msbtn--${comboVariant}`, 'msbtn--dropdown']"
      :style="dropdownStyle"
      @click="$emit('dropdown-click')"
      :disabled="disabled"
    >
      <span class="msbtn__icon"><MSIcon :name="dropdownIcon" /></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    comboVariant?: 'primary' | 'secondary'
    icon?: string
    dropdownIcon?: string
    disabled?: boolean
    height?: number
    dropdownWidth?: number
  }>(),
  {
    variant: 'primary',
    comboVariant: undefined,
    icon: undefined,
    dropdownIcon: 'dropdown',
    disabled: false,
    height: 36,
    dropdownWidth: 40,
  },
)

const variant = computed(() => props.variant || 'primary')
const comboVariant = computed(() => props.comboVariant ?? props.variant)
const dropdownIcon = computed(() => props.dropdownIcon || 'dropdown')

const mainStyle = computed(() => ({
  height: `${props.height}px`,
  borderRadius: '4px 0 0 4px',
  paddingLeft: props.icon ? '12px' : '16px',
  paddingRight: '16px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}))

const dropdownStyle = computed(() => ({
  height: `${props.height}px`,
  width: `${props.dropdownWidth}px`,
  borderRadius: '0 4px 4px 0',
  padding: '0',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}))
</script>

<style scoped>
.msbtn-combo {
  display: inline-flex;
  align-items: center;
  position: relative;
}

.msbtn-combo ::v-deep(.msbtn) {
  border-radius: 0;
  border: none !important;
}

.msbtn-combo ::v-deep(.msbtn--dropdown) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.msbtn-combo::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  width: 1px;
  right: var(--dropdown-width, 40px);
  background: #ffffff;
  border-radius: 1px;
  pointer-events: none;
}

.msbtn__icon {
  box-sizing: content-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.msbtn__content {
  padding-top: 0;
  display: inline-flex;
  align-items: center;
}

/* copy of base msbtn styles so combo buttons look the same */
.msbtn {
  box-sizing: border-box;
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
  border-color: white;
}
.msbtn--secondary:hover:not(.msbtn--disabled) {
  color: #02b936;
  border-color: #02b936;
  --ms-icon-color: #02b936;
}
.msbtn--secondary:active:not(.msbtn--disabled) {
  border-color: #198f3b;
  --ms-icon-color: #ffffff;
}
.msbtn--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
