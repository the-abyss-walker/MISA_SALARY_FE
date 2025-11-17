<template>
  <span
    class="inline-block bg-current"
    :style="{
      width: `${iconSize.width}px`,
      height: `${iconSize.height}px`,
      maskImage: `url(${iconUrl})`,
      maskRepeat: 'no-repeat',
      maskSize: 'auto',
      maskPosition: positionMap[name] || '0 0',
      WebkitMaskImage: `url(${iconUrl})`,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: 'auto',
      WebkitMaskPosition: positionMap[name] || '0 0',
      /* color uses a CSS variable fallback so parent can override --ms-icon-color */
      color: `var(--ms-icon-color, ${defaultColor})`,
    }"
  ></span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import iconUrl from '@/assets/icons/ICON.svg'

interface Props {
  name: string
  color?: string
}
const props = withDefaults(defineProps<Props>(), {
  color: undefined,
})

const positionMap: Record<string, string> = {
  dashboard: '0 -778px',
  salary_composition: '-120px -778px',
  salary_template: '-100px -778px',
  salary_data: '-20px -778px',
  salary_table: '-40px -778px',
  payment: '-60px -778px',
  report: '-80px -778px',
  settings: '-140px -778px',
  sidebar_zoom: '-162px -779px',
  search: '0 0',
  rule: '-260px -100px',
  plus: '-220px 0',
  dropdown: '-100px 0',
  filter: '-20px 0',
  setting: '-48px -120px',
  arrow_left: '-180px 0',
  check: '-120px -60px',
  chevron_left: '-160px 0',
  chevron_right: '-140px 0',
  minus_circle: '-200px -40px',
  copy: '-80px 0',
  pencil: '-60px 0',
  trash: '-120px -20px',
}

const sizeMap: Record<string, { width: number; height: number }> = {
  dashboard: { width: 20, height: 18 },
  salary_composition: { width: 20, height: 18 },
  salary_template: { width: 20, height: 18 },
  salary_data: { width: 20, height: 18 },
  salary_table: { width: 20, height: 18 },
  payment: { width: 20, height: 18 },
  report: { width: 20, height: 18 },
  settings: { width: 20, height: 18 },
  sidebar_zoom: { width: 16, height: 16 },
  search: { width: 20, height: 20 },
  rule: { width: 20, height: 20 },
  plus: { width: 20, height: 20 },
  dropdown: { width: 20, height: 20 },
  filter: { width: 20, height: 20 },
  setting: { width: 24, height: 24 },
  arrow_left: { width: 20, height: 20 },
  check: { width: 20, height: 20 },
  chevron_left: { width: 20, height: 20 },
  chevron_right: { width: 20, height: 20 },
  minus_circle: { width: 20, height: 20 },
  copy: { width: 20, height: 20 },
  pencil: { width: 20, height: 20 },
  trash: { width: 20, height: 20 },
}

const iconSize = computed(() => sizeMap[props.name] || { width: 20, height: 20 })

// default color per icon (you can expand this map)
const colorMap: Record<string, string> = {
  dashboard: '#6E737A',
  salary_composition: '#6E737A',
  salary_template: '#6E737A',
  salary_data: '#6E737A',
  salary_table: '#6E737A',
  payment: '#6E737A',
  report: '#6E737A',
  settings: '#6E737A',
  sidebar_zoom: '#FFFFFF',
  search: '#6E737A',
  rule: '#6E737A',
  plus: '#FFFFFF',
  dropdown: '#FFFFFF',
  filter: '#6E737A',
  setting: '#6E737A',
  arrow_left: '#6E737A',
  check: '#34b057',
  chevron_left: '#6E737A',
  chevron_right: '#6E737A',
  minus_circle: '#f90',
  copy: '#6E737A',
  pencil: '#6E737A',
  trash: '#FF6161',
}

const defaultColor = computed(() => props.color ?? colorMap[props.name] ?? 'currentColor')
</script>

<style scoped>
span {
  display: inline-block;
}
</style>
