import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
    // ── Theme ────────────────────────────────────────────────
    const theme = ref(localStorage.getItem('am-theme') || 'system')

    function setTheme(newTheme) {
        theme.value = newTheme
        localStorage.setItem('am-theme', newTheme)

        const root = document.documentElement
        if (newTheme === 'dark') {
            root.setAttribute('data-theme', 'dark')
        } else if (newTheme === 'light') {
            root.setAttribute('data-theme', 'light')
        } else {
            // system
            root.removeAttribute('data-theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) root.setAttribute('data-theme', 'dark')
        }
    }

    // Initialise theme on store creation
    setTheme(theme.value)

    // ── Language ─────────────────────────────────────────────
    const locale = ref(localStorage.getItem('am-locale') || 'en')

    function setLocale(lang) {
        locale.value = lang
        localStorage.setItem('am-locale', lang)
        document.documentElement.lang = lang
    }

    // ── Toasts ───────────────────────────────────────────────
    const toasts = ref([])
    let toastIdCounter = 0

    function addToast({ type = 'info', title = '', message, duration = 4000 }) {
        const id = ++toastIdCounter
        toasts.value.push({ id, type, title, message })
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration)
        }
    }

    function removeToast(id) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    // Convenience helpers
    const toast = {
        success: (message, title = '') => addToast({ type: 'success', title, message }),
        error: (message, title = '') => addToast({ type: 'error', title, message }),
        info: (message, title = '') => addToast({ type: 'info', title, message }),
        warning: (message, title = '') => addToast({ type: 'warning', title, message })
    }

    // ── Global Loading ────────────────────────────────────────
    const globalLoading = ref(false)

    // ── Mobile Nav ────────────────────────────────────────────
    const mobileNavOpen = ref(false)

    function toggleMobileNav() {
        mobileNavOpen.value = !mobileNavOpen.value
    }

    function closeMobileNav() {
        mobileNavOpen.value = false
    }

    // ── Contact Modal ─────────────────────────────────────────
    const contactModalOpen = ref(false)

    function openContactModal() {
        contactModalOpen.value = true
    }

    function closeContactModal() {
        contactModalOpen.value = false
    }

    // ── Active language flag helper ───────────────────────────
    const languageFlags = {
        pl: '🇵🇱',
        en: '🇬🇧',
        lt: '🇱🇹',
        ru: '🇷🇺',
        de: '🇩🇪'
    }

    const languageNames = {
        pl: 'Polski',
        en: 'English',
        lt: 'Lietuvių',
        ru: 'Русский',
        de: 'Deutsch'
    }

    const currentFlag = computed(() => languageFlags[locale.value] || '🌐')
    const currentLangName = computed(() => languageNames[locale.value] || locale.value)

    return {
        theme, setTheme,
        locale, setLocale,
        toasts, addToast, removeToast, toast,
        globalLoading,
        mobileNavOpen, toggleMobileNav, closeMobileNav,
        contactModalOpen, openContactModal, closeContactModal,
        languageFlags, languageNames, currentFlag, currentLangName
    }
})
