<template>
  <div class="auth-layout">
    <!-- Left Panel: Brand (same as LoginView) -->
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
        <h2 class="auth-brand-headline">Set Your New Password</h2>
        <p class="auth-brand-desc">Create a strong password to keep your AM Automobile account secure.</p>
        <div class="auth-brand-stats">
          <div class="auth-brand-stat">
            <span class="auth-brand-stat-value">500+</span>
            <span class="auth-brand-stat-label">Cars in Stock</span>
          </div>
          <div class="auth-brand-stat-sep"></div>
          <div class="auth-brand-stat">
            <span class="auth-brand-stat-value">1000+</span>
            <span class="auth-brand-stat-label">Happy Customers</span>
          </div>
          <div class="auth-brand-stat-sep"></div>
          <div class="auth-brand-stat">
            <span class="auth-brand-stat-value">10+</span>
            <span class="auth-brand-stat-label">Years Experience</span>
          </div>
        </div>
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

        <!-- ── INVALID / MISSING TOKEN ── -->
        <div v-if="!token" class="rp-state-card rp-state-error">
          <div class="rp-state-icon rp-state-icon--error">
            <i class="fa-solid fa-link-slash"></i>
          </div>
          <h1 class="auth-form-title">Invalid Reset Link</h1>
          <p class="auth-form-subtitle">
            This password reset link is missing or invalid. Please request a new one.
          </p>
          <RouterLink :to="{ name: 'login' }" class="auth-submit-btn rp-btn-link">
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            Back to Sign In
          </RouterLink>
        </div>

        <!-- ── SUCCESS STATE ── -->
        <div v-else-if="success" class="rp-state-card rp-state-success">
          <div class="rp-state-icon rp-state-icon--success">
            <i class="fa-solid fa-shield-check"></i>
          </div>
          <h1 class="auth-form-title">Password Updated!</h1>
          <p class="auth-form-subtitle">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <RouterLink :to="{ name: 'login' }" class="auth-submit-btn rp-btn-link">
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            Sign In
          </RouterLink>
        </div>

        <!-- ── FORM STATE ── -->
        <template v-else>
          <div class="auth-form-header">
            <div class="rp-header-icon">
              <i class="fa-solid fa-key"></i>
            </div>
            <h1 class="auth-form-title">Set New Password</h1>
            <p class="auth-form-subtitle">Enter your new password below. It must be at least 8 characters and include an uppercase letter and a number.</p>
          </div>

          <form @submit.prevent="handleSubmit" novalidate>

            <!-- New password -->
            <div class="auth-field" :class="{ 'rp-field--error': errors.password }">
              <label class="auth-label" for="rp-password">New Password</label>
              <div class="auth-input-wrap">
                <i class="fa-solid fa-lock auth-input-icon"></i>
                <input
                  id="rp-password"
                  :type="showPass ? 'text' : 'password'"
                  class="auth-input auth-input-pw"
                  v-model="form.password"
                  autocomplete="new-password"
                  placeholder="New password"
                  :aria-describedby="errors.password ? 'rp-password-err' : undefined"
                  :aria-invalid="!!errors.password"
                  @input="errors.password = ''"
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
              <!-- Strength bar -->
              <div class="rp-strength" aria-hidden="true">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="rp-strength-bar"
                  :class="strengthClass(i)"
                ></div>
              </div>
              <p v-if="errors.password" id="rp-password-err" class="rp-field-error" role="alert">
                <i class="fa-solid fa-circle-exclamation"></i>
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm password -->
            <div class="auth-field" :class="{ 'rp-field--error': errors.confirm }">
              <label class="auth-label" for="rp-confirm">Confirm New Password</label>
              <div class="auth-input-wrap">
                <i class="fa-solid fa-lock auth-input-icon"></i>
                <input
                  id="rp-confirm"
                  :type="showConfirm ? 'text' : 'password'"
                  class="auth-input auth-input-pw"
                  v-model="form.confirm"
                  autocomplete="new-password"
                  placeholder="Confirm new password"
                  :aria-describedby="errors.confirm ? 'rp-confirm-err' : undefined"
                  :aria-invalid="!!errors.confirm"
                  @input="errors.confirm = ''"
                />
                <button
                  type="button"
                  class="auth-eye-btn"
                  @click="showConfirm = !showConfirm"
                  :aria-label="showConfirm ? 'Hide password' : 'Show password'"
                >
                  <i :class="showConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
              <p v-if="errors.confirm" id="rp-confirm-err" class="rp-field-error" role="alert">
                <i class="fa-solid fa-circle-exclamation"></i>
                {{ errors.confirm }}
              </p>
            </div>

            <!-- Server error -->
            <div v-if="serverError" class="auth-error" role="alert">
              <i class="fa-solid fa-triangle-exclamation"></i>
              {{ serverError }}
            </div>

            <!-- Submit -->
            <button
              type="submit"
              class="auth-submit-btn"
              :disabled="loading"
            >
              <span class="auth-submit-inner">
                <span v-if="loading" class="auth-spinner"></span>
                <i v-else class="fa-solid fa-shield-check"></i>
                {{ loading ? 'Updating password…' : 'Set New Password' }}
              </span>
            </button>
          </form>

          <!-- Back -->
          <div class="auth-back">
            <RouterLink to="/login" class="auth-back-link">
              <i class="fa-solid fa-arrow-left"></i>
              Back to Sign In
            </RouterLink>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route  = useRoute()
