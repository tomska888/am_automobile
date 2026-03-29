<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="fpm-backdrop">
      <div
        v-if="modelValue"
        class="fpm-backdrop"
        aria-hidden="true"
        @click="handleClose"
      ></div>
    </Transition>

    <!-- Dialog -->
    <Transition name="fpm-modal">
      <div
        v-if="modelValue"
        class="fpm-wrapper"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('auth.forgotPassword.title')"
        @keydown.esc="handleClose"
      >
        <div class="fpm-dialog" ref="dialogRef">
          <!-- Close button -->
          <button
            type="button"
            class="fpm-close"
            :aria-label="'Close'"
            @click="handleClose"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- ── SUCCESS STATE ── -->
          <div v-if="sent" class="fpm-success">
            <div class="fpm-success-icon">
              <i class="fa-solid fa-envelope-circle-check"></i>
            </div>
            <h2 class="fpm-title">{{ $t('auth.forgotPassword.successTitle') }}</h2>
            <p class="fpm-subtitle">{{ $t('auth.forgotPassword.successMsg') }}</p>
            <button type="button" class="fpm-btn fpm-btn-ghost" @click="handleClose">
              <i class="fa-solid fa-arrow-left"></i>
              {{ $t('auth.forgotPassword.backToLogin') }}
            </button>
          </div>

          <!-- ── FORM STATE ── -->
          <template v-else>
            <!-- Icon header -->
            <div class="fpm-icon-wrap">
              <div class="fpm-icon">
                <i class="fa-solid fa-key"></i>
              </div>
            </div>

            <h2 class="fpm-title">{{ $t('auth.forgotPassword.title') }}</h2>
            <p class="fpm-subtitle">{{ $t('auth.forgotPassword.subtitle') }}</p>

            <form @submit.prevent="handleSubmit" novalidate class="fpm-form">
              <!-- Email field -->
              <div class="fpm-field" :class="{ 'fpm-field--error': fieldError }">
                <label class="fpm-label" for="fpm-email">
                  {{ $t('auth.forgotPassword.email') }}
                </label>
                <div class="fpm-input-wrap">
                  <i class="fa-solid fa-envelope fpm-input-icon"></i>
                  <input
                    id="fpm-email"
                    ref="emailRef"
                    type="email"
                    class="fpm-input"
                    v-model.trim="email"
                    autocomplete="email"
                    :placeholder="$t('auth.forgotPassword.email')"
                    :aria-describedby="fieldError ? 'fpm-email-error' : undefined"
                    :aria-invalid="!!fieldError"
                    @input="fieldError = ''"
                  />
                </div>
                <p v-if="fieldError" id="fpm-email-error" class="fpm-field-error" role="alert">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {{ fieldError }}
                </p>
              </div>

              <!-- Server error -->
              <div v-if="serverError" class="fpm-server-error" role="alert">
                <i class="fa-solid fa-triangle-exclamation"></i>
                {{ serverError }}
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="fpm-btn fpm-btn-primary"
                :disabled="authStore.loading"
              >
                <span class="fpm-btn-inner">
                  <span v-if="authStore.loading" class="fpm-spinner"></span>
                  <i v-else class="fa-solid fa-paper-plane"></i>
                  {{ authStore.loading
                    ? $t('auth.forgotPassword.submitting')
                    : $t('auth.forgotPassword.submit') }}
                </span>
              </button>

              <!-- Back link -->
              <button type="button" class="fpm-btn fpm-btn-ghost" @click="handleClose">
                <i class="fa-solid fa-arrow-left"></i>
                {{ $t('auth.forgotPassword.backToLogin') }}
              </button>
            </form>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useI18n } from 'vue-i18n'

// ── Props / Emits ──────────────────────────────────────────────────────────
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

// ── Stores / i18n ──────────────────────────────────────────────────────────
const authStore = useAuthStore()
const { t } = useI18n()

// ── Local state ────────────────────────────────────────────────────────────
const email       = ref('')
const fieldError  = ref('')
const serverError = ref('')
const sent        = ref(false)
const emailRef    = ref(null)
const dialogRef   = ref(null)

// ── Focus management ───────────────────────────────────────────────────────
watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      // Reset state each time modal opens
      email.value       = ''
      fieldError.value  = ''
      serverError.value = ''
      sent.value        = false
      await nextTick()
      emailRef.value?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

