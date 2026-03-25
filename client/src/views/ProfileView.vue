<template>
  <div class="profile-page">

    <AppHeader />

    <!-- ── Hero ────────────────────────────────────────────────── -->
    <div class="profile-hero">
      <div class="profile-hero-bg-pattern"></div>
      <div class="profile-hero-inner">
        <div class="profile-avatar" :style="{ background: avatarGradient }">
          <span class="avatar-initials">{{ initials }}</span>
          <span class="avatar-ring"></span>
        </div>
        <div class="profile-hero-info">
          <h1 class="profile-name">{{ authStore.user?.name || '—' }}</h1>
          <div class="profile-hero-meta">
            <span class="profile-role-badge" :class="authStore.isAdmin ? 'badge-admin' : 'badge-user'">
              <i :class="authStore.isAdmin ? 'fa-solid fa-shield-halved' : 'fa-solid fa-user'"></i>
              {{ authStore.isAdmin ? $t('profile.roleAdmin') : $t('profile.roleUser') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Content Layout ───────────────────────────────────────── -->
    <div class="profile-layout">

      <!-- Sidebar Nav -->
      <aside class="profile-sidebar">
        <nav class="profile-nav" role="tablist" :aria-label="$t('profile.navigation')">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="profile-nav-item"
            :class="{ active: activeTab === tab.id }"
            :aria-selected="activeTab === tab.id"
            role="tab"
            @click="activeTab = tab.id"
          >
            <span class="nav-icon"><i :class="tab.icon"></i></span>
            <span class="nav-label">{{ $t(tab.label) }}</span>
            <span v-if="tab.id === 'favorites' && favStore.count > 0" class="nav-badge">
              {{ favStore.count }}
            </span>
          </button>
        </nav>

        <!-- Quick Account Info -->
        <div class="profile-info-card">
          <div class="info-card-title">{{ $t('profile.accountInfo') }}</div>
          <div class="info-card-row">
            <span class="info-card-label">{{ $t('profile.accountId') }}</span>
            <span class="info-card-value">#{{ authStore.user?.id || '—' }}</span>
          </div>
          <div class="info-card-row">
            <span class="info-card-label">{{ $t('profile.memberSince') }}</span>
            <span class="info-card-value">{{ memberSince }}</span>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="profile-main" role="main">
        <Transition name="tab-fade" mode="out-in">

          <!-- ── Edit Profile Tab ──────────────────────────────── -->
          <div v-if="activeTab === 'edit'" key="edit" class="profile-card">
            <div class="profile-card-header">
              <div class="card-header-icon" style="background: rgba(26,86,219,0.1); color: #1a56db;">
                <i class="fa-solid fa-user-pen"></i>
              </div>
              <div>
                <h2>{{ $t('profile.editProfile') }}</h2>
                <p>{{ $t('profile.editProfileDesc') }}</p>
              </div>
            </div>

            <Transition name="banner-fade">
              <div v-if="profileSuccess" class="alert-banner alert-success">
                <i class="fa-solid fa-circle-check"></i> {{ $t('profile.updateSuccess') }}
              </div>
            </Transition>
            <Transition name="banner-fade">
              <div v-if="profileError" class="alert-banner alert-error">
                <i class="fa-solid fa-circle-exclamation"></i> {{ profileError }}
              </div>
            </Transition>

            <form class="profile-form" @submit.prevent="saveProfile">
              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="prof-name">{{ $t('profile.fullName') }}</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-user input-icon"></i>
                    <input
                      id="prof-name"
                      v-model="profileForm.name"
                      type="text"
                      class="form-input"
                      :placeholder="$t('profile.fullNamePlaceholder')"
                      autocomplete="name"
                      required
                    />
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label" for="prof-email">{{ $t('profile.email') }}</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-envelope input-icon"></i>
                    <input
                      id="prof-email"
                      v-model="profileForm.email"
                      type="email"
                      class="form-input"
                      :placeholder="$t('profile.emailPlaceholder')"
                      autocomplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetProfileForm">
                  <i class="fa-solid fa-rotate-left"></i>
                  {{ $t('common.cancel') }}
                </button>
                <button type="submit" class="btn-primary" :disabled="profileLoading">
                  <i v-if="profileLoading" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else class="fa-solid fa-floppy-disk"></i>
                  {{ profileLoading ? $t('common.saving') : $t('common.save') }}
                </button>
              </div>
            </form>
          </div>

          <!-- ── Favorites Tab ─────────────────────────────────── -->
          <div v-else-if="activeTab === 'favorites'" key="favorites" class="profile-card">
            <div class="profile-card-header">
              <div class="card-header-icon" style="background: rgba(239,68,68,0.1); color: #ef4444;">
                <i class="fa-solid fa-heart"></i>
              </div>
              <div>
                <h2>{{ $t('profile.myFavorites') }}</h2>
                <p>{{ $t('profile.myFavoritesDesc') }}</p>
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="favStore.loading" class="fav-loading">
              <div class="fav-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
              </div>
              <p>{{ $t('profile.loadingFavorites') }}</p>
            </div>

            <!-- Empty state -->
            <div v-else-if="!favStore.hasFavorites" class="fav-empty">
              <div class="fav-empty-icon">
                <i class="fa-regular fa-heart"></i>
              </div>
              <h3>{{ $t('profile.noFavorites') }}</h3>
              <p>{{ $t('profile.noFavoritesDesc') }}</p>
              <router-link :to="{ name: 'inventory' }" class="btn-primary">
                <i class="fa-solid fa-car"></i>
                {{ $t('profile.browseCars') }}
              </router-link>
            </div>

            <!-- Favorites grid -->
            <div v-else class="fav-grid">
              <article
                v-for="car in favStore.favoriteCars"
                :key="car.id"
                class="fav-car-card"
              >
                <div class="fav-car-image" @click="goToCar(car.id)">
                  <img
                    :src="car.image_url || '/assets/img/car-placeholder.jpg'"
                    :alt="`${car.make} ${car.model}`"
                    loading="lazy"
                  />
                  <div v-if="car.status !== 'available'" class="fav-status-overlay">
                    <span class="fav-status-badge" :class="`badge-${car.status}`">
                      {{ $t(`car.status.${car.status}`) }}
                    </span>
                  </div>
                </div>
                <div class="fav-car-body">
                  <div class="fav-car-content">
                    <div class="fav-car-header">
                      <div class="fav-car-title">
                        <h3 class="fav-car-name" @click="goToCar(car.id)">
                          {{ car.make }} {{ car.model }}
                        </h3>
                        <p class="fav-car-year">{{ car.year }}</p>
                      </div>
                      <p class="fav-car-price">{{ formatPrice(car.price) }}</p>
                    </div>
                    <div class="fav-car-specs">
                      <span v-if="car.mileage" class="fav-spec">
                        <i class="fa-solid fa-road"></i> {{ formatMileage(car.mileage) }}
                      </span>
                      <span v-if="car.fuel_type" class="fav-spec">
                        <i class="fa-solid fa-gas-pump"></i> {{ $t(`car.fuel.${car.fuel_type}`) }}
                      </span>
                      <span v-if="car.transmission" class="fav-spec">
                        <i class="fa-solid fa-gears"></i> {{ $t(`car.trans.${car.transmission}`) }}
                      </span>
                      <span v-if="car.power_hp" class="fav-spec">
                        <i class="fa-solid fa-bolt"></i> {{ car.power_hp }} {{ $t('common.hp') }}
                      </span>
                    </div>
                  </div>
                  <div class="fav-car-actions">
                    <button class="btn-primary fav-view-btn" @click="goToCar(car.id)">
                      <i class="fa-solid fa-circle-info"></i>
                      {{ $t('car.viewDetails') }}
                    </button>
                    <button
                      class="btn-remove-fav"
                      :disabled="favStore.isToggling(car.id)"
                      :aria-label="$t('car.removeFromFavorites')"
                      @click="favStore.toggleFavorite(car.id)"
                    >
                      <i :class="favStore.isToggling(car.id) ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-heart-crack'"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- ── Settings Tab ─────────────────────────────────── -->
          <div v-else-if="activeTab === 'settings'" key="settings" class="profile-card">
            <div class="profile-card-header">
              <div class="card-header-icon" style="background: rgba(99,102,241,0.1); color: #6366f1;">
                <i class="fa-solid fa-sliders"></i>
              </div>
              <div>
                <h2>{{ $t('profile.settings') }}</h2>
                <p>{{ $t('profile.settingsDesc') }}</p>
              </div>
            </div>

            <Transition name="banner-fade">
              <div v-if="settingsSuccess" class="alert-banner alert-success">
                <i class="fa-solid fa-circle-check"></i> {{ $t('profile.settingsSaved') }}
              </div>
            </Transition>
            <Transition name="banner-fade">
              <div v-if="settingsError" class="alert-banner alert-error">
                <i class="fa-solid fa-circle-exclamation"></i> {{ settingsError }}
              </div>
            </Transition>

            <!-- Theme -->
            <div class="settings-section">
              <div class="settings-section-header">
                <i class="fa-solid fa-circle-half-stroke"></i>
                <div>
                  <h3>{{ $t('profile.settingsTheme') }}</h3>
                  <p>{{ $t('profile.settingsThemeDesc') }}</p>
                </div>
              </div>
              <div class="settings-theme-grid">
                <button
                  v-for="opt in themeOptions"
                  :key="opt.value"
                  class="settings-theme-btn"
                  :class="{ active: uiStore.theme === opt.value }"
                  @click="setThemePref(opt.value)"
                  :aria-pressed="uiStore.theme === opt.value"
                >
                  <i :class="[opt.icon, 'theme-icon']"></i>
                  <span class="theme-label">{{ $t(opt.labelKey) }}</span>
                  <span v-if="uiStore.theme === opt.value" class="theme-check">
                    <i class="fa-solid fa-check"></i>
                  </span>
                </button>
              </div>
            </div>

            <!-- Language -->
            <div class="settings-section">
              <div class="settings-section-header">
                <i class="fa-solid fa-language"></i>
                <div>
                  <h3>{{ $t('profile.settingsLanguage') }}</h3>
                  <p>{{ $t('profile.settingsLanguageDesc') }}</p>
                </div>
              </div>
              <div class="settings-lang-grid">
                <button
                  v-for="lang in languageOptions"
                  :key="lang.code"
                  class="settings-lang-btn"
                  :class="{ active: uiStore.locale === lang.code }"
                  @click="setLocalePref(lang.code)"
                  :aria-pressed="uiStore.locale === lang.code"
                >
                  <span class="lang-code">{{ lang.abbr }}</span>
                  <span class="lang-name">{{ lang.name }}</span>
                  <span v-if="uiStore.locale === lang.code" class="lang-check">
                    <i class="fa-solid fa-check"></i>
                  </span>
                </button>
              </div>
            </div>

            <div v-if="settingsLoading" class="settings-saving">
              <i class="fa-solid fa-spinner fa-spin"></i> {{ $t('common.saving') }}
            </div>
          </div>

          <!-- ── Security Tab ──────────────────────────────────── -->
          <div v-else-if="activeTab === 'security'" key="security" class="profile-card">
            <div class="profile-card-header">
              <div class="card-header-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h2>{{ $t('profile.security') }}</h2>
                <p>{{ $t('profile.securityDesc') }}</p>
              </div>
            </div>

            <Transition name="banner-fade">
              <div v-if="passwordSuccess" class="alert-banner alert-success">
                <i class="fa-solid fa-circle-check"></i> {{ $t('profile.passwordSuccess') }}
              </div>
            </Transition>
            <Transition name="banner-fade">
              <div v-if="passwordError" class="alert-banner alert-error">
                <i class="fa-solid fa-circle-exclamation"></i> {{ passwordError }}
              </div>
            </Transition>

            <form class="profile-form" @submit.prevent="savePassword">
              <div class="form-field">
                <label class="form-label" for="pw-current">{{ $t('profile.currentPassword') }}</label>
                <div class="input-wrap">
                  <i class="fa-solid fa-lock input-icon"></i>
                  <input
                    id="pw-current"
                    v-model="passwordForm.current"
                    :type="showCurrentPw ? 'text' : 'password'"
                    class="form-input"
                    :placeholder="$t('profile.currentPasswordPlaceholder')"
                    autocomplete="current-password"
                    required
                  />
                  <button type="button" class="pw-toggle" @click="showCurrentPw = !showCurrentPw" :aria-label="showCurrentPw ? 'Hide' : 'Show'">
                    <i :class="showCurrentPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="pw-new">{{ $t('profile.newPassword') }}</label>
                <div class="input-wrap">
                  <i class="fa-solid fa-lock-open input-icon"></i>
                  <input
                    id="pw-new"
                    v-model="passwordForm.newPw"
                    :type="showNewPw ? 'text' : 'password'"
                    class="form-input"
                    :placeholder="$t('profile.newPasswordPlaceholder')"
                    autocomplete="new-password"
                    required
                  />
                  <button type="button" class="pw-toggle" @click="showNewPw = !showNewPw" :aria-label="showNewPw ? 'Hide' : 'Show'">
                    <i :class="showNewPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
                <!-- Strength Meter -->
                <div v-if="passwordForm.newPw" class="strength-meter">
                  <div class="strength-bar">
                    <div class="strength-fill" :class="strengthClass" :style="{ width: strengthWidth }"></div>
                  </div>
                  <span class="strength-label" :class="strengthClass">{{ $t(strengthLabelKey) }}</span>
                </div>
                <ul v-if="passwordForm.newPw" class="pw-requirements">
                  <li :class="{ met: pwReqs.length }">
                    <i :class="pwReqs.length ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
                    {{ $t('profile.req8Chars') }}
                  </li>
                  <li :class="{ met: pwReqs.upper }">
                    <i :class="pwReqs.upper ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
                    {{ $t('profile.reqUppercase') }}
                  </li>
                  <li :class="{ met: pwReqs.number }">
                    <i :class="pwReqs.number ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
                    {{ $t('profile.reqNumber') }}
                  </li>
                </ul>
              </div>

              <div class="form-field">
                <label class="form-label" for="pw-confirm">{{ $t('profile.confirmPassword') }}</label>
                <div class="input-wrap">
                  <i class="fa-solid fa-lock input-icon"></i>
                  <input
                    id="pw-confirm"
                    v-model="passwordForm.confirm"
                    :type="showConfirmPw ? 'text' : 'password'"
                    class="form-input"
                    :placeholder="$t('profile.confirmPasswordPlaceholder')"
                    autocomplete="new-password"
                    required
                  />
                  <button type="button" class="pw-toggle" @click="showConfirmPw = !showConfirmPw" :aria-label="showConfirmPw ? 'Hide' : 'Show'">
                    <i :class="showConfirmPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
                <p v-if="passwordForm.confirm && passwordForm.newPw !== passwordForm.confirm" class="field-error">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ $t('profile.passwordMismatch') }}
                </p>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetPasswordForm">
                  <i class="fa-solid fa-rotate-left"></i>
                  {{ $t('common.cancel') }}
                </button>
                <button type="submit" class="btn-primary" :disabled="passwordLoading || !canSavePassword">
                  <i v-if="passwordLoading" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else class="fa-solid fa-key"></i>
                  {{ passwordLoading ? $t('common.saving') : $t('profile.changePassword') }}
                </button>
              </div>
            </form>
          </div>

          <!-- ── Danger Zone Tab ───────────────────────────────── -->
          <div v-else-if="activeTab === 'danger'" key="danger" class="profile-card">
            <div class="profile-card-header">
              <div class="card-header-icon" style="background: rgba(239,68,68,0.1); color: #ef4444;">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <h2>{{ $t('profile.dangerZone') }}</h2>
                <p>{{ $t('profile.dangerZoneDesc') }}</p>
              </div>
            </div>

            <div class="danger-zone-section">
              <div class="danger-item">
                <div class="danger-item-info">
                  <h3><i class="fa-solid fa-right-from-bracket"></i> {{ $t('profile.signOut') }}</h3>
                  <p>{{ $t('profile.signOutDesc') }}</p>
                </div>
                <button class="btn-danger" @click="handleLogout">
                  <i class="fa-solid fa-right-from-bracket"></i>
                  {{ $t('nav.logout') }}
                </button>
              </div>
            </div>
          </div>

        </Transition>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.js'