const router = useRouter()

// ── Token from query string ────────────────────────────────────────────────
const token = computed(() => route.query.token || '')

// ── State ──────────────────────────────────────────────────────────────────
const form        = reactive({ password: '', confirm: '' })
const errors      = reactive({ password: '', confirm: '' })
const serverError = ref('')
const loading     = ref(false)
const success     = ref(false)
const showPass    = ref(false)
const showConfirm = ref(false)

// ── Password strength ──────────────────────────────────────────────────────
const strength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8)  score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

function strengthClass(barIndex) {
  if (strength.value === 0) return ''
  if (barIndex > strength.value) return ''
  if (strength.value <= 1) return 'rp-strength-bar--weak'
  if (strength.value <= 2) return 'rp-strength-bar--fair'
  if (strength.value <= 3) return 'rp-strength-bar--good'
  return 'rp-strength-bar--strong'
}

// ── Validation ─────────────────────────────────────────────────────────────
function validate() {
  let valid = true
  if (!form.password) {
    errors.password = 'Please enter a new password.'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    valid = false
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter.'
    valid = false
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = 'Password must contain at least one number.'
    valid = false
  }
  if (!form.confirm) {
    errors.confirm = 'Please confirm your new password.'
    valid = false
  } else if (form.password !== form.confirm) {
    errors.confirm = 'Passwords do not match.'
    valid = false
  }
  return valid
}

// ── Submit ─────────────────────────────────────────────────────────────────
async function handleSubmit() {
  serverError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await axios.post('/api/auth/reset-password', {
      token:    token.value,
      password: form.password
    })
    success.value = true
  } catch (err) {
    const msg = err.response?.data?.message || 'Password reset failed. The link may have expired.'
    serverError.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── LAYOUT (reuse login panel styles via shared CSS vars) ─── */
.auth-layout {
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
}

/* ── BRAND PANEL ────────────────────────────────────────────── */
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
  position: absolute; inset: 0;
  background: linear-gradient(145deg, #0A4B8C 0%, #0d1117 55%, #1a1a2e 100%);
}
.auth-brand-bg::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px;
  background: var(--accent);
  border-radius: 50%;
  opacity: 0.07;
  top: -150px; right: -150px;
}
.auth-brand-bg::after {
  content: '';
  position: absolute;
  width: 300px; height: 300px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.04;
  bottom: -80px; left: -80px;
}
.auth-brand-content {
  position: relative; z-index: 2;
  padding: 3rem; max-width: 420px;
}
.auth-brand-logo {
  display: flex; align-items: center; gap: 0.75rem;
  text-decoration: none; margin-bottom: 3.5rem;
}
.auth-brand-icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.2rem; flex-shrink: 0;
}
.auth-brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.auth-brand-name { font-size: 1rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
.auth-brand-sub  { font-size: 0.5625rem; color: rgba(255,255,255,0.55); letter-spacing: 0.12em; font-weight: 600; margin-top: 2px; }
.auth-brand-headline {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800; color: #fff; line-height: 1.2;
  margin-bottom: 1rem; letter-spacing: -0.02em;
}
.auth-brand-desc { font-size: 1rem; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 2.5rem; }
.auth-brand-stats { display: flex; align-items: center; }
.auth-brand-stat  { display: flex; flex-direction: column; }
.auth-brand-stat-value { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1; }
.auth-brand-stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.55); margin-top: 4px; }
.auth-brand-stat-sep   { width: 1px; height: 36px; background: rgba(255,255,255,0.2); margin: 0 1.5rem; }

/* ── FORM PANEL ─────────────────────────────────────────────── */
.auth-form-panel {
  flex: 1; display: flex;
  align-items: center; justify-content: center;
  padding: 2rem 1.5rem;
  background: var(--bg-primary);
  transition: background 0.3s ease;
}
.auth-form-inner { width: 100%; max-width: 420px; }

/* ── MOBILE LOGO ────────────────────────────────────────────── */
.auth-mobile-logo {
  display: flex; align-items: center; gap: 0.75rem;
  text-decoration: none; margin-bottom: 2.5rem;
}
@media (min-width: 992px) { .auth-mobile-logo { display: none; } }
.auth-mobile-icon {
  width: 40px; height: 40px;
  background: var(--accent); border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.1rem;
}
.auth-mobile-name { font-size: 1.125rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }

