<template>
  <div class="adm-page">
    <h1 class="adm-title">{{ $t('admin.messages.title') }}</h1>

    <LoadingSpinner v-if="loading" />
    <div v-else class="table-am-container">
      <div class="overflow-x-auto">
        <table class="table-am">
          <thead>
            <tr>
              <th>{{ $t('admin.messages.from') }}</th>
              <th>{{ $t('admin.messages.subject') }}</th>
              <th>{{ $t('admin.messages.date') }}</th>
              <th>{{ $t('admin.messages.status') }}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="msg in messages"
              :key="msg.id"
              :class="{ 'msg-unread': !msg.is_read }"
              class="cursor-pointer"
              @click="viewMessage(msg)"
            >
              <td>
                <div class="adm-fw">{{ msg.name }}</div>
                <div class="adm-sub">{{ msg.email }}</div>
              </td>
              <td>{{ msg.subject || '—' }}</td>
              <td class="adm-sub">{{ formatDate(msg.created_at) }}</td>
              <td>
                <span class="adm-chip" :class="statusChipClass(msg)">
                  {{ msg.is_read ? $t('admin.messages.statuses.read') : $t('admin.messages.statuses.new') }}
                </span>
              </td>
              <td @click.stop>
                <button
                  v-if="!msg.is_read"
                  class="btn-am btn-am-secondary btn-am-sm"
                  @click="markRead(msg)"
                >
                  <i class="fa-solid fa-envelope-open"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <Teleport to="body">
      <Transition name="adm-modal">
        <div
          v-if="selected"
          class="adm-modal-backdrop"
          @click.self="selected = null"
        >
          <div class="adm-modal-box">
            <div class="adm-modal-head">
              <div>
                <h5 class="adm-modal-title">{{ selected.subject || 'Message' }}</h5>
                <p class="adm-modal-from">From: {{ selected.name }} <{{ selected.email }}></p>
              </div>
              <button class="adm-modal-close" @click="selected = null">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="adm-modal-body">
              <p class="adm-msg-text">{{ selected.message }}</p>
              <hr class="adm-divider" />
              <div class="adm-modal-actions">
                <a
                  :href="`mailto:${selected.email}?subject=Re: ${selected.subject}`"
                  class="btn-am btn-am-primary btn-am-sm"
                >
                  <i class="fa-solid fa-reply"></i>
                  {{ $t('admin.messages.reply') }}
                </a>
                <button class="btn-am btn-am-secondary btn-am-sm" @click="selected = null">
                  {{ $t('common.close') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUiStore } from '@/stores/ui.js'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const uiStore  = useUiStore()
const loading  = ref(true)
const messages = ref([])
const selected = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/messages')
    // API returns { success, data: [...messages], pagination }
    messages.value = data.data || []
  } catch { /* silent */ }
  finally { loading.value = false }
})

async function markRead(msg) {
  try {
    await axios.put(`/api/messages/${msg.id}`, { is_read: true })
    msg.is_read = true
  } catch {
    uiStore.toast.error('Failed to update status.')
  }
}

function viewMessage(msg) {
  selected.value = msg
  if (!msg.is_read) markRead(msg)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusChipClass(msg) {
  if (!msg.is_read) return 'adm-chip-accent'
  return 'adm-chip-muted'
}
</script>

<style scoped>
/* ── PAGE ──────────────────────────────────────────── */
.adm-page { padding: 0; }

.adm-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1.75rem;
}

/* ── TABLE EXTRAS ──────────────────────────────────── */
.msg-unread { font-weight: 600; }
.adm-fw { font-weight: 600; color: var(--text-primary); }
.adm-sub { font-size: 0.82rem; color: var(--text-secondary); }

/* ── CHIPS ─────────────────────────────────────────── */
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
  max-width: 560px;
  overflow: hidden;
}

.adm-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.adm-modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.adm-modal-from {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: 0;
}

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
}

.adm-msg-text {
  line-height: 1.75;
  white-space: pre-wrap;
  color: var(--text-primary);
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.adm-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1rem 0;
}

.adm-modal-actions {
  display: flex;
  gap: 0.75rem;
}

/* ── TRANSITIONS ───────────────────────────────────── */
.adm-modal-enter-active,
.adm-modal-leave-active { transition: opacity 0.25s ease; }
.adm-modal-enter-from,
.adm-modal-leave-to { opacity: 0; }
</style>