import { useUiStore } from '@/stores/ui.js'
import { useFavoritesStore } from '@/stores/favorites.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const favStore = useFavoritesStore()

// ── Tabs ──────────────────────────────────────────────────────────────
const tabs = [
  { id: 'edit',      icon: 'fa-solid fa-user-pen',             label: 'profile.editProfile' },
  { id: 'favorites', icon: 'fa-solid fa-heart',                 label: 'profile.myFavorites' },
  { id: 'settings',  icon: 'fa-solid fa-sliders',               label: 'profile.settings' },
  { id: 'security',  icon: 'fa-solid fa-shield-halved',         label: 'profile.security' },
  { id: 'danger',    icon: 'fa-solid fa-triangle-exclamation',  label: 'profile.dangerZone' },
]
const activeTab = ref('edit')

// Load favorites when switching to that tab
watch(activeTab, (tab) => {
  if (tab === 'favorites') {
    favStore.fetchFavoriteCars()
  }
})

// ── Avatar ─────────────────────────────────────────────────────────────
const initials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const avatarGradients = [
  'linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #7e3af2 0%, #a78bfa 100%)',
  'linear-gradient(135deg, #057a55 0%, #34d399 100%)',
  'linear-gradient(135deg, #c27803 0%, #fbbf24 100%)',
  'linear-gradient(135deg, #b91c1c 0%, #f87171 100%)',
]
const avatarGradient = computed(() => {
  const id = authStore.user?.id || 0
  return avatarGradients[id % avatarGradients.length]
})

