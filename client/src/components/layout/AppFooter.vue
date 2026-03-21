<template>
  <footer class="am-footer" id="footer" aria-label="Site footer">
    <div class="container container-xl">
      <div class="footer-main-grid">

        <!-- Col 1: Logo + Tagline + Socials -->
        <div class="footer-logo-col">
          <RouterLink to="/" class="footer-logo" aria-label="AM Automobile">
            <div class="footer-logo-icon">
              <i class="fa-solid fa-car-side"></i>
            </div>
            <div class="footer-logo-text">
              <span class="footer-logo-name">AM Automobile</span>
              <span class="footer-logo-sub">PREMIUM DEALERSHIP</span>
            </div>
          </RouterLink>
          <p class="footer-tagline">{{ $t('footer.tagline') }}</p>
          <div class="footer-socials" aria-label="Social media links">
            <a href="#" class="footer-social-btn" aria-label="Facebook" target="_blank" rel="noopener">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" class="footer-social-btn" aria-label="Instagram" target="_blank" rel="noopener">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="footer-social-btn" aria-label="YouTube" target="_blank" rel="noopener">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <a href="#" class="footer-social-btn" aria-label="TikTok" target="_blank" rel="noopener">
              <i class="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

        <!-- Col 2: Company -->
        <div>
          <h6 class="footer-col-heading">{{ $t('footer.company') }}</h6>
          <ul class="footer-link-list" role="list">
            <li><RouterLink to="/about">{{ $t('footer.links.about') }}</RouterLink></li>
            <li><a href="#">{{ $t('footer.links.team') }}</a></li>
            <li><a href="#">{{ $t('footer.links.careers') }}</a></li>
            <li><a href="#">{{ $t('footer.links.blog') }}</a></li>
          </ul>
        </div>

        <!-- Col 3: Inventory -->
        <div>
          <h6 class="footer-col-heading">{{ $t('footer.inventory') }}</h6>
          <ul class="footer-link-list" role="list">
            <li><RouterLink to="/inventory">{{ $t('footer.links.allCars') }}</RouterLink></li>
            <li><RouterLink to="/inventory?sort=year_desc">{{ $t('footer.links.byMake') }}</RouterLink></li>
            <li><RouterLink to="/inventory?body_type=suv">{{ $t('footer.links.byType') }}</RouterLink></li>
            <li><RouterLink to="/inventory?featured=1">{{ $t('footer.links.featured') }}</RouterLink></li>
          </ul>
        </div>

        <!-- Col 4: Support -->
        <div>
          <h6 class="footer-col-heading">{{ $t('footer.support') }}</h6>
          <ul class="footer-link-list" role="list">
            <li><RouterLink to="/contact">{{ $t('footer.links.contact') }}</RouterLink></li>
            <li><a href="#">{{ $t('footer.links.faq') }}</a></li>
            <li><a href="#">{{ $t('footer.links.financing') }}</a></li>
            <li><a href="#">{{ $t('footer.links.testDrive') }}</a></li>
          </ul>
        </div>

        <!-- Col 5: Legal + Newsletter -->
        <div>
          <h6 class="footer-col-heading">{{ $t('footer.legal') }}</h6>
          <ul class="footer-link-list" role="list">
            <li><RouterLink to="/terms">{{ $t('footer.links.tos') }}</RouterLink></li>
            <li><RouterLink to="/privacy">{{ $t('footer.links.privacy') }}</RouterLink></li>
            <li><RouterLink to="/cookies">{{ $t('footer.links.cookies') }}</RouterLink></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          {{ $t('footer.copyright', { year: currentYear }) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui.js'
import { useAuthStore } from '@/stores/auth.js'

const { locale } = useI18n()
const uiStore = useUiStore()
const authStore = useAuthStore()

const newsletterEmail = ref('')
const currentYear = computed(() => new Date().getFullYear())

const languages = [
  { code: 'pl', name: 'PL' },
  { code: 'en', name: 'EN' },
  { code: 'lt', name: 'LT' },
  { code: 'ru', name: 'RU' },
]

function switchLang(code) {
  locale.value = code
  uiStore.setLocale(code)
  if (authStore.isAuthenticated) {
    authStore.savePreferences({ locale: code })
  }
}

function subscribeNewsletter() {
  if (!newsletterEmail.value) return
  // Show toast if uiStore supports it, fallback to alert
  if (uiStore.showToast) {
    uiStore.showToast('🎉 Successfully subscribed! Welcome to AM Automobile.')
  } else {
    alert('Successfully subscribed!')
  }
  newsletterEmail.value = ''
}
</script>

<style scoped>
/* ── FOOTER BASE ──────────────────────────────────────────── */
.am-footer {
  background: #0d1117;
  color: #8b949e;
  padding-top: 4rem;
}

.container-xl {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── MAIN GRID ────────────────────────────────────────────── */
.footer-main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 2.5rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid #21262d;
}

@media (max-width: 1024px) {
  .footer-main-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
  .footer-logo-col { grid-column: 1 / -1; }
}

@media (max-width: 640px) {
  .footer-main-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
  }
}

/* ── LOGO COL ─────────────────────────────────────────────── */
.footer-logo-col { display: flex; flex-direction: column; gap: 0; }

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: #E6EDF3;
  margin-bottom: 0.875rem;
}

.footer-logo-icon {
  width: 38px;
  height: 38px;
  background: rgba(255,255,255,0.08);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.footer-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.footer-logo-name {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #E6EDF3;
  letter-spacing: -0.01em;
}

.footer-logo-sub {
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  color: #8b949e;
  font-weight: 600;
  margin-top: 2px;
}

.footer-tagline {
  font-size: 0.875rem;
  color: #8b949e;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

/* Socials */
.footer-socials {
  display: flex;
  gap: 8px;
}

.footer-social-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid #21262d;
  color: #8b949e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.footer-social-btn:hover {
  background: rgba(0,123,255,0.15);
  border-color: rgba(0,123,255,0.3);
  color: #58a6ff;
}

/* ── COLUMNS ──────────────────────────────────────────────── */
.footer-col-heading {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #E6EDF3;
  margin-bottom: 1rem;
}

.footer-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link-list li a,
.footer-link-list li a:visited {
  color: #8b949e;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}
.footer-link-list li a:hover { color: #ffffff; }

/* ── NEWSLETTER ───────────────────────────────────────────── */
.footer-newsletter-sub {
  font-size: 0.8125rem;
  color: #8b949e;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.footer-newsletter-form {
  display: flex;
  gap: 6px;
}

.footer-newsletter-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid #21262d;
  border-radius: 8px;
  color: #E6EDF3;
  font-size: 0.8125rem;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s ease;
  min-width: 0;
}
.footer-newsletter-input::placeholder { color: #6e7681; }
.footer-newsletter-input:focus { border-color: #007BFF; }

.btn-newsletter {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #007BFF, #0A4B8C);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.btn-newsletter:hover { opacity: 0.9; transform: scale(1.05); }

/* ── FOOTER BOTTOM ────────────────────────────────────────── */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem 0;
}

.footer-copyright {
  font-size: 0.8125rem;
  color: #8b949e;
  margin: 0;
}

.footer-lang-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.footer-lang-btn {
  background: transparent;
  border: none;
  color: #8b949e;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.footer-lang-btn:hover { color: white; background: rgba(255,255,255,0.06); }
.footer-lang-btn.active { color: #58a6ff; }

.footer-made-with {
  font-size: 0.8125rem;
  color: #8b949e;
  margin: 0;
}
</style>
