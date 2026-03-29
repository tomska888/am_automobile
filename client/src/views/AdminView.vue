<template>
  <div class="admin-layout">

    <!-- ══ DESKTOP SIDEBAR (hidden on mobile) ══ -->
    <aside class="admin-sidebar">
      <!-- Brand -->
      <div class="admin-sidebar-brand">
        <RouterLink to="/" class="admin-brand-link">
          <div class="admin-brand-icon">
            <i class="fa-solid fa-car"></i>
          </div>
          <div>
            <div class="admin-brand-name">AM Automobile</div>
            <div class="admin-brand-sub">Admin Panel</div>
          </div>
        </RouterLink>
      </div>

      <!-- Admin User Info -->
      <div class="admin-sidebar-user">
        <div class="admin-user-avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <div>
          <div class="admin-user-name">{{ authStore.userName }}</div>
          <div class="admin-user-role">Administrator</div>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="admin-sidebar-nav">
        <RouterLink :to="{ name: 'admin-dashboard' }" class="admin-nav-link">
          <i class="fa-solid fa-gauge-high"></i>
          <span>{{ $t('admin.dashboard.title') }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-cars' }" class="admin-nav-link">
          <i class="fa-solid fa-car"></i>
          <span>{{ $t('admin.cars.title') }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-messages' }" class="admin-nav-link">
          <i class="fa-solid fa-envelope"></i>
          <span>{{ $t('admin.messages.title') }}</span>
          <span v-if="unreadMessages > 0" class="admin-badge">{{ unreadMessages }}</span>
        </RouterLink>
        <div class="admin-nav-divider"></div>

        <RouterLink to="/" class="admin-nav-link">
          <i class="fa-solid fa-globe"></i>
          <span>View Website</span>
        </RouterLink>
        <button class="admin-nav-link admin-nav-btn" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>{{ $t('nav.logout') }}</span>
        </button>
      </nav>
    </aside>

    <!-- ══ MOBILE HEADER (hidden on desktop) ══ -->
    <header
      class="admin-mobile-header"
      :class="{ 'menu-open': mobileMenuOpen }"
    >
      <div class="admin-mobile-header-inner">
        <!-- Logo -->
        <RouterLink to="/" class="admin-mobile-logo" @click="mobileMenuOpen = false">
          <div class="admin-mobile-logo-icon">
            <i class="fa-solid fa-car-side"></i>
          </div>
          <div class="admin-mobile-logo-text">
            <span class="admin-mobile-logo-name">AM Automobile</span>
            <span class="admin-mobile-logo-sub">ADMIN PANEL</span>
          </div>
        </RouterLink>

        <!-- Hamburger -->
        <button
          class="admin-hamburger"
          :class="{ open: mobileMenuOpen }"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle navigation"
          aria-controls="admin-mobile-menu"
        >
          <span class="ham-line"></span>
          <span class="ham-line"></span>
          <span class="ham-line"></span>
        </button>
      </div>

      <!-- Mobile slide-down menu -->
      <Transition name="mobile-slide">
        <div
          v-if="mobileMenuOpen"
          class="admin-mobile-menu"
          id="admin-mobile-menu"
          role="navigation"
          aria-label="Admin mobile navigation"
        >
          <!-- Nav links -->
          <nav class="admin-mobile-nav-links">
            <RouterLink :to="{ name: 'admin-dashboard' }" class="admin-mobile-nav-link" @click="mobileMenuOpen = false">
              <i class="fa-solid fa-gauge-high"></i>
              {{ $t('admin.dashboard.title') }}
            </RouterLink>
            <RouterLink :to="{ name: 'admin-cars' }" class="admin-mobile-nav-link" @click="mobileMenuOpen = false">
              <i class="fa-solid fa-car"></i>
              {{ $t('admin.cars.title') }}
            </RouterLink>
            <RouterLink :to="{ name: 'admin-messages' }" class="admin-mobile-nav-link" @click="mobileMenuOpen = false">
              <i class="fa-solid fa-envelope"></i>
              {{ $t('admin.messages.title') }}
              <span v-if="unreadMessages > 0" class="admin-badge">{{ unreadMessages }}</span>
            </RouterLink>
          </nav>

          <div class="admin-mobile-divider"></div>

          <!-- Bottom actions -->
          <div class="admin-mobile-auth-row">
            <RouterLink to="/" class="admin-mobile-auth-btn admin-mobile-auth-btn-ghost" @click="mobileMenuOpen = false">
              <i class="fa-solid fa-globe"></i>
              View Website
            </RouterLink>
            <button class="admin-mobile-auth-btn admin-mobile-auth-btn-danger" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              {{ $t('nav.logout') }}
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <!-- ══ MAIN CONTENT ══ -->
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useUiStore } from '@/stores/ui.js'
import axios from 'axios'

const router    = useRouter()
const authStore = useAuthStore()
const uiStore   = useUiStore()
const unreadMessages  = ref(0)
const mobileMenuOpen  = ref(false)

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/stats')
    unreadMessages.value = data.unread_messages || 0
  } catch { /* silent */ }
})

