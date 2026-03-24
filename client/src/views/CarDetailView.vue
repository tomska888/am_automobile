<template>
  <div class="car-detail-page">
    <AppHeader :heroBelow="pageScrolled" />

    <LoadingSpinner v-if="loading" />

    <template v-else-if="car">
      <!-- Hero / Breadcrumb Bar -->
      <div class="cd-breadcrumb-bar" :class="{ 'cd-breadcrumb-bar--scrolled': pageScrolled }">
        <nav class="cd-breadcrumb cd-container" aria-label="breadcrumb">
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

      <!-- MAIN LAYOUT: Gallery + Sticky Card -->
      <section class="cd-section">
        <div class="cd-container">
          <div class="cd-main-grid">

            <!-- GALLERY: grid-area "gallery" -->
            <div class="cd-gallery">
              <div class="cd-gallery-main" role="region" aria-label="Car image gallery">
                <button
                  class="cd-gallery-arrow cd-gallery-arrow--left"
                  @click="prevImage"
                  :disabled="allImages.length <= 1"
                  aria-label="Previous image"
                >
                  <i class="fa-solid fa-chevron-left"></i>
                </button>

                <div class="cd-gallery-img-wrap" @click="openLightbox(activeImageIndex)">
                  <img
                    :src="allImages[activeImageIndex] || '/assets/img/car-placeholder.jpg'"
                    :alt="car.make + ' ' + car.model + ' image ' + (activeImageIndex + 1)"
                    class="cd-gallery-img"
                    @error="onImgError"
                  />
                  <span class="cd-gallery-counter">
                    <i class="fa-solid fa-images"></i>
                    {{ activeImageIndex + 1 }} / {{ allImages.length }}
                  </span>
                  <span class="cd-gallery-zoom-hint">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </div>

                <button
                  class="cd-gallery-arrow cd-gallery-arrow--right"
                  @click="nextImage"
                  :disabled="allImages.length <= 1"
                  aria-label="Next image"
                >
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>

              <div class="cd-gallery-thumbs" role="list" aria-label="Image thumbnails">
                <button
                  v-for="(img, idx) in allImages"
                  :key="idx"
                  class="cd-gallery-thumb"
                  :class="{ 'cd-gallery-thumb--active': idx === activeImageIndex }"
                  @click="setImage(idx)"
                  :aria-label="'View image ' + (idx + 1)"
                  :aria-current="idx === activeImageIndex ? 'true' : 'false'"
                  role="listitem"
                >
                  <img
                    :src="img"
                    :alt="car.make + ' ' + car.model + ' thumbnail ' + (idx + 1)"
                    class="cd-gallery-thumb-img"
                    @error="onImgError"
                  />
                </button>
              </div>
            </div>

            <!-- ── Lightbox ─────────────────────────────────────────────── -->
            <Teleport to="body">
              <Transition name="lb-fade">
                <div
                  v-if="lightboxOpen"
                  class="cd-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Image lightbox"
                  @click.self="closeLightbox"
                >
                  <!-- Close -->
                  <button class="lb-close" @click="closeLightbox" aria-label="Close lightbox">
                    <i class="fa-solid fa-xmark"></i>
                  </button>

                  <!-- Counter -->
                  <div class="lb-counter">
                    {{ activeImageIndex + 1 }} / {{ allImages.length }}
                  </div>

                  <!-- Prev arrow -->
                  <button
                    class="lb-arrow lb-arrow--left"
                    @click="prevImage"
                    :disabled="allImages.length <= 1"
                    aria-label="Previous image"
                  >
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>

                  <!-- Image with pan-zoom on hover -->
                  <div class="lb-img-wrap">
                    <Transition name="lb-img" mode="out-in">
                      <div
                        :key="activeImageIndex"
                        class="lb-zoom-container"
                        :class="{ 'is-panning': lbPanning }"
                        @mouseenter="lbPanning = true"
                        @mouseleave="lbPanning = false; lbResetZoom()"
                        @mousemove="lbOnMouseMove"
                        ref="lbZoomRef"
                      >
                        <img
                          ref="lbImgRef"
                          :src="allImages[activeImageIndex]"
                          :alt="car.make + ' ' + car.model + ' image ' + (activeImageIndex + 1)"
                          class="lb-img"
                          :style="lbImgStyle"
                          @error="onImgError"
                        />
                        <span class="lb-zoom-hint" v-if="!lbPanning">
                          <i class="fa-solid fa-magnifying-glass-plus"></i>
                          Hover to zoom
                        </span>
                      </div>
                    </Transition>
                  </div>

                  <!-- Next arrow -->
                  <button
                    class="lb-arrow lb-arrow--right"
                    @click="nextImage"
                    :disabled="allImages.length <= 1"
                    aria-label="Next image"
                  >
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>

                  <!-- Thumbnail strip -->
                  <div class="lb-thumbs" v-if="allImages.length > 1">
                    <button
                      v-for="(img, idx) in allImages"
                      :key="idx"
                      class="lb-thumb"
                      :class="{ 'lb-thumb--active': idx === activeImageIndex }"
                      @click="setImage(idx)"
                      :aria-label="'View image ' + (idx + 1)"
                    >
                      <img :src="img" :alt="'Thumb ' + (idx + 1)" @error="onImgError" />
                    </button>
                  </div>
                </div>
              </Transition>
            </Teleport>

            <!-- RIGHT COLUMN: Sticky Info Card (in DOM before data-col so mobile shows: gallery → card → data) -->
            <div class="cd-right-col">
              <div class="cd-info-card">
                <h1 class="cd-car-name">{{ car.make }} {{ car.model }}</h1>

                <div class="cd-price-main">{{ formatPrice(car.price) }}</div>
                <div class="cd-price-sub">
                  <span>{{ formatPrice(netPrice) }} (net)</span>
                  <span class="cd-price-sep">,</span>
                  <span>19 % VAT</span>
                </div>

                <hr class="cd-card-divider" />

                <div class="cd-phone-row">
                  <span class="cd-phone-masked" v-if="!phoneRevealed">Tel.: +48 (0)... ...</span>
                  <a v-else :href="'tel:' + contactPhone" class="cd-phone-revealed">
                    <i class="fa-solid fa-phone"></i>
                    {{ contactPhone }}
                  </a>
                  <button
                    class="cd-phone-reveal-btn"
                    @click="phoneRevealed = !phoneRevealed"
                    :aria-label="phoneRevealed ? 'Hide phone number' : 'Show phone number'"
                  >
                    <i :class="phoneRevealed ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                    {{ phoneRevealed ? 'Hide' : 'Show' }}
                  </button>
                </div>

                <button class="cd-btn-email" @click="openContact">
                  <i class="fa-solid fa-envelope"></i>
                  Write an email
                </button>

                <div class="cd-action-row">
                  <button
                    class="cd-btn-action"
                    :class="{ 'cd-btn-action--active': isFavorited }"
                    @click="toggleFavorite"
                    :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
                    :aria-pressed="isFavorited"
                  >
                    <i :class="isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    {{ isFavorited ? 'Saved' : 'Favorites' }}
                  </button>
                  <button class="cd-btn-action" :class="{ 'cd-btn-action--copied': linkCopied }" @click="shareListing" aria-label="Share this listing">
                    <i :class="linkCopied ? 'fa-solid fa-check' : 'fa-solid fa-share-nodes'"></i>
                    {{ linkCopied ? 'Copied' : 'Share' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- DATA COLUMN: Quick stats + collapsible cards (grid-area "data") -->
            <div class="cd-data-col">

              <!-- QUICK STATS -->
              <div class="cd-quick-stats-card">
                <div class="cd-quick-stats-grid">
                  <div class="cd-qs-item" v-if="car.mileage">
                    <span class="cd-qs-icon"><i class="fa-solid fa-gauge-high"></i></span>
                    <div class="cd-qs-body">
                      <span class="cd-qs-label">Mileage</span>
                      <span class="cd-qs-value">{{ car.mileage?.toLocaleString() }} km</span>
                    </div>
                  </div>
                  <div class="cd-qs-item" v-if="car.power_hp">
                    <span class="cd-qs-icon"><i class="fa-solid fa-tachometer-alt"></i></span>
                    <div class="cd-qs-body">
                      <span class="cd-qs-label">Performance</span>
                      <span class="cd-qs-value">{{ Math.round(car.power_hp * 0.7457) }} kW ({{ car.power_hp }} hp)</span>
                    </div>
                  </div>
                  <div class="cd-qs-item" v-if="car.fuel_type">
                    <span class="cd-qs-icon"><i class="fa-solid fa-gas-pump"></i></span>
                    <div class="cd-qs-body">
                      <span class="cd-qs-label">Fuel type</span>
                      <span class="cd-qs-value">{{ capitalize(car.fuel_type) }}</span>
                    </div>
                  </div>
                  <div class="cd-qs-item" v-if="car.transmission">
                    <span class="cd-qs-icon"><i class="fa-solid fa-gears"></i></span>
                    <div class="cd-qs-body">
                      <span class="cd-qs-label">Transmission</span>
                      <span class="cd-qs-value">{{ capitalize(car.transmission) }}</span>
                    </div>
                  </div>
                  <div class="cd-qs-item" v-if="car.year">
                    <span class="cd-qs-icon"><i class="fa-solid fa-calendar-check"></i></span>
                    <div class="cd-qs-body">
                      <span class="cd-qs-label">First registration</span>
                      <span class="cd-qs-value">{{ car.year }}</span>
                    </div>
                  </div>
                  <div class="cd-qs-item">
                    <span class="cd-qs-icon"><i class="fa-solid fa-user-shield"></i></span>
                    <div class="cd-qs-body">
                      <span class="cd-qs-label">{{ $t('car.owners') }}</span>
                      <span class="cd-qs-value">{{ car.owners ?? '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TECHNICAL DATA (collapsible) -->
              <div class="cd-collapse-card">
                <button
                  class="cd-collapse-header"
                  @click="techOpen = !techOpen"
                  :aria-expanded="techOpen"
                  aria-controls="tech-data-panel"
                >
                  <span class="cd-collapse-title">Technical data</span>
                  <i class="fa-solid fa-chevron-down cd-collapse-chevron" :class="{ 'cd-collapse-chevron--open': techOpen }"></i>
                </button>
                <div id="tech-data-panel" class="cd-collapse-body" :class="{ 'cd-collapse-body--open': techOpen }">
                  <div class="cd-collapse-inner">
                    <div class="cd-clamp-wrap" :class="{ 'cd-clamp-wrap--expanded': techExpanded }">
                      <table class="cd-tech-table">
                        <tbody>
                          <tr v-if="car.status">
                            <td class="cd-tech-label">Vehicle condition</td>
                            <td class="cd-tech-value">{{ capitalize(car.status) }}</td>
                          </tr>
                          <tr v-if="car.body_type">
                            <td class="cd-tech-label">Category</td>
                            <td class="cd-tech-value">{{ capitalize(car.body_type) }}</td>
                          </tr>
                          <tr v-if="car.mileage">
                            <td class="cd-tech-label">Mileage</td>
                            <td class="cd-tech-value cd-tech-value--link">{{ car.mileage?.toLocaleString() }} km</td>
                          </tr>
                          <tr v-if="car.engine_size">
                            <td class="cd-tech-label">Engine displacement</td>
                            <td class="cd-tech-value">{{ car.engine_size }} L</td>
                          </tr>
                          <tr v-if="car.power_hp">
                            <td class="cd-tech-label">Performance</td>
                            <td class="cd-tech-value">{{ Math.round(car.power_hp * 0.7457) }} kW ({{ car.power_hp }} hp)</td>
                          </tr>
                          <tr v-if="car.fuel_type">
                            <td class="cd-tech-label">Fuel type</td>
                            <td class="cd-tech-value">{{ capitalize(car.fuel_type) }}</td>
                          </tr>
                          <tr v-if="car.transmission">
                            <td class="cd-tech-label">Transmission</td>
                            <td class="cd-tech-value">{{ capitalize(car.transmission) }}</td>
                          </tr>
                          <tr v-if="car.color">
                            <td class="cd-tech-label">Color</td>
                            <td class="cd-tech-value">{{ car.color }}</td>
                          </tr>
                          <tr v-if="car.year">
                            <td class="cd-tech-label">First registration</td>
                            <td class="cd-tech-value">{{ car.year }}</td>
                          </tr>
                          <tr>
                            <td class="cd-tech-label">{{ $t('car.ownersLong') }}</td>
                            <td class="cd-tech-value">{{ car.owners ?? '—' }}</td>
                          </tr>
                          <tr v-if="car.vin">
                            <td class="cd-tech-label">Vehicle number</td>
                            <td class="cd-tech-value">{{ car.vin }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="cd-clamp-fade" aria-hidden="true" v-if="!techExpanded"></div>
                    </div>
                    <button class="cd-show-more-btn" @click="techExpanded = !techExpanded">
                      <span>{{ techExpanded ? 'Show less' : 'Show more' }}</span>
                      <i class="fa-solid fa-chevron-down cd-show-more-chevron" :class="{ 'cd-show-more-chevron--up': techExpanded }"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- FEATURES (collapsible, two-column) -->
              <div class="cd-collapse-card" v-if="allFeatures.length">
                <button
                  class="cd-collapse-header"
                  @click="featuresOpen = !featuresOpen"
                  :aria-expanded="featuresOpen"
                  aria-controls="features-panel"
                >
                  <span class="cd-collapse-title">Features</span>
                  <i class="fa-solid fa-chevron-down cd-collapse-chevron" :class="{ 'cd-collapse-chevron--open': featuresOpen }"></i>
                </button>
                <div id="features-panel" class="cd-collapse-body" :class="{ 'cd-collapse-body--open': featuresOpen }">
                  <div class="cd-collapse-inner">
                    <div class="cd-clamp-wrap" :class="{ 'cd-clamp-wrap--expanded': featuresExpanded }">
                      <div class="cd-features-two-col">
                        <ul class="cd-features-col">
                          <li v-for="feat in leftFeatures" :key="feat" class="cd-feature-row">
                            <span class="cd-feature-name">{{ feat }}</span>
                            <i class="fa-solid fa-check cd-feature-check"></i>
                          </li>
                        </ul>
                        <div class="cd-features-divider" aria-hidden="true"></div>
                        <ul class="cd-features-col">
                          <li v-for="feat in rightFeatures" :key="feat" class="cd-feature-row">
                            <span class="cd-feature-name">{{ feat }}</span>
                            <i class="fa-solid fa-check cd-feature-check"></i>
                          </li>
                        </ul>
                      </div>
                      <div class="cd-clamp-fade" aria-hidden="true" v-if="!featuresExpanded"></div>
                    </div>
                    <button class="cd-show-more-btn" @click="featuresExpanded = !featuresExpanded">
                      <span>{{ featuresExpanded ? 'Show less' : 'Show more' }}</span>
                      <i class="fa-solid fa-chevron-down cd-show-more-chevron" :class="{ 'cd-show-more-chevron--up': featuresExpanded }"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- VEHICLE DESCRIPTION (collapsible, rich text) -->
              <div class="cd-collapse-card" v-if="car.description">
                <button
                  class="cd-collapse-header"
                  @click="descOpen = !descOpen"
                  :aria-expanded="descOpen"
                  aria-controls="desc-panel"
                >
                  <span class="cd-collapse-title">Vehicle description</span>
                  <i class="fa-solid fa-chevron-down cd-collapse-chevron" :class="{ 'cd-collapse-chevron--open': descOpen }"></i>
                </button>
                <div id="desc-panel" class="cd-collapse-body" :class="{ 'cd-collapse-body--open': descOpen }">
                  <div class="cd-collapse-inner">
                    <div class="cd-clamp-wrap" :class="{ 'cd-clamp-wrap--expanded': descExpanded }">
                      <div class="cd-desc-rich" v-html="renderDescription(car.description)"></div>
                      <div class="cd-clamp-fade" aria-hidden="true" v-if="!descExpanded"></div>
                    </div>
                    <button class="cd-show-more-btn" @click="descExpanded = !descExpanded">
                      <span>{{ descExpanded ? 'Show less' : 'Show more' }}</span>
                      <i class="fa-solid fa-chevron-down cd-show-more-chevron" :class="{ 'cd-show-more-chevron--up': descExpanded }"></i>
                    </button>
                  </div>
                </div>
              </div>

            </div><!-- /cd-data-col -->
          </div>
        </div>
      </section>

    </template>

    <div v-else-if="!loading" class="cd-not-found">
      <i class="fa-solid fa-car-burst cd-not-found-icon"></i>
      <h2 class="cd-not-found-title">Car not found</h2>
      <p class="cd-not-found-sub">This vehicle may have been sold or removed.</p>
      <RouterLink to="/inventory" class="btn-am btn-am-primary">
        <i class="fa-solid fa-arrow-left"></i>
        Back to Inventory
      </RouterLink>
    </div>

    <AppFooter />
    <ContactModal :car-subject="car ? car.make + ' ' + car.model + ' (' + car.year + ')' : ''" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCarsStore } from '@/stores/cars.js'
import { useUiStore } from '@/stores/ui.js'
import { useFavoritesStore } from '@/stores/favorites.js'
import { useAuthStore } from '@/stores/auth.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ContactModal from '@/components/ui/ContactModal.vue'

const route          = useRoute()
const { locale }     = useI18n()
const carsStore      = useCarsStore()
const uiStore        = useUiStore()
const favoritesStore = useFavoritesStore()
const authStore      = useAuthStore()

// ── State ────────────────────────────────────────────────────
const car              = ref(null)
const loading          = ref(true)
const activeImageIndex = ref(0)
const techOpen         = ref(true)
const featuresOpen     = ref(true)
const descOpen         = ref(true)
const techExpanded     = ref(false)
const featuresExpanded = ref(false)
const descExpanded     = ref(false)
const phoneRevealed    = ref(false)
const contactPhone     = '+48 123 456 789'
const pageScrolled     = ref(false)
const lightboxOpen     = ref(false)

// ── Lightbox pan-zoom ────────────────────────────────────────
const lbPanning    = ref(false)
const lbZoomRef    = ref(null)
const lbImgRef     = ref(null)
const lbImgStyle   = ref({})

function lbOnMouseMove(e) {
  const el = lbZoomRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width)  * 100
  const y = ((e.clientY - rect.top)  / rect.height) * 100
  lbImgStyle.value = {
    transform: 'scale(2.2)',
    transformOrigin: `${x}% ${y}%`,
    transition: 'transform-origin 0.05s linear',
    cursor: 'crosshair',
  }
}

function lbResetZoom() {
  lbImgStyle.value = {}
}

// ── Favorites (driven by favoritesStore, not localStorage) ───
const isFavorited = computed(() =>
  favoritesStore.isFavorite(Number(route.params.id))
)

function onPageScroll() {
  pageScrolled.value = window.scrollY > 80
  if (pageScrolled.value) {
    document.body.classList.add('has-breadcrumb-pill')
  } else {
    document.body.classList.remove('has-breadcrumb-pill')
  }
}

// ── Computed ─────────────────────────────────────────────────
const allImages = computed(() => {
  if (!car.value) return []
  const imgs = []
  if (car.value.image_url) imgs.push(car.value.image_url)
  if (car.value.gallery) {
    try {
      const parsed = typeof car.value.gallery === 'string'
        ? JSON.parse(car.value.gallery)
        : car.value.gallery
      if (Array.isArray(parsed)) imgs.push(...parsed)
    } catch {}
  }
  return imgs.length ? imgs : ['/assets/img/car-placeholder.jpg']
})

const netPrice = computed(() => {
  if (!car.value?.price) return 0
  return Math.round(car.value.price / 1.19)
})

const allFeatures = computed(() => {
  if (!car.value?.features) return []
  try {
    const parsed = typeof car.value.features === 'string'
      ? JSON.parse(car.value.features)
      : car.value.features
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
})

const leftFeatures = computed(() =>
  allFeatures.value.slice(0, Math.ceil(allFeatures.value.length / 2))
)
const rightFeatures = computed(() =>
  allFeatures.value.slice(Math.ceil(allFeatures.value.length / 2))
)

// ── Lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  car.value = await carsStore.fetchCarById(route.params.id)
  loading.value = false
  // Ensure favorite IDs are loaded (noop if already loaded or not logged in)
  if (authStore.isAuthenticated) {
    await favoritesStore.fetchFavoriteIds()
  }
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', onPageScroll, { passive: true })
  onPageScroll()
})

onUnmounted(() => {
  document.body.classList.remove('has-breadcrumb-pill')
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', onPageScroll)
})

// ── Gallery ──────────────────────────────────────────────────
function setImage(idx) {
  activeImageIndex.value = idx
}

function prevImage() {
  activeImageIndex.value =
    (activeImageIndex.value - 1 + allImages.value.length) % allImages.value.length
}

function nextImage() {
  activeImageIndex.value =
    (activeImageIndex.value + 1) % allImages.value.length
}

function openLightbox(idx) {
  activeImageIndex.value = idx
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function handleKeydown(e) {
  if (e.key === 'ArrowLeft')  prevImage()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'Escape' && lightboxOpen.value) closeLightbox()
}

function onImgError(e) {
  e.target.src = '/assets/img/car-placeholder.jpg'
}

// ── Formatting ────────────────────────────────────────────────
function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

// ── Rich-text description renderer ───────────────────────────
function renderDescription(text) {
  if (!text) return ''
  // If content contains HTML tags, it was saved by the WYSIWYG editor — pass through directly
  if (/<[a-z][\s\S]*>/i.test(text)) return text
  // Legacy: plain markdown-style text
  const lines = text.split('\n')
  let html = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { html += '<br>'; continue }
    if (trimmed.startsWith('* ')) {
      html += '<li>' + applyInline(trimmed.slice(2)) + '</li>'
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      html += '<h4 class="cd-desc-heading">' + trimmed.slice(2, -2) + '</h4>'
    } else {
      html += '<p>' + applyInline(trimmed) + '</p>'
    }
  }
  // wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)+/g, (match) => '<ul class="cd-desc-list">' + match + '</ul>')
  return html
}

function applyInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,   '<em>$1</em>')
}

