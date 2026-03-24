<template>
  <article class="card-am car-card" @click="$emit('view', car)">
    <!-- Image -->
    <div class="car-card-image">
      <img
        :src="car.image_url || '/assets/img/car-placeholder.jpg'"
        :alt="`${car.make} ${car.model}`"
        loading="lazy"
      />
      <!-- Badge -->
      <span v-if="car.badge" class="car-card-badge" :class="badgeClass">
        {{ car.badge }}
      </span>
      <!-- Status overlay for sold/reserved -->
      <div v-if="car.status !== 'available' && car.status !== 'featured'" class="status-overlay">
        <span class="car-card-badge" :class="`badge-${car.status}`">
          {{ $t(`car.status.${car.status}`) }}
        </span>
      </div>
      <!-- Favorite button -->
      <button
        v-if="authStore.isAuthenticated"
        class="fav-btn"
        :class="{ 'fav-btn--active': favStore.isFavorite(car.id), 'fav-btn--loading': favStore.isToggling(car.id) }"
        :aria-label="favStore.isFavorite(car.id) ? $t('car.removeFromFavorites') : $t('car.addToFavorites')"
        :title="favStore.isFavorite(car.id) ? $t('car.removeFromFavorites') : $t('car.addToFavorites')"
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

    <!-- Body -->
    <div class="car-card-body">
      <h3 class="car-card-title">{{ car.make }} {{ car.model }}</h3>
      <p class="car-card-year">{{ car.year }}</p>
      <p class="car-card-price">{{ formatPrice(car.price) }}</p>

      <!-- Key Specs -->
      <div class="car-card-specs">
        <span class="car-card-spec" v-if="car.mileage">
          <i class="fa-solid fa-road"></i>
          {{ formatMileage(car.mileage) }}
        </span>
        <span class="car-card-spec" v-if="car.fuel_type">
          <i class="fa-solid fa-gas-pump"></i>
          {{ $t(`car.fuel.${car.fuel_type}`) }}
        </span>
        <span class="car-card-spec" v-if="car.transmission">
          <i class="fa-solid fa-gears"></i>
          {{ $t(`car.trans.${car.transmission}`) }}
        </span>
        <span class="car-card-spec" v-if="car.power_hp">
          <i class="fa-solid fa-bolt"></i>
          {{ car.power_hp }} {{ $t('common.hp') }}
        </span>
      </div>

      <!-- Footer CTA -->
      <div class="car-card-footer">
        <button class="btn-am btn-am-primary btn-am-sm w-full" @click.stop="$emit('view', car)">
          <i class="fa-solid fa-circle-info"></i>
          {{ $t('car.viewDetails') }}
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

const { locale } = useI18n()
const authStore = useAuthStore()
const favStore = useFavoritesStore()

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
.car-card { cursor: pointer; }

.status-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-overlay .car-card-badge {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}

/* ── Favorite Button ─────────────────────────────────────── */
.fav-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  color: #94a3b8;
  font-size: 0.95rem;
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

.fav-btn--active {
  background: #fff;
  color: #ef4444;
}

.fav-btn--active:hover {
  color: #dc2626;
}

.fav-btn--loading {
  pointer-events: none;
  opacity: 0.7;
}
</style>
