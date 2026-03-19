<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="uiStore.contactModalOpen"
        class="cm-backdrop"
        @click.self="uiStore.closeContactModal()"
      >
        <div class="cm-dialog" role="dialog" aria-modal="true" :aria-label="$t('contact.form.title')">
          <div class="cm-content">
            <!-- Header -->
            <div class="cm-header">
              <div>
                <h5 class="cm-title">
                  <i class="fa-solid fa-envelope cm-title-icon"></i>
                  {{ $t('contact.form.title') }}
                </h5>
                <span v-if="carSubject" class="cm-car-subject">{{ carSubject }}</span>
              </div>
              <button
                type="button"
                class="cm-close"
                @click="uiStore.closeContactModal()"
                :aria-label="$t('common.close')"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Body -->
            <div class="cm-body">
              <form @submit.prevent="handleSubmit">
                <!-- Name + Phone row -->
                <div class="cm-row">
                  <div class="form-group-am">
                    <label class="form-label-am">{{ $t('contact.form.name') }} *</label>
                    <input
                      type="text"
                      class="form-control-am"
                      v-model="form.name"
                      required
                      :placeholder="$t('contact.form.name')"
                    />
                  </div>
                  <div class="form-group-am">
                    <label class="form-label-am">{{ $t('contact.form.phone') }}</label>
                    <input
                      type="tel"
                      class="form-control-am"
                      v-model="form.phone"
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div class="form-group-am">
                  <label class="form-label-am">{{ $t('contact.form.email') }} *</label>
                  <input
                    type="email"
                    class="form-control-am"
                    v-model="form.email"
                    required
                    :placeholder="$t('contact.form.email')"
                  />
                </div>

                <!-- Subject -->
                <div class="form-group-am">
                  <label class="form-label-am">{{ $t('contact.form.subject') }}</label>
                  <input
                    type="text"
                    class="form-control-am"
                    v-model="form.subject"
                    :placeholder="$t('contact.form.subject')"
                  />
                </div>

                <!-- Message -->
                <div class="form-group-am">
                  <label class="form-label-am">{{ $t('contact.form.message') }} *</label>
                  <textarea
                    class="form-control-am"
                    v-model="form.message"
                    required
                    rows="4"
                    :placeholder="$t('contact.form.message')"
                    style="resize: vertical;"
                  ></textarea>
                </div>

                <!-- Error -->
                <div v-if="error" class="cm-error">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ error }}
                </div>

                <!-- Footer -->
                <div class="cm-footer">
                  <button
                    type="button"
                    class="btn-am btn-am-secondary"
                    @click="uiStore.closeContactModal()"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button
                    type="submit"
                    class="btn-am btn-am-primary"
                    :disabled="submitting"
                  >
                    <span v-if="submitting" class="cm-sending">
                      <span class="spinner-am spinner-sm"></span>
                      {{ $t('contact.form.sending') }}
                    </span>
                    <span v-else>
                      <i class="fa-solid fa-paper-plane" style="margin-right: 6px;"></i>
                      {{ $t('contact.form.send') }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useUiStore } from '@/stores/ui.js'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  carSubject: {
    type: String,
    default: ''
  }
})

const uiStore = useUiStore()
const { t } = useI18n()

const submitting = ref(false)
const error = ref('')

const form = reactive({
  name:    '',
  email:   '',
  phone:   '',
  subject: props.carSubject || '',
  message: ''
})

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    await axios.post('/api/contact', form)
    uiStore.toast.success(t('contact.form.success'))
    uiStore.closeContactModal()
    Object.keys(form).forEach(k => form[k] = '')
  } catch (err) {
    error.value = err.response?.data?.message || t('contact.form.error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* ── BACKDROP ─────────────────────────────────────────── */
.cm-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 1050);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* ── DIALOG ───────────────────────────────────────────── */
.cm-dialog {
  width: 100%;
  max-width: 560px;
}

.cm-content {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
}

/* ── HEADER ───────────────────────────────────────────── */
.cm-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.cm-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cm-title-icon {
  color: var(--accent);
  font-size: 0.9375rem;
}

.cm-car-subject {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.cm-close {
  background: none;
  border: none;
  padding: 0.25rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}
.cm-close:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* ── BODY ─────────────────────────────────────────────── */
.cm-body {
  padding: 1.5rem;
}

/* Two-column name + phone row */
.cm-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 500px) {
  .cm-row {
    grid-template-columns: 1fr;
  }
}

/* ── ERROR ────────────────────────────────────────────── */
.cm-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.25);
  color: #dc3545;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

/* ── FOOTER ───────────────────────────────────────────── */
.cm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

/* ── SENDING STATE ────────────────────────────────────── */
.cm-sending {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* ── MODAL TRANSITION ─────────────────────────────────── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .cm-content,
.modal-leave-active .cm-content {
  transition: transform 0.25s ease;
}
.modal-enter-from .cm-content {
  transform: scale(0.95) translateY(-10px);
}
.modal-leave-to .cm-content {
  transform: scale(0.95) translateY(-10px);
}
</style>