// ── Actions ───────────────────────────────────────────────────
function openContact() {
  uiStore.openContactModal?.()
}

async function toggleFavorite() {
  if (!authStore.isAuthenticated) {
    uiStore.addToast({ type: 'info', message: 'Please log in to save favorites.' })
    return
  }
  await favoritesStore.toggleFavorite(Number(route.params.id))
}

const linkCopied = ref(false)
let copiedTimer  = null

async function shareListing() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    linkCopied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { linkCopied.value = false }, 2500)
  } catch {
    // Fallback: create temp input for older browsers
    const el = document.createElement('input')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    linkCopied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { linkCopied.value = false }, 2500)
  }
}
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   PAGE WRAPPER
══════════════════════════════════════════════════════════ */
.car-detail-page {
  min-height: 100vh;
  background: var(--bg-primary);
  /* nav (72px) + breadcrumb bar (~40px) */
  padding-top: calc(var(--nav-height, 72px) + 40px);
  display: flex;
  flex-direction: column;
}

/* ══════════════════════════════════════════════════════════
   SHARED CONTAINER
══════════════════════════════════════════════════════════ */
.cd-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ══════════════════════════════════════════════════════════
   BREADCRUMB BAR — fixed pill, mirrors header behaviour
══════════════════════════════════════════════════════════ */
.cd-breadcrumb-bar {
  position: fixed;
  top: var(--nav-height, 72px); /* flush below the header */
  left: 0;
  right: 0;
  z-index: 99;
  background: linear-gradient(135deg, #0A3F75 0%, #0A4B8C 100%);
  border-radius: 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem 0;
  transition:
    top           0.35s cubic-bezier(0.4, 0, 0.2, 1),
    left          0.35s cubic-bezier(0.4, 0, 0.2, 1),
    right         0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow    0.35s ease;
}

/* Scrolled: attach flush below the navbar pill — no gap, rounded only at bottom */
.cd-breadcrumb-bar--scrolled {
  top: calc(8px + var(--nav-height, 72px)); /* flush directly below pill bar (pill top=10px + nav height=72px) */
  left: 24px;
  right: 24px;
  border-radius: 0 0 28px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}
.cd-bc-link:hover { color: #fff; }
.cd-bc-link i { font-size: 0.75rem; }

.cd-bc-sep {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.65rem;
}

.cd-bc-current {
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
}

/* ══════════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════════ */
.cd-section {
  flex: 1;
  padding: 2rem 0 5rem;
}

/* ══════════════════════════════════════════════════════════
   THREE-AREA MAIN GRID
   Desktop areas:
     "gallery  card"
     "data     card"
   Mobile (single col, DOM order): gallery → card → data
══════════════════════════════════════════════════════════ */
.cd-main-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "gallery card"
    "data    card";
  gap: 2rem;
  align-items: start;
}

.cd-data-col {
  grid-area: data;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cd-right-col {
  grid-area: card;
  position: sticky;
  /* nav + breadcrumb bar (40px) + gap */
  top: calc(var(--nav-height, 72px) + 40px + 1.25rem);
  align-self: start;
}

/* ══════════════════════════════════════════════════════════
   IMAGE GALLERY
══════════════════════════════════════════════════════════ */
.cd-gallery {
  grid-area: gallery;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

/* Main viewport */
.cd-gallery-main {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
}

.cd-gallery-img-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: zoom-in;
}

.cd-gallery-img-wrap:hover .cd-gallery-zoom-hint {
  opacity: 1;
}

.cd-gallery-zoom-hint {
  position: absolute;
  top: 0.75rem;
  right: 0.875rem;
  width: 2rem;
  height: 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.cd-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.25s ease, transform 0.3s ease;
}

.cd-gallery-img-wrap:hover .cd-gallery-img {
  transform: scale(1.02);
}

/* Counter badge */
.cd-gallery-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 0.875rem;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
  user-select: none;
}

/* Arrow buttons */
.cd-gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}
.cd-gallery-arrow:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.7);
  transform: translateY(-50%) scale(1.08);
}
.cd-gallery-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}
.cd-gallery-arrow--left  { left: 0.75rem; }
.cd-gallery-arrow--right { right: 0.75rem; }
.cd-gallery-arrow i { font-size: 0.75rem; }