// ── Member Since ───────────────────────────────────────────────────────
const memberSince = computed(() => {
  const createdAt = authStore.user?.created_at
  if (!createdAt) return '—'
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(new Date(createdAt))
})

// ── Navigation helpers ─────────────────────────────────────────────────
function goToCar(id) {
  router.push({ name: 'car-detail', params: { id } })
}

// ── Edit Profile ───────────────────────────────────────────────────────
const profileForm = ref({ name: '', email: '' })
const profileLoading = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')

function resetProfileForm() {
  profileForm.value = {
    name:  authStore.user?.name  || '',
    email: authStore.user?.email || '',
  }
  profileSuccess.value = false
  profileError.value = ''
}

async function saveProfile() {
  profileSuccess.value = false
  profileError.value = ''
  profileLoading.value = true
  const result = await authStore.updateProfile({
    name:  profileForm.value.name.trim(),
    email: profileForm.value.email.trim(),
  })
  profileLoading.value = false
  if (result.success) {
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 4000)
  } else {
    profileError.value = result.message || t('profile.updateError')
  }
}

// ── Password ───────────────────────────────────────────────────────────
const passwordForm = ref({ current: '', newPw: '', confirm: '' })
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const showCurrentPw = ref(false)
const showNewPw = ref(false)
const showConfirmPw = ref(false)