async function handleLogout() {
  mobileMenuOpen.value = false
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<style scoped>
/* ── LAYOUT ────────────────────────────────────────── */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* ══ DESKTOP SIDEBAR ═══════════════════════════════════════ */
.admin-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #0A2E52 0%, #0A3F75 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}

/* ── BRAND ─────────────────────────────────────────── */
.admin-sidebar-brand {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.admin-brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.admin-brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
  flex-shrink: 0;
}

.admin-brand-name {
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.2;
}

.admin-brand-sub {
  color: rgba(255,255,255,0.45);
  font-size: 0.7rem;
  margin-top: 1px;
}

/* ── USER INFO ─────────────────────────────────────── */
.admin-sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.admin-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.admin-user-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.3;
}

.admin-user-role {
  color: rgba(255,255,255,0.45);
  font-size: 0.72rem;
}

/* ── NAV ───────────────────────────────────────────── */
.admin-sidebar-nav {
  padding: 1rem 0.75rem;
  flex: 1;
}

.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.875rem;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.18s;
  margin-bottom: 2px;
  width: 100%;
  position: relative;
}

.admin-nav-link i {
  width: 18px;
  text-align: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.admin-nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.admin-nav-link.router-link-exact-active {
  background: rgba(255,255,255,0.14);
  color: #fff;
}

.admin-nav-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.admin-nav-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 0.75rem 0;
}

.admin-badge {
  margin-left: auto;
  background: var(--danger);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  line-height: 1.4;
}

/* ── MAIN ──────────────────────────────────────────── */
.admin-main {
  flex: 1;
  margin-left: 260px;
  padding: 2.5rem;
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* ══ MOBILE HEADER — hidden on desktop ══════════════════════ */
.admin-mobile-header {
  display: none;
}

/* ══ RESPONSIVE ════════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Hide desktop sidebar entirely */
  .admin-sidebar {
    display: none;
  }

  /* Show mobile header */
  .admin-mobile-header {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: linear-gradient(135deg, #0A3F75 0%, #0A4B8C 100%);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 2px 20px rgba(0,0,0,0.25);
  }

  .admin-mobile-header-inner {
    height: 64px;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Logo — mirrors AppHeader .am-logo */
  .admin-mobile-logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    color: white;
    flex-shrink: 0;
  }

  .admin-mobile-logo-icon {
    width: 38px;
    height: 38px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
  }

  .admin-mobile-logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .admin-mobile-logo-name {
    color: white;
    font-size: 0.9375rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .admin-mobile-logo-sub {
    color: rgba(255,255,255,0.55);
    font-size: 0.5rem;
    letter-spacing: 0.12em;
    font-weight: 600;
    margin-top: 2px;
  }

  /* Hamburger — mirrors AppHeader .am-hamburger */
  .admin-hamburger {
    display: flex;
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
    transition: background 0.2s ease;
    flex-shrink: 0;
  }
  .admin-hamburger:hover { background: rgba(255,255,255,0.18); }

  .ham-line {
    display: block;
    width: 20px;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
    transform-origin: center;
  }

  .admin-hamburger.open .ham-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .admin-hamburger.open .ham-line:nth-child(2) {
    opacity: 0;
    width: 0;
  }
  .admin-hamburger.open .ham-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* Slide-down mobile menu — mirrors AppHeader .am-mobile-menu */
  .admin-mobile-menu {
    background: #0A4B8C;
    border-top: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    padding: 1rem 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Nav links in mobile menu */
  .admin-mobile-nav-links {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 0.75rem;
  }

  .admin-mobile-nav-link {
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
    position: relative;
  }

  .admin-mobile-nav-link i {
    width: 18px;
    text-align: center;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .admin-mobile-nav-link:hover,
  .admin-mobile-nav-link.router-link-active {
    background: rgba(255,255,255,0.1);
    color: white;
  }

  .admin-mobile-nav-link.router-link-exact-active {
    background: rgba(255,255,255,0.14);
    color: white;
  }

  /* Badge in mobile nav */
  .admin-mobile-nav-link .admin-badge {
    margin-left: auto;
  }

  .admin-mobile-divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 0.5rem 0;
  }

  /* Auth row — mirrors AppHeader .mobile-auth-row */
  .admin-mobile-auth-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 0.5rem;
  }

  .admin-mobile-auth-btn {
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
    transition: background 0.2s ease;
    width: 100%;
  }

  .admin-mobile-auth-btn-ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.9);
  }
  .admin-mobile-auth-btn-ghost:hover {
    background: rgba(255,255,255,0.08);
    color: white;
  }

  .admin-mobile-auth-btn-danger {
    background: rgba(220,53,69,0.2);
    border: 1px solid rgba(220,53,69,0.4);
    color: #ff8a8a;
  }
  .admin-mobile-auth-btn-danger:hover {
    background: rgba(220,53,69,0.3);
    color: white;
  }

  /* Push main content below the fixed header */
  .admin-layout {
    flex-direction: column;
  }

  .admin-main {
    margin-left: 0;
    padding: 1.25rem 1rem;
    padding-top: calc(64px + 1.25rem); /* header height + spacing */
  }
}

/* ── MOBILE SLIDE TRANSITION — mirrors AppHeader ─── */
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