/* Thumbnails strip */
.cd-gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.cd-gallery-thumb {
  flex-shrink: 0;
  width: 72px;
  height: 52px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.18s ease, transform 0.15s ease;
}
.cd-gallery-thumb:hover {
  border-color: var(--accent);
  transform: scale(1.04);
}
.cd-gallery-thumb--active {
  border-color: var(--accent) !important;
}

.cd-gallery-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ══════════════════════════════════════════════════════════
   QUICK STATS
══════════════════════════════════════════════════════════ */
.cd-quick-stats-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
}

.cd-quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 600px) {
  .cd-quick-stats-grid { grid-template-columns: repeat(2, 1fr); }
}

.cd-qs-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.cd-qs-icon {
  color: var(--accent);
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.cd-qs-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cd-qs-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.cd-qs-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* ══════════════════════════════════════════════════════════
   COLLAPSIBLE CARDS (Tech data, Equipment, Description)
══════════════════════════════════════════════════════════ */
.cd-collapse-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.cd-collapse-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.18s ease;
}
.cd-collapse-header:hover {
  background: var(--bg-secondary);
}

.cd-collapse-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.cd-collapse-chevron {
  color: var(--text-muted);
  font-size: 0.8125rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}
.cd-collapse-chevron--open {
  transform: rotate(180deg);
}

