<template>
  <header
    class="am-navbar"
    :class="[
      { scrolled: navScrolled },
      transparent ? 'am-navbar-transparent' : 'am-navbar-solid'
    ]"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="navbar-inner">
      <!-- Logo -->
      <RouterLink class="am-logo" to="/" @click="closeMobile" aria-label="AM Automobile Home">
        <div class="am-logo-icon">
          <i class="fa-solid fa-car-side"></i>
        </div>
        <div class="am-logo-text">
          <span class="am-logo-name">AM Automobile</span>
          <span class="am-logo-sub">PREMIUM DEALERSHIP</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <ul class="am-nav-links" role="list">
        <li>
          <RouterLink class="am-nav-link" :to="{ name: 'home' }" @click="closeMobile">
            {{ $t('nav.home') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="am-nav-link" :to="{ name: 'inventory' }" @click="closeMobile">
            {{ $t('nav.inventory') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="am-nav-link" :to="{ name: 'about' }" @click="closeMobile">
            {{ $t('nav.about') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="am-nav-link" :to="{ name: 'contact' }" @click="closeMobile">
            {{ $t('nav.contact') }}
          </RouterLink>
        </li>
      </ul>

      <!-- Desktop Right Controls -->
      <div class="am-nav-right">
        <!-- Language Dropdown + Theme Toggle: only when logged OUT -->
        <template v-if="!authStore.isAuthenticated">
          <div class="am-lang-dropdown" ref="langDropdownRef">
            <button
              class="am-lang-btn"
              @click="langMenuOpen = !langMenuOpen"
              :aria-expanded="langMenuOpen"
              aria-haspopup="true"
              aria-label="Select language"
            >
              <span>{{ currentLangFlag }}</span>
              {{ currentLangCode.toUpperCase() }}
              <i class="fa-solid fa-chevron-down" style="font-size:0.7rem; margin-left:2px;" :style="langMenuOpen ? 'transform:rotate(180deg)' : ''"></i>
            </button>
            <div
              v-if="langMenuOpen"
              class="am-lang-menu"
              role="listbox"
              aria-label="Language options"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                class="am-lang-option"
                :class="{ active: currentLangCode === lang.code }"
                role="option"
                :aria-selected="currentLangCode === lang.code"
                @click="setLang(lang.code)"
              >
                <span>{{ lang.flag }}</span> {{ lang.label }}
              </button>
            </div>
          </div>

          <!-- Theme Toggle -->
          <ThemeToggle />
        </template>

        <!-- Auth -->
        <template v-if="authStore.isAuthenticated">
          <div class="am-user-dropdown" ref="userDropdownRef">
            <button class="btn-nav-ghost" @click="userMenuOpen = !userMenuOpen">
              <i class="fa-solid fa-user-circle" style="margin-right:6px;"></i>
              {{ authStore.userName }}
              <i class="fa-solid fa-chevron-down" style="font-size:0.7rem; margin-left:4px;"></i>
            </button>
            <div v-if="userMenuOpen" class="am-user-menu am-user-menu-rich">
              <!-- Admin Panel (admins only) -->
              <RouterLink
                v-if="authStore.isAdmin"
                :to="{ name: 'admin-dashboard' }"
                class="am-user-menu-item am-user-menu-item-admin"
                @click="userMenuOpen = false"
              >
                <i class="fa-solid fa-gauge-high"></i> {{ $t('nav.admin') }}
              </RouterLink>

              <!-- My Profile -->
              <RouterLink :to="{ name: 'profile' }" class="am-user-menu-item" @click="userMenuOpen = false">
                <i class="fa-solid fa-user-pen"></i> {{ $t('nav.profile') }}
              </RouterLink>

              <!-- Divider -->
              <div class="am-user-menu-divider"></div>

              <!-- Language section -->
              <div class="am-user-menu-section-label">{{ $t('nav.language') }}</div>
              <div class="am-user-menu-lang-row">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  class="am-user-menu-lang-btn"
                  :class="{ active: currentLangCode === lang.code }"
                  @click="setLang(lang.code)"
                >
                  {{ lang.flag }} {{ lang.code.toUpperCase() }}
                </button>
              </div>

              <!-- Theme section -->
              <div class="am-user-menu-section-label">{{ $t('nav.theme') }}</div>
              <div class="am-user-menu-theme-row">
                <ThemeToggle />
              </div>

              <!-- Divider -->
              <div class="am-user-menu-divider"></div>

              <!-- Logout -->
              <button class="am-user-menu-item am-user-menu-danger" @click="handleLogout">
                <i class="fa-solid fa-right-from-bracket"></i> {{ $t('nav.logout') }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'login' }" class="btn-nav-ghost">
            {{ $t('nav.signIn') }}
          </RouterLink>
        </template>
      </div>

      <!-- Mobile Hamburger -->
      <button
        class="am-hamburger"
        :class="{ open: mobileMenuOpen }"
        @click="mobileMenuOpen = !mobileMenuOpen"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation"
        aria-controls="am-mobile-menu"
      >
        <span class="ham-line"></span>
        <span class="ham-line"></span>
        <span class="ham-line"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-slide">
      <div
        v-if="mobileMenuOpen"
        class="am-mobile-menu"
        id="am-mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <!-- Mobile Nav Links -->
        <nav class="mobile-nav-links">
          <RouterLink class="mobile-nav-link" :to="{ name: 'home' }" @click="closeMobile">
            <i class="fa-solid fa-house"></i> {{ $t('nav.home') }}
          </RouterLink>
          <RouterLink class="mobile-nav-link" :to="{ name: 'inventory' }" @click="closeMobile">
            <i class="fa-solid fa-car"></i> {{ $t('nav.inventory') }}
          </RouterLink>
          <RouterLink class="mobile-nav-link" :to="{ name: 'about' }" @click="closeMobile">
            <i class="fa-solid fa-circle-info"></i> {{ $t('nav.about') }}
          </RouterLink>
          <RouterLink class="mobile-nav-link" :to="{ name: 'contact' }" @click="closeMobile">
            <i class="fa-solid fa-envelope"></i> {{ $t('nav.contact') }}
          </RouterLink>
        </nav>

        <div class="mobile-divider"></div>

        <!-- Mobile Lang + Theme row -->
        <div class="mobile-controls-row">
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button
              v-for="lang in languages"
              :key="lang.code"
              class="mobile-lang-btn"
              :class="{ active: currentLangCode === lang.code }"
              @click="setLang(lang.code)"
            >
              {{ lang.flag }} {{ lang.code.toUpperCase() }}
            </button>
          </div>
          <ThemeToggle />
        </div>

        <!-- Mobile Auth -->
        <div class="mobile-auth-row">
          <template v-if="authStore.isAuthenticated">
            <RouterLink :to="{ name: 'profile' }" class="mobile-auth-btn mobile-auth-btn-ghost" @click="closeMobile">
              <i class="fa-solid fa-user-pen"></i> {{ $t('nav.profile') }}
            </RouterLink>
            <RouterLink v-if="authStore.isAdmin" :to="{ name: 'admin-dashboard' }" class="mobile-auth-btn mobile-auth-btn-ghost" @click="closeMobile">
              <i class="fa-solid fa-gauge-high"></i> {{ $t('nav.admin') }}
            </RouterLink>
            <button class="mobile-auth-btn mobile-auth-btn-danger" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i> {{ $t('nav.logout') }}
            </button>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'login' }" class="mobile-auth-btn mobile-auth-btn-ghost" @click="closeMobile">
              {{ $t('nav.signIn') }}
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useUiStore } from '@/stores/ui.js'
import ThemeToggle from './ThemeToggle.vue'

const props = defineProps({
  transparent: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

// State
const navScrolled = ref(false)
const mobileMenuOpen = ref(false)
const langMenuOpen = ref(false)
const userMenuOpen = ref(false)

// Refs for outside-click
const langDropdownRef = ref(null)
const userDropdownRef = ref(null)

// Languages
const languages = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'English' },
  { code: 'lt', label: 'Lietuvių' },
  { code: 'ru', label: 'Русский' },
]

const currentLangCode = computed(() => locale.value || 'en')
const currentLangFlag = computed(() => {
  const lang = languages.find(l => l.code === currentLangCode.value)
  return lang ? lang.flag : '🇬🇧'
})

function setLang(code) {
  locale.value = code
  uiStore.setLocale?.(code)
  localStorage.setItem('am-lang', code)
  langMenuOpen.value = false
}

function closeMobile() {
  mobileMenuOpen.value = false
}

async function handleLogout() {
  await authStore.logout()
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  router.push({ name: 'home' })
}

// Scroll handler
function handleScroll() {
  navScrolled.value = window.scrollY > 80
}

// Outside click handler
function handleOutsideClick(e) {
  if (langMenuOpen.value && langDropdownRef.value && !langDropdownRef.value.contains(e.target)) {
    langMenuOpen.value = false
  }
  if (userMenuOpen.value && userDropdownRef.value && !userDropdownRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
/* ── NAVBAR BASE ──────────────────────────────────────────── */
/*
  Strategy: the <header> element is always full-width fixed.
  We animate IT — shrinking via left/right/top/border-radius.
  The .navbar-inner stays max-width: 1280px, margin: 0 auto
  at all times so its children never reflow or jump.
*/
.am-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 72px;
  transition:
    top    0.35s cubic-bezier(0.4, 0, 0.2, 1),
    left   0.35s cubic-bezier(0.4, 0, 0.2, 1),
    right  0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    background    0.35s ease,
    box-shadow    0.35s ease,
    border-color  0.35s ease;
}

/* ── NAVBAR INNER — never changes layout ─────────────────── */
.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  /* no layout transitions here — prevents reflow jank */
}

/* ── SOLID MODE — non-home pages ─────────────────────────── */
.am-navbar-solid {
  background: linear-gradient(135deg, #0A3F75 0%, #0A4B8C 100%);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 2px 20px rgba(0,0,0,0.2);
  border-radius: 0;
  top: 0; left: 0; right: 0;
}

.am-navbar-solid.scrolled {
  top: 10px;
  left: 24px;
  right: 24px;
  border-radius: 50px;
  border-bottom-color: transparent;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1);
}

/* ── TRANSPARENT MODE — home page ────────────────────────── */
.am-navbar-transparent {
  background: transparent;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  border-radius: 0;
  top: 0; left: 0; right: 0;
}

.am-navbar-transparent.scrolled {
  background: linear-gradient(135deg, #0A3F75 0%, #0A4B8C 100%);
  top: 10px;
  left: 24px;
  right: 24px;
  border-radius: 50px;
  border-bottom-color: transparent;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1);
}

/* ── LOGO ─────────────────────────────────────────────────── */
.am-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: white;
  flex-shrink: 0;
}

.am-logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.am-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.am-logo-name {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.am-logo-sub {
  font-size: 0.5625rem;
  letter-spacing: 0.12em;
  opacity: 0.65;
  font-weight: 600;
  margin-top: 2px;
}

/* ── NAV LINKS ────────────────────────────────────────────── */
.am-nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}

.am-nav-link {
  display: block;
  padding: 0.5rem 0.875rem;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;
  white-space: nowrap;
}
.am-nav-link:hover,
.am-nav-link.router-link-active {
  color: white;
  background: rgba(255,255,255,0.1);
}

@media (max-width: 1023px) {
  .am-nav-links { display: none; }
}

/* ── NAV RIGHT ────────────────────────────────────────────── */
.am-nav-right {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
}

@media (max-width: 1023px) {
  .am-nav-right { display: none; }
}

/* ── LANG DROPDOWN ────────────────────────────────────────── */
.am-lang-dropdown { position: relative; }

.am-lang-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: rgba(255,255,255,0.9);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 7px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.am-lang-btn:hover { background: rgba(255,255,255,0.18); }

.am-lang-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: #0A4B8C;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  z-index: 100;
}

.am-lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255,255,255,0.85);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}
.am-lang-option:hover { background: rgba(255,255,255,0.1); color: white; }
.am-lang-option.active { color: white; font-weight: 700; background: rgba(255,255,255,0.1); }

