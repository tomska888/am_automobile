<template>
  <div class="profile-page">
    <!-- Hero Header -->
    <div class="profile-hero">
      <div class="profile-hero-inner">
        <div class="profile-avatar" :style="{ background: avatarGradient }">
          {{ initials }}
        </div>
        <div class="profile-hero-info">
          <h1 class="profile-name">{{ authStore.user?.name || '—' }}</h1>
          <p class="profile-email-hero">{{ authStore.user?.email || '—' }}</p>
          <span class="profile-role-badge" :class="authStore.isAdmin ? 'badge-admin' : 'badge-user'">
            <i :class="authStore.isAdmin ? 'fa-solid fa-shield-halved' : 'fa-solid fa-user'"></i>
            {{ authStore.isAdmin ? $t('profile.roleAdmin') : $t('profile.roleUser') }}
          </span>
        </div>
      </div>
    </div>

    <div class="profile-layout">
      <!-- Sidebar Nav -->
      <aside class="profile-sidebar">
        <nav class="profile-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="profile-nav-item"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            <span>{{ $t(tab.label) }}</span>
          </button>
        </nav>

        <!-- Account Info Card -->
        <div class="profile-info-card">
          <div class="info-card-row">
            <span class="info-card-label">{{ $t('profile.memberSince') }}</span>
            <span class="info-card-value">{{ memberSince }}</span>
          </div>
          <div class="info-card-row">
            <span class="info-card-label">{{ $t('profile.accountId') }}</span>
            <span class="info-card-value">#{{ authStore.user?.id || '—' }}</span>
          </div>
          <div class="info-card-row">
            <span class="info-card-label">{{ $t('profile.status') }}</span>
            <span class="info-card-value status-active">
              <i class="fa-solid fa-circle" style="font-size:0.5rem;"></i>
              {{ $t('profile.statusActive') }}
            </span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="profile-main">
        <Transition name="tab-fade" mode="out-in">
          <!-- Edit Profile Tab -->
          <div v-if="activeTab === 'edit'" key="edit" class="profile-card">
            <div class="profile-card-header">
              <h2><i class="fa-solid fa-user-pen"></i> {{ $t('profile.editProfile') }}</h2>
              <p>{{ $t('profile.editProfileDesc') }}</p>
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

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetProfileForm">
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

          <!-- Security Tab -->
          <div v-else-if="activeTab === 'security'" key="security" class="profile-card">
            <div class="profile-card-header">
              <h2><i class="fa-solid fa-shield-halved"></i> {{ $t('profile.security') }}</h2>
              <p>{{ $t('profile.securityDesc') }}</p>
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
                  <button type="button" class="pw-toggle" @click="showCurrentPw = !showCurrentPw" :aria-label="showCurrentPw ? 'Hide password' : 'Show password'">
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
                    @input="onNewPwInput"
                  />
                  <button type="button" class="pw-toggle" @click="showNewPw = !showNewPw" :aria-label="showNewPw ? 'Hide password' : 'Show password'">
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
                <!-- Requirements -->
                <ul v-if="passwordForm.newPw" class="pw-requirements">
                  <li :class="{ met: pwReqs.length }"><i :class="pwReqs.length ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i> {{ $t('profile.req8Chars') }}</li>
                  <li :class="{ met: pwReqs.upper }"><i :class="pwReqs.upper ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i> {{ $t('profile.reqUppercase') }}</li>
                  <li :class="{ met: pwReqs.number }"><i :class="pwReqs.number ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i> {{ $t('profile.reqNumber') }}</li>
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
                  <button type="button" class="pw-toggle" @click="showConfirmPw = !showConfirmPw" :aria-label="showConfirmPw ? 'Hide password' : 'Show password'">
                    <i :class="showConfirmPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
                <p v-if="passwordForm.confirm && passwordForm.newPw !== passwordForm.confirm" class="field-error">
                  {{ $t('profile.passwordMismatch') }}
                </p>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetPasswordForm">
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

          <!-- Danger Zone Tab -->
          <div v-else-if="activeTab === 'danger'" key="danger" class="profile-card">
            <div class="profile-card-header">
              <h2><i class="fa-solid fa-triangle-exclamation"></i> {{ $t('profile.dangerZone') }}</h2>
              <p>{{ $t('profile.dangerZoneDesc') }}</p>
            </div>

            <div class="danger-zone-section">
              <div class="danger-item">
                <div class="danger-item-info">
                  <h3>{{ $t('profile.signOut') }}</h3>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.js'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// ── Tabs ─────────────────────────────────────────────────────────────