/* Grid-rows animation trick */
.cd-collapse-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.32s ease;
}
.cd-collapse-body--open {
  grid-template-rows: 1fr;
}

.cd-collapse-inner {
  overflow: hidden;
  padding: 0 1.5rem;
}
.cd-collapse-body--open .cd-collapse-inner {
  padding: 1.25rem 1.5rem;
}

/* ══════════════════════════════════════════════════════════
   SHOW MORE / LESS CLAMP
══════════════════════════════════════════════════════════ */
.cd-clamp-wrap {
  position: relative;
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.cd-clamp-wrap--expanded {
  max-height: 9999px;
}

.cd-clamp-fade {
  position: absolute;
  inset: auto 0 0 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--bg-primary) 100%
  );
  pointer-events: none;
}

.cd-show-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  width: 100%;
  margin-top: 0.875rem;
  padding: 0.25rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
  transition: color 0.2s, opacity 0.2s;
}
.cd-show-more-btn:hover {
  opacity: 0.75;
}

.cd-show-more-chevron {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}
.cd-show-more-chevron--up {
  transform: rotate(180deg);
}

/* Share button — copied state */
.cd-btn-action--copied {
  color: #16a34a !important;
}

/* ══════════════════════════════════════════════════════════
   TECHNICAL DATA TABLE
══════════════════════════════════════════════════════════ */
.cd-tech-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.cd-tech-table tr {
  border-bottom: 1px solid var(--border-color);
}
.cd-tech-table tr:last-child {
  border-bottom: none;
}
.cd-tech-table tr:nth-child(even) {
  background: var(--bg-secondary);
}

