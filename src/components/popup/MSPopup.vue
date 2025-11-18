<template>
  <div v-if="visible" class="ms-popup__overlay" @click.self="onClose">
    <div class="ms-popup__panel" role="dialog" aria-modal="true">
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
  }>(),
  {
    title: '',
    visible: false,
    content: null,
    buttons: () => [] as ButtonDef[],
  },
)

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'close'): void
  (e: 'action', payload: { button?: ButtonDef; index: number }): void
}>()

const { visible, title, content, buttons } = toRefs(props)

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
  padding-top: 70px;
  z-index: 9999;
}
.ms-popup__panel {
  background: #ffffff;
  border-radius: 8px;
  width: 500px;
  max-width: calc(100% - 32px);
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
  border-bottom: 1px solid #eef2f6;
}
.ms-popup__title {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  color: #212121;
}
.ms-popup__close {
  background: transparent;
  border: none;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ms-popup__body {
  padding: 20px;
  min-height: 48px;
  height: 69px;
}
.ms-popup__body-text {
  display: inline-block;
  color: #374151;
}
.ms-popup__footer {
  padding: 12px 20px;
  border-top: 1px solid #eef2f6;
  height: 68px;
}
.ms-popup__footer-inner {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
