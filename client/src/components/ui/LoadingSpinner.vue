<template>
  <div class="loading-state" :class="{ overlay: overlay }">
    <div class="spinner-am" :class="size === 'sm' ? 'spinner-sm' : ''"></div>
    <p v-if="label" class="loading-label">{{ label || $t('common.loading') }}</p>
  </div>
</template>

<script setup>
defineProps({
  size:    { type: String, default: 'md' },
  label:   { type: String, default: '' },
  overlay: { type: Boolean, default: false }
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
}

.loading-state.overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: var(--z-overlay);
  padding: 0;
}

.loading-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}
</style>
