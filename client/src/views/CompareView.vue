<template>
  <div class="cmpv-page">
    <AppHeader />

    <div class="cmpv-container">

      <!-- ── TOP BAR ──────────────────────────────────────── -->
      <div class="cmpv-topbar">
        <RouterLink to="/inventory" class="cmpv-back">
          <i class="fa-solid fa-arrow-left"></i>
          {{ $t('compare.backToInventory') }}
        </RouterLink>
        <h1 class="cmpv-title">
            <i class="fa-solid fa-code-compare"></i>
            {{ $t('compare.compareCars') }}
          </h1>
      </div>

      <!-- ── EMPTY STATE ────────────────────────────────── -->
      <div v-if="compareStore.count === 0" class="cmpv-empty">
        <div class="cmpv-empty-icon"><i class="fa-solid fa-code-compare"></i></div>
        <p class="cmpv-empty-text">{{ $t('compare.selectAtLeastTwo') }}</p>
        <RouterLink to="/inventory" class="cmpv-go-btn">
          <i class="fa-solid fa-car"></i>
          {{ $t('compare.backToInventory') }}
        </RouterLink>
      </div>

      <!-- ── COMPARISON TABLE ───────────────────────────── -->
      <div v-else class="cmpv-scroll-wrap">
        <div class="cmpv-table" :style="{ '--col-count': compareStore.count }">

          <!-- ── CAR HEADER ROW ──────────────────────────── -->
          <div class="cmpv-header-row">

            <!-- Row label spacer (desktop) -->
            <div class="cmpv-label-cell cmpv-header-label" aria-hidden="true"></div>

            <!-- One column per car -->
            <div
              v-for="car in compareStore.cars"
              :key="car.id"
              class="cmpv-car-col cmpv-car-header"
            >
              <!-- Car image -->
              <div class="cmpv-car-img-wrap">
                <img
                  :src="car.image_url || '/assets/img/car-placeholder.jpg'"
                  :alt="`${car.make} ${car.model}`"
                  class="cmpv-car-img"
                />
              </div>

              <!-- Car name + inline action buttons -->
              <div class="cmpv-car-meta">
                <RouterLink
                  :to="{ name: 'car-detail', params: { id: car.id } }"
                  class="cmpv-car-name-link"
                >
                  <h2 class="cmpv-car-name">{{ car.make }} {{ car.model }}</h2>
                </RouterLink>
                <div class="cmpv-car-actions">
                  <button
                    v-if="authStore.isAuthenticated"
                    class="cmpv-fav-btn"
                    :class="{ 'is-active': favStore.isFavorite(car.id) }"
                    :disabled="favStore.isToggling(car.id)"
                    :aria-label="favStore.isFavorite(car.id) ? $t('car.removeFromFavorites') : $t('car.addToFavorites')"
                    @click="favStore.toggleFavorite(car.id)"
                  >
                    <i
                      :class="favStore.isToggling(car.id)
                        ? 'fa-solid fa-spinner fa-spin'
                        : favStore.isFavorite(car.id)
                          ? 'fa-solid fa-heart'
                          : 'fa-regular fa-heart'"
                    ></i>
                  </button>

                  <button
                    class="cmpv-remove-btn"
                    :aria-label="$t('compare.removeCar')"
                    @click="compareStore.removeCar(car.id)"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── DATA ROWS ────────────────────────────────── -->
          <template v-for="field in fields" :key="field.key">
            <div
              class="cmpv-data-row"
              :class="{ 'has-diff': hasDiff(field.key) }"
            >
              <!-- Row label -->
              <div class="cmpv-label-cell">
                <span class="cmpv-field-label">
                  <i :class="field.icon"></i>
                  {{ $t(`compare.fields.${field.key}`) }}
                </span>
                <span v-if="hasDiff(field.key)" class="cmpv-diff-badge" aria-label="values differ">
                  <i class="fa-solid fa-not-equal"></i>
                </span>
              </div>

              <!-- Value cells -->
              <div
                v-for="car in compareStore.cars"
                :key="car.id"
                class="cmpv-value-cell"
                :class="{
                  'is-diff': hasDiff(field.key),
                  'is-best': field.bestFn && isBest(field, car),
                  'is-worst': field.bestFn && isWorst(field, car)
                }"
              >
                <span class="cmpv-value">{{ displayValue(field, car) }}</span>
              </div>
            </div>
          </template>

        </div><!-- end .cmpv-table -->
      </div><!-- end .cmpv-scroll-wrap -->

    </div><!-- end .cmpv-container -->

    <AppFooter />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCompareStore } from '@/stores/compare.js'