/* ── FORM HEADER ────────────────────────────────────────────── */
.rp-header-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary-dark, #0056b3) 100%);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.25rem;
  box-shadow: 0 8px 20px rgba(0,123,255,0.3);
  margin-bottom: 1.25rem;
}
.auth-form-header { margin-bottom: 2rem; }
.auth-form-title {
  font-size: 1.75rem; font-weight: 800;
  color: var(--text-primary); margin-bottom: 0.375rem; letter-spacing: -0.02em;
}
.auth-form-subtitle { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6; }

/* ── FIELDS ─────────────────────────────────────────────────── */
.auth-field { margin-bottom: 1.25rem; }
.auth-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
.auth-input-wrap { position: relative; display: flex; align-items: center; }
.auth-input-icon {
  position: absolute; left: 1rem;
  color: var(--text-muted); font-size: 0.875rem;
  pointer-events: none; z-index: 1;
}
.auth-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9375rem; color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none; font-family: inherit;
}
.auth-input::placeholder { color: var(--text-muted); }
.auth-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow, rgba(0,123,255,0.15));
  background: var(--bg-primary);
}
.auth-input-pw { padding-right: 3rem; }
.auth-eye-btn {
  position: absolute; right: 0.875rem;
  background: none; border: none;
  color: var(--text-muted); cursor: pointer;
  padding: 0.25rem; display: flex; align-items: center;
  font-size: 0.9rem; transition: color 0.2s;
}
.auth-eye-btn:hover { color: var(--text-primary); }

.rp-field--error .auth-input {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220,53,69,0.12);
}

.rp-field-error {
  display: flex; align-items: center; gap: 0.375rem;
  margin-top: 0.375rem; font-size: 0.8125rem; color: #dc3545;
}
[data-theme="dark"] .rp-field-error { color: #ff6b7a; }

/* ── STRENGTH BAR ───────────────────────────────────────────── */
.rp-strength {
  display: flex; gap: 4px; margin-top: 6px;
}
.rp-strength-bar {
  flex: 1; height: 3px; border-radius: 2px;
  background: var(--border-color);
  transition: background 0.25s ease;
}
.rp-strength-bar--weak   { background: #dc3545; }
.rp-strength-bar--fair   { background: #fd7e14; }
.rp-strength-bar--good   { background: #ffc107; }
.rp-strength-bar--strong { background: #28a745; }

/* ── ERROR BANNER ───────────────────────────────────────────── */
.auth-error {
  display: flex; align-items: center; gap: 0.5rem;
  background: rgba(220,53,69,0.1);
  border: 1px solid rgba(220,53,69,0.3);
  border-radius: 10px; padding: 0.75rem 1rem;
  color: #dc3545; font-size: 0.875rem; margin-bottom: 1.25rem;
}
[data-theme="dark"] .auth-error {
  background: rgba(220,53,69,0.15);
  border-color: rgba(220,53,69,0.4);
  color: #ff6b7a;
}

/* ── SUBMIT BUTTON ──────────────────────────────────────────── */
.auth-submit-btn {
  width: 100%; padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary-dark, #0056b3) 100%);
  color: white; border: none; border-radius: 12px;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  margin-bottom: 1.5rem; margin-top: 0.5rem;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(0,123,255,0.35);
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
}
.auth-submit-btn:hover:not(:disabled) {
  opacity: 0.92; transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,123,255,0.45);
}
.auth-submit-btn:active:not(:disabled) { transform: translateY(0); }
.auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-submit-inner {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.rp-btn-link { gap: 0.5rem; }

/* ── SPINNER ────────────────────────────────────────────────── */
.auth-spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: rp-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes rp-spin { to { transform: rotate(360deg); } }

/* ── BACK LINK ──────────────────────────────────────────────── */
.auth-back { text-align: center; }
.auth-back-link {
  font-size: 0.875rem; color: var(--text-muted);
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 0.375rem;
  transition: color 0.2s;
}
.auth-back-link:hover { color: var(--text-secondary); }

/* ── STATE CARDS (success / error) ─────────────────────────── */
.rp-state-card {
  display: flex; flex-direction: column;
  align-items: flex-start; gap: 0;
}
.rp-state-icon {
  width: 64px; height: 64px;
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-size: 1.75rem; color: white;
  margin-bottom: 1.25rem;
  animation: rp-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.rp-state-icon--success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  box-shadow: 0 8px 24px rgba(40,167,69,0.35);
}
.rp-state-icon--error {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 8px 24px rgba(220,53,69,0.3);
}
@keyframes rp-pop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
.rp-state-card .auth-form-title  { margin-bottom: 0.5rem; }
.rp-state-card .auth-form-subtitle { margin-bottom: 1.75rem; }
.rp-state-card .auth-submit-btn  { margin-top: 0; width: auto; padding-left: 2rem; padding-right: 2rem; }
</style>
