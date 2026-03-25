import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const MAX_CARS = 4
const STORAGE_KEY = 'am_compare_cars'

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

export const useCompareStore = defineStore('compare', () => {
  // ── State (hydrated from sessionStorage on init) ──────────
  const cars = ref(loadFromStorage())

  // ── Persist on every change ───────────────────────────────
  watch(cars, (val) => saveToStorage(val), { deep: true })

  // ── Getters ──────────────────────────────────────────────
  const count = computed(() => cars.value.length)
  const isFull = computed(() => cars.value.length >= MAX_CARS)
  const canCompare = computed(() => cars.value.length >= 2)
  const ids = computed(() => new Set(cars.value.map(c => c.id)))

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

  return {
    cars,
    count,
    isFull,
    canCompare,
    ids,
    MAX_CARS,
    isInCompare,
    addCar,
    removeCar,
    toggleCar,
    clearAll,
  }
})