const pwReqs = computed(() => ({
  length: passwordForm.value.newPw.length >= 8,
  upper:  /[A-Z]/.test(passwordForm.value.newPw),
  number: /\d/.test(passwordForm.value.newPw),
}))

const strengthScore = computed(() => {
  const pw = passwordForm.value.newPw
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
})

const strengthClass = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'strength-weak'
  if (s === 2) return 'strength-fair'
  if (s === 3) return 'strength-good'
  return 'strength-strong'
})

const strengthWidth = computed(() => `${(strengthScore.value / 5) * 100}%`)

const strengthLabelKey = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'profile.strengthWeak'
  if (s === 2) return 'profile.strengthFair'
  if (s === 3) return 'profile.strengthGood'
  return 'profile.strengthStrong'
})

const canSavePassword = computed(() =>
  passwordForm.value.current &&
  passwordForm.value.newPw &&
  passwordForm.value.newPw === passwordForm.value.confirm &&
  pwReqs.value.length &&
  pwReqs.value.upper &&
  pwReqs.value.number
)

function resetPasswordForm() {
  passwordForm.value = { current: '', newPw: '', confirm: '' }
  passwordSuccess.value = false
  passwordError.value = ''
}

async function savePassword() {
  passwordSuccess.value = false
  passwordError.value = ''
  if (passwordForm.value.newPw !== passwordForm.value.confirm) {
    passwordError.value = t('profile.passwordMismatch')
    return
  }
  passwordLoading.value = true
  const result = await authStore.changePassword(passwordForm.value.current, passwordForm.value.newPw)
  passwordLoading.value = false
  if (result.success) {
    passwordSuccess.value = true
    resetPasswordForm()
    setTimeout(() => { passwordSuccess.value = false }, 4000)
  } else {
    passwordError.value = result.message || t('profile.passwordError')
  }
}

