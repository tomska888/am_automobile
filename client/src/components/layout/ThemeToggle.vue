<template>
  <div class="theme-toggle" role="radiogroup" :aria-label="$t('theme.system')">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="theme-toggle-option"
      :class="{ active: uiStore.theme === opt.value }"
      :data-theme="opt.value"
      role="radio"
      :aria-checked="uiStore.theme === opt.value"
      @click="uiStore.setTheme(opt.value)"
      :title="$t(`theme.${opt.value}`)"
    >
      <span aria-hidden="true">{{ opt.icon }}</span>
    </button>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.js'

const uiStore = useUiStore()

const options = [
  { value: 'light',  icon: '☀️' },
  { value: 'system', icon: '💻' },
  { value: 'dark',   icon: '🌙' }
]
</script>