.cd-tech-label {
  padding: 0.7rem 0.75rem 0.7rem 0.7rem;
  color: var(--text-secondary);
  font-weight: 500;
  width: 50%;
}

.cd-tech-value {
  padding: 0.7rem 0 0.7rem 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
}

.cd-tech-value--link {
  color: var(--accent);
}

/* ══════════════════════════════════════════════════════════
   EQUIPMENT — two-column list
══════════════════════════════════════════════════════════ */
.cd-features-two-col {
  display: flex;
  gap: 0;
}

.cd-features-col {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cd-features-divider {
  width: 1px;
  background: var(--border-color);
  margin: 0 1rem;
  flex-shrink: 0;
}

.cd-feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-primary);
}
.cd-feature-row:last-child { border-bottom: none; }

.cd-feature-name { flex: 1; }

.cd-feature-check {
  color: var(--success, #28a745);
  font-size: 0.75rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .cd-features-two-col { flex-direction: column; }
  .cd-features-divider { width: 100%; height: 1px; margin: 0.75rem 0; }
}

/* ══════════════════════════════════════════════════════════
   VEHICLE DESCRIPTION — rich text
══════════════════════════════════════════════════════════ */
.cd-desc-rich {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

:deep(.cd-desc-rich p) {
  margin: 0 0 0.75rem;
}
:deep(.cd-desc-rich h4.cd-desc-heading) {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 1.25rem 0 0.5rem;
}
:deep(.cd-desc-rich ul.cd-desc-list) {
  margin: 0 0 0.75rem 1.25rem;
  padding: 0;
}
:deep(.cd-desc-rich ul.cd-desc-list li) {
  margin-bottom: 0.25rem;
}

/* WYSIWYG HTML output styles */
:deep(.cd-desc-rich strong),
:deep(.cd-desc-rich b) {
  font-weight: 700;
  color: var(--text-primary);
}
:deep(.cd-desc-rich ul) {
  margin: 0 0 0.75rem 1.25rem;
  padding: 0;
  list-style: disc;
}
:deep(.cd-desc-rich li) {
  margin-bottom: 0.25rem;
}
:deep(.cd-desc-rich hr) {
  border: none;
  border-top: 1.5px solid var(--border-color);
  margin: 0.85rem 0;
}
:deep(.cd-desc-rich br) {
  display: block;
  content: '';
  margin-top: 0.4rem;
}

/* ══════════════════════════════════════════════════════════
   RIGHT CARD — Info Card
══════════════════════════════════════════════════════════ */
.cd-info-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: var(--shadow-md);
}

.cd-car-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0 0 1.25rem;
}

