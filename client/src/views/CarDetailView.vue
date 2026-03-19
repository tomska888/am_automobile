<template>
  <div class="car-detail-page">
    <AppHeader />

    <LoadingSpinner v-if="loading" />

    <template v-else-if="car">
      <!-- Hero / Breadcrumb Bar -->
      <div class="cd-breadcrumb-bar">
        <div class="cd-container">
          <nav class="cd-breadcrumb" aria-label="breadcrumb">
            <RouterLink to="/" class="cd-bc-link">
              <i class="fa-solid fa-house"></i>
              Home
            </RouterLink>
            <span class="cd-bc-sep"><i class="fa-solid fa-chevron-right"></i></span>
            <RouterLink to="/inventory" class="cd-bc-link">
              {{ $t('nav.inventory') }}
            </RouterLink>
            <span class="cd-bc-sep"><i class="fa-solid fa-chevron-right"></i></span>
            <span class="cd-bc-current">{{ car.make }} {{ car.model }}</span>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <section class="cd-section">
        <div class="cd-container">

          <!-- Top Grid: Image + Info -->
          <div class="cd-top-grid">

            <!-- Left: Image -->
            <div class="cd-image-col">
              <div class="cd-image-wrap">
                <img
                  :src="car.image_url || '/assets/img/car-placeholder.jpg'"
                  :alt="`${car.make} ${car.model}`"
                  class="cd-image"
                />
                <div class="cd-image-badges" v-if="car.badge || car.status">
                  <span v-if="car.badge" class="cd-badge cd-badge-featured">{{ car.badge }}</span>
                  <span class="cd-badge" :class="`cd-badge-${car.status}`">
                    {{ $t(`car.status.${car.status}`) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right: Info Card -->
            <div class="cd-info-col">
              <div class="cd-info-card">
                <!-- Title -->
                <h1 class="cd-car-name">{{ car.make }} {{ car.model }}</h1>
                <p class="cd-car-year">{{ car.year }}</p>

                <!-- Price -->
                <div class="cd-price-block">
                  <span class="cd-price">{{ formatPrice(car.price) }}</span>
                </div>

                <!-- Specs Grid -->
                <div class="cd-specs-grid">
                  <div class="cd-spec-item" v-if="car.mileage">
                    <i class="fa-solid fa-road cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.mileage') }}</div>
                      <div class="cd-spec-value">{{ car.mileage?.toLocaleString() }} km</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.fuel_type">
                    <i class="fa-solid fa-gas-pump cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.fuelType') }}</div>
                      <div class="cd-spec-value">{{ $t(`car.fuel.${car.fuel_type}`) }}</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.transmission">
                    <i class="fa-solid fa-gears cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.transmission') }}</div>
                      <div class="cd-spec-value">{{ $t(`car.trans.${car.transmission}`) }}</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.power_hp">
                    <i class="fa-solid fa-bolt cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.power') }}</div>
                      <div class="cd-spec-value">{{ car.power_hp }} {{ $t('common.hp') }}</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.color">
                    <i class="fa-solid fa-palette cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.color') }}</div>
                      <div class="cd-spec-value">{{ car.color }}</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.body_type">
                    <i class="fa-solid fa-car cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.bodyType') }}</div>
                      <div class="cd-spec-value">{{ $t(`car.body.${car.body_type}`) }}</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.engine_size">
                    <i class="fa-solid fa-engine cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">{{ $t('car.engineSize') }}</div>
                      <div class="cd-spec-value">{{ car.engine_size }}L</div>
                    </div>
                  </div>
                  <div class="cd-spec-item" v-if="car.vin">
                    <i class="fa-solid fa-barcode cd-spec-icon"></i>
                    <div>
                      <div class="cd-spec-label">VIN</div>
                      <div class="cd-spec-value cd-vin">{{ car.vin }}</div>
                    </div>
                  </div>
                </div>

                <!-- CTAs -->
                <div class="cd-cta-stack">
                  <button class="btn-am btn-am-primary btn-am-lg cd-cta-btn" @click="openContact">
                    <i class="fa-solid fa-envelope"></i>
                    {{ $t('car.contactAbout') }}
                  </button>
                  <a href="tel:+48123456789" class="btn-am btn-am-outline btn-am-lg cd-cta-btn">
                    <i class="fa-solid fa-phone"></i>
                    +48 123 456 789
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Grid: Description + Features -->
          <div class="cd-bottom-grid">
            <!-- Description -->
            <div class="cd-desc-card" v-if="car.description">
              <h2 class="cd-section-title">
                <i class="fa-solid fa-file-lines"></i>
                {{ $t('car.description') }}
              </h2>
              <p class="cd-desc-text">{{ car.description }}</p>
            </div>

            <!-- Features -->
            <div class="cd-features-card">
              <h2 class="cd-section-title">
                <i class="fa-solid fa-list-check"></i>
                {{ $t('car.features') }}
              </h2>
              <ul class="cd-features-list" v-if="car.features?.length">
                <li v-for="feat in car.features" :key="feat" class="cd-feature-item">
                  <i class="fa-solid fa-check cd-feature-check"></i>
                  {{ feat }}
                </li>
              </ul>
              <p v-else class="cd-no-features">{{ $t('common.noData') }}</p>
            </div>
          </div>

        </div>
      </section>
    </template>

    <!-- Not found state -->
    <div v-else class="cd-not-found">
      <i class="fa-solid fa-car-burst cd-not-found-icon"></i>
      <h2 class="cd-not-found-title">Car not found</h2>
      <p class="cd-not-found-sub">This vehicle may have been sold or removed.</p>
      <RouterLink to="/inventory" class="btn-am btn-am-primary">
        <i class="fa-solid fa-arrow-left"></i>
        Back to Inventory
      </RouterLink>
    </div>

    <AppFooter />
    <ContactModal :car-subject="car ? `${car.make} ${car.model} (${car.year})` : ''" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCarsStore } from '@/stores/cars.js'
import { useUiStore } from '@/stores/ui.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ContactModal from '@/components/ui/ContactModal.vue'

const route     = useRoute()
const { locale }= useI18n()
const carsStore = useCarsStore()
const uiStore   = useUiStore()

const car     = ref(null)
const loading = ref(true)

onMounted(async () => {
  car.value = await carsStore.fetchCarById(route.params.id)
  loading.value = false
})

function formatPrice(price) {
  return new Intl.NumberFormat(locale.value === 'pl' ? 'pl-PL' : 'en-EU', {
    style: 'currency', currency: locale.value === 'pl' ? 'PLN' : 'EUR', maximumFractionDigits: 0
  }).format(price)
}

function openContact() {
  uiStore.openContactModal?.()
}
</script>

<style scoped>
/* ── PAGE WRAPPER ─────────────────────────────────────────── */
.car-detail-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: var(--nav-height, 72px);
  display: flex;
  flex-direction: column;
}

