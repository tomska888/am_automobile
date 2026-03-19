<template>
  <div class="page-home">
    <AppHeader :transparent="true" />

    <!-- ── HERO SECTION ─────────────────────────────────────────── -->
    <section class="hero-section" aria-label="Hero">
      <!-- Decorative background layers -->
      <div class="hero-shapes">
        <div class="hero-shape hero-shape-1"></div>
        <div class="hero-shape hero-shape-2"></div>
        <div class="hero-shape hero-shape-3"></div>
      </div>
      <div class="hero-grid-overlay"></div>

      <div class="container container-xl hero-content-wrap">
        <div class="hero-content">
          <!-- Title -->
          <h1 class="hero-title animate-fade-in-up" style="animation-delay: 0.1s;">
            {{ heroTitleMain }}<br />
            <span class="hero-title-gradient">{{ heroTitleAccent }}</span>
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.2s;">
            {{ $t('home.hero.subtitle') }}
          </p>

          <!-- Search Bar -->
          <div class="hero-search-bar animate-fade-in-up" role="search" aria-label="Car search" style="animation-delay: 0.3s;">
            <div class="hero-search-field">
              <i class="fa-solid fa-car" style="color: rgba(255,255,255,0.5); margin-right: 8px;"></i>
              <select
                v-model="searchMake"
                aria-label="Select make"
                style="background:transparent; border:none; color:rgba(255,255,255,0.85); outline:none; font-size:0.9375rem; flex:1;"
              >
                <option value="" style="color:#1a1a2e;">{{ $t('home.hero.searchMake') }}</option>
                <option v-for="make in carMakes" :key="make" :value="make" style="color:#1a1a2e;">{{ make }}</option>
              </select>
            </div>
            <div class="hero-search-divider"></div>
            <div class="hero-search-field">
              <i class="fa-solid fa-calendar" style="color: rgba(255,255,255,0.5); margin-right: 8px;"></i>
              <select
                v-model="searchYear"
                aria-label="Select year range"
                style="background:transparent; border:none; color:rgba(255,255,255,0.85); outline:none; font-size:0.9375rem; flex:1;"
              >
                <option value="" style="color:#1a1a2e;">{{ $t('home.hero.searchYear') }}</option>
                <option v-for="y in yearOptions" :key="y" :value="y" style="color:#1a1a2e;">{{ y }}</option>
              </select>
            </div>
            <RouterLink
              :to="{ name: 'inventory', query: searchQuery }"
              class="btn-search"
              :aria-label="$t('home.hero.searchBtn')"
            >
              <i class="fa-solid fa-magnifying-glass" style="margin-right: 8px;"></i>
              {{ $t('home.hero.searchBtn') }}
            </RouterLink>
          </div>

          <!-- Stats Row -->
          <div class="hero-stats animate-fade-in-up" role="list" aria-label="Key statistics" style="animation-delay: 0.4s;">
            <div class="hero-stat" role="listitem">
              <span class="hero-stat-value">500+</span>
              <span class="hero-stat-label">{{ $t('home.hero.stats.cars') }}</span>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat" role="listitem">
              <span class="hero-stat-value">10+</span>
              <span class="hero-stat-label">{{ $t('home.hero.stats.years') }}</span>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat" role="listitem">
              <span class="hero-stat-value">1000+</span>
              <span class="hero-stat-label">{{ $t('home.hero.stats.customers') }}</span>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat" role="listitem">
              <span class="hero-stat-value">100%</span>
              <span class="hero-stat-label">{{ $t('home.hero.stats.verified') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div
        class="scroll-indicator"
        @click="scrollToSection('#featured')"
        role="button"
        tabindex="0"
        aria-label="Scroll down"
        @keydown.enter="scrollToSection('#featured')"
      >
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </section>

    <!-- ── FEATURED CARS ─────────────────────────────────────────── -->
    <section class="featured-section" id="featured" aria-label="Featured vehicles">
      <div class="container container-xl">
        <div class="section-header reveal">
          <span class="section-tag">{{ $t('home.featured.tag') }}</span>
          <h2 class="section-title-main">{{ $t('home.featured.title') }}</h2>
          <div class="section-underline"></div>
        </div>

        <!-- Loading -->
        <LoadingSpinner v-if="carsStore.loading" />

        <!-- Car Grid from API -->
        <div v-else-if="carsStore.featuredCars?.length" class="cars-grid">
          <div
            v-for="(car, index) in carsStore.featuredCars.slice(0, 3)"
            :key="car.id"
          >
            <div
              class="car-card reveal"
              :class="'reveal-delay-' + (index + 1)"
              role="article"
              :aria-label="car.make + ' ' + car.model"
            >
              <div class="car-image-area" :class="'car-bg-' + ((index % 3) + 1)">
                <div class="car-icon-wrap">
                  <i class="fa-solid fa-car-side" :style="{ color: carIconColors[index % 3] }"></i>
                </div>
                <span class="car-badge" :class="index === 2 ? 'badge-deal' : index === 1 ? 'badge-new' : 'badge-featured'">
                  {{ index === 2 ? $t('home.featured.badgeDeal') : index === 1 ? $t('home.featured.badgeNew') : $t('home.featured.badgeFeatured') }}
                </span>
              </div>
              <div class="car-card-body">
                <div class="car-card-meta">
                  <span class="car-card-name">{{ car.year }} {{ car.make }} {{ car.model }}</span>
                  <span class="car-card-price">€{{ Number(car.price).toLocaleString() }}</span>
                </div>
                <div class="car-features-row">
                  <div class="car-feature-chip">
                    <i class="fa-solid fa-road"></i> {{ Number(car.mileage).toLocaleString() }} km
                  </div>
                  <div class="car-feature-chip">
                    <i class="fa-solid fa-gas-pump"></i> {{ car.fuel_type }}
                  </div>
                  <div class="car-feature-chip">
                    <i class="fa-solid fa-gears"></i> {{ car.transmission }}
                  </div>
                  <div class="car-feature-chip">
                    <i class="fa-solid fa-calendar"></i> {{ car.year }}
                  </div>
                </div>
                <RouterLink
                  :to="{ name: 'car-detail', params: { id: car.id } }"
                  class="btn-view-details"
                  :aria-label="'View details for ' + car.make + ' ' + car.model"
                >
                  {{ $t('home.featured.viewDetails') }}
                  <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Static fallback cards (before API data loads or on error) -->
        <div v-else class="cars-grid">
          <div
            v-for="(car, index) in staticFeaturedCars"
            :key="car.id"
          >
            <div
              class="car-card reveal"
              :class="'reveal-delay-' + (index + 1)"
              role="article"
              :aria-label="car.name"
            >
              <div class="car-image-area" :class="car.bgClass">
                <div class="car-icon-wrap">
                  <i class="fa-solid fa-car-side" :style="{ color: car.iconColor }"></i>
                </div>
                <span class="car-badge" :class="car.badgeClass">{{ car.badge }}</span>
              </div>
              <div class="car-card-body">
                <div class="car-card-meta">
                  <span class="car-card-name">{{ car.year }} {{ car.name }}</span>
                  <span class="car-card-price">{{ car.price }}</span>
                </div>
                <div class="car-features-row">
                  <div class="car-feature-chip"><i class="fa-solid fa-road"></i> {{ car.mileage }}</div>
                  <div class="car-feature-chip"><i class="fa-solid fa-gas-pump"></i> {{ car.fuel }}</div>
                  <div class="car-feature-chip"><i class="fa-solid fa-gears"></i> {{ car.transmission }}</div>
                  <div class="car-feature-chip"><i class="fa-solid fa-calendar"></i> {{ car.year }}</div>
                </div>
                <RouterLink :to="{ name: 'inventory' }" class="btn-view-details">
                  {{ $t('home.featured.viewDetails') }}
                  <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- View All -->
        <div class="view-all-wrap reveal">
          <RouterLink :to="{ name: 'inventory' }" class="btn-cta-primary">
            <i class="fa-solid fa-th-large" style="margin-right: 8px;"></i>
            {{ $t('home.featured.viewAll') }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── WHY CHOOSE US ──────────────────────────────────────────── -->
    <section class="why-section" id="why" aria-label="Why choose AM Automobile">
      <div class="container container-xl">
        <div class="section-header reveal">
          <span class="section-tag">{{ $t('home.why.tag') }}</span>
          <h2 class="section-title-main">{{ $t('home.why.title') }}</h2>
          <div class="section-underline"></div>
        </div>

        <div class="features-grid">
          <div
            v-for="(feature, index) in whyFeatures"
            :key="feature.id"
          >
            <div class="feature-card reveal" :class="'reveal-delay-' + (index + 1)" role="article">
              <div class="feature-icon-circle">
                <i :class="feature.icon"></i>
              </div>
              <h3 class="feature-card-title">{{ feature.title }}</h3>
              <p class="feature-card-desc">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ───────────────────────────────────────────── -->
    <section class="how-section" aria-label="How it works">
      <div class="container container-xl">
        <div class="section-header reveal">
          <span class="section-tag">{{ $t('home.how.tag') }}</span>
          <h2 class="section-title-main">{{ $t('home.how.title') }}</h2>
          <div class="section-underline"></div>
        </div>

        <div class="how-steps-wrapper">
          <div
            v-for="(step, index) in howSteps"
            :key="step.id"
            class="how-step reveal"
            :class="'reveal-delay-' + (index + 1)"
          >
            <div class="how-step-number">{{ index + 1 }}</div>
            <div class="how-step-icon">
              <i :class="step.icon"></i>
            </div>
            <h3 class="how-step-title">{{ step.title }}</h3>
            <p class="how-step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TESTIMONIALS ───────────────────────────────────────────── -->
    <section class="testimonials-section" aria-label="Customer testimonials">
      <div class="container container-xl">
        <div class="section-header reveal">
          <span class="section-tag">{{ $t('home.testimonials.tag') }}</span>
          <h2 class="section-title-main">{{ $t('home.testimonials.title') }}</h2>
          <div class="section-underline"></div>
        </div>

        <div class="testimonials-grid">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="testimonial.id"
          >
            <div
              class="testimonial-card reveal"
              :class="'reveal-delay-' + (index + 1)"
              role="article"
              :aria-label="'Testimonial from ' + testimonial.name"
            >
              <div class="testimonial-quote">"</div>
              <div class="testimonial-stars">
                <i v-for="s in 5" :key="s" class="fa-solid fa-star"></i>
              </div>
              <p class="testimonial-text">{{ testimonial.text }}</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">{{ testimonial.initials }}</div>
                <div>
                  <div class="testimonial-name">{{ testimonial.name }}</div>
                  <div class="testimonial-city">
                    <i class="fa-solid fa-location-dot" style="margin-right: 4px; color: var(--accent);"></i>
                    {{ testimonial.city }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA SECTION ────────────────────────────────────────────── -->
    <section class="cta-section" aria-label="Call to action">
      <div class="cta-dots"></div>
      <div class="cta-shape cta-shape-1"></div>
      <div class="cta-shape cta-shape-2"></div>
      <div class="container">
        <div class="cta-content reveal">
          <h2 class="cta-title">{{ $t('home.cta.title') }}</h2>
          <p class="cta-subtitle">{{ $t('home.cta.subtitle') }}</p>
          <div class="cta-buttons">
            <RouterLink :to="{ name: 'inventory' }" class="btn-cta-primary">
              <i class="fa-solid fa-car" style="margin-right: 8px;"></i>
              {{ $t('home.cta.browse') }}
            </RouterLink>
            <RouterLink :to="{ name: 'contact' }" class="btn-cta-ghost">
              <i class="fa-solid fa-phone" style="margin-right: 8px;"></i>
              {{ $t('home.cta.contact') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCarsStore } from '@/stores/cars.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const { t, tm } = useI18n()
const carsStore = useCarsStore()

// Search state
const searchMake = ref('')
const searchYear = ref('')

const carMakes = ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Hyundai', 'Kia', 'Volvo']
const yearOptions = computed(() => {
  const years = []
  for (let y = new Date().getFullYear(); y >= 2000; y--) years.push(y)
  return years
})

const searchQuery = computed(() => {
  const q = {}
  if (searchMake.value) q.make = searchMake.value
  if (searchYear.value) q.year_from = searchYear.value
  return q
})

// Hero title split: last 2 words get gradient
const heroTitleMain = computed(() => {
  const title = t('home.hero.title')
  const words = title.split(' ')
  return words.slice(0, -2).join(' ')
})
const heroTitleAccent = computed(() => {
  const title = t('home.hero.title')
  const words = title.split(' ')
  return words.slice(-2).join(' ')
})

// Car icon colors
const carIconColors = ['#60b3ff', '#a0c8ff', '#80c4ff']

// Static featured cars (fallback if API not loaded)
const staticFeaturedCars = [
  { id: 1, name: 'BMW 3 Series', year: '2022', mileage: '45,000 km', fuel: 'Diesel', transmission: 'Automatic', price: '€28,500', badge: 'Featured', badgeClass: 'badge-featured', bgClass: 'car-bg-1', iconColor: '#60b3ff' },
  { id: 2, name: 'Audi A4', year: '2021', mileage: '38,000 km', fuel: 'Petrol', transmission: 'Automatic', price: '€32,000', badge: 'New Arrival', badgeClass: 'badge-new', bgClass: 'car-bg-2', iconColor: '#a0c8ff' },
  { id: 3, name: 'Mercedes C-Class', year: '2023', mileage: '12,000 km', fuel: 'Hybrid', transmission: 'Automatic', price: '€41,000', badge: 'Best Deal', badgeClass: 'badge-deal', bgClass: 'car-bg-3', iconColor: '#80c4ff' },
]

// Why Choose Us — use tm() to access array items
const whyIcons = ['fa-solid fa-magnifying-glass', 'fa-solid fa-tag', 'fa-solid fa-shield-halved', 'fa-solid fa-headset']
const whyFeatures = computed(() => {
  const items = tm('home.why.items')
  return (Array.isArray(items) ? items : []).map((item, i) => ({
    id: i + 1,
    icon: whyIcons[i] || 'fa-solid fa-star',
    title: item.title,
    desc: item.desc
  }))
})

// How It Works — use tm() to access array items
const howIcons = ['fa-solid fa-magnifying-glass', 'fa-solid fa-car', 'fa-solid fa-key']
const howSteps = computed(() => {
  const steps = tm('home.how.steps')
  return (Array.isArray(steps) ? steps : []).map((step, i) => ({
    id: i + 1,
    icon: howIcons[i] || 'fa-solid fa-circle-check',
    title: step.title,
    desc: step.desc
  }))
})

// Testimonials — use tm() to access array items
const testimonialAuthors = [
  { name: 'Tomasz K.', city: 'Warsaw, Poland', initials: 'TK' },
  { name: 'Anna M.', city: 'Vilnius, Lithuania', initials: 'AM' },
  { name: 'Dmitri S.', city: 'Kaunas, Lithuania', initials: 'DS' },
]
const testimonials = computed(() => {
  const items = tm('home.testimonials.items')
  return (Array.isArray(items) ? items : []).map((item, i) => ({
    id: i + 1,
    text: item.text,
    ...testimonialAuthors[i]
  }))
})

// Scroll helper
function scrollToSection(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Intersection Observer for reveal animations
let revealObserver = null
function initReveal() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))
}

onMounted(() => {
  carsStore.fetchFeatured()
  setTimeout(initReveal, 150)
})

onBeforeUnmount(() => {
  if (revealObserver) revealObserver.disconnect()
})
</script>

<style scoped>
/* ── HERO ──────────────────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0A4B8C 0%, #0d1117 60%, #1a1a2e 100%);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.hero-shapes { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.hero-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.07;
  animation: float-shape 8s ease-in-out infinite;
}
.hero-shape-1 { width: 600px; height: 600px; background: var(--accent); top: -200px; right: -150px; animation-delay: 0s; }
.hero-shape-2 { width: 300px; height: 300px; background: #fff; bottom: 100px; left: -80px; animation-delay: 3s; }
.hero-shape-3 { width: 200px; height: 200px; background: var(--accent); bottom: -60px; right: 200px; animation-delay: 6s; }

@keyframes float-shape {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

.hero-content-wrap {
  position: relative;
  z-index: 2;
  padding-top: calc(var(--nav-height, 72px) + 2rem);
  padding-bottom: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--nav-height, 72px));
}

.hero-content {
  max-width: 720px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  padding: 8px 20px;
  color: rgba(255,255,255,0.9);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  color: #ffffff;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
  text-align: center;
  width: 100%;
}

.hero-title-gradient {
  background: linear-gradient(90deg, #60b3ff, #a0d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: rgba(255,255,255,0.75);
  max-width: 540px;
  line-height: 1.7;
  margin-bottom: 2rem;
  text-align: center;
}

/* Search Bar */
.hero-search-bar {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  backdrop-filter: blur(16px);
  padding: 8px 8px 8px 20px;
  margin-bottom: 2.5rem;
  max-width: 600px;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
  margin-right: auto;
}

.hero-search-field {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 150px;
}

.hero-search-divider {
  width: 1px;
  height: 28px;
  background: rgba(255,255,255,0.2);
  flex-shrink: 0;
}

.btn-search {
  background: linear-gradient(135deg, var(--accent), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}
.btn-search:hover { opacity: 0.9; transform: scale(1.02); color: white; }

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  justify-content: center;
  width: 100%;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  padding-right: 2rem;
}

.hero-stat-sep {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  margin-right: 2rem;
}

.hero-stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.8125rem;
  color: rgba(255,255,255,0.6);
  margin-top: 4px;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.5);
  font-size: 1.25rem;
  cursor: pointer;
  animation: bounce-down 2s ease infinite;
  z-index: 3;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  transition: border-color 0.2s ease;
}
.scroll-indicator:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.8); }