import { useFavoritesStore } from '@/stores/favorites.js'
import { useAuthStore } from '@/stores/auth.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t } = useI18n()
const router = useRouter()
const compareStore = useCompareStore()
const favStore     = useFavoritesStore()
const authStore    = useAuthStore()

// ── Auto-redirect when fewer than 2 cars remain ───────────
watch(
  () => compareStore.count,
  (count) => {
    if (count < 2) {
      router.replace({ name: 'inventory' })
    }
  }
)

// ── Field definitions ─────────────────────────────────────
// bestFn: 'max' = higher is better, 'min' = lower is better
const fields = [
  { key: 'price',        icon: 'fa-solid fa-tag',              prop: 'price',         fmt: 'price',    bestFn: 'min' },
  { key: 'year',         icon: 'fa-solid fa-calendar',         prop: 'year',          fmt: 'number',   bestFn: 'max' },
  { key: 'mileage',      icon: 'fa-solid fa-road',             prop: 'mileage',       fmt: 'mileage',  bestFn: 'min' },
  { key: 'power',        icon: 'fa-solid fa-bolt',             prop: 'power_hp',      fmt: 'hp',       bestFn: 'max' },
  { key: 'engineSize',   icon: 'fa-solid fa-gauge-high',       prop: 'engine_size',   fmt: 'litre',    bestFn: null  },
  { key: 'fuelType',     icon: 'fa-solid fa-gas-pump',         prop: 'fuel_type',     fmt: 'fuelType', bestFn: null  },
  { key: 'transmission', icon: 'fa-solid fa-gears',            prop: 'transmission',  fmt: 'trans',    bestFn: null  },
  { key: 'bodyType',     icon: 'fa-solid fa-car-side',         prop: 'body_type',     fmt: 'bodyType', bestFn: null  },
  { key: 'color',        icon: 'fa-solid fa-palette',          prop: 'color',         fmt: 'text',     bestFn: null  },
  { key: 'doors',        icon: 'fa-solid fa-door-open',        prop: 'doors',         fmt: 'number',   bestFn: null  },
  { key: 'seats',        icon: 'fa-solid fa-users',            prop: 'seats',         fmt: 'number',   bestFn: null  },
  { key: 'owners',       icon: 'fa-solid fa-user-clock',       prop: 'previous_owners', fmt: 'number', bestFn: 'min' },
  { key: 'status',       icon: 'fa-solid fa-circle-dot',       prop: 'status',        fmt: 'status',   bestFn: null  },
]

// ── Helpers ───────────────────────────────────────────────
function getRaw(field, car) {
  return car[field.prop]
}

function displayValue(field, car) {
  const v = getRaw(field, car)
  if (v === null || v === undefined || v === '') return '—'
  switch (field.fmt) {
    case 'price':    return formatPrice(v)
    case 'mileage':  return new Intl.NumberFormat().format(v) + ' km'
    case 'hp':       return v + ' hp'
    case 'litre':    return v + ' L'
    case 'number':   return String(v)
    case 'fuelType': return t(`car.fuel.${v}`)
    case 'trans':    return t(`car.trans.${v}`)
    case 'bodyType': return t(`car.body.${v}`)
    case 'status':   return t(`car.status.${v}`)
    default:         return String(v)
  }
}

function formatPrice(price) {
  if (!price) return '—'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(price)
}

