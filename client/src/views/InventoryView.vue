<template>
  <div class="inv-page">
    <AppHeader />

    <!-- Page Hero Banner -->
    <section class="inv-hero">
      <div class="inv-hero-inner">
        <span class="inv-hero-label">
          <i class="fa-solid fa-car me-2"></i>{{ $t('nav.inventory') }}
        </span>
        <h1 class="inv-hero-title">{{ $t('inventory.title') }}</h1>
        <p class="inv-hero-sub">{{ $t('inventory.subtitle') }}</p>
      </div>
    </section>

    <!-- Main Layout -->
    <section class="inv-body">
      <div class="inv-container">
        <div class="inv-layout">

          <!-- ── FILTER SIDEBAR ─────────────────────────── -->
          <aside class="inv-sidebar">
            <div class="inv-filter-card">
              <div class="inv-filter-header">
                <h2 class="inv-filter-title">
                  <i class="fa-solid fa-sliders"></i>
                  {{ $t('inventory.filters.title') }}
                </h2>
                <button
                  v-if="carsStore.activeFilterCount > 0"
                  class="inv-reset-btn"
                  @click="carsStore.resetFilters()"
                >
                  <i class="fa-solid fa-times"></i>
                  {{ $t('inventory.filters.reset') }} ({{ carsStore.activeFilterCount }})
                </button>
              </div>

              <!-- Search -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.searchPlaceholder') }}</label>
                <div class="inv-search-wrap">
                  <i class="fa-solid fa-magnifying-glass inv-search-icon"></i>
                  <input
                    type="search"
                    class="inv-input inv-search-input"
                    :placeholder="$t('inventory.searchPlaceholder')"
                    v-model="localFilters.search"
                    @input="debouncedSearch"
                  />
                </div>
              </div>

              <!-- Make -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.filters.make') }}</label>
                <select class="inv-select" v-model="localFilters.make">
                  <option value="">{{ $t('inventory.filters.make') }}</option>
                  <option v-for="m in makes" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>

              <!-- Year Range -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.filters.yearFrom') }}</label>
                <div class="inv-range-row">
                  <input type="number" class="inv-input" :placeholder="$t('inventory.filters.yearFrom')" v-model="localFilters.year_min" min="1990" :max="currentYear" />
                  <span class="inv-range-sep">—</span>
                  <input type="number" class="inv-input" :placeholder="$t('inventory.filters.yearTo')" v-model="localFilters.year_max" min="1990" :max="currentYear" />
                </div>
              </div>

              <!-- Price Range -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.filters.priceFrom') }}</label>
                <div class="inv-range-row">
                  <input type="number" class="inv-input" :placeholder="$t('inventory.filters.priceFrom')" v-model="localFilters.price_min" min="0" step="1000" />
                  <span class="inv-range-sep">—</span>
                  <input type="number" class="inv-input" :placeholder="$t('inventory.filters.priceTo')" v-model="localFilters.price_max" min="0" step="1000" />
                </div>
              </div>

              <!-- Fuel Type -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.filters.fuelType') }}</label>
                <select class="inv-select" v-model="localFilters.fuel_type">
                  <option value="">{{ $t('inventory.filters.fuelType') }}</option>
                  <option value="petrol">{{ $t('car.fuel.petrol') }}</option>
                  <option value="diesel">{{ $t('car.fuel.diesel') }}</option>
                  <option value="electric">{{ $t('car.fuel.electric') }}</option>
                  <option value="hybrid">{{ $t('car.fuel.hybrid') }}</option>
                  <option value="lpg">{{ $t('car.fuel.lpg') }}</option>
                </select>
              </div>

              <!-- Transmission -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.filters.transmission') }}</label>
                <select class="inv-select" v-model="localFilters.transmission">
                  <option value="">{{ $t('inventory.filters.transmission') }}</option>
                  <option value="manual">{{ $t('car.trans.manual') }}</option>
                  <option value="automatic">{{ $t('car.trans.automatic') }}</option>
                  <option value="semiAuto">{{ $t('car.trans.semiAuto') }}</option>
                </select>
              </div>

              <!-- Body Type -->
              <div class="inv-filter-group">
                <label class="inv-filter-label">{{ $t('inventory.filters.bodyType') }}</label>
                <select class="inv-select" v-model="localFilters.body_type">
                  <option value="">{{ $t('inventory.filters.bodyType') }}</option>
                  <option v-for="b in bodyTypes" :key="b.val" :value="b.val">{{ $t(`car.body.${b.val}`) }}</option>
                </select>
              </div>

              <!-- Apply -->
              <button class="inv-apply-btn" @click="applyFilters">
                <i class="fa-solid fa-check"></i>
                {{ $t('inventory.filters.apply') }}
              </button>
            </div>
          </aside>

          <!-- ── RESULTS AREA ─────────────────────────── -->
          <div class="inv-results">

            <!-- Toolbar -->
            <div class="inv-toolbar">
              <p class="inv-count">
                {{ $t('inventory.results', { count: carsStore.pagination.total }) }}
              </p>
              <div class="inv-sort-wrap">
                <label class="inv-sort-label">{{ $t('inventory.sort.label') }}:</label>
                <select class="inv-select inv-sort-select" v-model="carsStore.filters.sort" @change="carsStore.fetchCars()">
                  <option value="created_at_desc">{{ $t('inventory.sort.newest') }}</option>
                  <option value="created_at_asc">{{ $t('inventory.sort.oldest') }}</option>
                  <option value="price_asc">{{ $t('inventory.sort.priceAsc') }}</option>
                  <option value="price_desc">{{ $t('inventory.sort.priceDesc') }}</option>
                  <option value="year_desc">{{ $t('inventory.sort.yearDesc') }}</option>
                  <option value="year_asc">{{ $t('inventory.sort.yearAsc') }}</option>
                </select>
              </div>
            </div>

            <!-- Active Filter Chips -->
            <div v-if="carsStore.activeFilterCount > 0" class="inv-chips">
              <span class="inv-chip" v-if="carsStore.filters.search">
                <i class="fa-solid fa-magnifying-glass"></i> {{ carsStore.filters.search }}
                <button class="inv-chip-remove" @click="removeFilter('search')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.make">
                {{ carsStore.filters.make }}
                <button class="inv-chip-remove" @click="removeFilter('make')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.fuel_type">
                {{ $t(`car.fuel.${carsStore.filters.fuel_type}`) }}
                <button class="inv-chip-remove" @click="removeFilter('fuel_type')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.transmission">
                {{ $t(`car.trans.${carsStore.filters.transmission}`) }}
                <button class="inv-chip-remove" @click="removeFilter('transmission')">×</button>
              </span>
            </div>

            <!-- Loading -->
            <LoadingSpinner v-if="carsStore.loading" :label="$t('inventory.loading')" />

            <!-- No Results -->
            <div v-else-if="!carsStore.hasResults" class="inv-empty">
              <div class="inv-empty-icon">
                <i class="fa-solid fa-car-burst"></i>
              </div>
              <h3 class="inv-empty-title">{{ $t('inventory.noResults') }}</h3>
              <p class="inv-empty-sub">{{ $t('inventory.noResultsDesc') }}</p>
              <button class="inv-apply-btn" style="width:auto; padding: 0.75rem 2rem;" @click="carsStore.resetFilters()">
                {{ $t('inventory.filters.reset') }}
              </button>
            </div>

            <!-- Car Grid -->
            <div v-else class="inv-grid">
              <CarCard
                v-for="car in carsStore.cars"
                :key="car.id"
                :car="car"
                @view="openCarDetail"
              />
            </div>

            <!-- Pagination -->
            <Pagination
              :current-page="carsStore.pagination.page"
              :total-pages="carsStore.pagination.totalPages"
              @page="carsStore.setPage"
            />
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
    <ContactModal />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCarsStore } from '@/stores/cars.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CarCard from '@/components/ui/CarCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ContactModal from '@/components/ui/ContactModal.vue'

