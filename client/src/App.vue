<template>
  <div class="page-wrapper">
    <!-- Global Toast Notifications -->
    <Teleport to="body">
      <div class="toast-container-am" aria-live="polite" aria-atomic="true">
        <TransitionGroup name="toast">
          <div
            v-for="toast in uiStore.toasts"
            :key="toast.id"
            class="toast-am"
            :class="toast.type"
            role="alert"
          >
            <i :class="toastIcon(toast.type)" style="flex-shrink:0; margin-top:2px;"></i>
            <div style="flex:1; min-width:0;">
              <div v-if="toast.title" style="font-weight:600; font-size:0.875rem; margin-bottom:2px;">{{ toast.title }}</div>
              <div style="font-size:0.875rem;">{{ toast.message }}</div>
            </div>
            <button
              class="toast-close-btn"
              @click="uiStore.removeToast(toast.id)"
              aria-label="Close"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <!-- Router View with page transitions -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.js'
import { useAuthStore } from '@/stores/auth.js'
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const uiStore = useUiStore()
const authStore = useAuthStore()
const { locale } = useI18n()

// Keep vue-i18n locale in sync with uiStore.locale (single source of truth).
// This fires when applyUserPreferences() updates uiStore via setLocale(),
// as well as when the user manually switches language.
watch(
  () => uiStore.locale,
  (lang) => { locale.value = lang },
  { immediate: true }
)

onMounted(() => {
  // Restore auth session on app load
  authStore.restoreSession()
})

function toastIcon(type) {
  const icons = {
    success: 'fa-solid fa-circle-check text-success',
    error:   'fa-solid fa-circle-xmark text-danger',
    warning: 'fa-solid fa-triangle-exclamation text-warning',
    info:    'fa-solid fa-circle-info text-accent'
  }
  return icons[type] || icons.info
}
</script>

<style>
/* Toast transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Toast close button */
.toast-close-btn {
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  font-size: 0.875rem;
  line-height: 1;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  margin-left: auto;
}
.toast-close-btn:hover { opacity: 1; }
</style>
