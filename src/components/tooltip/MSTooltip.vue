<template>
  <DxTooltip
    :target="target"
    :showEvent="showEvent"
    :hideEvent="hideEvent"
    :position="position"
    :visible="visible"
    :container="container"
    :closeOnOutsideClick="closeOnOutsideClick"
    :animation="animation"
    class="custom-tooltip"
  >
    <template #content>
      <div class="px-2 py-1 text-white bg-black rounded">
        {{ content }}
      </div>
    </template>
  </DxTooltip>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { DxTooltip } from 'devextreme-vue/tooltip'

const props = defineProps({
  target: { type: [String, HTMLElement], required: true },
  content: { type: String, required: true },
  showEvent: { type: String, default: 'mouseenter' },
  hideEvent: { type: String, default: 'mouseleave' },
  position: {
    type: Object,
    default: () => ({
      my: 'top center',
      at: 'bottom center',
    }),
  },
  visible: { type: Boolean, default: true },
  container: { type: String, default: 'body' },
  closeOnOutsideClick: { type: Boolean, default: true },
  animation: {
    type: Object,
    default: () => ({
      show: { type: 'fade', duration: 200 },
      hide: { type: 'fade', duration: 200 },
    }),
  },
})
</script>

<style scoped>
.custom-tooltip {
  z-index: 9999;
}
</style>