const router = useRouter()
const carsStore = useCarsStore()
const currentYear = new Date().getFullYear()

const localFilters = reactive({ ...carsStore.filters })

let searchTimer = null
function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(applyFilters, 400)
}

function applyFilters() {
  carsStore.applyFilters({ ...localFilters })
}

function removeFilter(key) {
  localFilters[key] = ''
  carsStore.applyFilters({ ...localFilters })
}

function openCarDetail(car) {
  router.push({ name: 'car-detail', params: { id: car.id } })
}

const makes = ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Nissan', 'Opel', 'Renault', 'Skoda', 'Toyota', 'Volkswagen', 'Volvo']
const bodyTypes = [
  { val: 'sedan' }, { val: 'suv' }, { val: 'hatchback' },
  { val: 'combi' }, { val: 'coupe' }, { val: 'cabrio' },
  { val: 'van' },   { val: 'pickup' }
]

onMounted(() => carsStore.fetchCars())
</script>

<style scoped>
/* ── PAGE WRAPPER ──────────────────────────────────── */
.inv-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* ── HERO BANNER ───────────────────────────────────── */
.inv-hero {
  background: linear-gradient(135deg, #0A4B8C 0%, #0066CC 60%, #1a7fd4 100%);
  padding: calc(var(--nav-height, 72px) + 3.5rem) 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.inv-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.inv-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.inv-hero-label {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.inv-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.inv-hero-sub {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

/* ── BODY SECTION ──────────────────────────────────── */
.inv-body {
  padding: 2.5rem 0 4rem;
  background: var(--bg-secondary);
}

.inv-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── LAYOUT ────────────────────────────────────────── */
.inv-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .inv-layout {
    grid-template-columns: 240px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .inv-layout {
    grid-template-columns: 1fr;
  }
}

/* ── SIDEBAR ───────────────────────────────────────── */
.inv-sidebar {
  position: sticky;
  top: calc(var(--nav-height, 72px) + 1.5rem);
}

.inv-filter-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.inv-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.inv-filter-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-filter-title i {
  color: var(--accent);
}

.inv-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: none;
  color: var(--danger);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.inv-reset-btn:hover { opacity: 0.75; }

/* ── FILTER GROUPS ─────────────────────────────────── */
.inv-filter-group {
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.inv-filter-group:last-of-type {
  border-bottom: none;
  margin-bottom: 1rem;
}

.inv-filter-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
}

/* ── FORM INPUTS ───────────────────────────────────── */
.inv-input {
  display: block;
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.inv-input::placeholder { color: var(--text-muted); }

.inv-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--bg-primary);
}

.inv-select {
  display: block;
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2357606a' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 14px 10px;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.inv-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background-color: var(--bg-primary);
}

/* ── SEARCH INPUT ──────────────────────────────────── */
.inv-search-wrap {
  position: relative;
}

.inv-search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.8rem;
  pointer-events: none;
}

.inv-search-input {
  padding-left: 2.25rem;
}

/* ── RANGE ROW ─────────────────────────────────────── */
.inv-range-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-range-row .inv-input {
  flex: 1;
  min-width: 0;
}

.inv-range-sep {
  color: var(--text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* ── APPLY BUTTON ──────────────────────────────────── */
.inv-apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.inv-apply-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--accent-glow);
}

.inv-apply-btn:active { transform: translateY(0); }

/* ── TOOLBAR ───────────────────────────────────────── */
.inv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.inv-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.inv-sort-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-sort-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.inv-sort-select {
  width: auto;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  font-size: 0.82rem;
}

/* ── CHIPS ─────────────────────────────────────────── */
.inv-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.inv-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.inv-chip-remove {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.1rem;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.inv-chip-remove:hover { opacity: 1; }

/* ── EMPTY STATE ───────────────────────────────────── */
.inv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 2rem;
}

.inv-empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--accent);
  margin-bottom: 1.5rem;
}

.inv-empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.inv-empty-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem;
}

/* ── CAR GRID ──────────────────────────────────────── */
.inv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .inv-grid {
    grid-template-columns: 1fr;
  }
}
</style>
