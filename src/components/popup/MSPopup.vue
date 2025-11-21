<template>
  <div v-if="visible" class="ms-popup__overlay" @click.self="onClose">
    <div
      class="ms-popup__panel"
      role="dialog"
      aria-modal="true"
      :style="{ width: width ? width : '500px' }"
    >
      <header class="ms-popup__header">
        <div class="ms-popup__title">
          <h2>
            <span>{{ title }}</span>
          </h2>
        </div>

        <div>
          <button class="ms-popup__close" @click="onClose" aria-label="Close">
            <MSIcon name="close" />
          </button>
        </div>
      </header>

      <section class="ms-popup__body">
        <span class="ms-popup__body-text" v-if="content">{{ content }}</span>
        <slot v-else />
      </section>

      <footer class="ms-popup__footer">
        <div class="ms-popup__footer-inner">
          <template v-for="(btn, idx) in buttons" :key="btn.id ?? idx">
            <MSButton
              :variant="btn.variant ?? 'secondary'"
              :icon="btn.icon"
              :disabled="btn.disabled"
              @click="onButtonClick(btn, idx)"
            >
              {{ btn.label }}
            </MSButton>
          </template>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import MSIcon from '@/components/icons/MSIcon.vue'
import MSButton from '@/components/button/MSButton.vue'

type ButtonDef = {
  id?: string | number
  label: string
  variant?: 'primary' | 'secondary' | 'icon'
  icon?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    title?: string
    visible?: boolean
    content?: string | null
    buttons?: ButtonDef[]
    width?: string
  }>(),
  {
    title: '',
    visible: false,
    content: null,
    buttons: () => [] as ButtonDef[],
  },
)

const { visible, title, content, buttons, width } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'action', payload: { button: ButtonDef; index: number }): void
  (e: 'close'): void
}>()

function onClose() {
  emit('update:visible', false)
  emit('close')
}

function onButtonClick(btn: ButtonDef, idx: number) {
  emit('action', { button: btn, index: idx })
}
</script>

<style scoped>
.ms-popup__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 75px;
  z-index: 9999;
}
.ms-popup__panel {
  background: #ffffff;
  border-radius: 8px;
  width: 500px;
  max-width: calc(100vw - 340px);
  max-height: calc(100vh - 100px);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ms-popup__header {
  display: flex;
  height: 53px;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0px 24px;
}
.ms-popup__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #212121;
}
.ms-popup__close {
  background: transparent;
  border: none;
  padding: 6px 0px 6px 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ms-popup__body {
  padding: 24px;
  min-height: 48px;
  flex: 1;
  overflow-y: auto;
}
.ms-popup__body-text {
  display: inline-block;
  color: #212121;
}
.ms-popup__footer {
  padding: 16px 24px;
  height: 68px;
  background-color: #f2f2f2;
}
.ms-popup__footer-inner {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
