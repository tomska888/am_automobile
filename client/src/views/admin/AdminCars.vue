<template>
  <div class="adm-page">
    <!-- Header -->
    <div class="adm-page-header">
      <h1 class="adm-title">{{ $t('admin.cars.title') }}</h1>
      <button class="btn-am btn-am-primary" @click="openModal()">
        <i class="fa-solid fa-plus"></i>
        {{ $t('admin.cars.add') }}
      </button>
    </div>

    <!-- Search -->
    <div class="adm-search-wrap">
      <i class="fa-solid fa-magnifying-glass adm-search-icon"></i>
      <input
        type="search"
        class="adm-search-input"
        :placeholder="$t('inventory.searchPlaceholder')"
        v-model="search"
      />
    </div>

    <!-- Table -->
    <LoadingSpinner v-if="loading" />
    <div v-else class="table-am-container">
      <div class="overflow-x-auto">
        <table class="table-am">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $t('car.make') }} / {{ $t('car.model') }}</th>
              <th>{{ $t('car.year') }}</th>
              <th>{{ $t('car.price') }}</th>
              <th>{{ $t('car.fuelType') }}</th>
              <th>{{ $t('car.statusLabel') }}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in filteredCars" :key="car.id">
              <td class="adm-id">#{{ car.id }}</td>
              <td class="adm-fw">{{ car.make }} {{ car.model }}</td>
              <td>{{ car.year }}</td>
              <td class="adm-price">{{ formatPrice(car.price) }}</td>
              <td>{{ $t(`car.fuel.${car.fuel_type}`) }}</td>
              <td>
                <span class="car-card-badge adm-status-badge" :class="`badge-${car.status}`">
                  {{ $t(`car.status.${car.status}`) }}
                </span>
              </td>
              <td>
                <div class="adm-actions">
                  <button class="btn-am btn-am-secondary btn-am-sm" @click="openModal(car)">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-am btn-am-danger btn-am-sm" @click="confirmDelete(car)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal — CarForm is self-contained (owns its own Teleport + backdrop) -->
    <CarForm v-model="showModal" :car="editingCar" @saved="onCarSaved" />

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <Transition name="adm-modal">
        <div
          v-if="deleteTarget"
          class="adm-modal-backdrop"
          @click.self="deleteTarget = null"
        >
          <div class="adm-modal-box adm-modal-sm">
            <div class="adm-modal-head">
              <h5 class="adm-modal-title adm-modal-title-danger">
                <i class="fa-solid fa-triangle-exclamation"></i>
                {{ $t('common.confirm') }}
              </h5>
              <button class="adm-modal-close" @click="deleteTarget = null">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="adm-modal-body">
              <p style="color: var(--text-secondary); margin: 0 0 0.75rem;">
                {{ $t('admin.cars.deleteConfirm') }}
              </p>
              <p class="adm-fw" style="color: var(--text-primary); margin: 0;">
                {{ deleteTarget?.make }} {{ deleteTarget?.model }} ({{ deleteTarget?.year }})
              </p>
            </div>
            <div class="adm-modal-foot">
              <button class="btn-am btn-am-secondary" @click="deleteTarget = null">
                {{ $t('common.cancel') }}
              </button>
              <button class="btn-am btn-am-danger" @click="handleDelete" :disabled="deleting">
                <span v-if="deleting" class="adm-spinner"></span>
                <i v-else class="fa-solid fa-trash"></i>
                {{ $t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarsStore } from '@/stores/cars.js'
import { useUiStore } from '@/stores/ui.js'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import CarForm from '@/components/admin/CarForm.vue'

const carsStore = useCarsStore()
const uiStore   = useUiStore()

const loading      = ref(true)
const showModal    = ref(false)
const editingCar   = ref(null)
const deleteTarget = ref(null)
const deleting     = ref(false)
const search       = ref('')

const filteredCars = computed(() => {
  if (!search.value) return carsStore.cars
  const q = search.value.toLowerCase()
  return carsStore.cars.filter(c =>
    `${c.make} ${c.model}`.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  await carsStore.fetchCars()
  loading.value = false
})

function openModal(car = null) {
  editingCar.value = car
  showModal.value  = true
}

function onCarSaved() {
  showModal.value = false
  carsStore.fetchCars()
  uiStore.toast.success('Car saved successfully!')
}

function confirmDelete(car) {
  deleteTarget.value = car
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await carsStore.deleteCar(deleteTarget.value.id)
    uiStore.toast.success('Car deleted.')
    deleteTarget.value = null
  } catch {
    uiStore.toast.error('Failed to delete car.')
  } finally {
    deleting.value = false
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(price)
}
</script>

<style scoped>
/* ── PAGE ──────────────────────────────────────────── */
.adm-page { padding: 0; }

.adm-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.adm-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

/* ── SEARCH ────────────────────────────────────────── */
.adm-search-wrap {
  position: relative;
  max-width: 360px;
  margin-bottom: 1.5rem;
}

.adm-search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.82rem;
  pointer-events: none;
}

.adm-search-input {
  width: 100%;
  padding: 0.65rem 0.875rem 0.65rem 2.25rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.adm-search-input::placeholder { color: var(--text-muted); }

.adm-search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* ── TABLE EXTRAS ──────────────────────────────────── */
.adm-id    { font-size: 0.8rem; color: var(--text-muted); }
.adm-fw    { font-weight: 600; color: var(--text-primary); }
.adm-price { color: var(--accent); font-weight: 700; }

.adm-status-badge {
  position: static;
  font-size: 0.72rem;
}

.adm-actions {
  display: flex;
  gap: 0.5rem;
}

/* ── MODAL ─────────────────────────────────────────── */
.adm-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.adm-modal-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
  width: 100%;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.adm-modal-sm { max-width: 400px; }
.adm-modal-lg { max-width: 720px; }

.adm-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.adm-modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.adm-modal-title-danger { color: var(--danger); }

.adm-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: background 0.18s, color 0.18s;
}

.adm-modal-close:hover { background: var(--danger); color: #fff; }

.adm-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.adm-modal-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

/* ── SPINNER ───────────────────────────────────────── */
.adm-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: admSpin 0.7s linear infinite;
}

@keyframes admSpin { to { transform: rotate(360deg); } }

/* ── TRANSITIONS ───────────────────────────────────── */
.adm-modal-enter-active,
.adm-modal-leave-active { transition: opacity 0.25s ease; }
.adm-modal-enter-from,
.adm-modal-leave-to { opacity: 0; }
</style>
