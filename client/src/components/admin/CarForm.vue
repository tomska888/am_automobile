<template>
  <!-- Modal Backdrop -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-am-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-am car-form-modal" role="dialog" aria-modal="true" :aria-label="isEditing ? $t('admin.cars.editCar') : $t('admin.cars.addCar')">

          <!-- Header -->
          <div class="modal-am-header">
            <div class="modal-am-title-group">
              <div class="modal-am-icon">
                <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus'"></i>
              </div>
              <div>
                <h2 class="modal-am-title">
                  {{ isEditing ? $t('admin.cars.editCar') : $t('admin.cars.addCar') }}
                </h2>
                <p class="modal-am-subtitle">
                  {{ isEditing ? $t('admin.cars.form.editingSubtitle', { make: form.make, model: form.model }) : $t('admin.cars.form.addSubtitle') }}
                </p>
              </div>
            </div>
            <div class="modal-am-header-actions">
              <!-- Save button -->
              <button
                type="submit"
                form="car-form"
                class="modal-header-btn modal-header-btn-save"
                :disabled="submitting"
                :title="isEditing ? $t('admin.cars.form.saveChanges') : $t('admin.cars.form.addVehicle')"
                :aria-label="isEditing ? $t('admin.cars.form.saveChanges') : $t('admin.cars.form.addVehicle')"
              >
                <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
                <i v-else :class="isEditing ? 'fas fa-save' : 'fas fa-plus-circle'"></i>
              </button>
              <!-- Cancel / close button -->
              <button
                type="button"
                class="modal-header-btn modal-header-btn-cancel"
                @click="$emit('update:modelValue', false)"
                :title="$t('admin.cars.form.cancel')"
                :aria-label="$t('admin.cars.form.cancel')"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Form Body -->
          <div class="modal-am-body">
            <form id="car-form" @submit.prevent="handleSubmit" novalidate>

              <!-- Section: Basic Info -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-car"></i>
                  {{ $t('admin.cars.form.sectionBasic') }}
                </h3>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label-am" for="car-make">
                      {{ $t('admin.cars.form.make') }} <span class="required">*</span>
                    </label>
                    <input
                      id="car-make"
                      v-model="form.make"
                      type="text"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.make }"
                      :placeholder="$t('admin.cars.form.makePlaceholder')"
                      required
                    />
                    <div v-if="errors.make" class="form-error">{{ errors.make }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-model">
                      {{ $t('admin.cars.form.model') }} <span class="required">*</span>
                    </label>
                    <input
                      id="car-model"
                      v-model="form.model"
                      type="text"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.model }"
                      :placeholder="$t('admin.cars.form.modelPlaceholder')"
                      required
                    />
                    <div v-if="errors.model" class="form-error">{{ errors.model }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-year">
                      {{ $t('admin.cars.form.year') }} <span class="required">*</span>
                    </label>
                    <input
                      id="car-year"
                      v-model.number="form.year"
                      type="number"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.year }"
                      :min="1990"
                      :max="currentYear"
                      placeholder="2020"
                      required
                    />
                    <div v-if="errors.year" class="form-error">{{ errors.year }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-price">
                      {{ $t('admin.cars.form.price') }} <span class="required">*</span>
                    </label>
                    <div class="input-with-prefix">
                      <span class="input-prefix">€</span>
                      <input
                        id="car-price"
                        v-model.number="form.price"
                        type="number"
                        class="form-control-am with-prefix"
                        :class="{ 'is-invalid': errors.price }"
                        min="0"
                        step="100"
                        placeholder="89900"
                        required
                      />
                    </div>
                    <div v-if="errors.price" class="form-error">{{ errors.price }}</div>
                  </div>
                </div>
              </div>

              <!-- Section: Technical Specs -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-cogs"></i>
                  {{ $t('admin.cars.form.sectionTech') }}
                </h3>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label-am" for="car-mileage">
                      {{ $t('admin.cars.form.mileage') }}
                    </label>
                    <input
                      id="car-mileage"
                      v-model.number="form.mileage"
                      type="number"
                      class="form-control-am"
                      min="0"
                      :placeholder="$t('admin.cars.form.mileagePlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-fuel">
                      {{ $t('admin.cars.form.fuelType') }} <span class="required">*</span>
                    </label>
                    <select
                      id="car-fuel"
                      v-model="form.fuel_type"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.fuel_type }"
                    >
                      <option value="">{{ $t('admin.cars.form.fuelPlaceholder') }}</option>
                      <option value="petrol">{{ $t('admin.cars.form.fuelPetrol') }}</option>
                      <option value="diesel">{{ $t('admin.cars.form.fuelDiesel') }}</option>
                      <option value="hybrid">{{ $t('admin.cars.form.fuelHybrid') }}</option>
                      <option value="electric">{{ $t('admin.cars.form.fuelElectric') }}</option>
                      <option value="lpg">{{ $t('admin.cars.form.fuelLpg') }}</option>
                      <option value="phev">{{ $t('admin.cars.form.fuelPhev') }}</option>
                    </select>
                    <div v-if="errors.fuel_type" class="form-error">{{ errors.fuel_type }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-transmission">
                      {{ $t('admin.cars.form.transmission') }}
                    </label>
                    <select
                      id="car-transmission"
                      v-model="form.transmission"
                      class="form-control-am"
                    >
                      <option value="">{{ $t('admin.cars.form.transmissionPlaceholder') }}</option>
                      <option value="manual">{{ $t('admin.cars.form.transManual') }}</option>
                      <option value="automatic">{{ $t('admin.cars.form.transAutomatic') }}</option>
                      <option value="semi-automatic">{{ $t('admin.cars.form.transSemi') }}</option>
                      <option value="cvt">{{ $t('admin.cars.form.transCvt') }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-body">
                      {{ $t('admin.cars.form.bodyType') }}
                    </label>
                    <select
                      id="car-body"
                      v-model="form.body_type"
                      class="form-control-am"
                    >
                      <option value="">{{ $t('admin.cars.form.bodyPlaceholder') }}</option>
                      <option value="sedan">{{ $t('admin.cars.form.bodySedan') }}</option>
                      <option value="hatchback">{{ $t('admin.cars.form.bodyHatchback') }}</option>
                      <option value="suv">{{ $t('admin.cars.form.bodySuv') }}</option>
                      <option value="coupe">{{ $t('admin.cars.form.bodyCoupe') }}</option>
                      <option value="wagon">{{ $t('admin.cars.form.bodyWagon') }}</option>
                      <option value="convertible">{{ $t('admin.cars.form.bodyConvertible') }}</option>
                      <option value="van">{{ $t('admin.cars.form.bodyVan') }}</option>
                      <option value="pickup">{{ $t('admin.cars.form.bodyPickup') }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-engine">
                      {{ $t('admin.cars.form.engineSize') }}
                    </label>
                    <input
                      id="car-engine"
                      v-model.number="form.engine_size"
                      type="number"
                      class="form-control-am"
                      min="0.5"
                      max="10"
                      step="0.1"
                      :placeholder="$t('admin.cars.form.enginePlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-power">
                      {{ $t('admin.cars.form.power') }}
                    </label>
                    <input
                      id="car-power"
                      v-model.number="form.power_hp"
                      type="number"
                      class="form-control-am"
                      min="40"
                      max="2000"
                      :placeholder="$t('admin.cars.form.powerPlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-color">
                      {{ $t('admin.cars.form.color') }}
                    </label>
                    <input
                      id="car-color"
                      v-model="form.color"
                      type="text"
                      class="form-control-am"
                      :placeholder="$t('admin.cars.form.colorPlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-vin">
                      {{ $t('admin.cars.form.vin') }}
                    </label>
                    <input
                      id="car-vin"
                      v-model="form.vin"
                      type="text"
                      class="form-control-am"
                      maxlength="17"
                      :placeholder="$t('admin.cars.form.vinPlaceholder')"
                      style="text-transform: uppercase"
                    />
                  </div>
                </div>
              </div>

              <!-- Section: Description -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-align-left"></i>
                  {{ $t('admin.cars.form.sectionDesc') }}
                </h3>

                <div class="form-group">
                  <label class="form-label-am" for="car-description">
                    {{ $t('admin.cars.form.description') }}
                  </label>
                  <textarea
                    id="car-description"
                    v-model="form.description"
                    class="form-control-am"
                    rows="4"
                    :placeholder="$t('admin.cars.form.descriptionPlaceholder')"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label-am" for="car-features">
                    {{ $t('admin.cars.form.features') }}
                  </label>
                  <textarea
                    id="car-features"
                    v-model="featuresText"
                    class="form-control-am"
                    rows="5"
                    placeholder="Air conditioning&#10;GPS Navigation&#10;Heated seats&#10;Rear camera&#10;Adaptive cruise control"
                  ></textarea>
                  <div class="form-hint">{{ $t('admin.cars.form.featuresHint') }}</div>
                </div>
              </div>

              <!-- Section: Status & Visibility -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-toggle-on"></i>
                  {{ $t('admin.cars.form.sectionStatus') }}
                </h3>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label-am" for="car-status">
                      {{ $t('admin.cars.form.status') }} <span class="required">*</span>
                    </label>
                    <select
                      id="car-status"
                      v-model="form.status"
                      class="form-control-am"
                    >
                      <option value="available">{{ $t('admin.cars.form.statusAvailable') }}</option>
                      <option value="reserved">{{ $t('admin.cars.form.statusReserved') }}</option>
                      <option value="sold">{{ $t('admin.cars.form.statusSold') }}</option>
                    </select>
                  </div>

                  <div class="form-group form-group-checkbox">
                    <label class="form-label-am">{{ $t('admin.cars.form.displayOptions') }}</label>
                    <label class="checkbox-am">
                      <input v-model="form.featured" type="checkbox" />
                      <span class="checkbox-label">
                        <i class="fas fa-star"></i>
                        {{ $t('admin.cars.form.featured') }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Section: Images -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-images"></i>
                  {{ $t('admin.cars.form.sectionImages') }}
                </h3>

                <!-- Upload error banner -->
                <div v-if="uploadError" class="upload-error-banner">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ uploadError }}
                </div>

                <!-- Drop zone -->
                <div
                  class="upload-dropzone"
                  :class="{ 'is-dragover': isDragOver, 'is-uploading': uploading }"
                  @dragenter.prevent="isDragOver = true"
                  @dragleave.prevent="isDragOver = false"
                  @dragover.prevent
                  @drop.prevent="onDrop"
                  @click="!uploading && $refs.fileInput.click()"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    class="upload-file-input"
                    @change="onFileInputChange"
                  />

                  <div v-if="uploading" class="upload-dropzone-inner">
                    <i class="fas fa-spinner fa-spin upload-icon"></i>
                    <span class="upload-label">{{ $t('admin.cars.form.uploading') }}</span>
                  </div>
                  <div v-else class="upload-dropzone-inner">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <span class="upload-label">
                      {{ isDragOver ? $t('admin.cars.form.uploadDropActive') : $t('admin.cars.form.uploadDrop') }}
                    </span>
                    <span class="upload-hint">{{ $t('admin.cars.form.uploadHint') }}</span>
                    <button type="button" class="btn-am-ghost btn-sm upload-btn">
                      <i class="fas fa-folder-open"></i>
                      {{ $t('admin.cars.form.uploadBtn') }}
                    </button>
                  </div>
                </div>

                <!-- Photo grid -->
                <div v-if="photos.length > 0" class="photo-grid">
                  <div
                    v-for="(photo, index) in photos"
                    :key="photo.url"
                    class="photo-card"
                    :class="{ 'is-main': index === 0 }"
                  >
                    <!-- Thumbnail -->
                    <div class="photo-thumb">
                      <img
                        :src="photo.url"
                        :alt="$t('admin.cars.form.mainImage')"
                        @error="photo.loadError = true"
                        @load="photo.loadError = false"
                      />
                      <div v-if="photo.loadError" class="photo-load-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>{{ $t('admin.cars.form.imagePreviewError') }}</span>
                      </div>
                      <!-- Main badge -->
                      <span v-if="index === 0" class="photo-main-badge">
                        <i class="fas fa-star"></i>
                        {{ $t('admin.cars.form.mainBadge') }}
                      </span>
                    </div>

                    <!-- Actions -->
                    <div class="photo-actions">
                      <button
                        v-if="index !== 0"
                        type="button"
                        class="photo-btn photo-btn-main"
                        :title="$t('admin.cars.form.setAsMain')"
                        @click="setAsMain(index)"
                      >
                        <i class="fas fa-star"></i>
                      </button>
                      <button
                        type="button"
                        class="photo-btn photo-btn-remove"
                        :title="$t('admin.cars.form.removePhoto')"
                        @click="removePhoto(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Photo count hint -->
                <div v-if="photos.length > 0" class="form-hint photos-count-hint">
                  <i class="fas fa-images"></i>
                  {{ photos.length }} {{ photos.length === 1 ? $t('admin.cars.form.mainImage') : $t('admin.cars.form.gallery') }}
                  &nbsp;·&nbsp;
                  {{ $t('admin.cars.form.mainImage') }}: {{ photos[0]?.url ? photos[0].url.split('/').pop().split('?')[0] : '—' }}
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCarsStore } from '@/stores/cars'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  car: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved', 'cancel'])

const carsStore = useCarsStore()
const uiStore = useUiStore()
const authStore = useAuthStore()
const { t } = useI18n()

const currentYear = new Date().getFullYear()
const submitting = ref(false)
const errors = ref({})

// ─── Photo state ──────────────────────────────────────────────────────────────
// Each entry: { url: string, publicId: string|null, loadError: boolean }
// photos[0] is the main image; the rest form the gallery
const photos = ref([])
const uploading = ref(false)
const isDragOver = ref(false)
const uploadError = ref('')
const fileInput = ref(null)

const MAX_PHOTOS = 20
const MAX_SIZE_MB = 15

// ─── Form state ───────────────────────────────────────────────────────────────
const defaultForm = () => ({
  make: '',
  model: '',
  year: currentYear,
  price: '',
  mileage: '',
  fuel_type: '',
  transmission: '',
  body_type: '',
  engine_size: '',
  power_hp: '',
  color: '',
  vin: '',
  status: 'available',
  featured: false,
  description: '',
  features: []
})

const form = ref(defaultForm())
const featuresText = ref('')

const isEditing = computed(() => !!props.car?.id)

// ─── Populate / reset when modal opens ───────────────────────────────────────
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      const car = props.car
      if (car) {
        form.value = {
          ...defaultForm(),
          ...car,
          features: Array.isArray(car.features) ? [...car.features] : [],
        }
        // Rebuild photos array from existing car data
        const existingPhotos = []
        if (car.image_url) {
          existingPhotos.push({ url: car.image_url, publicId: null, loadError: false })
        }
        const gallery = Array.isArray(car.gallery) ? car.gallery : []
        for (const url of gallery) {
          if (url && url !== car.image_url) {
            existingPhotos.push({ url, publicId: null, loadError: false })
          }
        }
        photos.value = existingPhotos
      } else {
        form.value = defaultForm()
        photos.value = []
      }
      featuresText.value = form.value.features.join('\n')
      errors.value = {}
      uploadError.value = ''
      isDragOver.value = false
    } else {
      errors.value = {}
    }
  }
)