@keyframes bounce-down {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* Animations */
.animate-fade-in-up {
  animation: fadeInUp 0.7s ease both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── REVEAL ─────────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }

/* ── SECTION COMMON ─────────────────────────────────────────── */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-tag {
  display: inline-block;
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid rgba(0,123,255,0.2);
  border-radius: 50px;
  padding: 4px 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.section-title-main {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent), var(--primary-dark));
  border-radius: 2px;
  margin: 0 auto;
}

/* ── FEATURED SECTION ───────────────────────────────────────── */
.featured-section {
  padding: 5rem 0;
  background: var(--bg-secondary);
}

/* Car Cards */
.car-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
}
.car-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.car-image-area {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-bg-1 { background: linear-gradient(135deg, #0A4B8C 0%, #1a2744 100%); }
.car-bg-2 { background: linear-gradient(135deg, #1a2744 0%, #0d1b3e 100%); }
.car-bg-3 { background: linear-gradient(135deg, #0d1b3e 0%, #0A4B8C 100%); }

.car-icon-wrap {
  font-size: 5rem;
  opacity: 0.8;
  filter: drop-shadow(0 4px 16px rgba(0,123,255,0.4));
}

.car-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-featured { background: rgba(0,123,255,0.9); color: white; }
.badge-new      { background: rgba(40,167,69,0.9); color: white; }
.badge-deal     { background: rgba(255,193,7,0.95); color: #1a1a2e; }

.car-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.car-card-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.car-card-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.car-card-price {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--accent);
  white-space: nowrap;
}

.car-features-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.car-feature-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 3px 10px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.car-feature-chip i { color: var(--accent); font-size: 0.6875rem; }

.btn-view-details {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  margin-top: auto;
}
.btn-view-details:hover { opacity: 0.9; transform: scale(1.02); color: white; }

/* ── WHY SECTION ────────────────────────────────────────────── */
.why-section {
  padding: 5rem 0;
  background: var(--bg-primary);
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent-light);
  border: 2px solid rgba(0,123,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--accent);
  margin: 0 auto 1.25rem;
  transition: background 0.3s ease, color 0.3s ease;
}
.feature-card:hover .feature-icon-circle {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.feature-card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.feature-card-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* ── HOW SECTION ────────────────────────────────────────────── */
.how-section {
  padding: 5rem 0;
  background: var(--light-blue, #E8F4FD);
}

[data-theme="dark"] .how-section {
  background: var(--bg-secondary);
}

.how-steps-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  position: relative;
}

.how-step {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.how-step:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.how-step-number {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent), var(--primary-dark));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
}

.how-step-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-light);
  border: 2px solid rgba(0,123,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--accent);
  margin: 0.75rem auto 1rem;
  transition: background 0.3s ease, color 0.3s ease;
}
.how-step:hover .how-step-icon { background: var(--accent); color: white; border-color: var(--accent); }

.how-step-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.how-step-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* ── TESTIMONIALS ───────────────────────────────────────────── */
.testimonials-section {
  padding: 5rem 0;
  background: var(--bg-secondary);
}

.testimonial-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.testimonial-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.testimonial-quote {
  position: absolute;
  top: 12px;
  right: 20px;
  font-size: 5rem;
  line-height: 1;
  color: rgba(0,123,255,0.08);
  font-family: Georgia, serif;
  font-weight: 700;
  pointer-events: none;
}

.testimonial-stars {
  color: #ffc107;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  display: flex;
  gap: 3px;
}

.testimonial-text {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
  flex: 1;
  margin-bottom: 1.25rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.testimonial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.testimonial-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.testimonial-city {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ── CTA SECTION ────────────────────────────────────────────── */
.cta-section {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent) 100%);
  text-align: center;
  overflow: hidden;
}

.cta-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

.cta-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
  background: white;
  pointer-events: none;
}
.cta-shape-1 { width: 400px; height: 400px; top: -150px; right: -100px; }
.cta-shape-2 { width: 250px; height: 250px; bottom: -100px; left: -60px; }

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.0625rem;
  color: rgba(255,255,255,0.85);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  background: white;
  color: var(--primary-dark);
  border: 2px solid white;
  border-radius: 50px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.btn-cta-primary:hover { background: rgba(255,255,255,0.9); transform: scale(1.03); color: var(--primary-dark); }

.btn-cta-ghost {
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: 50px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.btn-cta-ghost:hover { background: rgba(255,255,255,0.1); border-color: white; transform: scale(1.03); color: white; }

/* ── CONTAINER OVERRIDE ─────────────────────────────────────── */
.container-xl { max-width: 1280px; }

/* ── GRID LAYOUTS ───────────────────────────────────────────── */
/* Featured cars — 3 columns */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Why choose us — 4 columns */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Testimonials — 3 columns */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* View all button centering */
.view-all-wrap {
  text-align: center;
  margin-top: 3rem;
}

/* ── RESPONSIVE ─────────────────────────────────────────────── */
@media (max-width: 1023px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-search-bar { flex-direction: column; align-items: stretch; }
  .hero-search-divider { display: none; }
  .btn-search { width: 100%; justify-content: center; }
  .hero-stats { gap: 1.5rem; }
  .hero-stat-sep { display: none; }
  .hero-stat { padding-right: 0; }
  .cta-buttons { flex-direction: column; align-items: center; }
  .btn-cta-primary, .btn-cta-ghost { width: 100%; max-width: 320px; justify-content: center; }

  /* Stack all grids on mobile */
  .cars-grid,
  .features-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1023px) {
  .cars-grid,
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
