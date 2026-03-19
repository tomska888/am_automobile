<template>
  <nav class="pagination-am" v-if="totalPages > 1" :aria-label="$t('common.page')">
    <!-- Prev -->
    <button
      class="page-btn"
      :disabled="currentPage <= 1"
      @click="$emit('page', currentPage - 1)"
      :aria-label="$t('common.previous')"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <!-- First page if not in range -->
    <template v-if="pages[0] > 1">
      <button class="page-btn" @click="$emit('page', 1)">1</button>
      <span class="page-btn" style="cursor: default; opacity: 0.4;">…</span>
    </template>

    <!-- Page numbers -->
    <button
      v-for="p in pages"
      :key="p"
      class="page-btn"
      :class="{ active: p === currentPage }"
      @click="$emit('page', p)"
      :aria-current="p === currentPage ? 'page' : undefined"
    >
      {{ p }}
    </button>

    <!-- Last page if not in range -->
    <template v-if="pages[pages.length - 1] < totalPages">
      <span class="page-btn" style="cursor: default; opacity: 0.4;">…</span>
      <button class="page-btn" @click="$emit('page', totalPages)">{{ totalPages }}</button>
    </template>

    <!-- Next -->
    <button
      class="page-btn"
      :disabled="currentPage >= totalPages"
      @click="$emit('page', currentPage + 1)"
      :aria-label="$t('common.next')"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true }
})

defineEmits(['page'])

const pages = computed(() => {
  const range = []
  const delta = 2
  const left  = Math.max(1, props.currentPage - delta)
  const right = Math.min(props.totalPages, props.currentPage + delta)
  for (let i = left; i <= right; i++) range.push(i)
  return range
})
</script>
