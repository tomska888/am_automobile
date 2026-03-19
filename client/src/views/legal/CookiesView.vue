<template>
  <div class="legal-page">
    <AppHeader />

    <main class="legal-main">
      <div class="container">
        <!-- Page Header -->
        <div class="legal-header">
          <div class="legal-icon">
            <i class="fas fa-cookie-bite"></i>
          </div>
          <h1 class="legal-title">{{ $t('legal.cookies.title') }}</h1>
          <p class="legal-subtitle">{{ $t('legal.tos.lastUpdated') }}: 1 marca 2025</p>
        </div>

        <!-- Cookie Consent Banner (for demo) -->
        <div v-if="showBanner" class="cookie-banner">
          <div class="cookie-banner-content">
            <i class="fas fa-cookie-bite cookie-banner-icon"></i>
            <div class="cookie-banner-text">
              <strong>Zarządzaj preferencjami cookies</strong>
              <p>
                Używamy plików cookies, aby poprawić Twoje doświadczenia. Możesz zaakceptować
                wszystkie lub dostosować swoje preferencje.
              </p>
            </div>
          </div>
          <div class="cookie-banner-actions">
            <button class="btn-am-ghost btn-sm" @click="managePreferences">Zarządzaj</button>
            <button class="btn-am-secondary btn-sm" @click="acceptNecessary">
              Tylko niezbędne
            </button>
            <button class="btn-am-primary btn-sm" @click="acceptAll">Akceptuj wszystkie</button>
          </div>
        </div>

        <!-- Content -->
        <div class="legal-content">
          <div class="legal-toc">
            <h3>Spis treści</h3>
            <ol>
              <li><a href="#what-are">Czym są pliki cookies?</a></li>
              <li><a href="#types">Rodzaje cookies</a></li>
              <li><a href="#used">Cookies używane w Serwisie</a></li>
              <li><a href="#third-party">Cookies podmiotów trzecich</a></li>
              <li><a href="#management">Zarządzanie cookies</a></li>
              <li><a href="#browser">Ustawienia przeglądarki</a></li>
              <li><a href="#contact">Kontakt</a></li>
            </ol>
          </div>

          <section id="what-are" class="legal-section">
            <h2>1. Czym są pliki cookies?</h2>
            <p>
              Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu
              (komputerze, tablecie, smartfonie) podczas przeglądania stron internetowych. Służą
              one do zapamiętywania informacji o Twojej wizycie i preferencjach.
            </p>
            <p>
              Pliki cookies nie są wirusami ani złośliwym oprogramowaniem. Nie mogą samodzielnie
              uruchamiać programów ani instalować oprogramowania. Są szeroko stosowane w celu
              usprawnienia działania serwisów internetowych.
            </p>
          </section>

          <section id="types" class="legal-section">
            <h2>2. Rodzaje plików cookies</h2>

            <div class="cookie-type-grid">
              <div class="cookie-type-card cookie-type-essential">
                <div class="cookie-type-header">
                  <i class="fas fa-lock"></i>
                  <h3>Niezbędne</h3>
                  <span class="cookie-badge cookie-badge-required">Zawsze aktywne</span>
                </div>
                <p>
                  Niezbędne do prawidłowego działania Serwisu. Umożliwiają podstawowe funkcje jak
                  nawigacja i dostęp do zabezpieczonych obszarów. Serwis nie może prawidłowo
                  funkcjonować bez tych plików.
                </p>
              </div>

              <div class="cookie-type-card">
                <div class="cookie-type-header">
                  <i class="fas fa-chart-bar"></i>
                  <h3>Analityczne</h3>
                  <label class="cookie-toggle-switch">
                    <input v-model="preferences.analytics" type="checkbox" />
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p>
                  Pomagają nam zrozumieć, jak odwiedzający korzystają z Serwisu. Zbierają anonimowe
                  informacje o liczbie odwiedzin, czasie spędzonym na stronach i błędach.
                </p>
              </div>

              <div class="cookie-type-card">
                <div class="cookie-type-header">
                  <i class="fas fa-bullhorn"></i>
                  <h3>Marketingowe</h3>
                  <label class="cookie-toggle-switch">
                    <input v-model="preferences.marketing" type="checkbox" />
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p>
                  Używane do śledzenia odwiedzających między stronami i wyświetlania odpowiednich
                  reklam. Przechowują informacje o wyborach użytkownika i profilach zachowań.
                </p>
              </div>

              <div class="cookie-type-card">
                <div class="cookie-type-header">
                  <i class="fas fa-sliders-h"></i>
                  <h3>Preferencji</h3>
                  <label class="cookie-toggle-switch">
                    <input v-model="preferences.functional" type="checkbox" />
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p>
                  Pozwalają Serwisowi zapamiętać Twoje wybory (jak język interfejsu, motyw
                  kolorystyczny czy region). Zapewniają spersonalizowane doświadczenie.
                </p>
              </div>
            </div>

            <div class="preferences-save">
              <button class="btn-am-primary" @click="savePreferences">
                <i class="fas fa-save"></i>
                Zapisz moje preferencje
              </button>
              <span v-if="saved" class="preferences-saved-msg">
                <i class="fas fa-check-circle"></i> Preferencje zapisane!
              </span>
            </div>
          </section>

          <section id="used" class="legal-section">
            <h2>3. Cookies używane w Serwisie AM Automobile</h2>

            <div class="cookie-table-wrapper">
              <table class="cookie-table">
                <thead>
                  <tr>
                    <th>Nazwa</th>
                    <th>Typ</th>
                    <th>Czas trwania</th>
                    <th>Cel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>am_session</code></td>
                    <td><span class="cookie-badge cookie-badge-required">Niezbędne</span></td>
                    <td>Sesja</td>
                    <td>Utrzymanie sesji zalogowanego użytkownika</td>
                  </tr>
                  <tr>
                    <td><code>am_auth_token</code></td>
                    <td><span class="cookie-badge cookie-badge-required">Niezbędne</span></td>
                    <td>7 dni</td>
                    <td>Token autoryzacji JWT dla zalogowanych użytkowników</td>
                  </tr>
                  <tr>
                    <td><code>am_theme</code></td>
                    <td><span class="cookie-badge cookie-badge-functional">Preferencji</span></td>
                    <td>1 rok</td>
                    <td>Zapamiętanie wybranego motywu (jasny/ciemny)</td>
                  </tr>
                  <tr>
                    <td><code>am_locale</code></td>
                    <td><span class="cookie-badge cookie-badge-functional">Preferencji</span></td>
                    <td>1 rok</td>
                    <td>Zapamiętanie wybranego języka interfejsu</td>
                  </tr>
                  <tr>
                    <td><code>am_cookie_consent</code></td>
                    <td><span class="cookie-badge cookie-badge-required">Niezbędne</span></td>
                    <td>1 rok</td>
                    <td>Zapamiętanie Twoich preferencji dotyczących cookies</td>
                  </tr>
                  <tr>
                    <td><code>_ga</code></td>
                    <td><span class="cookie-badge cookie-badge-analytics">Analityczne</span></td>
                    <td>2 lata</td>
                    <td>Google Analytics – identyfikacja użytkowników</td>
                  </tr>
                  <tr>
                    <td><code>_ga_*</code></td>
                    <td><span class="cookie-badge cookie-badge-analytics">Analityczne</span></td>
                    <td>2 lata</td>
                    <td>Google Analytics 4 – przechowywanie stanu sesji</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="third-party" class="legal-section">
            <h2>4. Cookies podmiotów trzecich</h2>
            <p>Serwis może korzystać z usług zewnętrznych dostawców, którzy ustawiają własne cookies:</p>
            <ul>
              <li>
                <strong>Google Maps</strong> – mapy i geolokalizacja na stronie kontaktowej
                (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                  Polityka prywatności Google</a
                >)
              </li>
              <li>
                <strong>Google Analytics</strong> – analiza ruchu na stronie
                (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                  Polityka prywatności Google</a
                >)
              </li>
              <li>
                <strong>Facebook Pixel</strong> – remarketing i analiza konwersji (jeśli dotyczy)
              </li>
            </ul>
            <p>
              Nie mamy kontroli nad cookies podmiotów trzecich. Zachęcamy do zapoznania się z ich
              politykami prywatności.
            </p>
          </section>

          <section id="management" class="legal-section">
            <h2>5. Zarządzanie cookies</h2>
            <p>Możesz zarządzać plikami cookies na kilka sposobów:</p>
            <ul>
              <li>
                <strong>Panel preferencji powyżej</strong> – ustaw swoje preferencje bezpośrednio
                na tej stronie
              </li>
              <li>
                <strong>Ustawienia przeglądarki</strong> – zablokuj lub usuń cookies przez
                ustawienia swojej przeglądarki
              </li>
              <li>
                <strong>Narzędzia opt-out</strong> – skorzystaj z narzędzi rezygnacji oferowanych
                przez dostawców analityki
              </li>
            </ul>
            <p>
              Pamiętaj, że zablokowanie niektórych cookies może wpłynąć na funkcjonalność Serwisu.
            </p>
          </section>

          <section id="browser" class="legal-section">
            <h2>6. Ustawienia przeglądarki</h2>
            <p>Instrukcje zarządzania cookies dla popularnych przeglądarek:</p>
            <div class="browser-links">
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener"
                class="browser-link"
              >
                <i class="fab fa-chrome"></i>
                Google Chrome
              </a>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener"
                class="browser-link"
              >
                <i class="fab fa-firefox"></i>
                Mozilla Firefox
              </a>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406"
                target="_blank"
                rel="noopener"
                class="browser-link"
              >
                <i class="fab fa-edge"></i>
                Microsoft Edge
              </a>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener"
                class="browser-link"
              >
                <i class="fab fa-safari"></i>
                Apple Safari
              </a>
            </div>
          </section>

          <section id="contact" class="legal-section">
            <h2>7. Kontakt</h2>
            <p>W przypadku pytań dotyczących plików cookies, prosimy o kontakt:</p>
            <div class="legal-contact-info">
              <p><strong>AM Automobile sp. z o.o.</strong></p>
              <p><i class="fas fa-envelope"></i> privacy@amautomobile.pl</p>
              <p><i class="fas fa-phone"></i> +48 22 123 45 67</p>
            </div>
          </section>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const showBanner = ref(!localStorage.getItem('am_cookie_consent'))
