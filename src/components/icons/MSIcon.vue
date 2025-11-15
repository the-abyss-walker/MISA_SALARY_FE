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
      color: color || 'currentColor',
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
  color: 'white',
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
  dropdown: '-186px -781px',
  sidebar_zoom: '-162px -779px',
  search: '0 0',
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
  dropdown: { width: 7.4625, height: 12 },
  sidebar_zoom: { width: 16, height: 16 },
  search: { width: 20, height: 20 },
}

const iconSize = computed(() => sizeMap[props.name] || { width: 20, height: 20 })
</script>

<style scoped>
span {
  display: inline-block;
}
</style>