// ─── File handling ────────────────────────────────────────────────────────────
function onFileInputChange(e) {
  const files = Array.from(e.target.files || [])
  e.target.value = '' // reset so same file can be re-selected
  handleFiles(files)
}

function onDrop(e) {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  handleFiles(files)
}

async function handleFiles(files) {
  uploadError.value = ''

  // Client-side validation
  const imageFiles = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      uploadError.value = t('admin.cars.form.uploadErrorType', { name: file.name })
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      uploadError.value = t('admin.cars.form.uploadErrorSize', { name: file.name })
      return
    }
    imageFiles.push(file)
  }

  if (imageFiles.length === 0) return

  const remaining = MAX_PHOTOS - photos.value.length
  if (remaining <= 0) {
    uploadError.value = t('admin.cars.form.uploadHint')
    return
  }
  const toUpload = imageFiles.slice(0, remaining)

  uploading.value = true
  try {
    const formData = new FormData()
    for (const file of toUpload) {
      formData.append('images', file)
    }

    const token = authStore.token
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    const json = await response.json()

    if (!response.ok || !json.success) {
      throw new Error(json.message || t('admin.cars.form.uploadError'))
    }

    for (const item of json.data) {
      photos.value.push({ url: item.url, publicId: item.publicId, loadError: false })
    }
  } catch (err) {
    uploadError.value = err.message || t('admin.cars.form.uploadError')
  } finally {
    uploading.value = false
  }
}

