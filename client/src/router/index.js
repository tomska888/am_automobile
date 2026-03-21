import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  // ── Public Routes ────────────────────────────────────────
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'AM Automobile — Premium Car Dealership' }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/views/InventoryView.vue'),
    meta: { title: 'Car Inventory — AM Automobile' }
  },
  {
    path: '/inventory/:id',
    name: 'car-detail',
    component: () => import('@/views/CarDetailView.vue'),
    meta: { title: 'Car Details — AM Automobile' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About Us — AM Automobile' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contact — AM Automobile' }
  },

  // ── Auth Routes ──────────────────────────────────────────
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Sign In — AM Automobile', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Create Account — AM Automobile', guestOnly: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'My Profile — AM Automobile', requiresAuth: true }
  },

  // ── Admin Routes (protected) ─────────────────────────────
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Panel — AM Automobile' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { title: 'Dashboard — Admin' }
      },
      {
        path: 'cars',
        name: 'admin-cars',
        component: () => import('@/views/admin/AdminCars.vue'),
        meta: { title: 'Car Management — Admin' }
      },
      {
        path: 'messages',
        name: 'admin-messages',
        component: () => import('@/views/admin/AdminMessages.vue'),
        meta: { title: 'Messages — Admin' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/AdminUsers.vue'),
        meta: { title: 'Users — Admin' }
      }
    ]
  },

  // ── Legal Pages ──────────────────────────────────────────
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/legal/TosView.vue'),
    meta: { title: 'Terms of Service — AM Automobile' }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/legal/PrivacyView.vue'),
    meta: { title: 'Privacy Policy — AM Automobile' }
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('@/views/legal/CookiesView.vue'),
    meta: { title: 'Cookie Policy — AM Automobile' }
  },

  // ── 404 Fallback ─────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 — AM Automobile' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

// ── Navigation Guards ────────────────────────────────────────
router.beforeEach(async (to, from, next) => {
  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const authStore = useAuthStore()

  // Guest-only routes (login, register) — redirect if already logged in
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  // Protected routes — redirect to login if not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Admin routes — redirect to home if not admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

export default router
