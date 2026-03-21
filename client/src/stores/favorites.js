import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useFavoritesStore = defineStore('favorites', () => {
  // ── State ────────────────────────────────────────────────
  const favoriteIds = ref(new Set())
  const favoriteCars = ref([])
  const loading = ref(false)
  const toggleLoading = ref(new Set()) // tracks per-car loading

  // ── Getters ──────────────────────────────────────────────
  const count = computed(() => favoriteIds.value.size)
  const hasFavorites = computed(() => favoriteIds.value.size > 0)

  function isFavorite(carId) {
    return favoriteIds.value.has(Number(carId))
  }

  function isToggling(carId) {
    return toggleLoading.value.has(Number(carId))
  }

  // ── Actions ──────────────────────────────────────────────

  /** Fetch just IDs (lightweight, called on login/app init) */
  async function fetchFavoriteIds() {
    try {
      const { data } = await axios.get('/api/favorites/ids')
      favoriteIds.value = new Set((data.data || []).map(Number))
    } catch {
      // Silent — user might not be logged in
    }
  }

  /** Fetch full car objects for the profile favorites tab */
  async function fetchFavoriteCars() {
    loading.value = true
    try {
      const { data } = await axios.get('/api/favorites')
      favoriteCars.value = data.data || []
    } catch (err) {
      console.error('Failed to fetch favorite cars:', err)
      favoriteCars.value = []
    } finally {
      loading.value = false
    }
  }

  /** Toggle favorite — optimistic update */
  async function toggleFavorite(carId) {
    const id = Number(carId)
    if (toggleLoading.value.has(id)) return // prevent double-click

    toggleLoading.value = new Set([...toggleLoading.value, id])

    const wasFavorite = favoriteIds.value.has(id)

    // Optimistic update
    const newSet = new Set(favoriteIds.value)
    if (wasFavorite) {
      newSet.delete(id)
      favoriteCars.value = favoriteCars.value.filter(c => c.id !== id)
    } else {
      newSet.add(id)
    }
    favoriteIds.value = newSet

    try {
      if (wasFavorite) {
        await axios.delete(`/api/favorites/${id}`)
      } else {
        await axios.post(`/api/favorites/${id}`)
      }
    } catch (err) {
      // Revert on error
      const revertSet = new Set(favoriteIds.value)
      if (wasFavorite) {
        revertSet.add(id)
      } else {
        revertSet.delete(id)
      }
      favoriteIds.value = revertSet
      console.error('Toggle favorite failed:', err)
    } finally {
      const newToggleSet = new Set(toggleLoading.value)
      newToggleSet.delete(id)
      toggleLoading.value = newToggleSet
    }
  }

  /** Clear all favorites state (on logout) */
  function clearFavorites() {
    favoriteIds.value = new Set()
    favoriteCars.value = []
    toggleLoading.value = new Set()
  }

  return {
    favoriteIds, favoriteCars, loading, count, hasFavorites,
    isFavorite, isToggling,
    fetchFavoriteIds, fetchFavoriteCars, toggleFavorite, clearFavorites
  }
})
