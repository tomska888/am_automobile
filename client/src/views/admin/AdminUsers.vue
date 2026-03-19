<template>
  <div class="adm-page">
    <h1 class="adm-title">{{ $t('admin.users.title') }}</h1>

    <LoadingSpinner v-if="loading" />
    <div v-else class="table-am-container">
      <div class="overflow-x-auto">
        <table class="table-am">
          <thead>
            <tr>
              <th>{{ $t('admin.users.name') }}</th>
              <th>{{ $t('admin.users.email') }}</th>
              <th>{{ $t('admin.users.role') }}</th>
              <th>Joined</th>
              <th>{{ $t('admin.users.status') }}</th>
              <th>{{ $t('admin.users.toggle') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="adm-fw">{{ user.name }}</td>
              <td class="adm-sub">{{ user.email }}</td>
              <td>
                <span class="adm-chip" :class="user.role === 'admin' ? 'adm-chip-accent' : 'adm-chip-muted'">
                  {{ user.role }}
                </span>
              </td>
              <td class="adm-sub">{{ formatDate(user.created_at) }}</td>
              <td>
                <span class="adm-chip" :class="user.is_active ? 'adm-chip-success' : 'adm-chip-muted'">
                  {{ user.is_active ? $t('admin.users.active') : $t('admin.users.inactive') }}
                </span>
              </td>
              <td>
                <button
                  class="btn-am btn-am-sm"
                  :class="user.is_active ? 'btn-am-danger' : 'btn-am-secondary'"
                  @click="toggleUserStatus(user)"
                  :disabled="user.role === 'admin'"
                >
                  <i class="fa-solid" :class="user.is_active ? 'fa-user-slash' : 'fa-user-check'"></i>
                  {{ user.is_active ? $t('admin.users.inactive') : $t('admin.users.active') }}
                </button>
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
import { useUiStore } from '@/stores/ui.js'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const uiStore = useUiStore()
const loading = ref(true)
const users   = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/users')
    // API returns { success, data: [...users], pagination }
    users.value = data.data || []
  } catch { /* silent */ }
  finally { loading.value = false }
})

async function toggleUserStatus(user) {
  try {
    await axios.put(`/api/users/${user.id}`, { is_active: !user.is_active })
    user.is_active = !user.is_active
    uiStore.toast.success('User status updated.')
  } catch {
    uiStore.toast.error('Failed to update user.')
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.adm-page { padding: 0; }

.adm-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1.75rem;
}

.adm-fw { font-weight: 600; color: var(--text-primary); }
.adm-sub { font-size: 0.82rem; color: var(--text-secondary); }

.adm-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.adm-chip-accent {
  background: var(--accent-light);
  color: var(--accent);
}

.adm-chip-muted {
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.adm-chip-success {
  background: rgba(40, 167, 69, 0.12);
  color: #28a745;
}
</style>
