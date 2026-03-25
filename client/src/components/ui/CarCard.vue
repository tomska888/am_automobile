<template>
  <article class="car-card" :class="{ 'is-comparing': compareStore.isInCompare(car.id) }" @click="$emit('view', car)">

    <!-- ── Image ──────────────────────────────────────────── -->
    <div class="car-card-image">
      <img
        :src="car.image_url || '/assets/img/car-placeholder.jpg'"
        :alt="`${car.make} ${car.model}`"
        loading="lazy"
      />

      <!-- Badge (featured / new arrival / best deal) -->
      <span v-if="car.badge" class="car-badge" :class="badgeClass">
        {{ car.badge }}
      </span>

      <!-- Status overlay for sold / reserved -->
      <div v-if="car.status !== 'available' && car.status !== 'featured'" class="car-status-overlay">
        <span class="car-status-badge" :class="`badge-${car.status}`">
          {{ $t(`car.status.${car.status}`) }}
        </span>
      </div>

    </div>

    <!-- ── Body ───────────────────────────────────────────── -->
    <div class="car-card-body">
      <div class="car-card-content">

        <!-- Header: name + price -->
        <div class="car-card-header">
          <div class="car-card-title-wrap">
            <h3 class="car-card-name">{{ car.make }} {{ car.model }}</h3>
            <p class="car-card-year">{{ car.year }}</p>
          </div>
          <p class="car-card-price">{{ formatPrice(car.price) }}</p>
        </div>

        <!-- Spec pills -->
        <div class="car-card-specs">
          <span v-if="car.mileage" class="car-spec">
            <i class="fa-solid fa-road"></i>
            {{ formatMileage(car.mileage) }}
          </span>
          <span v-if="car.fuel_type" class="car-spec">
            <i class="fa-solid fa-gas-pump"></i>
            {{ $t(`car.fuel.${car.fuel_type}`) }}
          </span>
          <span v-if="car.transmission" class="car-spec">
            <i class="fa-solid fa-gears"></i>
            {{ $t(`car.trans.${car.transmission}`) }}
          </span>
          <span v-if="car.power_hp" class="car-spec">
            <i class="fa-solid fa-bolt"></i>
            {{ car.power_hp }} {{ $t('common.hp') }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="car-card-actions">
        <!-- Compare button -->
        <button
          class="car-compare-btn"
          :class="{ 'is-active': compareStore.isInCompare(car.id) }"
          :disabled="!compareStore.isInCompare(car.id) && compareStore.isFull"
          :aria-label="compareStore.isInCompare(car.id) ? $t('compare.removeFromCompare') : $t('compare.addToCompare')"
          :title="compareStore.isInCompare(car.id) ? $t('compare.removeFromCompare') : (!compareStore.isInCompare(car.id) && compareStore.isFull ? $t('compare.maxReached', { max: compareStore.MAX_CARS }) : $t('compare.addToCompare'))"
          @click.stop="compareStore.toggleCar(car)"
        >
          <i :class="compareStore.isInCompare(car.id) ? 'fa-solid fa-code-compare' : 'fa-solid fa-code-compare'"></i>
        </button>

        <button class="car-view-btn" @click.stop="$emit('view', car)">
          <i class="fa-solid fa-circle-info"></i>
          <span class="car-view-btn-text">{{ $t('car.viewDetails') }}</span>
        </button>

        <button
          v-if="authStore.isAuthenticated"
          class="car-fav-action-btn"
          :class="{ 'is-active': favStore.isFavorite(car.id) }"
          :disabled="favStore.isToggling(car.id)"
          :aria-label="favStore.isFavorite(car.id) ? $t('car.removeFromFavorites') : $t('car.addToFavorites')"
          @click.stop="handleFavToggle"
        >
          <i
            :class="favStore.isToggling(car.id)
              ? 'fa-solid fa-spinner fa-spin'
              : favStore.isFavorite(car.id)
                ? 'fa-solid fa-heart'
                : 'fa-regular fa-heart'"
          ></i>
        </button>
      </div>
    </div>

  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.js'
import { useFavoritesStore } from '@/stores/favorites.js'
import { useCompareStore } from '@/stores/compare.js'

const { locale } = useI18n()
const authStore    = useAuthStore()
const favStore     = useFavoritesStore()
const compareStore = useCompareStore()

const props = defineProps({
  car: {
    type: Object,
    required: true
  }
})

defineEmits(['view'])

const badgeClass = computed(() => {
  const map = {
    'Featured':    'badge-featured',
    'New Arrival': 'badge-new',
    'Best Deal':   'badge-deal'
  }
  return map[props.car.badge] || 'badge-featured'
})

function handleFavToggle() {
  favStore.toggleFavorite(props.car.id)
}

function formatPrice(price) {
  if (!price) return '—'
  return new Intl.NumberFormat('de-DE', {
    style:    'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}

function formatMileage(km) {
  return new Intl.NumberFormat().format(km) + ' km'
}
</script>

<style scoped>
/* ── Card shell ─────────────────────────────────────────── */
.car-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-primary);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* ── Image area ─────────────────────────────────────────── */
.car-card-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.car-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}

.car-card:hover .car-card-image img {
  transform: scale(1.06);
}

/* ── Badge (featured / new / deal) ──────────────────────── */
.car-badge {
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  padding: 0.25rem 0.7rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  z-index: 5;
}

.badge-featured { background: var(--accent);     color: #fff; }
.badge-new      { background: #10b981;            color: #fff; }
.badge-deal     { background: #f97316;            color: #fff; }

/* ── Status overlay (sold / reserved) ───────────────────── */
.car-status-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
}

.car-status-badge {
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.badge-sold     { background: rgba(239, 68, 68,  0.9); }
.badge-reserved { background: rgba(234, 179, 8, 0.9); }

/* ── Favorite overlay button (top-right) ────────────────── */
.fav-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.fav-btn:hover {
  background: #fff;
  color: #ef4444;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.fav-btn--active          { background: #fff; color: #ef4444; }
.fav-btn--active:hover    { color: #dc2626; }
.fav-btn--loading         { pointer-events: none; opacity: 0.7; }

/* ── Body ───────────────────────────────────────────────── */
.car-card-body {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  justify-content: space-between;
  flex: 1;
}

.car-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* ── Header row: name + price ───────────────────────────── */
.car-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.car-card-title-wrap { min-width: 0; }

.car-card-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.car-card:hover .car-card-name { color: var(--accent); }

.car-card-year {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
  margin: 0;
}

.car-card-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.02em;
  white-space: nowrap;
  margin: 0;
}

/* ── Spec pills ─────────────────────────────────────────── */
.car-card-specs {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.car-spec {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  font-size: 0.74rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.22rem 0.55rem;
  border-radius: 50px;
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.car-spec i {
  font-size: 0.65rem;
  color: var(--accent);
}

/* ── Actions row ────────────────────────────────────────── */
.car-card-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.car-view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
  padding: 0.6rem 0.75rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
  white-space: nowrap;
  overflow: hidden;
}

.car-view-btn-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.car-view-btn:hover {
  background: var(--accent-hover, #1648c0);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(26, 86, 219, 0.3);
}

/* ── Compare button ─────────────────────────────────────── */
.car-compare-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
  flex-shrink: 0;
  order: -1; /* sits left of view-details */
}

.car-compare-btn:hover:not(:disabled) {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}

.car-compare-btn.is-active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.car-compare-btn.is-active:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.car-compare-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

/* Highlight card outline when in compare */
.car-card.is-comparing {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

/* Favourite action button in the footer row */
.car-fav-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: rgba(239, 68, 68, 0.07);
  color: #ef4444;
  border: 1.5px solid rgba(239, 68, 68, 0.18);
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;
  flex-shrink: 0;
}

.car-fav-action-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.45);
  transform: translateY(-1px);
}

.car-fav-action-btn.is-active {
  background: rgba(239, 68, 68, 0.13);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.car-fav-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