function hasDiff(fieldKey) {
  if (compareStore.count < 2) return false
  const field = fields.find(f => f.key === fieldKey)
  if (!field) return false
  const vals = compareStore.cars.map(c => getRaw(field, c))
  const nonNull = vals.filter(v => v !== null && v !== undefined && v !== '')
  if (nonNull.length < 2) return false
  return new Set(nonNull.map(String)).size > 1
}

// For numeric fields with bestFn: highlight best (green) / worst (faint red)
function numericValues(field) {
  return compareStore.cars.map(c => {
    const v = getRaw(field, c)
    return (v !== null && v !== undefined && v !== '') ? Number(v) : null
  })
}

function isBest(field, car) {
  if (!field.bestFn) return false
  const vals = numericValues(field).filter(v => v !== null)
  if (vals.length < 2) return false
  const best = field.bestFn === 'max' ? Math.max(...vals) : Math.min(...vals)
  const v = getRaw(field, car)
  return v !== null && v !== undefined && Number(v) === best
}

function isWorst(field, car) {
  if (!field.bestFn) return false
  const vals = numericValues(field).filter(v => v !== null)
  if (vals.length < 2) return false
  const worst = field.bestFn === 'max' ? Math.min(...vals) : Math.max(...vals)
  const best  = field.bestFn === 'max' ? Math.max(...vals) : Math.min(...vals)
  if (worst === best) return false
  const v = getRaw(field, car)
  return v !== null && v !== undefined && Number(v) === worst
}
</script>

<style scoped>
/* ── PAGE ────────────────────────────────────────────────── */
.cmpv-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.cmpv-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: calc(var(--nav-height, 72px) + 2rem) 1.5rem 4rem;
}

/* ── TOP BAR ────────────────────────────────────────────── */
.cmpv-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 2rem;
  /* Never wrap — back and clear stay on same row as title */
  flex-wrap: nowrap;
}

.cmpv-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.45rem 0.9rem;
  border-radius: 50px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-primary);
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}

.cmpv-back:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-light);
}

.cmpv-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  /* Allow title to shrink but stay centred */
  flex: 1;
  justify-content: center;
  text-align: center;
  min-width: 0;
}

.cmpv-title i { color: var(--accent); }


/* ── EMPTY STATE ────────────────────────────────────────── */
.cmpv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 2rem;
  gap: 1.25rem;
}

.cmpv-empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--accent);
}

.cmpv-empty-text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.cmpv-go-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.15s, transform 0.12s;
}

.cmpv-go-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

/* ── SCROLL WRAPPER (horizontal scroll on mobile) ───────── */
.cmpv-scroll-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 16px;
}

/* ── TABLE GRID ─────────────────────────────────────────── */
/*
  Layout: label col (220px) + N car columns (1fr each)
  We use CSS grid with repeat so the label col is always first.
*/
.cmpv-table {
  --label-w: 200px;
  display: grid;
  grid-template-columns: var(--label-w) repeat(var(--col-count), 1fr);
  min-width: calc(var(--label-w) + var(--col-count) * 220px);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* ── HEADER ROW ─────────────────────────────────────────── */
.cmpv-header-row {
  display: contents;
}

.cmpv-header-label {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  border-bottom: 2px solid var(--border-color);
}

.cmpv-car-col {
  padding: 1.5rem 1.25rem 1.25rem;
  border-right: 1px solid var(--border-color);
  border-bottom: 2px solid var(--border-color);
  background: var(--bg-primary);
}

.cmpv-car-col:last-child {
  border-right: none;
}

/* ── CAR HEADER CELL ────────────────────────────────────── */
.cmpv-car-img-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-secondary);
  margin-bottom: 1rem;
}

.cmpv-car-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cmpv-car-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.cmpv-car-name-link {
  flex: 1;
  min-width: 0;
  text-decoration: none;
  display: block;
}

.cmpv-car-name-link:hover .cmpv-car-name {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cmpv-car-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
  transition: color 0.15s;
}

