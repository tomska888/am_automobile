<template>
  <div class="adm-page">
    <!-- Header -->
    <div class="adm-page-header">
      <div>
        <h1 class="adm-title">{{ $t('admin.cars.title') }}</h1>
        <p class="adm-subtitle">
          {{ $t('inventory.results', { count: carsStore.cars.length }) }}
          <template v-if="activeCount > 0">
            &nbsp;·&nbsp;
            <span class="adm-filtered-note">{{ $t('inventory.results', { count: filteredCars.length }) }} {{ $t('admin.cars.filters.showing') }}</span>
          </template>
        </p>
      </div>
      <button class="btn-am btn-am-primary" @click="openModal()">
        <i class="fa-solid fa-plus"></i>
        {{ $t('admin.cars.add') }}
      </button>
    </div>

    <!-- Filter Panel -->
    <div class="adm-filter-panel">
      <!-- Row 1: Search + Sort -->
      <div class="adm-filter-row adm-filter-row-top">
        <!-- Search -->
        <div class="adm-filter-field adm-field-search">
          <label class="adm-filter-label">
            <i class="fa-solid fa-magnifying-glass"></i>
            {{ $t('common.search') }}
          </label>
          <div class="adm-input-wrap">
            <input
              type="search"
              class="adm-input"
              :placeholder="`${$t('car.make')}, ${$t('car.model')}, VIN…`"
              v-model="search"
            />
            <button v-if="search" class="adm-input-clear" @click="search = ''" tabindex="-1">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div class="adm-filter-field adm-field-sort">
          <label class="adm-filter-label">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
            {{ $t('inventory.sort.label') }}
          </label>
          <div class="adm-select-wrap">
            <select class="adm-select" v-model="sortKey">
              <option value="id_desc">{{ $t('admin.cars.filters.sortNewest') }}</option>
              <option value="id_asc">{{ $t('admin.cars.filters.sortOldest') }}</option>
              <option value="price_asc">{{ $t('inventory.sort.priceAsc') }}</option>
              <option value="price_desc">{{ $t('inventory.sort.priceDesc') }}</option>
              <option value="year_desc">{{ $t('inventory.sort.yearDesc') }}</option>
              <option value="year_asc">{{ $t('inventory.sort.yearAsc') }}</option>
              <option value="make_asc">{{ $t('admin.cars.filters.sortMakeAZ') }}</option>
            </select>
            <i class="fa-solid fa-chevron-down adm-select-arrow"></i>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="adm-filter-divider"></div>

      <!-- Row 2: Dropdowns + Year range -->
      <div class="adm-filter-row adm-filter-row-dropdowns">

        <!-- Status -->
        <div class="adm-filter-field">
          <label class="adm-filter-label">
            <i class="fa-solid fa-circle-dot"></i>
            {{ $t('car.statusLabel') }}
          </label>
          <div class="adm-select-wrap" :class="{ 'is-active': filterStatus }">
            <select class="adm-select" v-model="filterStatus">
              <option value="">{{ $t('admin.cars.filters.allStatuses') }}</option>
              <option value="available">{{ $t('car.status.available') }}</option>
              <option value="reserved">{{ $t('car.status.reserved') }}</option>
              <option value="sold">{{ $t('car.status.sold') }}</option>
              <option value="archived">{{ $t('car.status.archived') }}</option>
            </select>
            <i class="fa-solid fa-chevron-down adm-select-arrow"></i>
          </div>
        </div>

        <!-- Fuel Type -->
        <div class="adm-filter-field">
          <label class="adm-filter-label">
            <i class="fa-solid fa-gas-pump"></i>
            {{ $t('car.fuelType') }}
          </label>
          <div class="adm-select-wrap" :class="{ 'is-active': filterFuel }">
            <select class="adm-select" v-model="filterFuel">
              <option value="">{{ $t('admin.cars.filters.allFuels') }}</option>
              <option value="petrol">{{ $t('car.fuel.petrol') }}</option>
              <option value="diesel">{{ $t('car.fuel.diesel') }}</option>
              <option value="electric">{{ $t('car.fuel.electric') }}</option>
              <option value="hybrid">{{ $t('car.fuel.hybrid') }}</option>
              <option value="lpg">{{ $t('car.fuel.lpg') }}</option>
            </select>
            <i class="fa-solid fa-chevron-down adm-select-arrow"></i>
          </div>
        </div>

        <!-- Body Type -->
        <div class="adm-filter-field">
          <label class="adm-filter-label">
            <i class="fa-solid fa-car-side"></i>
            {{ $t('car.bodyType') }}
          </label>
          <div class="adm-select-wrap" :class="{ 'is-active': filterBody }">
            <select class="adm-select" v-model="filterBody">
              <option value="">{{ $t('admin.cars.filters.allBodies') }}</option>
              <option value="sedan">{{ $t('car.body.sedan') }}</option>
              <option value="hatchback">{{ $t('car.body.hatchback') }}</option>
              <option value="suv">{{ $t('car.body.suv') }}</option>
              <option value="coupe">{{ $t('car.body.coupe') }}</option>
              <option value="combi">{{ $t('car.body.combi') }}</option>
              <option value="cabrio">{{ $t('car.body.cabrio') }}</option>
              <option value="van">{{ $t('car.body.van') }}</option>
              <option value="pickup">{{ $t('car.body.pickup') }}</option>
            </select>
            <i class="fa-solid fa-chevron-down adm-select-arrow"></i>
          </div>
        </div>

        <!-- Year Range -->
        <div class="adm-filter-field">
          <label class="adm-filter-label">
            <i class="fa-solid fa-calendar"></i>
            {{ $t('car.year') }}
          </label>
          <div class="adm-range-wrap" :class="{ 'is-active': filterYearMin || filterYearMax }">
            <input
              type="number"
              class="adm-range-input"
              :placeholder="$t('admin.cars.filters.yearFrom')"
              v-model.number="filterYearMin"
              min="1990"
              :max="currentYear"
            />
            <span class="adm-range-sep">–</span>
            <input
              type="number"
              class="adm-range-input"
              :placeholder="$t('admin.cars.filters.yearTo')"
              v-model.number="filterYearMax"
              min="1990"
              :max="currentYear"
            />
          </div>
        </div>

        <!-- Spacer + Reset -->
        <div class="adm-filter-field adm-field-reset">
          <label class="adm-filter-label adm-filter-label-ghost">&nbsp;</label>
          <Transition name="adm-fade">
            <button
              v-if="activeCount > 0"
              class="adm-reset-btn"
              @click="resetFilters"
            >
              <i class="fa-solid fa-filter-circle-xmark"></i>
              {{ $t('admin.cars.filters.reset') }}
              <span class="adm-active-dot">{{ activeCount }}</span>
            </button>
          </Transition>
        </div>

      </div>

      <!-- Active filter chips -->
      <Transition name="adm-fade">
        <div v-if="activeCount > 0" class="adm-chip-row">
          <span class="adm-chip-label">{{ $t('inventory.filters.activeFilters') }}:</span>
          <span v-if="search" class="adm-chip" @click="search = ''">
            <i class="fa-solid fa-magnifying-glass"></i> {{ search }}
            <i class="fa-solid fa-xmark adm-chip-x"></i>
          </span>
          <span v-if="filterStatus" class="adm-chip adm-chip-status" @click="filterStatus = ''">
            <i class="fa-solid fa-circle-dot"></i> {{ $t(`car.status.${filterStatus}`) }}
            <i class="fa-solid fa-xmark adm-chip-x"></i>
          </span>
          <span v-if="filterFuel" class="adm-chip" @click="filterFuel = ''">
            <i class="fa-solid fa-gas-pump"></i> {{ $t(`car.fuel.${filterFuel}`) }}
            <i class="fa-solid fa-xmark adm-chip-x"></i>
          </span>
          <span v-if="filterBody" class="adm-chip" @click="filterBody = ''">
            <i class="fa-solid fa-car-side"></i> {{ $t(`car.body.${filterBody}`) }}
            <i class="fa-solid fa-xmark adm-chip-x"></i>
          </span>
          <span v-if="filterYearMin" class="adm-chip" @click="filterYearMin = ''">
            <i class="fa-solid fa-calendar"></i> ≥ {{ filterYearMin }}
            <i class="fa-solid fa-xmark adm-chip-x"></i>
          </span>
          <span v-if="filterYearMax" class="adm-chip" @click="filterYearMax = ''">
            <i class="fa-solid fa-calendar"></i> ≤ {{ filterYearMax }}
            <i class="fa-solid fa-xmark adm-chip-x"></i>
          </span>
        </div>
      </Transition>
    </div>

    <!-- Table -->
    <LoadingSpinner v-if="loading" />
    <div v-else class="table-am-container">
      <div class="overflow-x-auto">
        <table class="table-am">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $t('car.make') }} / {{ $t('car.model') }}</th>
              <th>{{ $t('car.year') }}</th>
              <th>{{ $t('car.price') }}</th>
              <th>{{ $t('car.fuelType') }}</th>
              <th>{{ $t('car.bodyType') }}</th>
              <th>{{ $t('car.statusLabel') }}</th>
              <th>{{ $t('admin.cars.filters.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCars.length === 0">
              <td colspan="8" class="adm-no-results">
                <i class="fa-solid fa-magnifying-glass"></i>
                {{ $t('inventory.noResults') }}
              </td>
            </tr>
            <tr v-for="car in filteredCars" :key="car.id">
              <td class="adm-id">#{{ car.id }}</td>
              <td class="adm-fw">{{ car.make }} {{ car.model }}</td>
              <td>{{ car.year }}</td>
              <td class="adm-price">{{ formatPrice(car.price) }}</td>
              <td>{{ car.fuel_type ? $t(`car.fuel.${car.fuel_type}`) : '—' }}</td>
              <td>{{ car.body_type ? $t(`car.body.${car.body_type}`) : '—' }}</td>
              <td>
                <span class="car-card-badge adm-status-badge" :class="`badge-${car.status}`">
                  {{ $t(`car.status.${car.status}`) }}
                </span>
              </td>
              <td>
                <div class="adm-actions">
                  <button class="btn-am btn-am-secondary btn-am-sm" @click="openModal(car)">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-am btn-am-danger btn-am-sm" @click="confirmDelete(car)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CarForm v-model="showModal" :car="editingCar" @saved="onCarSaved" />

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <Transition name="adm-modal">
        <div
          v-if="deleteTarget"
          class="adm-modal-backdrop"
          @click.self="deleteTarget = null"
        >
          <div class="adm-modal-box adm-modal-sm">
            <div class="adm-modal-head">
              <h5 class="adm-modal-title adm-modal-title-danger">
                <i class="fa-solid fa-triangle-exclamation"></i>
                {{ $t('common.confirm') }}
              </h5>
              <button class="adm-modal-close" @click="deleteTarget = null">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="adm-modal-body">
              <p style="color: var(--text-secondary); margin: 0 0 0.75rem;">
                {{ $t('admin.cars.deleteConfirm') }}
              </p>
              <p class="adm-fw" style="color: var(--text-primary); margin: 0;">
                {{ deleteTarget?.make }} {{ deleteTarget?.model }} ({{ deleteTarget?.year }})
              </p>
            </div>
            <div class="adm-modal-foot">
              <button class="btn-am btn-am-secondary" @click="deleteTarget = null">
                {{ $t('common.cancel') }}
              </button>
              <button class="btn-am btn-am-danger" @click="handleDelete" :disabled="deleting">
                <span v-if="deleting" class="adm-spinner"></span>
                <i v-else class="fa-solid fa-trash"></i>
                {{ $t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarsStore } from '@/stores/cars.js'
import { useUiStore } from '@/stores/ui.js'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import CarForm from '@/components/admin/CarForm.vue'

const carsStore = useCarsStore()
const uiStore   = useUiStore()

const loading      = ref(true)
const showModal    = ref(false)
const editingCar   = ref(null)
const deleteTarget = ref(null)
const deleting     = ref(false)

// ── Filter state ───────────────────────────────────────────
const search       = ref('')
const filterStatus = ref('')
const filterFuel   = ref('')
const filterBody   = ref('')
const filterYearMin = ref('')
const filterYearMax = ref('')
const sortKey      = ref('id_desc')

const currentYear = new Date().getFullYear()

// How many non-default filters are active (excluding sort)
const activeCount = computed(() => {
  let n = 0
  if (search.value)        n++
  if (filterStatus.value)  n++
  if (filterFuel.value)    n++
  if (filterBody.value)    n++
  if (filterYearMin.value) n++
  if (filterYearMax.value) n++
  return n
})

function resetFilters() {
  search.value        = ''
  filterStatus.value  = ''
  filterFuel.value    = ''
  filterBody.value    = ''
  filterYearMin.value = ''
  filterYearMax.value = ''
  sortKey.value       = 'id_desc'
}

// ── Filtered + sorted list (client-side, all 200 cars loaded) ──
const filteredCars = computed(() => {
  let list = [...carsStore.cars]

  // Text search (make, model, year, color, VIN)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(c =>
      `${c.make} ${c.model} ${c.year} ${c.color ?? ''} ${c.vin ?? ''}`.toLowerCase().includes(q)
    )
  }

  // Status
  if (filterStatus.value) {
    list = list.filter(c => c.status === filterStatus.value)
  }

  // Fuel
  if (filterFuel.value) {
    list = list.filter(c => c.fuel_type === filterFuel.value)
  }

  // Body type
  if (filterBody.value) {
    list = list.filter(c => c.body_type === filterBody.value)
  }

  // Year range
  if (filterYearMin.value) {
    list = list.filter(c => c.year >= filterYearMin.value)
  }
  if (filterYearMax.value) {
    list = list.filter(c => c.year <= filterYearMax.value)
  }

  // Sort
  const [field, dir] = sortKey.value.split('_')
  const mul = dir === 'asc' ? 1 : -1

  list.sort((a, b) => {
    if (field === 'price') return (a.price - b.price) * mul
    if (field === 'year')  return (a.year  - b.year)  * mul
    if (field === 'id')    return (a.id    - b.id)    * mul
    if (field === 'make')  return a.make.localeCompare(b.make) * mul
    return 0
  })

  return list
})

onMounted(async () => {
  await carsStore.fetchCars({ status: 'all', limit: 500 })
  loading.value = false
})

function openModal(car = null) {
  editingCar.value = car
  showModal.value  = true
}

async function onCarSaved() {
  showModal.value = false
  await Promise.all([
    carsStore.fetchCars({ status: 'all', limit: 500 }),
    carsStore.fetchFeatured()
  ])
  uiStore.toast.success('Car saved successfully!')
}

function confirmDelete(car) {
  deleteTarget.value = car
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await carsStore.deleteCar(deleteTarget.value.id)
    await carsStore.fetchCars({ status: 'all', limit: 500 })
    uiStore.toast.success('Car deleted.')
    deleteTarget.value = null
  } catch {
    uiStore.toast.error('Failed to delete car.')
  } finally {
    deleting.value = false
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}
</script>

<style scoped>
/* ── PAGE ──────────────────────────────────────────── */
.adm-page { padding: 0; }

.adm-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.adm-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
  line-height: 1.2;
}

.adm-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.adm-total-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 20px;
}

