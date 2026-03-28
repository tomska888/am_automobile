import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const MAX_CARS = 4
const STORAGE_KEY = 'am_compare_cars'
const SAVED_KEY = 'am_saved_comparisons'

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(cars) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
  } catch {
    // ignore quota errors
  }
}

function loadSavedComparisons() {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistSavedComparisons(list) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list))
  } catch {
    // ignore quota errors
  }
}

export const useCompareStore = defineStore('compare', () => {
  // ── State (hydrated from sessionStorage on init) ──────────
  const cars = ref(loadFromStorage())

  // ── Saved comparisons (persisted to localStorage) ─────────
  const savedComparisons = ref(loadSavedComparisons())

  // ── Persist active compare list on every change ───────────
  watch(cars, (val) => saveToStorage(val), { deep: true })

  // ── Persist saved comparisons on every change ─────────────
  watch(savedComparisons, (val) => persistSavedComparisons(val), { deep: true })

  // ── Getters ──────────────────────────────────────────────
  const count = computed(() => cars.value.length)
  const isFull = computed(() => cars.value.length >= MAX_CARS)
  const canCompare = computed(() => cars.value.length >= 2)
  const ids = computed(() => new Set(cars.value.map(c => c.id)))
  const savedCount = computed(() => savedComparisons.value.length)

  function isInCompare(carId) {
    return ids.value.has(Number(carId))
  }

  // ── Actions ──────────────────────────────────────────────

  function addCar(car) {
    if (isInCompare(car.id) || isFull.value) return
    cars.value = [...cars.value, car]
  }

  function removeCar(carId) {
    cars.value = cars.value.filter(c => c.id !== Number(carId))
  }

  function toggleCar(car) {
    if (isInCompare(car.id)) {
      removeCar(car.id)
    } else {
      addCar(car)
    }
  }

  function clearAll() {
    cars.value = []
  }

  // ── Saved Comparisons ─────────────────────────────────────

  /**
   * Save the current active comparison.
   * Returns { success, id } or { success: false, reason }
   */
  function saveComparison(label) {
    if (cars.value.length < 2) {
      return { success: false, reason: 'need_two' }
    }
    const entry = {
      id: Date.now(),
      label: label || generateLabel(cars.value),
      savedAt: new Date().toISOString(),
      cars: JSON.parse(JSON.stringify(cars.value)), // deep copy snapshot
    }
    savedComparisons.value = [entry, ...savedComparisons.value]
    return { success: true, id: entry.id }
  }

  /**
   * Remove a previously saved comparison by its id.
   */
  function deleteSavedComparison(id) {
    savedComparisons.value = savedComparisons.value.filter(s => s.id !== id)
  }

  /**
   * Load a saved comparison into the active compare list.
   */
  function loadSavedComparison(savedEntry) {
    cars.value = JSON.parse(JSON.stringify(savedEntry.cars))
  }

  /**
   * Clear all saved comparisons (e.g. on logout).
   */
  function clearSavedComparisons() {
    savedComparisons.value = []
    localStorage.removeItem(SAVED_KEY)
  }

  function generateLabel(carList) {
    return carList.map(c => `${c.make} ${c.model}`).join(' vs ')
  }

  return {
    cars,
    savedComparisons,
    count,
    isFull,
    canCompare,
    ids,
    savedCount,
    MAX_CARS,
    isInCompare,
    addCar,
    removeCar,
    toggleCar,
    clearAll,
    saveComparison,
    deleteSavedComparison,
    loadSavedComparison,
    clearSavedComparisons,
  }
})
