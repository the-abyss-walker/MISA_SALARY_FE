<template>
  <div class="ms-toast" :class="typeClass">
    <div class="toast-icon">
      <MSIcon :name="iconName" />
    </div>
    <div class="toast-message">
      <span>{{ message }}</span>
    </div>
    <div class="exit-icon" @click.stop="$emit('close')">
      <MSIcon name="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'

const props = defineProps({
  type: {
    type: String as () => 'information' | 'warning' | 'success' | 'failed',
    default: 'information',
  },
  message: {
    type: String,
    default: '',
  },
})

const typeClass = computed(() => {
  return props.type || 'information'
})

const iconName = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'information'
    case 'success':
      return 'success'
    case 'failed':
      return 'failed'
    case 'information':
    default:
      return 'information'
  }
})
</script>

<style scoped>
.ms-toast {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: fit-content;
  display: flex;
  align-items: center;
  padding-right: 8px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: #fff;
  z-index: 9999;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* Color variables per type */
.ms-toast.information {
  --toast-color: #34b057;
}
.ms-toast.success {
  --toast-color: #34b057;
}
.ms-toast.warning {
  --toast-color: #ffdd00;
}
.ms-toast.failed {
  --toast-color: #e83950;
}

.ms-toast {
  border-color: var(--toast-color);
}

.toast-icon {
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--toast-color);
  box-sizing: border-box;
}
.toast-message {
  padding-inline: 12px;
  display: flex;
  align-items: center;
  flex: 1;
}

.exit-icon {
  display: flex;
  align-items: end;
  cursor: pointer;
}
</style>