.adm-filtered-note {
  color: var(--accent);
  font-weight: 600;
}

/* ── FILTER PANEL ───────────────────────────────────── */
.adm-filter-panel {
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.adm-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  align-items: flex-end;
}

.adm-filter-row-top {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.adm-filter-row-dropdowns {
  background: var(--bg-primary);
}

.adm-filter-divider {
  display: none; /* handled by border-bottom on top row */
}

/* ── FILTER FIELD ───────────────────────────────────── */
.adm-filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.adm-field-search {
  flex: 2 1 260px;
}

.adm-field-sort {
  flex: 1 1 190px;
}

.adm-filter-field:not(.adm-field-search):not(.adm-field-sort):not(.adm-field-reset) {
  flex: 1 1 140px;
}

.adm-field-reset {
  flex: 0 0 auto;
  align-self: flex-end;
}

.adm-filter-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: default;
  user-select: none;
}

.adm-filter-label i {
  font-size: 0.7rem;
  opacity: 0.7;
}

.adm-filter-label-ghost {
  visibility: hidden;
}

/* ── SEARCH INPUT ───────────────────────────────────── */
.adm-input-wrap {
  position: relative;
}

.adm-input {
  width: 100%;
  padding: 0.6rem 2rem 0.6rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.adm-input::placeholder { color: var(--text-muted); }

.adm-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.adm-input-clear {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  transition: background 0.15s, color 0.15s;
  padding: 0;
}

.adm-input-clear:hover {
  background: var(--danger);
  color: #fff;
}

/* ── SELECT ─────────────────────────────────────────── */
.adm-select-wrap {
  position: relative;
}

.adm-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 0.6rem 2.1rem 0.6rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.adm-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* Highlight active (non-default) selects */
.adm-select-wrap.is-active .adm-select {
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
  background: var(--accent-light);
}

.adm-select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.65rem;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.15s;
}