function setAsMain(index) {
  const [main] = photos.value.splice(index, 1)
  photos.value.unshift(main)
}

async function removePhoto(index) {
  const photo = photos.value[index]
  // Fire-and-forget delete from Cloudinary (non-blocking)
  if (photo.publicId) {
    const token = authStore.token
    fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId: photo.publicId })
    }).catch(() => {/* ignore */})
  }
  photos.value.splice(index, 1)
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate() {
  const e = {}
  if (!form.value.make?.trim()) e.make = t('admin.cars.form.makeRequired')
  if (!form.value.model?.trim()) e.model = t('admin.cars.form.modelRequired')
  if (!form.value.year || form.value.year < 1990 || form.value.year > currentYear + 1) {
    e.year = t('admin.cars.form.yearRequired', { max: currentYear + 1 })
  }
  if (!form.value.price || form.value.price < 0) e.price = t('admin.cars.form.priceRequired')
  if (!form.value.fuel_type) e.fuel_type = t('admin.cars.form.fuelTypeRequired')
  errors.value = e
  return Object.keys(e).length === 0
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validate()) return

  const features = featuresText.value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  const toNum = (v) => (v === '' || v === null || v === undefined) ? null : Number(v)
  const toStr = (v) => (v === '' || v === null || v === undefined) ? null : String(v).trim()

  // Derive image_url and gallery from photos array
  const image_url = photos.value[0]?.url || null
  const gallery = photos.value.slice(1).map(p => p.url)

  const payload = {
    make:         form.value.make?.trim(),
    model:        form.value.model?.trim(),
    year:         Number(form.value.year),
    price:        Number(form.value.price),
    mileage:      toNum(form.value.mileage),
    fuel_type:    form.value.fuel_type,
    transmission: toStr(form.value.transmission),
    body_type:    toStr(form.value.body_type),
    engine_size:  toNum(form.value.engine_size),
    power_hp:     toNum(form.value.power_hp),
    color:        toStr(form.value.color),
    vin:          toStr(form.value.vin),
    status:       form.value.status,
    featured:     !!form.value.featured,
    image_url,
    description:  toStr(form.value.description),
    gallery,
    features,
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await carsStore.updateCar(props.car.id, payload)
    } else {
      await carsStore.createCar(payload)
    }
    emit('saved')
    emit('update:modelValue', false)
  } catch (err) {
    uiStore.addToast({
      type: 'error',
      message: err.response?.data?.message || t('admin.cars.form.saveError')
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* ── Modal shell ──────────────────────────────────────────────────────────── */
.car-form-modal {
  max-width: 780px;
  max-height: 90vh;
  /* overflow hidden so border-radius clips the scrollbar track at corners */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
}

/* Body is the scroll container — scrollbar stays inside rounded modal */
.car-form-modal .modal-am-body {
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

/* Webkit (Chrome, Edge, Safari) */
.car-form-modal .modal-am-body::-webkit-scrollbar {
  width: 5px;
}

.car-form-modal .modal-am-body::-webkit-scrollbar-track {
  background: transparent;
}

.car-form-modal .modal-am-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
}

.car-form-modal .modal-am-body::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.modal-am-title-group {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.modal-am-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--accent), var(--primary-dark));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--accent-glow);
  color: #fff;
  font-size: 1rem;
}