/* ── BREADCRUMB BAR ───────────────────────────────────────── */
.cd-breadcrumb-bar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.875rem 0;
}

.cd-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.cd-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cd-bc-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}
.cd-bc-link:hover { color: var(--accent); }
.cd-bc-link i { font-size: 0.75rem; }

.cd-bc-sep {
  color: var(--text-muted);
  font-size: 0.65rem;
}

.cd-bc-current {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
.cd-section {
  flex: 1;
  padding: 2.5rem 0 4rem;
}

/* ── TOP GRID ─────────────────────────────────────────────── */
.cd-top-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2rem;
  align-items: start;
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .cd-top-grid {
    grid-template-columns: 1fr;
  }
}

/* ── IMAGE ────────────────────────────────────────────────── */
.cd-image-wrap {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.cd-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cd-image-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cd-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cd-badge-featured {
  background: linear-gradient(135deg, #ffc107, #ff8f00);
  color: #1a1a1a;
}
.cd-badge-available {
  background: rgba(40,167,69,0.15);
  color: #28a745;
  border: 1px solid rgba(40,167,69,0.3);
}
.cd-badge-sold {
  background: rgba(220,53,69,0.15);
  color: #dc3545;
  border: 1px solid rgba(220,53,69,0.3);
}
.cd-badge-reserved {
  background: rgba(255,193,7,0.15);
  color: #ffc107;
  border: 1px solid rgba(255,193,7,0.3);
}

/* ── INFO CARD ────────────────────────────────────────────── */
.cd-info-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: calc(var(--nav-height, 72px) + 1.5rem);
}

.cd-car-name {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0 0 0.25rem;
}

.cd-car-year {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0 0 1.25rem;
}

.cd-price-block {
  background: var(--accent-light);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 123, 255, 0.15);
}

.cd-price {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--accent);
  letter-spacing: -0.02em;
}

/* ── SPECS GRID ───────────────────────────────────────────── */
.cd-specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
}

.cd-spec-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: border-color 0.2s ease;
}
.cd-spec-item:hover {
  border-color: var(--accent);
}

.cd-spec-icon {
  color: var(--accent);
  font-size: 0.875rem;
  margin-top: 3px;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
}

.cd-spec-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 3px;
}

.cd-spec-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.cd-vin {
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
}

/* ── CTA STACK ────────────────────────────────────────────── */
.cd-cta-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cd-cta-btn {
  width: 100%;
  justify-content: center;
}

/* ── BOTTOM GRID ──────────────────────────────────────────── */
.cd-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 900px) {
  .cd-bottom-grid {
    grid-template-columns: 1fr;
  }
}

.cd-desc-card,
.cd-features-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
}

.cd-section-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border-color);
}

.cd-section-title i {
  color: var(--accent);
  font-size: 0.9375rem;
}

.cd-desc-text {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
}

.cd-features-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cd-feature-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  padding: 0.375rem 0;
}

.cd-feature-check {
  color: var(--success);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.cd-no-features {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

/* ── NOT FOUND ────────────────────────────────────────────── */
.cd-not-found {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
}

.cd-not-found-icon {
  font-size: 4rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.cd-not-found-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.cd-not-found-sub {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0 0 2rem;
}
</style>