/* ── CAR ACTIONS (fav + remove) ─────────────────────────── */
.cmpv-car-actions {
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  flex-shrink: 0;
}

.cmpv-fav-btn,
.cmpv-remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1.5px solid;
  border-radius: 7px;
  width: 30px;
  height: 30px;
  padding: 0;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
}

.cmpv-fav-btn {
  background: rgba(239, 68, 68, 0.07);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.cmpv-fav-btn.is-active {
  background: rgba(239, 68, 68, 0.13);
  border-color: rgba(239, 68, 68, 0.4);
}

.cmpv-fav-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.17);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
}

.cmpv-fav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.cmpv-remove-btn {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.cmpv-remove-btn:hover {
  background: rgba(220, 53, 69, 0.08);
  border-color: rgba(220, 53, 69, 0.3);
  color: var(--danger);
  transform: translateY(-1px);
}

/* ── DATA ROWS ──────────────────────────────────────────── */
.cmpv-data-row {
  display: contents;
}

/* Label cell */
.cmpv-label-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.8rem 1rem;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.cmpv-field-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.cmpv-field-label i {
  font-size: 0.7rem;
  color: var(--accent);
  width: 14px;
  text-align: center;
}

.cmpv-diff-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f59e0b;
  color: #fff;
  font-size: 0.55rem;
  flex-shrink: 0;
}

/* Value cell */
.cmpv-value-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-primary);
  text-align: center;
  gap: 0.35rem;
  position: relative;
  transition: background 0.2s;
}

.cmpv-value-cell:last-child {
  border-right: none;
}

/* Highlight row where values differ */
.cmpv-data-row.has-diff .cmpv-label-cell {
  background: rgba(245, 158, 11, 0.06);
}

.cmpv-data-row.has-diff .cmpv-value-cell.is-diff {
  background: rgba(245, 158, 11, 0.07);
}

/* Best value highlight (green accent) */
.cmpv-value-cell.is-best {
  background: rgba(16, 185, 129, 0.09) !important;
  color: #059669;
  font-weight: 700;
}

/* Worst value (light red tint, no icon) */
.cmpv-value-cell.is-worst {
  background: rgba(239, 68, 68, 0.06) !important;
  color: #dc2626;
}

.cmpv-value {
  word-break: break-word;
}

/* Last row in table: remove bottom border */
.cmpv-data-row:last-child .cmpv-label-cell,
.cmpv-data-row:last-child .cmpv-value-cell {
  border-bottom: none;
}

/* ── MOBILE COMPACT ─────────────────────────────────────── */
@media (max-width: 768px) {
  .cmpv-container {
    padding: calc(var(--nav-height, 72px) + 1rem) 0.75rem 3rem;
  }

  .cmpv-topbar {
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  /* Topbar: collapse back to icon-only, shrink title */
  .cmpv-back span {
    display: none;
  }

  .cmpv-back {
    padding: 0.45rem 0.65rem;
  }

  .cmpv-title {
    font-size: 1rem;
    gap: 0.35rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cmpv-table {
    --label-w: 120px;
    min-width: calc(120px + var(--col-count) * 160px);
    font-size: 0.82rem;
  }

  .cmpv-car-col {
    padding: 0.85rem 0.75rem;
  }

  .cmpv-car-img-wrap {
    aspect-ratio: 4 / 3;
    margin-bottom: 0.65rem;
  }

  .cmpv-car-name {
    font-size: 0.85rem;
  }

  .cmpv-label-cell {
    padding: 0.65rem 0.6rem;
  }

  .cmpv-field-label {
    font-size: 0.68rem;
    letter-spacing: 0.03em;
  }

  .cmpv-field-label i {
    display: none;
  }

  .cmpv-value-cell {
    padding: 0.65rem 0.5rem;
    font-size: 0.82rem;
  }

  .cmpv-car-actions {
    gap: 0.25rem;
  }

  .cmpv-fav-btn,
  .cmpv-remove-btn {
    width: 26px;
    height: 26px;
    font-size: 0.75rem;
  }
}
</style>