.modal-am-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-am-subtitle {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin: 0;
}

/* ── Form sections ────────────────────────────────────────────────────────── */
.form-section {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-5);
}

.form-section-title i {
  width: 28px;
  height: 28px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group-checkbox {
  justify-content: flex-end;
}

/* ── € prefix ─────────────────────────────────────────────────────────────── */
.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: var(--space-4);
  color: var(--accent);
  font-weight: 600;
  font-size: var(--text-sm);
  pointer-events: none;
  z-index: 1;
}

.form-control-am.with-prefix {
  padding-left: calc(var(--space-4) + 20px);
}

/* ── Checkbox ─────────────────────────────────────────────────────────────── */
.checkbox-am {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.checkbox-am:hover {
  border-color: var(--accent);
  background: var(--accent-light);
}

.checkbox-am input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  flex-shrink: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.checkbox-label i {
  color: var(--warning);
  font-size: 0.85rem;
}

/* ── Upload error banner ──────────────────────────────────────────────────── */
.upload-error-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: rgba(220, 53, 69, 0.08);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: var(--radius-lg);
  color: var(--danger);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

/* ── Dropzone ─────────────────────────────────────────────────────────────── */
.upload-dropzone {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-4);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
  background: var(--bg-secondary);
  margin-bottom: var(--space-5);
  user-select: none;
}