// ── Settings (theme + locale) ──────────────────────────────────────────
const settingsLoading = ref(false)
const settingsSuccess = ref(false)
const settingsError = ref('')

const themeOptions = [
  { value: 'light',  icon: 'fa-solid fa-sun',     labelKey: 'theme.light' },
  { value: 'system', icon: 'fa-solid fa-display',  labelKey: 'theme.system' },
  { value: 'dark',   icon: 'fa-solid fa-moon',     labelKey: 'theme.dark' },
]

const languageOptions = [
  { code: 'en', abbr: 'EN', name: 'English' },
  { code: 'pl', abbr: 'PL', name: 'Polski' },
  { code: 'de', abbr: 'DE', name: 'Deutsch' },
  { code: 'lt', abbr: 'LT', name: 'Lietuvių' },
  { code: 'ru', abbr: 'RU', name: 'Русский' },
]

function setThemePref(value) {
  uiStore.setTheme(value)
  saveSettings()
}

function setLocalePref(code) {
  locale.value = code
  uiStore.setLocale(code)
  saveSettings()
}

async function saveSettings() {
  settingsError.value = ''
  settingsSuccess.value = false
  settingsLoading.value = true
  const result = await authStore.savePreferences({
    theme:  uiStore.theme,
    locale: uiStore.locale,
  })
  settingsLoading.value = false
  if (result.success) {
    settingsSuccess.value = true
    setTimeout(() => { settingsSuccess.value = false }, 3000)
  } else {
    settingsError.value = t('profile.settingsSaveError')
  }
}

