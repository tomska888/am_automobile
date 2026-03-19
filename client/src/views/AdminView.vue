<template>
  <div class="admin-layout">
    <!-- Sidebar -->
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
        <RouterLink :to="{ name: 'admin-users' }" class="admin-nav-link">
          <i class="fa-solid fa-users"></i>
          <span>{{ $t('admin.users.title') }}</span>
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

    <!-- Main Content -->
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
const unreadMessages = ref(0)

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/stats')
    unreadMessages.value = data.unread_messages || 0
  } catch { /* silent */ }
})

async function handleLogout() {
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

/* ── SIDEBAR ───────────────────────────────────────── */
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

.admin-nav-link:hover,
.admin-nav-link.router-link-active {
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

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .admin-layout {
    flex-direction: column;
  }

  .admin-main {
    margin-left: 0;
    padding: 1.5rem 1rem;
  }
}
</style>