/* Price */
.cd-price-main {
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent);
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}

.cd-price-sub {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}

.cd-price-sep { margin: 0 0.1rem; }

.cd-card-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1.25rem 0;
}

/* Phone row */
.cd-phone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.cd-phone-masked {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.cd-phone-revealed {
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.cd-phone-revealed:hover { text-decoration: underline; }

.cd-phone-reveal-btn {
  flex-shrink: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: background 0.18s ease, border-color 0.18s ease;
}
.cd-phone-reveal-btn:hover {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
}

/* Email button */
.cd-btn-email {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  margin-bottom: 0.875rem;
}
.cd-btn-email:hover {
  background: var(--accent-dark, #0056b3);
  transform: translateY(-1px);
}

/* Action row (Favorites + Share) */
.cd-action-row {
  display: flex;
  gap: 0.625rem;
}

.cd-btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.cd-btn-action:hover {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
}
.cd-btn-action--active {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.4);
  color: #dc3545;
}
.cd-btn-action--active i { color: #dc3545; }

/* ══════════════════════════════════════════════════════════
   NOT FOUND STATE
══════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════
   MOBILE OVERRIDES
══════════════════════════════════════════════════════════ */
@media (max-width: 960px) {
  /* Drop named areas → single column, DOM order stacks:
     1. cd-gallery  2. cd-right-col (card)  3. cd-data-col */
  .cd-main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: none;
  }

  .cd-gallery,
  .cd-right-col,
  .cd-data-col {
    grid-area: unset;
    width: 100%;
  }

  .cd-right-col {
    position: static;
  }

  .cd-price-main { font-size: 1.625rem; }
}

@media (max-width: 480px) {
  .cd-gallery-thumb { width: 58px; height: 42px; }
  .cd-quick-stats-grid { grid-template-columns: 1fr 1fr; }
  .cd-collapse-header { padding: 1rem 1.125rem; }
  .cd-collapse-inner,
  .cd-collapse-body--open .cd-collapse-inner { padding-left: 1.125rem; padding-right: 1.125rem; }
}

/* ══════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════ */
.cd-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Close button */
.lb-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  z-index: 10;
}
.lb-close:hover { background: rgba(255, 255, 255, 0.25); }

/* Counter */
.lb-counter {
  position: absolute;
  top: 1.1rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  pointer-events: none;
}

/* Prev / Next arrows */
.lb-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  z-index: 10;
}
.lb-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
}
.lb-arrow:disabled { opacity: 0.2; cursor: default; }
.lb-arrow--left  { left: 1rem; }
.lb-arrow--right { right: 1rem; }