const tabs = [
  { id: 'edit',     icon: 'fa-solid fa-user-pen',          label: 'profile.editProfile' },
  { id: 'security', icon: 'fa-solid fa-shield-halved',      label: 'profile.security' },
  { id: 'danger',   icon: 'fa-solid fa-triangle-exclamation', label: 'profile.dangerZone' },
]
const activeTab = ref('edit')

// ── Avatar ────────────────────────────────────────────────────────────
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

// ── Member Since ──────────────────────────────────────────────────────
const memberSince = computed(() => {
  return new Date().getFullYear()
})

// ── Edit Profile ──────────────────────────────────────────────────────
const profileForm = ref({ name: '', email: '' })
const profileLoading = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')

function resetProfileForm() {
  profileForm.value = {
    name: authStore.user?.name || '',
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
    name: profileForm.value.name.trim(),
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

// ── Password ──────────────────────────────────────────────────────────
const passwordForm = ref({ current: '', newPw: '', confirm: '' })
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const showCurrentPw = ref(false)
const showNewPw = ref(false)
const showConfirmPw = ref(false)

const pwReqs = computed(() => ({
  length: passwordForm.value.newPw.length >= 8,
  upper: /[A-Z]/.test(passwordForm.value.newPw),
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

function onNewPwInput() {
  // reactive — computed handles everything
}

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

// ── Logout ────────────────────────────────────────────────────────────
async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}

// ── Init ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await authStore.fetchMe()
  resetProfileForm()
})
</script>

<style scoped>
/* ── Page Layout ───────────────────────────────────────────────────── */
.profile-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: 4rem;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.profile-hero {
  background: linear-gradient(135deg, #1a3a6e 0%, #1a56db 60%, #0ea5e9 100%);
  padding: calc(var(--nav-height, 72px) + 5rem) 2rem 3rem;
  position: relative;
  overflow: hidden;
}

.profile-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.profile-hero-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  border: 4px solid rgba(255,255,255,0.25);
  flex-shrink: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  letter-spacing: 0.05em;
}

.profile-hero-info {
  flex: 1;
}

.profile-name {
  font-size: 1.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem;
  line-height: 1.2;
}

.profile-email-hero {
  color: rgba(255,255,255,0.75);
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
}

.profile-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.85rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge-admin {
  background: rgba(255,200,60,0.2);
  color: #fbbf24;
  border: 1px solid rgba(251,191,36,0.35);
}

.badge-user {
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.2);
}

/* ── Main Layout ───────────────────────────────────────────────────── */
.profile-layout {
  max-width: 900px;
  margin: -2rem auto 0;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 680px) {
  .profile-layout {
    grid-template-columns: 1fr;
    margin-top: -1.5rem;
  }
  .profile-hero {
    padding: calc(var(--nav-height, 72px) + 4.5rem) 1.25rem 2rem;
  }
  .profile-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  .profile-name { font-size: 1.5rem; }
}

/* ── Sidebar ───────────────────────────────────────────────────────── */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-nav {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
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
  transition: background 0.15s, color 0.15s;
}

.profile-nav-item:last-child {
  border-bottom: none;
}

.profile-nav-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.profile-nav-item.active {
  background: rgba(26, 86, 219, 0.08);
  color: var(--accent);
  font-weight: 600;
  border-left: 3px solid var(--accent);
}

.profile-nav-item i {
  width: 18px;
  text-align: center;
  font-size: 0.875rem;
}

/* Account Info Card */
.profile-info-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.info-card-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-card-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-card-row:first-child {
  padding-top: 0;
}

.info-card-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.info-card-value {
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
}

.status-active {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #10b981;
}

/* Mobile: sidebar becomes horizontal */
@media (max-width: 680px) {
  .profile-nav {
    display: flex;
    border-radius: 12px;
    overflow-x: auto;
  }
  .profile-nav-item {
    flex-direction: column;
    text-align: center;
    padding: 0.75rem 1rem;
    border-bottom: none;
    border-right: 1px solid var(--border-color);
    white-space: nowrap;
    gap: 0.3rem;
    font-size: 0.8rem;
    min-width: 90px;
  }
  .profile-nav-item:last-child { border-right: none; }
  .profile-nav-item.active {
    border-left: none;
    border-bottom: 3px solid var(--accent);
  }
  .profile-info-card { display: none; }
}

/* ── Profile Card ──────────────────────────────────────────────────── */
.profile-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
}

