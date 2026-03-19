<template>
  <div class="auth-layout">
    <!-- Left Panel: Brand -->
    <div class="auth-brand-panel" aria-hidden="true">
      <div class="auth-brand-bg"></div>
      <div class="auth-brand-content">
        <RouterLink to="/" class="auth-brand-logo">
          <div class="auth-brand-icon">
            <i class="fa-solid fa-car-side"></i>
          </div>
          <div class="auth-brand-text">
            <span class="auth-brand-name">AM Automobile</span>
            <span class="auth-brand-sub">PREMIUM DEALERSHIP</span>
          </div>
        </RouterLink>
        <h2 class="auth-brand-headline">Start Your Journey With Us</h2>
        <p class="auth-brand-desc">Create your account and get access to 500+ premium vehicles, exclusive offers, and expert guidance.</p>
        <ul class="auth-brand-perks">
          <li><i class="fa-solid fa-circle-check"></i> Access our full vehicle inventory</li>
          <li><i class="fa-solid fa-circle-check"></i> Save your favourite cars</li>
          <li><i class="fa-solid fa-circle-check"></i> Get notified about new arrivals</li>
          <li><i class="fa-solid fa-circle-check"></i> Request test drives online</li>
        </ul>
      </div>
    </div>

    <!-- Right Panel: Form -->
    <div class="auth-form-panel">
      <div class="auth-form-inner">
        <!-- Mobile Logo -->
        <RouterLink to="/" class="auth-mobile-logo">
          <div class="auth-mobile-icon">
            <i class="fa-solid fa-car-side"></i>
          </div>
          <span class="auth-mobile-name">AM Automobile</span>
        </RouterLink>

        <div class="auth-form-header">
          <h1 class="auth-form-title">{{ $t('auth.register.title') }}</h1>
          <p class="auth-form-subtitle">{{ $t('auth.register.subtitle') }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" novalidate>
          <!-- Name -->
          <div class="auth-field">
            <label class="auth-label">{{ $t('auth.register.name') }}</label>
            <div class="auth-input-wrap">
              <i class="fa-solid fa-user auth-input-icon"></i>
              <input
                type="text"
                class="auth-input"
                v-model="form.name"
                required
                autocomplete="name"
                :placeholder="$t('auth.register.name')"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="auth-field">
            <label class="auth-label">{{ $t('auth.register.email') }}</label>
            <div class="auth-input-wrap">
              <i class="fa-solid fa-envelope auth-input-icon"></i>
              <input
                type="email"
                class="auth-input"
                v-model="form.email"
                required
                autocomplete="email"
                :placeholder="$t('auth.register.email')"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="auth-field">
            <label class="auth-label">{{ $t('auth.register.password') }}</label>
            <div class="auth-input-wrap">
              <i class="fa-solid fa-lock auth-input-icon"></i>
              <input
                :type="showPass ? 'text' : 'password'"
                class="auth-input auth-input-pw"
                :class="{ 'auth-input-error': submitted && !passStrong }"
                v-model="form.password"
                required
                minlength="8"
                autocomplete="new-password"
                :placeholder="$t('auth.register.password')"
              />
              <button
                type="button"
                class="auth-eye-btn"
                @click="showPass = !showPass"
                :aria-label="showPass ? 'Hide password' : 'Show password'"
              >
                <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <!-- Password strength hints -->
            <ul v-if="showPassHints" class="pass-hints" aria-label="Password requirements">
              <li :class="passRules.length ? 'pass-hint-ok' : 'pass-hint-fail'">
                <i :class="passRules.length ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                At least 8 characters
              </li>
              <li :class="passRules.uppercase ? 'pass-hint-ok' : 'pass-hint-fail'">
                <i :class="passRules.uppercase ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                One uppercase letter (A–Z)
              </li>
              <li :class="passRules.number ? 'pass-hint-ok' : 'pass-hint-fail'">
                <i :class="passRules.number ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                One number (0–9)
              </li>
            </ul>
          </div>

          <!-- Confirm Password -->
          <div class="auth-field">
            <label class="auth-label">{{ $t('auth.register.confirmPass') }}</label>
            <div class="auth-input-wrap">
              <i class="fa-solid fa-lock-open auth-input-icon"></i>
              <input
                :type="showPass ? 'text' : 'password'"
                class="auth-input auth-input-pw"
                :class="{ 'auth-input-error': passError }"
                v-model="form.confirmPassword"
                required
                autocomplete="new-password"
                :placeholder="$t('auth.register.confirmPass')"
              />
            </div>
            <p v-if="passError" class="auth-field-error">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ passError }}
            </p>
          </div>

          <!-- Terms -->
          <p class="auth-terms">
            {{ $t('auth.register.termsText') }}
            <RouterLink :to="{ name: 'terms' }" class="auth-terms-link">{{ $t('auth.register.terms') }}</RouterLink>
            {{ $t('auth.register.and') }}
            <RouterLink :to="{ name: 'privacy' }" class="auth-terms-link">{{ $t('auth.register.privacy') }}</RouterLink>.
          </p>

          <!-- API Error -->
          <div v-if="authStore.error" class="auth-error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            {{ authStore.error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="auth-submit-btn"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="auth-submit-inner">
              <span class="auth-spinner"></span>
              {{ $t('auth.register.submitting') }}
            </span>
            <span v-else class="auth-submit-inner">
              <i class="fa-solid fa-user-plus"></i>
              {{ $t('auth.register.submit') }}
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <p class="auth-switch">
          {{ $t('auth.register.hasAccount') }}
          <RouterLink :to="{ name: 'login' }" class="auth-switch-link">
            {{ $t('auth.register.login') }}
          </RouterLink>
        </p>

        <!-- Back -->
        <div class="auth-back">
          <RouterLink to="/" class="auth-back-link">
            <i class="fa-solid fa-arrow-left"></i>
            Back to Home
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useUiStore } from '@/stores/ui.js'
import { useI18n } from 'vue-i18n'