// ── Logout ─────────────────────────────────────────────────────────────
async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}

// ── Format helpers ─────────────────────────────────────────────────────
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

// ── Init ───────────────────────────────────────────────────────────────
onMounted(async () => {
  await authStore.fetchMe()
  resetProfileForm()
  // Pre-load favorite IDs if not already loaded
  if (favStore.count === 0) {
    await favStore.fetchFavoriteIds()
  }
})
</script>

<style scoped>
/* ── Page Layout ──────────────────────────────────────────────────── */
.profile-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* ── Hero ─────────────────────────────────────────────────────────── */
.profile-hero {
  background: linear-gradient(135deg, #0f2460 0%, #1a56db 55%, #0ea5e9 100%);
  padding: calc(var(--nav-height, 72px) + 4rem) 2rem 3.5rem;
  position: relative;
  overflow: hidden;
}

.profile-hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.profile-hero-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
}

/* ── Avatar ───────────────────────────────────────────────────────── */
.profile-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}

.avatar-initials {
  font-size: 2.25rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.04em;
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.3);
}

/* ── Hero Info ────────────────────────────────────────────────────── */
.profile-hero-info { flex: 1; min-width: 0; }

.profile-name {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.3rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.profile-email-hero {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255,255,255,0.72);
  font-size: 0.9rem;
  margin: 0 0 0.9rem;
}

.profile-hero-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.profile-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.85rem;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.badge-admin {
  background: rgba(255,200,60,0.18);
  color: #fbbf24;
  border: 1px solid rgba(251,191,36,0.35);
}

.badge-user {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.92);
  border: 1px solid rgba(255,255,255,0.2);
}

.profile-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(255,255,255,0.65);
  font-size: 0.82rem;
}

.profile-stat i { font-size: 0.75rem; }

/* ── Main Layout ──────────────────────────────────────────────────── */
.profile-layout {
  max-width: 960px;
  margin: -2rem auto 4rem;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* ── Sidebar ──────────────────────────────────────────────────────── */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: calc(var(--nav-height, 72px) + 3rem);
}

.profile-nav {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
}

.profile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.125rem;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  position: relative;
}

.profile-nav-item:last-child { border-bottom: none; }

.profile-nav-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.profile-nav-item.active {
  background: rgba(26,86,219,0.07);
  color: var(--accent);
  font-weight: 650;
  border-left: 3px solid var(--accent);
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.nav-label { flex: 1; }

.nav-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: #ef4444;
  color: #fff;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Account Info Card */
.profile-info-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
}

.info-card-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.info-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-card-row:last-child { border-bottom: none; padding-bottom: 0; }
.info-card-row:first-of-type { padding-top: 0; }

.info-card-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
}

.info-card-value {
  font-size: 0.82rem;
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
}

.status-active {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #10b981;
}

.fav-count-val {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #ef4444;
}

/* ── Profile Card ─────────────────────────────────────────────────── */
.profile-main { min-width: 0; }

.profile-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  overflow: hidden;
  position: sticky;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}

.profile-card-header {
  padding: 1.75rem 2rem 1.4rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.card-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.profile-card-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.profile-card-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* ── Form ─────────────────────────────────────────────────────────── */
.profile-form {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.83rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.01em;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
}

.pw-toggle {
  position: absolute;
  right: 0.875rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.875rem;
  transition: color 0.15s;
  z-index: 1;
}
.pw-toggle:hover { color: var(--text-primary); }

/* ── Strength Meter ───────────────────────────────────────────────── */
.strength-meter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.3rem;
}