.profile-card-header {
  padding: 1.75rem 2rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-card-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.profile-card-header h2 i {
  color: var(--accent);
  font-size: 1rem;
}

.profile-card-header p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Form ──────────────────────────────────────────────────────────── */
.profile-form {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (max-width: 480px) {
  .profile-card-header, .profile-form { padding-left: 1.25rem; padding-right: 1.25rem; }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
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
  font-size: 0.875rem;
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
  box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
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
}

.pw-toggle:hover { color: var(--text-primary); }

/* ── Strength Meter ────────────────────────────────────────────────── */
.strength-meter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
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

.strength-weak   .strength-fill, .strength-fill.strength-weak   { background: #ef4444; }
.strength-fair   .strength-fill, .strength-fill.strength-fair   { background: #f97316; }
.strength-good   .strength-fill, .strength-fill.strength-good   { background: #eab308; }
.strength-strong .strength-fill, .strength-fill.strength-strong { background: #10b981; }

.strength-label {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 48px;
  text-align: right;
}

.strength-label.strength-weak   { color: #ef4444; }
.strength-label.strength-fair   { color: #f97316; }
.strength-label.strength-good   { color: #eab308; }
.strength-label.strength-strong { color: #10b981; }

/* ── Password Requirements ─────────────────────────────────────────── */
.pw-requirements {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.pw-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: color 0.2s;
}

.pw-requirements li.met {
  color: #10b981;
}

.pw-requirements li i {
  width: 14px;
  text-align: center;
  font-size: 0.75rem;
}

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
  margin: 0.15rem 0 0;
}

/* ── Form Actions ──────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 480px) {
  .form-actions { flex-direction: column; }
  .form-actions .btn-secondary,
  .form-actions .btn-primary { width: 100%; justify-content: center; }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, opacity 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover, #1648c0);
  transform: translateY(-1px);
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
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-secondary:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

/* ── Alert Banners ─────────────────────────────────────────────────── */
.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.875rem 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-bottom: 1px solid rgba(16, 185, 129, 0.2);
}

.alert-error {
  background: rgba(239, 68, 68, 0.09);
  color: #dc2626;
  border-bottom: 1px solid rgba(239, 68, 68, 0.18);
}

/* ── Danger Zone ───────────────────────────────────────────────────── */
.danger-zone-section {
  padding: 1.75rem 2rem;
}

.danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.04);
}

@media (max-width: 480px) {
  .danger-item { flex-direction: column; align-items: flex-start; }
  .danger-zone-section { padding-left: 1.25rem; padding-right: 1.25rem; }
}

.danger-item-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.3rem;
}

.danger-item-info p {
  font-size: 0.8rem;
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
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, transform 0.1s;
  flex-shrink: 0;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* ── Transitions ───────────────────────────────────────────────────── */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
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
</style>
