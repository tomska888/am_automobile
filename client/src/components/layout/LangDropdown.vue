<template>
  <div class="lang-dd" ref="containerRef">
    <button
      class="lang-dd-btn"
      type="button"
      @click="open = !open"
      :aria-expanded="open"
      aria-haspopup="true"
      aria-label="Select language"
    >
      <span class="lang-dd-flag">{{ uiStore.currentFlag }}</span>
      <span class="lang-dd-code">{{ locale.toUpperCase() }}</span>
      <i class="fa-solid fa-chevron-down lang-dd-chevron" :class="{ 'open': open }"></i>
    </button>

    <Transition name="lang-menu">
      <ul v-if="open" class="lang-dd-menu" role="listbox" :aria-label="'Language options'">
        <li v-for="lang in languages" :key="lang.code">
          <button
            class="lang-dd-item"
            :class="{ active: locale === lang.code }"
            role="option"
            :aria-selected="locale === lang.code"
            @click="switchLang(lang.code)"
          >
            <span class="lang-dd-item-flag">{{ lang.flag }}</span>
            <span class="lang-dd-item-name">{{ lang.name }}</span>
            <i v-if="locale === lang.code" class="fa-solid fa-check lang-dd-check"></i>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui.js'

const { locale } = useI18n()
const uiStore = useUiStore()

const open = ref(false)
const containerRef = ref(null)

const languages = [
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'lt', flag: '🇱🇹', name: 'Lietuvių' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }
]

function switchLang(code) {
  locale.value = code
  uiStore.setLocale(code)
  open.value = false
}

function handleOutsideClick(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick, true))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick, true))
</script>

<style scoped>
/* ── CONTAINER ──────────────────────────────────────── */
.lang-dd {
  position: relative;
}

/* ── TRIGGER BUTTON ─────────────────────────────────── */
.lang-dd-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 6px 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}
.lang-dd-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.lang-dd-flag {
  font-size: 1rem;
  line-height: 1;
}

.lang-dd-code {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.lang-dd-chevron {
  font-size: 0.625rem;
  opacity: 0.7;
  transition: transform 0.2s ease;
}
.lang-dd-chevron.open {
  transform: rotate(180deg);
}

/* ── DROPDOWN MENU ──────────────────────────────────── */
.lang-dd-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 150px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.375rem;
  list-style: none;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 200;
}

/* ── MENU ITEMS ─────────────────────────────────────── */
.lang-dd-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background: none;
  border: none;
  border-radius: 7px;
  padding: 0.5rem 0.625rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: background 0.15s ease;
  text-align: left;
}
.lang-dd-item:hover {
  background: var(--bg-secondary);
}
.lang-dd-item.active {
  color: var(--accent);
  font-weight: 600;
}

.lang-dd-item-flag {
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
}

.lang-dd-item-name {
  flex: 1;
}

.lang-dd-check {
  color: var(--accent);
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* ── TRANSITION ─────────────────────────────────────── */
.lang-menu-enter-active,
.lang-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lang-menu-enter-from,
.lang-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
