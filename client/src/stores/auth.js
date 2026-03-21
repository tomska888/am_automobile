import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useUiStore } from '@/stores/ui.js'
import { useFavoritesStore } from '@/stores/favorites.js'

export const useAuthStore = defineStore('auth', () => {
  // ── State ────────────────────────────────────────────────
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ── Getters ──────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || '')

  /**
   * Apply a user's stored theme + locale preferences to the UI.
   * Called after login and session restore so preferences sync across devices.
   */
  function applyUserPreferences(userData) {
    if (!userData) return
    const uiStore = useUiStore()
    if (userData.theme && ['light', 'dark', 'system'].includes(userData.theme)) {
      uiStore.setTheme(userData.theme)
    }
    if (userData.locale && ['en', 'pl', 'lt', 'ru'].includes(userData.locale)) {
      uiStore.setLocale(userData.locale)
    }
  }

  // ── Actions ──────────────────────────────────────────────
  function setAuth(userData, tokenValue) {
    user.value = userData
    token.value = tokenValue
    localStorage.setItem('am-token', tokenValue)
    localStorage.setItem('am-user', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`
    // Apply saved theme + locale from user profile
    applyUserPreferences(userData)
    // Load favorites after authentication
    try { useFavoritesStore().fetchFavoriteIds() } catch { /* silent */ }
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('am-token')
    localStorage.removeItem('am-user')
    localStorage.removeItem('am_favorites')
    delete axios.defaults.headers.common['Authorization']
    // Clear favorites on logout
    try { useFavoritesStore().clearFavorites() } catch { /* silent */ }
  }

  function restoreSession() {
    const storedToken = localStorage.getItem('am-token')
    const storedUser = localStorage.getItem('am-user')
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        const userData = JSON.parse(storedUser)
        user.value = userData
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        // Apply saved theme + locale from cached user profile
        applyUserPreferences(userData)
        // Restore favorites IDs
        try { useFavoritesStore().fetchFavoriteIds() } catch { /* silent */ }
      } catch {
        clearAuth()
      }
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password) {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password })
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      const resData = err.response?.data
      // express-validator returns { errors: [{msg, path},...] }  (no top-level .message)
      if (resData?.errors?.length) {
        error.value = resData.errors.map(e => e.msg).join(' · ')
      } else {
        error.value = resData?.message || 'Registration failed'
      }
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await axios.post('/api/auth/logout')
    } catch { /* silent */ }
    clearAuth()
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await axios.get('/api/auth/me')
      user.value = data.user
      localStorage.setItem('am-user', JSON.stringify(data.user))
      // Re-apply preferences in case they changed on another device
      applyUserPreferences(data.user)
    } catch {
      clearAuth()
    }
  }

  async function updateProfile({ name, email }) {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.put('/api/auth/me', { name, email })
      user.value = data.user
      localStorage.setItem('am-user', JSON.stringify(data.user))
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Save theme + locale preferences to the user's profile in the database.
   * Called whenever the user changes theme or locale while logged in.
   */
  async function savePreferences({ theme, locale }) {
    if (!token.value) return { success: false }
    try {
      const payload = {}
      if (theme)  payload.theme  = theme
      if (locale) payload.locale = locale
      if (!Object.keys(payload).length) return { success: true }

      const { data } = await axios.put('/api/auth/me', payload)
      user.value = data.user
      localStorage.setItem('am-user', JSON.stringify(data.user))
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  async function changePassword(currentPassword, newPassword) {
    loading.value = true
    error.value = null
    try {
      await axios.post('/api/auth/change-password', { currentPassword, newPassword })
      return { success: true }
    } catch (err) {
      const resData = err.response?.data
      const msg = resData?.errors?.length
        ? resData.errors.map(e => e.msg).join(' · ')
        : resData?.message || 'Password change failed'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  return {
    user, token, loading, error,
    isAuthenticated, isAdmin, userName,
    login, register, logout, restoreSession, fetchMe,
    updateProfile, savePreferences, changePassword
  }
})
