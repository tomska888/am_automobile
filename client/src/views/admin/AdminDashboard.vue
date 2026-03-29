<template>
  <div>
    <!-- Page Header -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">{{ $t('admin.dashboard.title') }}</h1>
        <p class="dash-sub">{{ $t('admin.title') }}</p>
      </div>
      <RouterLink :to="{ name: 'admin-cars' }" class="btn-am btn-am-primary">
        <i class="fa-solid fa-plus"></i>
        {{ $t('admin.cars.add') }}
      </RouterLink>
    </div>

    <!-- Stats Grid -->
    <LoadingSpinner v-if="loading" />
    <div v-else class="stats-grid dash-mb">
      <div class="stat-card">
        <div class="stat-card-icon blue"><i class="fa-solid fa-car"></i></div>
        <div>
          <div class="stat-card-value">{{ stats.cars?.total || 0 }}</div>
          <div class="stat-card-label">{{ $t('admin.dashboard.totalCars') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon green"><i class="fa-solid fa-circle-check"></i></div>
        <div>
          <div class="stat-card-value">{{ stats.cars?.available || 0 }}</div>
          <div class="stat-card-label">{{ $t('admin.dashboard.available') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon red"><i class="fa-solid fa-tag"></i></div>
        <div>
          <div class="stat-card-value">{{ stats.cars?.sold || 0 }}</div>
          <div class="stat-card-label">{{ $t('admin.dashboard.sold') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon yellow"><i class="fa-solid fa-envelope"></i></div>
        <div>
          <div class="stat-card-value">{{ stats.messages?.total || 0 }}</div>
          <div class="stat-card-label">{{ $t('admin.dashboard.messages') }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Cars Table -->
    <div class="table-am-container">
      <div class="table-am-header">
        <h2 class="table-am-heading">{{ $t('admin.dashboard.recentCars') }}</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="table-am">
          <thead>
            <tr>
              <th>{{ $t('car.make') }} / {{ $t('car.model') }}</th>
              <th>{{ $t('car.year') }}</th>
              <th>{{ $t('car.price') }}</th>
              <th>{{ $t('car.statusLabel') }}</th>
              <th>{{ $t('common.edit') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in recentCars" :key="car.id">
              <td class="fw-semi">{{ car.make }} {{ car.model }}</td>
              <td>{{ car.year }}</td>
              <td style="color:var(--accent);font-weight:600;">{{ formatPrice(car.price) }}</td>
              <td>
                <span class="car-card-badge" :class="`badge-${car.status}`" style="font-size:var(--text-xs);">
                  {{ $t(`car.status.${car.status}`) }}
                </span>
              </td>
              <td>
                <RouterLink :to="{ name: 'admin-cars' }" class="btn-am btn-am-secondary btn-am-sm">
                  {{ $t('common.edit') }}
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const loading    = ref(true)
const stats      = ref({ cars: {}, messages: {} })
const recentCars = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/stats')
    // API returns { success, data: { cars: {...}, messages: {...}, users: {...}, recentCars: [...] } }
    stats.value      = data.data || { cars: {}, messages: {}, users: {} }
    recentCars.value = data.data?.recentCars || []
  } catch { /* silent */ }
  finally { loading.value = false }
})

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}
</script>

<style scoped>
/* ── PAGE HEADER ──────────────────────────────────── */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.dash-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.2rem;
  line-height: 1.2;
}

.dash-sub {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.dash-mb {
  margin-bottom: 2rem;
}

/* ── TABLE HEADER ─────────────────────────────────── */
.table-am-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.table-am-heading {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
</style>