const saved = ref(false)

const preferences = ref({
  analytics: false,
  marketing: false,
  functional: true
})

function acceptAll() {
  preferences.value = { analytics: true, marketing: true, functional: true }
  savePreferences()
  showBanner.value = false
}

function acceptNecessary() {
  preferences.value = { analytics: false, marketing: false, functional: false }
  savePreferences()
  showBanner.value = false
}

function managePreferences() {
  showBanner.value = false
  document.getElementById('types')?.scrollIntoView({ behavior: 'smooth' })
}

function savePreferences() {
  localStorage.setItem('am_cookie_consent', JSON.stringify(preferences.value))
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.legal-main {
  padding: var(--space-20) 0 var(--space-16);
}

.legal-header {
  text-align: center;
  margin-bottom: var(--space-10);
  padding-top: var(--space-8);
}

.legal-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}

.legal-icon i {
  font-size: 2rem;
  color: white;
}

.legal-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.legal-subtitle {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

/* Cookie Banner */
.cookie-banner {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  margin-bottom: var(--space-10);
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.cookie-banner-content {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  flex: 1;
  min-width: 280px;
}

.cookie-banner-icon {
  font-size: 2rem;
  color: var(--primary-500);
  flex-shrink: 0;
}

.cookie-banner-text strong {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.cookie-banner-text p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}

.cookie-banner-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

/* Legal Content */
.legal-content {
  max-width: 860px;
  margin: 0 auto;
}

.legal-toc {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin-bottom: var(--space-10);
}

.legal-toc h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.legal-toc ol {
  margin: 0;
  padding-left: var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.legal-toc a {
  color: var(--primary-500);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color 0.2s;
}

.legal-toc a:hover {
  color: var(--primary-600);
  text-decoration: underline;
}

.legal-section {
  margin-bottom: var(--space-10);
  padding-bottom: var(--space-10);
  border-bottom: 1px solid var(--border-color);
}

.legal-section:last-child {
  border-bottom: none;
}

.legal-section h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.legal-section p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-4);
}

.legal-section ul {
  color: var(--text-secondary);
  line-height: 1.8;
  padding-left: var(--space-6);
  margin-bottom: var(--space-4);
}

.legal-section li {
  margin-bottom: var(--space-2);
}

.legal-section a {
  color: var(--primary-500);
  text-decoration: underline;
}

/* Cookie Type Grid */
.cookie-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.cookie-type-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  transition: border-color 0.2s;
}