const router    = useRouter()
const authStore = useAuthStore()
const uiStore   = useUiStore()
const { t }     = useI18n()

const showPass   = ref(false)
const submitted  = ref(false)
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })

// ── Password strength rules (must match server-side express-validator rules) ──
const passRules = computed(() => ({
  length:    form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  number:    /[0-9]/.test(form.password),
}))

const passStrong = computed(() =>
  passRules.value.length && passRules.value.uppercase && passRules.value.number
)

// ── Confirm password mismatch error (only show after user types in confirm) ──
const passError = computed(() => {
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    return t('auth.validation.passMatch')
  }
  return ''
})

// ── Show password hints only after user starts typing ──
const showPassHints = computed(() => form.password.length > 0)

// ── Overall form validity ──
const formValid = computed(() =>
  form.name.trim().length >= 2 &&
  form.email.includes('@') &&
  passStrong.value &&
  !passError.value &&
  form.confirmPassword.length > 0
)

async function handleRegister() {
  submitted.value = true
  if (!formValid.value) return
  const result = await authStore.register(form.name, form.email, form.password)
  if (result.success) {
    uiStore.toast.success('Account created successfully!', 'Welcome!')
    router.push({ name: 'home' })
  }
}
</script>

<style scoped>
/* ── PASSWORD HINTS ─────────────────────────────────────────── */
.pass-hints {
  list-style: none;
  padding: 0.5rem 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.pass-hints li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.pass-hint-ok  { color: #22c55e; }
.pass-hint-fail { color: var(--text-secondary); }
.pass-hint-ok i  { color: #22c55e; }
.pass-hint-fail i { color: var(--text-secondary); }

/* ── INPUT ERROR STATE ──────────────────────────────────────── */
.auth-input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

/* ── LAYOUT ─────────────────────────────────────────────────── */
.auth-layout {
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
}

/* ── BRAND PANEL (left) ─────────────────────────────────────── */
.auth-brand-panel {
  flex: 0 0 42%;
  position: relative;
  display: none;
  overflow: hidden;
}

@media (min-width: 992px) {
  .auth-brand-panel { display: flex; align-items: center; justify-content: center; }
}

.auth-brand-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #0A4B8C 0%, #0d1117 55%, #1a1a2e 100%);
}

.auth-brand-bg::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: var(--accent);
  border-radius: 50%;
  opacity: 0.07;
  top: -150px;
  right: -150px;
}

.auth-brand-bg::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.04;
  bottom: -80px;
  left: -80px;
}