/* Image */
.lb-img-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  overflow: hidden;
  padding: 3.5rem 4.5rem 1rem;
}

.lb-img {
  max-width: 100%;
  max-height: calc(100vh - 11rem);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.6);
  display: block;
  user-select: none;
}

/* Thumbnail strip */
.lb-thumbs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 0.5rem 1rem 0.25rem;
  max-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}

.lb-thumb {
  flex-shrink: 0;
  width: 60px;
  height: 42px;
  border-radius: 5px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  opacity: 0.55;
  padding: 0;
  background: none;
}
.lb-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.lb-thumb:hover { opacity: 0.85; }
.lb-thumb--active {
  border-color: #fff;
  opacity: 1;
}

/* Fade transition */
.lb-fade-enter-active,
.lb-fade-leave-active { transition: opacity 0.25s ease; }
.lb-fade-enter-from,
.lb-fade-leave-to { opacity: 0; }

/* Image swap transition */
.lb-img-enter-active,
.lb-img-leave-active { transition: opacity 0.18s ease; }
.lb-img-enter-from,
.lb-img-leave-to { opacity: 0; }

/* Zoom container */
.lb-zoom-container {
  position: relative;
  overflow: hidden;
  cursor: zoom-in;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: calc(100vh - 11rem);
}
.lb-zoom-container.is-panning { cursor: crosshair; }
.lb-zoom-container .lb-img {
  transition: transform 0.1s ease, transform-origin 0.05s linear;
  max-width: 100%;
  max-height: calc(100vh - 11rem);
  object-fit: contain;
}

/* Zoom hint overlay */
.lb-zoom-hint {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
}

/* Mobile */
@media (max-width: 640px) {
  .lb-arrow--left  { left: 0.25rem; }
  .lb-arrow--right { right: 0.25rem; }
  .lb-img-wrap { padding: 3rem 3rem 0.5rem; }
  .lb-arrow { width: 2.25rem; height: 2.25rem; font-size: 0.8rem; }
  .lb-zoom-container { max-height: calc(100vh - 14rem); }
  .lb-zoom-container .lb-img { max-height: calc(100vh - 14rem); }
}
</style>

<!-- Global override: flatten navbar pill bottom when breadcrumb bar is present -->
<style>
body.has-breadcrumb-pill .am-navbar-solid.scrolled,
body.has-breadcrumb-pill .am-navbar-transparent.scrolled {
  border-radius: 28px 28px 0 0 !important;
}
</style>