.adm-select-wrap.is-active .adm-select-arrow {
  color: var(--accent);
}

/* ── YEAR RANGE ─────────────────────────────────────── */
.adm-range-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  padding: 0 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.adm-range-wrap:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.adm-range-wrap.is-active {
  border-color: var(--accent);
  background: var(--accent-light);
}

.adm-range-input {
  width: 72px;
  padding: 0.6rem 0.25rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
}

.adm-range-input::-webkit-outer-spin-button,
.adm-range-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.adm-range-input::placeholder { color: var(--text-muted); font-size: 0.8rem; }

.adm-range-wrap.is-active .adm-range-input {
  color: var(--accent);
  font-weight: 600;
}

.adm-range-sep {
  color: var(--text-muted);
  font-size: 0.9rem;
  flex-shrink: 0;
  line-height: 1;
}

/* ── RESET BUTTON ───────────────────────────────────── */
.adm-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--danger);
  background: rgba(220, 53, 69, 0.08);
  border: 1.5px solid rgba(220, 53, 69, 0.25);
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s, border-color 0.18s, transform 0.15s;
  height: 38px;
}

.adm-reset-btn:hover {
  background: rgba(220, 53, 69, 0.15);
  border-color: var(--danger);
  transform: translateY(-1px);
}

.adm-active-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
  background: var(--danger);
  border-radius: 20px;
  line-height: 1;
}