.upload-dropzone:hover {
  border-color: var(--accent);
  background: var(--accent-light);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.upload-dropzone.is-dragover {
  border-color: var(--accent);
  background: var(--accent-light);
  box-shadow: 0 0 0 4px var(--accent-glow);
}

.upload-dropzone.is-uploading {
  cursor: not-allowed;
  opacity: 0.65;
}

.upload-file-input {
  display: none;
}

.upload-dropzone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  pointer-events: none;
}

.upload-icon {
  font-size: 2.4rem;
  color: var(--accent);
  margin-bottom: var(--space-1);
  filter: drop-shadow(0 2px 6px var(--accent-glow));
}

.upload-label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
}

.upload-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
  max-width: 340px;
}

/* Select-photos button — inline outline style, works on both themes */
.upload-btn {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-5);
  font-family: var(--font-family);
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: var(--radius-pill);
  border: 2px solid var(--accent);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.upload-btn:hover {
  background: var(--accent);
  color: #fff;
}

/* ── Photo grid ───────────────────────────────────────────────────────────── */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.photo-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  display: flex;
  flex-direction: column;
}

.photo-card.is-main {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.photo-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-base);
}

.photo-card:hover .photo-thumb img {
  transform: scale(1.04);
}

.photo-load-error {
  position: absolute;
  inset: 0;
  background: var(--bg-tertiary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-xs);
  text-align: center;
  padding: var(--space-2);
}