/* ── USER DROPDOWN ────────────────────────────────────────── */
.am-user-dropdown { position: relative; }

.am-user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: #0A4B8C;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  z-index: 100;
}

/* Rich dropdown (logged-in) — wider to fit lang + theme */
.am-user-menu-rich {
  min-width: 240px;
}

.am-user-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255,255,255,0.85);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  transition: background 0.15s ease;
}
.am-user-menu-item:hover { background: rgba(255,255,255,0.1); color: white; }
.am-user-menu-item-admin { color: #ffd166 !important; }
.am-user-menu-item-admin:hover { background: rgba(255,209,102,0.1) !important; }
.am-user-menu-danger { color: #ff6b6b !important; }
.am-user-menu-danger:hover { background: rgba(255,107,107,0.1) !important; }

/* Divider inside dropdown */
.am-user-menu-divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 4px 8px;
}

/* Section labels */
.am-user-menu-section-label {
  padding: 6px 12px 3px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

/* Language buttons row inside dropdown */
.am-user-menu-lang-row {
  display: flex;
  gap: 5px;
  padding: 4px 10px 6px;
  flex-wrap: wrap;
}

.am-user-menu-lang-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 7px;
  color: rgba(255,255,255,0.8);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 9px;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.am-user-menu-lang-btn:hover { background: rgba(255,255,255,0.18); color: white; }
.am-user-menu-lang-btn.active { background: rgba(255,255,255,0.22); color: white; border-color: rgba(255,255,255,0.35); }

/* Theme toggle row inside dropdown */
.am-user-menu-theme-row {
  display: flex;
  align-items: center;
  padding: 4px 10px 6px;
}

/* ── NAV BUTTONS ──────────────────────────────────────────── */
.btn-nav-ghost {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 8px;
  color: rgba(255,255,255,0.9);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}
.btn-nav-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); color: white; }