// ── Methods ────────────────────────────────────────────────────────────────
function handleClose() {
  emit('update:modelValue', false)
}

function validate() {
  if (!email.value) {
    fieldError.value = t('auth.validation.required')
    return false
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(email.value)) {
    fieldError.value = t('auth.validation.emailInvalid')
    return false
  }
  fieldError.value = ''
  return true
}

async function handleSubmit() {
  serverError.value = ''
  if (!validate()) return

  const result = await authStore.forgotPassword(email.value)

  if (result.success) {
    sent.value = true
  } else {
    serverError.value = t('auth.forgotPassword.error')
  }
}
</script>

<style scoped>
/* ── BACKDROP ────────────────────────────────────────────────── */
.fpm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
}

/* ── WRAPPER (centers the dialog) ───────────────────────────── */
.fpm-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

/* ── DIALOG ──────────────────────────────────────────────────── */
.fpm-dialog {
  position: relative;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem 2rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: background 0.3s ease, border-color 0.3s ease;
}

[data-theme="dark"] .fpm-dialog {
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* ── CLOSE BUTTON ────────────────────────────────────────────── */
.fpm-close {
  position: absolute;
  top: 1.125rem;
  right: 1.125rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}
.fpm-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* ── ICON HEADER ─────────────────────────────────────────────── */
.fpm-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.fpm-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary-dark, #0056b3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.375rem;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}

/* ── TYPOGRAPHY ──────────────────────────────────────────────── */
.fpm-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.fpm-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.65;
  margin-bottom: 1.75rem;
}

/* ── FORM ────────────────────────────────────────────────────── */
.fpm-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── FIELD ───────────────────────────────────────────────────── */
.fpm-field {
  margin-bottom: 1.125rem;
}

.fpm-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.fpm-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.fpm-input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 1;
}

.fpm-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.fpm-input::placeholder { color: var(--text-muted); }

.fpm-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow, rgba(0,123,255,0.15));
  background: var(--bg-primary);
}

.fpm-field--error .fpm-input {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.12);
}

.fpm-field-error {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: #dc3545;
}

[data-theme="dark"] .fpm-field-error { color: #ff6b7a; }

/* ── SERVER ERROR ────────────────────────────────────────────── */
.fpm-server-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1.125rem;
}
[data-theme="dark"] .fpm-server-error {
  background: rgba(220, 53, 69, 0.15);
  border-color: rgba(220, 53, 69, 0.4);
  color: #ff6b7a;
}

/* ── BUTTONS ─────────────────────────────────────────────────── */
.fpm-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  border: none;
  transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  margin-bottom: 0.625rem;
}

.fpm-btn:last-child { margin-bottom: 0; }

.fpm-btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.fpm-btn-primary {
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary-dark, #0056b3) 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.35);
  margin-top: 0.375rem;
}
.fpm-btn-primary:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.45);
}
.fpm-btn-primary:active:not(:disabled) { transform: translateY(0); }
.fpm-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.fpm-btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1.5px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}
.fpm-btn-ghost:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* ── SPINNER ─────────────────────────────────────────────────── */
.fpm-spinner {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: fpm-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes fpm-spin { to { transform: rotate(360deg); } }

/* ── SUCCESS STATE ───────────────────────────────────────────── */
.fpm-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

.fpm-success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px rgba(40, 167, 69, 0.35);
  animation: fpm-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fpm-pop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.fpm-success .fpm-subtitle {
  margin-bottom: 1.75rem;
  max-width: 340px;
}

.fpm-success .fpm-btn-ghost {
  width: auto;
  padding: 0.625rem 1.5rem;
}

/* ── TRANSITIONS ─────────────────────────────────────────────── */
/* Backdrop */
.fpm-backdrop-enter-active,
.fpm-backdrop-leave-active { transition: opacity 0.25s ease; }
.fpm-backdrop-enter-from,
.fpm-backdrop-leave-to    { opacity: 0; }

/* Modal */
.fpm-modal-enter-active { transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.fpm-modal-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fpm-modal-enter-from   { opacity: 0; transform: scale(0.92) translateY(12px); }
.fpm-modal-leave-to     { opacity: 0; transform: scale(0.95) translateY(8px); }
</style>