.cookie-type-card:hover {
  border-color: var(--primary-500);
}

.cookie-type-essential {
  border-color: rgba(0, 200, 83, 0.3);
  background: rgba(0, 200, 83, 0.04);
}

.cookie-type-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.cookie-type-header i {
  color: var(--primary-500);
  font-size: 1.1rem;
}

.cookie-type-header h3 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.cookie-type-card p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Cookie Badges */
.cookie-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.cookie-badge-required {
  background: rgba(0, 200, 83, 0.15);
  color: #00c853;
}

.cookie-badge-analytics {
  background: rgba(0, 123, 255, 0.15);
  color: var(--primary-500);
}

.cookie-badge-functional {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.cookie-badge-marketing {
  background: rgba(233, 30, 99, 0.15);
  color: #e91e63;
}

/* Toggle Switch */
.cookie-toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  cursor: pointer;
}

.cookie-toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.cookie-toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--border-color);
  border-radius: 22px;
  transition: 0.3s;
}

.cookie-toggle-slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.cookie-toggle-switch input:checked + .cookie-toggle-slider {
  background: var(--primary-500);
}

.cookie-toggle-switch input:checked + .cookie-toggle-slider::before {
  transform: translateX(18px);
}

/* Preferences Save */
.preferences-save {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.preferences-saved-msg {
  color: #00c853;
  font-size: var(--text-sm);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  animation: fadeIn 0.3s ease;
}

/* Cookie Table */
.cookie-table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
}

.cookie-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.cookie-table th {
  background: var(--bg-secondary);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.cookie-table td {
  padding: var(--space-3) var(--space-4);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.cookie-table tr:last-child td {
  border-bottom: none;
}

.cookie-table tr:hover td {
  background: var(--bg-secondary);
}

.cookie-table code {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: var(--primary-500);
}

/* Browser Links */
.browser-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.browser-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all 0.2s;
}

.browser-link:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
  text-decoration: none;
  background: rgba(0, 123, 255, 0.05);
}

.browser-link i {
  font-size: 1.5rem;
}

/* Contact Info */
.legal-contact-info {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-500);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-top: var(--space-4);
}

.legal-contact-info p {
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.legal-contact-info i {
  color: var(--primary-500);
  width: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .legal-toc ol {
    grid-template-columns: 1fr;
  }

  .legal-title {
    font-size: var(--text-3xl);
  }

  .cookie-type-grid {
    grid-template-columns: 1fr;
  }

  .browser-links {
    grid-template-columns: 1fr 1fr;
  }

  .cookie-banner {
    flex-direction: column;
  }

  .cookie-banner-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