.photo-load-error i {
  font-size: 1.2rem;
  color: var(--warning);
}

.photo-main-badge {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  background: linear-gradient(135deg, var(--accent), var(--primary-dark));
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 6px var(--accent-glow);
}

.photo-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
}

.photo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  font-size: 0.75rem;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}

.photo-btn-main {
  color: var(--warning);
}

.photo-btn-main:hover {
  background: rgba(255, 193, 7, 0.15);
  border-color: var(--warning);
}

.photo-btn-remove {
  color: var(--danger);
}

.photo-btn-remove:hover {
  background: rgba(220, 53, 69, 0.12);
  border-color: var(--danger);
}

.photos-count-hint {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* ── Utility ──────────────────────────────────────────────────────────────── */
.form-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.form-error {
  font-size: var(--text-xs);
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.form-control-am.is-invalid {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}

.required {
  color: var(--danger);
}

/* ── Form actions footer ──────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-color);
  margin-top: var(--space-4);
}

/* ── Header action buttons (save / cancel) ────────────────────────────────── */
.modal-am-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
}

.modal-header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast);
  flex-shrink: 0;
}

.modal-header-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Save — accent coloured */
.modal-header-btn-save {
  color: var(--accent);
  border-color: var(--accent);
}

.modal-header-btn-save:not(:disabled):hover {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* Cancel — neutral */
.modal-header-btn-cancel {
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.modal-header-btn-cancel:hover {
  background: rgba(220, 53, 69, 0.08);
  border-color: var(--danger);
  color: var(--danger);
}

/* ── Modal transition ─────────────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-am,
.modal-fade-leave-active .modal-am {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-am {
  transform: scale(0.96) translateY(-12px);
}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .car-form-modal {
    max-height: 95vh;
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    margin-top: auto;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }

  .upload-dropzone {
    padding: var(--space-8) var(--space-3);
  }
}
</style>