.btn-nav-cta {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50px;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 8px 18px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}
.btn-nav-cta:hover { background: rgba(255,255,255,0.25); transform: scale(1.03); color: white; }

/* ── HAMBURGER ────────────────────────────────────────────── */
.am-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  transition: background 0.2s ease;
}
.am-hamburger:hover { background: rgba(255,255,255,0.18); }

@media (max-width: 1023px) {
  .am-hamburger { display: flex; }
}

.ham-line {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
  transform-origin: center;
}

.am-hamburger.open .ham-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.am-hamburger.open .ham-line:nth-child(2) {
  opacity: 0;
  width: 0;
}
.am-hamburger.open .ham-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── MOBILE MENU ──────────────────────────────────────────── */
.am-mobile-menu {
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  pointer-events: all;
  background: #0A4B8C;
  border-top: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  padding: 1rem 1.5rem;
  transition: border-radius 0.35s cubic-bezier(0.4,0,0.2,1);
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* In pill mode — header physically moves, so absolute child follows.
   Just round the bottom corners to complete the pill shape. */
.am-navbar.scrolled .am-mobile-menu {
  border-radius: 0 0 28px 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 0.75rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.2s ease;
}
.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(255,255,255,0.1);
  color: white;
}

.mobile-divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 0.5rem 0;
}

.mobile-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.mobile-lang-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: rgba(255,255,255,0.8);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.mobile-lang-btn:hover { background: rgba(255,255,255,0.15); color: white; }
.mobile-lang-btn.active { background: rgba(255,255,255,0.2); color: white; }

.mobile-auth-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 0.5rem;
}

.mobile-auth-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, transform 0.15s ease;
}
.mobile-auth-btn-primary {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
}
.mobile-auth-btn-primary:hover { background: rgba(255,255,255,0.25); color: white; }
.mobile-auth-btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.9);
}
.mobile-auth-btn-ghost:hover { background: rgba(255,255,255,0.08); color: white; }
.mobile-auth-btn-danger {
  background: rgba(220,53,69,0.2);
  border: 1px solid rgba(220,53,69,0.4);
  color: #ff8a8a;
  width: 100%;
}
.mobile-auth-btn-danger:hover { background: rgba(220,53,69,0.3); color: white; }

/* ── MOBILE SLIDE TRANSITION ─────────────────────────────── */
.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.mobile-slide-enter-from,
.mobile-slide-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>