.strength-bar {
  flex: 1;
  height: 5px;
  background: var(--border-color);
  border-radius: 50px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 50px;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-fill.strength-weak   { background: #ef4444; }
.strength-fill.strength-fair   { background: #f97316; }
.strength-fill.strength-good   { background: #eab308; }
.strength-fill.strength-strong { background: #10b981; }

.strength-label {
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 46px;
  text-align: right;
}
.strength-label.strength-weak   { color: #ef4444; }
.strength-label.strength-fair   { color: #f97316; }
.strength-label.strength-good   { color: #eab308; }
.strength-label.strength-strong { color: #10b981; }

.pw-requirements {
  list-style: none;
  padding: 0;
  margin: 0.3rem 0 0;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pw-requirements li {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-muted);
  transition: color 0.2s;
}

.pw-requirements li.met { color: #10b981; }

.pw-requirements li i {
  width: 12px;
  text-align: center;
  font-size: 0.72rem;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #ef4444;
  margin: 0.15rem 0 0;
}

/* ── Form Actions ─────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

/* ── Buttons ──────────────────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, transform 0.12s, opacity 0.15s, box-shadow 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover, #1648c0);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(26,86,219,0.3);
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-secondary:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

/* ── Alert Banners ────────────────────────────────────────────────── */
.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.875rem 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-success {
  background: rgba(16,185,129,0.08);
  color: #059669;
  border-bottom: 1px solid rgba(16,185,129,0.18);
}

.alert-error {
  background: rgba(239,68,68,0.07);
  color: #dc2626;
  border-bottom: 1px solid rgba(239,68,68,0.15);
}

/* ── Favorites ────────────────────────────────────────────────────── */
.fav-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.fav-spinner {
  font-size: 2rem;
  color: var(--accent);
}

.fav-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 0.75rem;
}

.fav-empty-icon {
  width: 72px;
  height: 72px;
  background: rgba(239,68,68,0.07);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.fav-empty h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.fav-empty p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem;
  max-width: 300px;
}

/* ── Favorites Grid ───────────────────────────────────────────────── */
.fav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
}

.fav-car-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fav-car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.fav-car-image {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16/10;
  background: var(--bg-secondary);
}

.fav-car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.fav-car-card:hover .fav-car-image img { transform: scale(1.06); }

.fav-status-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-status-badge {
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(0,0,0,0.6);
  color: #fff;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.badge-sold { background: rgba(239,68,68,0.9); }
.badge-reserved { background: rgba(234,179,8,0.9); }

.fav-car-body {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  justify-content: space-between;
  flex: 1;
}

.fav-car-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.fav-car-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.fav-car-title { min-width: 0; }

.fav-car-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.1rem;
  cursor: pointer;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fav-car-name:hover { color: var(--accent); }

.fav-car-year {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
  margin: 0;
}

.fav-car-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.fav-car-specs {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.fav-spec {
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

.fav-spec i { font-size: 0.65rem; color: var(--accent); }

.fav-car-actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.fav-view-btn {
  padding: 0.6rem 1rem;
  font-size: 0.82rem;
  justify-content: center;
}

.btn-remove-fav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  background: rgba(239,68,68,0.07);
  color: #ef4444;
  border: 1.5px solid rgba(239,68,68,0.18);
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;
  flex-shrink: 0;
}

.btn-remove-fav:hover:not(:disabled) {
  background: rgba(239,68,68,0.15);
  border-color: rgba(239,68,68,0.45);
  transform: translateY(-1px);
}

.btn-remove-fav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ── Danger Zone ──────────────────────────────────────────────────── */
.danger-zone-section {
  padding: 1.75rem 2rem;
}

.danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  border: 1.5px solid rgba(239,68,68,0.2);
  border-radius: 14px;
  background: rgba(239,68,68,0.03);
}

.danger-item-info h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.3rem;
}

.danger-item-info h3 i { color: #ef4444; }

.danger-item-info p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: 0;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
  flex-shrink: 0;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(239,68,68,0.3);
}

/* ── Settings Tab ─────────────────────────────────────────────────── */
.settings-section {
  padding: 1.5rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}
.settings-section:last-of-type {
  border-bottom: none;
  padding-bottom: 1.5rem;
}

.settings-section-header {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}
.settings-section-header > i {
  margin-top: 0.15rem;
  flex-shrink: 0;
  font-size: 1rem;
  color: #6366f1;
  width: 1.25rem;
  text-align: center;
}
.settings-section-header h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.15rem;
  letter-spacing: -0.01em;
}
.settings-section-header p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Theme grid — 3 equal columns */
.settings-theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
}
.settings-theme-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 1.1rem 0.5rem 0.9rem;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.1s;
  font-family: inherit;
  outline: none;
  min-height: 5rem;
}
.settings-theme-btn:hover {
  border-color: #6366f1;
  background: var(--bg-primary);
  transform: translateY(-1px);
}
.settings-theme-btn:focus-visible {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
}
.settings-theme-btn.active {
  border-color: #6366f1;
  background: var(--bg-primary);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}
.theme-icon {
  font-size: 1.4rem;
  line-height: 1;
  display: block;
  color: var(--text-secondary);
  transition: color 0.15s;
}
.settings-theme-btn.active .theme-icon,
.settings-theme-btn:hover .theme-icon {
  color: #6366f1;
}
.theme-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.2;
}
.theme-check {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 1.15rem;
  height: 1.15rem;
  background: #6366f1;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
}

/* Language grid — 2 columns */
.settings-lang-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}
.settings-lang-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.1s;
  font-family: inherit;
  text-align: left;
  outline: none;
  min-height: 3.5rem;
}
.settings-lang-btn:hover {
  border-color: #6366f1;
  background: var(--bg-primary);
  transform: translateY(-1px);
}
.settings-lang-btn:focus-visible {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
}
.settings-lang-btn.active {
  border-color: #6366f1;
  background: var(--bg-primary);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}
.lang-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: rgba(99,102,241,0.1);
  color: #6366f1;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.settings-lang-btn.active .lang-code {
  background: #6366f1;
  color: #fff;
}
.lang-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  line-height: 1.2;
}
.lang-check {
  width: 1.15rem;
  height: 1.15rem;
  background: #6366f1;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  flex-shrink: 0;
}

