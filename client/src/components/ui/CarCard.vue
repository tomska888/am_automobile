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

const { locale } = useI18n()

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

function formatPrice(price) {
  if (!price) return '—'
  return new Intl.NumberFormat(locale.value === 'pl' ? 'pl-PL' : 'en-EU', {
    style:    'currency',
    currency: locale.value === 'pl' ? 'PLN' : 'EUR',
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
</style>