/* ── ACTIVE CHIPS ───────────────────────────────────── */
.adm-chip-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.625rem 1.25rem 0.875rem;
  border-top: 1px dashed var(--border-color);
}

.adm-chip-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  margin-right: 0.25rem;
}

.adm-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-light);
  border: 1px solid rgba(0, 123, 255, 0.25);
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;
  user-select: none;
}

.adm-chip:hover {
  background: rgba(0, 123, 255, 0.18);
  border-color: var(--accent);
  transform: translateY(-1px);
}

.adm-chip i { font-size: 0.65rem; opacity: 0.7; }

.adm-chip-x {
  opacity: 0.5;
  transition: opacity 0.15s;
}

.adm-chip:hover .adm-chip-x { opacity: 1; }

/* Status chip gets its own colour to echo the badge */
.adm-chip-status {
  color: var(--success);
  background: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.3);
}

.adm-chip-status:hover {
  background: rgba(40, 167, 69, 0.18);
  border-color: var(--success);
}

/* ── RESULTS ROW ────────────────────────────────────── */
.adm-results-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 0.875rem;
}

.adm-results-count {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 500;
}

.adm-results-of {
  color: var(--text-muted);
  font-weight: 400;
  margin-left: 0.2rem;
}

/* ── TABLE EXTRAS ──────────────────────────────────── */
.adm-id    { font-size: 0.8rem; color: var(--text-muted); }
.adm-fw    { font-weight: 600; color: var(--text-primary); }
.adm-price { color: var(--accent); font-weight: 700; }

