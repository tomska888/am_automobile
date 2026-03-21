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
      @click="setTheme(opt.value)"
      :title="$t(`theme.${opt.value}`)"
    >
      <i :class="opt.icon" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.js'
import { useAuthStore } from '@/stores/auth.js'

const uiStore = useUiStore()
const authStore = useAuthStore()

const options = [
  { value: 'light',  icon: 'fa-solid fa-sun' },
  { value: 'system', icon: 'fa-solid fa-display' },
  { value: 'dark',   icon: 'fa-solid fa-moon' }
]

function setTheme(value) {
  uiStore.setTheme(value)
  if (authStore.isAuthenticated) {
    authStore.savePreferences({ theme: value })
  }
}
</script>