/* Saving / status indicators */
.settings-saving {
  margin: 0.75rem 1.5rem 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* ── Transitions ──────────────────────────────────────────────────── */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.25s ease, max-height 0.25s ease;
  overflow: hidden;
  max-height: 80px;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
    margin-top: -1.5rem;
    padding: 0 1rem;
  }

  .profile-sidebar {
    position: static;
  }

  .profile-hero {
    padding: calc(var(--nav-height, 72px) + 2rem) 1.25rem 2rem;
  }

  .profile-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }

  .profile-hero-meta {
    justify-content: center;
  }

  .profile-name { font-size: 1.6rem; }

  .profile-nav {
    display: flex;
    border-radius: 14px;
    overflow-x: auto;
    position: sticky;
    scrollbar-width: none;
  }
  .profile-nav::-webkit-scrollbar { display: none; }

  .profile-nav-item {
    flex-direction: column;
    text-align: center;
    padding: 0.55rem 0.35rem;
    border-bottom: none;
    border-right: 1px solid var(--border-color);
    white-space: nowrap;
    gap: 0.2rem;
    font-size: 0.68rem;
    min-width: 0;
    flex: 1;
    justify-content: center;
  }

  .profile-nav-item:last-child { border-right: none; }

  .profile-nav-item.active {
    border-left: none;
    border-bottom: 3px solid var(--accent);
    background: rgba(26,86,219,0.07);
  }

  .nav-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
  }

  .profile-info-card { display: none; }

  .form-row { grid-template-columns: 1fr; }

  .profile-card-header { padding: 1.25rem 1.25rem 1rem; }
  .profile-form { padding: 1.25rem; }
  .danger-zone-section { padding: 1.25rem; }

  .fav-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }

  .pw-requirements { flex-direction: column; gap: 0.3rem; }
}

@media (max-width: 480px) {
  .fav-grid { padding: 0.75rem; gap: 0.75rem; }
  .form-actions { flex-direction: column; }
  .form-actions .btn-secondary,
  .form-actions .btn-primary { width: 100%; justify-content: center; }
  .danger-item { flex-direction: column; align-items: flex-start; }
  .settings-theme-grid { grid-template-columns: repeat(3, 1fr); }
  .settings-lang-grid  { grid-template-columns: 1fr 1fr; }
}
</style>