.auth-brand-content {
  position: relative;
  z-index: 2;
  padding: 3rem;
  max-width: 420px;
}

.auth-brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 3.5rem;
}

.auth-brand-icon {
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.auth-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.auth-brand-name {
  font-size: 1rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
}

.auth-brand-sub {
  font-size: 0.5625rem;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.12em;
  font-weight: 600;
  margin-top: 2px;
}

.auth-brand-headline {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.auth-brand-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.auth-brand-perks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-brand-perks li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255,255,255,0.8);
  font-size: 0.9375rem;
}

.auth-brand-perks .fa-circle-check {
  color: #60b3ff;
  font-size: 1rem;
  flex-shrink: 0;
}

/* ── FORM PANEL (right) ─────────────────────────────────────── */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: var(--bg-primary);
  transition: background 0.3s ease;
  overflow-y: auto;
}

.auth-form-inner {
  width: 100%;
  max-width: 420px;
  padding: 1rem 0;
}

/* ── MOBILE LOGO ────────────────────────────────────────────── */
.auth-mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 2rem;
}

@media (min-width: 992px) {
  .auth-mobile-logo { display: none; }
}

.auth-mobile-icon {
  width: 40px;
  height: 40px;
  background: var(--accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.auth-mobile-name {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

/* ── FORM HEADER ────────────────────────────────────────────── */
.auth-form-header {
  margin-bottom: 1.75rem;
}

.auth-form-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
  letter-spacing: -0.02em;
}

.auth-form-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ── FIELDS ─────────────────────────────────────────────────── */
.auth-field {
  margin-bottom: 1rem;
}

.auth-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.auth-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 1;
}

.auth-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  outline: none;
  font-family: inherit;
}

.auth-input::placeholder {
  color: var(--text-muted);
}

.auth-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--bg-primary);
}

.auth-input-pw {
  padding-right: 3rem;
}

.auth-input-error {
  border-color: var(--danger) !important;
}

.auth-eye-btn {
  position: absolute;
  right: 0.875rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}
.auth-eye-btn:hover { color: var(--text-primary); }

.auth-field-error {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--danger);
  font-size: 0.8125rem;
  margin-top: 0.375rem;
}

/* ── TERMS ──────────────────────────────────────────────────── */
.auth-terms {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.auth-terms-link {
  color: var(--accent);
  text-decoration: none;
}
.auth-terms-link:hover { text-decoration: underline; }

/* ── ERROR ──────────────────────────────────────────────────── */
.auth-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

[data-theme="dark"] .auth-error {
  background: rgba(220, 53, 69, 0.15);
  border-color: rgba(220, 53, 69, 0.4);
  color: #ff6b7a;
}

/* ── SUBMIT BUTTON ──────────────────────────────────────────── */
.auth-submit-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  margin-bottom: 1.25rem;
  margin-top: 0.25rem;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.35);
}

.auth-submit-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.45);
}

.auth-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.auth-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-submit-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* ── SPINNER ────────────────────────────────────────────────── */
.auth-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: auth-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes auth-spin {
  to { transform: rotate(360deg); }
}

/* ── SWITCH / BACK ──────────────────────────────────────────── */
.auth-switch {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.auth-switch-link {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}
.auth-switch-link:hover { text-decoration: underline; }

.auth-back {
  text-align: center;
}

.auth-back-link {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: color 0.2s ease;
}
.auth-back-link:hover { color: var(--text-secondary); }
</style>