.adm-status-badge {
  position: static;
  font-size: 0.72rem;
}

.adm-actions {
  display: flex;
  gap: 0.5rem;
}

.adm-no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.adm-no-results i {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.625rem;
  opacity: 0.3;
}

/* ── MODAL ─────────────────────────────────────────── */
.adm-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.adm-modal-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
  width: 100%;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.adm-modal-sm { max-width: 400px; }
.adm-modal-lg { max-width: 720px; }

.adm-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.adm-modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.adm-modal-title-danger { color: var(--danger); }

.adm-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: background 0.18s, color 0.18s;
}

.adm-modal-close:hover { background: var(--danger); color: #fff; }

.adm-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.adm-modal-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

/* ── SPINNER ───────────────────────────────────────── */
.adm-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: admSpin 0.7s linear infinite;
}

@keyframes admSpin { to { transform: rotate(360deg); } }

/* ── TRANSITIONS ───────────────────────────────────── */
.adm-modal-enter-active,
.adm-modal-leave-active { transition: opacity 0.25s ease; }
.adm-modal-enter-from,
.adm-modal-leave-to { opacity: 0; }

.adm-fade-enter-active,
.adm-fade-leave-active { transition: opacity 0.2s ease; }
.adm-fade-enter-from,
.adm-fade-leave-to { opacity: 0; }

/* ── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 900px) {
  .adm-filter-row {
    gap: 0.75rem;
  }

  .adm-field-search { flex: 1 1 100%; }
  .adm-field-sort   { flex: 1 1 160px; }
}

@media (max-width: 640px) {
  .adm-filter-row { padding: 0.875rem; }
  .adm-chip-row   { padding: 0.5rem 0.875rem 0.75rem; }

  .adm-filter-field:not(.adm-field-search):not(.adm-field-sort):not(.adm-field-reset) {
    flex: 1 1 calc(50% - 0.375rem);
  }

  .adm-range-wrap { flex: 1 1 100%; }
  .adm-range-input { flex: 1; }

  .adm-filter-label-ghost { display: none; }
  .adm-field-reset { width: 100%; }
  .adm-reset-btn   { width: 100%; justify-content: center; }
}
</style>
