<template>
  <div class="contact-page">
    <AppHeader />

    <!-- Hero Banner -->
    <section class="contact-hero">
      <div class="contact-hero-inner">
        <span class="contact-hero-label">
          <i class="fa-solid fa-envelope me-2"></i>{{ $t('nav.contact') }}
        </span>
        <h1 class="contact-hero-title">{{ $t('contact.title') }}</h1>
        <p class="contact-hero-sub">{{ $t('contact.subtitle') }}</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="contact-body">
      <div class="contact-container">
        <div class="contact-grid">

          <!-- Left: Info + Map -->
          <div class="contact-info-col">

            <!-- Info Card -->
            <div class="contact-info-card">
              <h2 class="contact-info-heading">{{ $t('contact.info.hours') }}</h2>

              <div class="contact-info-item">
                <div class="contact-info-icon">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div class="contact-info-body">
                  <p class="contact-info-label">{{ $t('contact.info.address') }}</p>
                  <p class="contact-info-value">ul. Przykładowa 1<br />00-001 Warszawa, Poland</p>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-info-icon">
                  <i class="fa-solid fa-phone"></i>
                </div>
                <div class="contact-info-body">
                  <p class="contact-info-label">{{ $t('contact.info.phone') }}</p>
                  <a class="contact-info-link" href="tel:+48123456789">+48 123 456 789</a>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-info-icon">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="contact-info-body">
                  <p class="contact-info-label">{{ $t('contact.info.email') }}</p>
                  <a class="contact-info-link" href="mailto:contact@amautomobile.com">contact@amautomobile.com</a>
                </div>
              </div>

              <div class="contact-info-item" style="border-bottom: none; padding-bottom: 0;">
                <div class="contact-info-icon">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <div class="contact-info-body">
                  <p class="contact-info-label">{{ $t('contact.info.hours') }}</p>
                  <p class="contact-info-value">{{ $t('contact.info.hoursVal') }}</p>
                </div>
              </div>
            </div>

            <!-- Map -->
            <div class="contact-map-wrap">
              <h3 class="contact-map-title">{{ $t('contact.map.title') }}</h3>
              <div class="contact-map-frame">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.3992157937604!2d21.017532315817985!3d52.22977097975988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc669a869f01%3A0x72f0be2a688537!2sWarsaw%2C%20Poland!5e0!3m2!1sen!2spl!4v1647878974965!5m2!1sen!2spl"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="AM Automobile Location"
                ></iframe>
              </div>
              <a
                href="https://maps.google.com/?q=Warsaw,Poland"
                target="_blank"
                rel="noopener"
                class="contact-directions-btn"
              >
                <i class="fa-solid fa-diamond-turn-right"></i>
                {{ $t('contact.map.directions') }}
              </a>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="contact-form-col">
            <div class="contact-form-card">
              <h2 class="contact-form-heading">{{ $t('contact.form.title') }}</h2>

              <form @submit.prevent="handleSubmit" class="contact-form">
                <div class="contact-form-row">
                  <div class="contact-field">
                    <label class="contact-label">{{ $t('contact.form.name') }} <span class="contact-req">*</span></label>
                    <input
                      type="text"
                      class="contact-input"
                      v-model="form.name"
                      required
                      :placeholder="$t('contact.form.name')"
                    />
                  </div>
                  <div class="contact-field">
                    <label class="contact-label">{{ $t('contact.form.phone') }}</label>
                    <input
                      type="tel"
                      class="contact-input"
                      v-model="form.phone"
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>

                <div class="contact-field">
                  <label class="contact-label">{{ $t('contact.form.email') }} <span class="contact-req">*</span></label>
                  <input
                    type="email"
                    class="contact-input"
                    v-model="form.email"
                    required
                    :placeholder="$t('contact.form.email')"
                  />
                </div>

                <div class="contact-field">
                  <label class="contact-label">{{ $t('contact.form.subject') }}</label>
                  <input
                    type="text"
                    class="contact-input"
                    v-model="form.subject"
                    :placeholder="$t('contact.form.subject')"
                  />
                </div>

                <div class="contact-field">
                  <label class="contact-label">{{ $t('contact.form.message') }} <span class="contact-req">*</span></label>
                  <textarea
                    class="contact-input contact-textarea"
                    v-model="form.message"
                    required
                    rows="6"
                    :placeholder="$t('contact.form.message')"
                  ></textarea>
                </div>

                <!-- Feedback -->
                <div v-if="success" class="contact-alert contact-alert-success">
                  <i class="fa-solid fa-circle-check"></i>
                  {{ $t('contact.form.success') }}
                </div>
                <div v-if="errorMsg" class="contact-alert contact-alert-error">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ errorMsg }}
                </div>

                <button type="submit" class="contact-submit-btn" :disabled="submitting">
                  <span v-if="submitting" class="contact-spinner"></span>
                  <i v-else class="fa-solid fa-paper-plane"></i>
                  {{ submitting ? $t('contact.form.sending') : $t('contact.form.send') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t } = useI18n()

const submitting = ref(false)
const success    = ref(false)
const errorMsg   = ref('')

const form = reactive({
  name: '', email: '', phone: '', subject: '', message: ''
})

async function handleSubmit() {
  submitting.value = true
  success.value    = false
  errorMsg.value   = ''
  try {
    await axios.post('/api/contact', form)
    success.value = true
    Object.keys(form).forEach(k => form[k] = '')
  } catch (err) {
    errorMsg.value = err.response?.data?.message || t('contact.form.error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* ── PAGE ──────────────────────────────────────────── */
.contact-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* ── HERO ──────────────────────────────────────────── */
.contact-hero {
  background: linear-gradient(135deg, #0A4B8C 0%, #0066CC 60%, #1a7fd4 100%);
  padding: calc(var(--nav-height, 72px) + 3.5rem) 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.contact-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.contact-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.contact-hero-label {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.contact-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.contact-hero-sub {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.78);
  margin: 0;
}

/* ── BODY ──────────────────────────────────────────── */
.contact-body {
  background: var(--bg-secondary);
  padding: 3rem 1.5rem 5rem;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── GRID ──────────────────────────────────────────── */
.contact-grid {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 960px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

/* ── INFO CARD ─────────────────────────────────────── */
.contact-info-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.contact-info-heading {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.contact-info-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 1rem;
  flex-shrink: 0;
}

.contact-info-body { flex: 1; }

.contact-info-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin: 0 0 0.25rem;
}

.contact-info-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
}

.contact-info-link {
  font-size: 0.9rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.contact-info-link:hover { opacity: 0.8; }

/* ── MAP ───────────────────────────────────────────── */
.contact-map-wrap {}

.contact-map-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.85rem;
}

.contact-map-frame {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  height: 280px;
  margin-bottom: 0.85rem;
}

.contact-map-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.contact-directions-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
}

.contact-directions-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.contact-directions-btn i { color: var(--accent); }

/* ── FORM CARD ─────────────────────────────────────── */
.contact-form-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.contact-form-heading {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 2rem;
}

/* ── FORM FIELDS ───────────────────────────────────── */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 560px) {
  .contact-form-row { grid-template-columns: 1fr; }
}

.contact-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.contact-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.contact-req {
  color: var(--danger);
}

.contact-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.contact-input::placeholder { color: var(--text-muted); }

.contact-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--bg-primary);
}

.contact-textarea {
  resize: vertical;
  min-height: 140px;
}

/* ── ALERTS ────────────────────────────────────────── */
.contact-alert {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.875rem 1.1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
}

.contact-alert-success {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.25);
}

.contact-alert-error {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.25);
}

/* ── SUBMIT BUTTON ─────────────────────────────────── */
.contact-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  margin-top: 0.5rem;
}

.contact-submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--accent-glow);
}

.contact-submit-btn:active { transform: translateY(0); }

.contact-submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ── SPINNER ───────────────────────────────────────── */
.contact-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: contactSpin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes contactSpin {
  to { transform: rotate(360deg); }
}
</style>
