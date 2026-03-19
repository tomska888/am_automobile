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
                  {{ isEditing ? `Edytujesz: ${form.make} ${form.model}` : 'Wypełnij dane nowego pojazdu' }}
                </p>
              </div>
            </div>
            <button class="modal-am-close" @click="$emit('update:modelValue', false)" aria-label="Zamknij">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Form Body -->
          <div class="modal-am-body">
            <form @submit.prevent="handleSubmit" novalidate>

              <!-- Section: Basic Info -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-car"></i>
                  Podstawowe informacje
                </h3>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label-am" for="car-make">
                      Marka <span class="required">*</span>
                    </label>
                    <input
                      id="car-make"
                      v-model="form.make"
                      type="text"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.make }"
                      placeholder="np. BMW, Toyota, Audi"
                      required
                    />
                    <div v-if="errors.make" class="form-error">{{ errors.make }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-model">
                      Model <span class="required">*</span>
                    </label>
                    <input
                      id="car-model"
                      v-model="form.model"
                      type="text"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.model }"
                      placeholder="np. 3 Series, Corolla, A4"
                      required
                    />
                    <div v-if="errors.model" class="form-error">{{ errors.model }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-year">
                      Rok produkcji <span class="required">*</span>
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
                      Cena (PLN) <span class="required">*</span>
                    </label>
                    <div class="input-with-prefix">
                      <span class="input-prefix">zł</span>
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
                  Dane techniczne
                </h3>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label-am" for="car-mileage">
                      Przebieg (km)
                    </label>
                    <input
                      id="car-mileage"
                      v-model.number="form.mileage"
                      type="number"
                      class="form-control-am"
                      min="0"
                      placeholder="45000"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-fuel">
                      Rodzaj paliwa <span class="required">*</span>
                    </label>
                    <select
                      id="car-fuel"
                      v-model="form.fuel_type"
                      class="form-control-am"
                      :class="{ 'is-invalid': errors.fuel_type }"
                    >
                      <option value="">Wybierz paliwo...</option>
                      <option value="petrol">Benzyna</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybryda</option>
                      <option value="electric">Elektryczny</option>
                      <option value="lpg">LPG</option>
                      <option value="phev">Plug-in Hybrid</option>
                    </select>
                    <div v-if="errors.fuel_type" class="form-error">{{ errors.fuel_type }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-transmission">
                      Skrzynia biegów
                    </label>
                    <select
                      id="car-transmission"
                      v-model="form.transmission"
                      class="form-control-am"
                    >
                      <option value="">Wybierz skrzynię...</option>
                      <option value="manual">Manualna</option>
                      <option value="automatic">Automatyczna</option>
                      <option value="semi-automatic">Półautomatyczna</option>
                      <option value="cvt">CVT</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-body">
                      Typ nadwozia
                    </label>
                    <select
                      id="car-body"
                      v-model="form.body_type"
                      class="form-control-am"
                    >
                      <option value="">Wybierz nadwozie...</option>
                      <option value="sedan">Sedan</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="suv">SUV</option>
                      <option value="coupe">Coupe</option>
                      <option value="wagon">Kombi</option>
                      <option value="convertible">Kabriolet</option>
                      <option value="van">Van</option>
                      <option value="pickup">Pickup</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-engine">
                      Pojemność silnika (L)
                    </label>
                    <input
                      id="car-engine"
                      v-model.number="form.engine_size"
                      type="number"
                      class="form-control-am"
                      min="0.5"
                      max="10"
                      step="0.1"
                      placeholder="2.0"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-power">
                      Moc (KM)
                    </label>
                    <input
                      id="car-power"
                      v-model.number="form.power_hp"
                      type="number"
                      class="form-control-am"
                      min="40"
                      max="2000"
                      placeholder="150"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-color">
                      Kolor
                    </label>
                    <input
                      id="car-color"
                      v-model="form.color"
                      type="text"
                      class="form-control-am"
                      placeholder="np. Czarny metalik"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label-am" for="car-vin">
                      Numer VIN
                    </label>
                    <input
                      id="car-vin"
                      v-model="form.vin"
                      type="text"
                      class="form-control-am"
                      maxlength="17"
                      placeholder="17-znakowy kod VIN"
                      style="text-transform: uppercase"
                    />
                  </div>
                </div>
              </div>

              <!-- Section: Status & Visibility -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-toggle-on"></i>
                  Status ogłoszenia
                </h3>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label-am" for="car-status">
                      Status <span class="required">*</span>
                    </label>
                    <select
                      id="car-status"
                      v-model="form.status"
                      class="form-control-am"
                    >
                      <option value="available">Dostępny</option>
                      <option value="reserved">Zarezerwowany</option>
                      <option value="sold">Sprzedany</option>
                    </select>
                  </div>

                  <div class="form-group form-group-checkbox">
                    <label class="form-label-am">Opcje wyświetlania</label>
                    <label class="checkbox-am">
                      <input v-model="form.featured" type="checkbox" />
                      <span class="checkbox-label">
                        <i class="fas fa-star"></i>
                        Wyróżnione ogłoszenie (pojawi się na stronie głównej)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Section: Images -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-images"></i>
                  Zdjęcia
                </h3>

                <div class="form-group">
                  <label class="form-label-am" for="car-image-url">
                    Główne zdjęcie (URL)
                  </label>
                  <input
                    id="car-image-url"
                    v-model="form.image_url"
                    type="url"
                    class="form-control-am"
                    placeholder="https://example.com/car-photo.jpg"
                  />
                  <div v-if="form.image_url" class="image-preview">
                    <img :src="form.image_url" alt="Podgląd zdjęcia" @error="imageError = true" @load="imageError = false" />
                    <div v-if="imageError" class="image-preview-error">
                      <i class="fas fa-exclamation-triangle"></i>
                      Nie można załadować obrazu z podanego URL
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label-am" for="car-gallery">
                    Galeria (URL-e, jeden na linię)
                  </label>
                  <textarea
                    id="car-gallery"
                    v-model="galleryText"
                    class="form-control-am"
                    rows="3"
                    placeholder="https://example.com/car-1.jpg&#10;https://example.com/car-2.jpg&#10;https://example.com/car-3.jpg"
                  ></textarea>
                  <div class="form-hint">Wpisz każdy URL w osobnej linii. Maksymalnie 10 zdjęć.</div>
                </div>
              </div>

              <!-- Section: Description -->
              <div class="form-section">
                <h3 class="form-section-title">
                  <i class="fas fa-align-left"></i>
                  Opis i wyposażenie
                </h3>

                <div class="form-group">
                  <label class="form-label-am" for="car-description">
                    Opis pojazdu
                  </label>
                  <textarea
                    id="car-description"
                    v-model="form.description"
                    class="form-control-am"
                    rows="4"
                    placeholder="Opisz pojazd, jego historię, stan techniczny, wyposażenie..."
                  ></textarea>
                  <div class="form-hint">
                    {{ form.description?.length || 0 }} / 2000 znaków
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label-am" for="car-features">
                    Wyposażenie dodatkowe (jedno na linię)
                  </label>
                  <textarea
                    id="car-features"
                    v-model="featuresText"
                    class="form-control-am"
                    rows="5"
                    placeholder="Klimatyzacja automatyczna&#10;Nawigacja GPS&#10;Podgrzewane fotele&#10;Kamera cofania&#10;Tempomat adaptacyjny"
                  ></textarea>
                  <div class="form-hint">Wpisz każdą funkcję w osobnej linii.</div>
                </div>
              </div>

              <!-- Form Footer -->
              <div class="form-actions">
                <button
                  type="button"
                  class="btn-am-ghost"
                  @click="$emit('update:modelValue', false)"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  class="btn-am-primary"
                  :disabled="submitting"
                >
                  <span v-if="submitting">
                    <i class="fas fa-spinner fa-spin"></i>
                    Zapisywanie...
                  </span>
                  <span v-else>
                    <i :class="isEditing ? 'fas fa-save' : 'fas fa-plus-circle'"></i>
                    {{ isEditing ? 'Zapisz zmiany' : 'Dodaj pojazd' }}
                  </span>
                </button>
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
import { useCarsStore } from '@/stores/cars'
import { useUiStore } from '@/stores/ui'

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

const currentYear = new Date().getFullYear()
const submitting = ref(false)
const imageError = ref(false)
const errors = ref({})

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
  image_url: '',
  gallery: [],
  description: '',
  features: []
})

const form = ref(defaultForm())
const galleryText = ref('')
const featuresText = ref('')

const isEditing = computed(() => !!props.car?.id)

// Populate form when editing
watch(
  () => props.car,
  (car) => {
    if (car) {
      form.value = { ...defaultForm(), ...car }
      galleryText.value = Array.isArray(car.gallery) ? car.gallery.join('\n') : ''
      featuresText.value = Array.isArray(car.features) ? car.features.join('\n') : ''
    } else {
      form.value = defaultForm()
      galleryText.value = ''
      featuresText.value = ''
    }
    errors.value = {}
    imageError.value = false
  },
  { immediate: true }
)

// Reset on close
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      errors.value = {}
    }
  }
)

function validate() {
  const e = {}
  if (!form.value.make?.trim()) e.make = 'Marka jest wymagana'
  if (!form.value.model?.trim()) e.model = 'Model jest wymagany'
  if (!form.value.year || form.value.year < 1990 || form.value.year > currentYear + 1) {
    e.year = `Rok musi być między 1990 a ${currentYear + 1}`
  }
  if (!form.value.price || form.value.price < 0) e.price = 'Podaj poprawną cenę'
  if (!form.value.fuel_type) e.fuel_type = 'Wybierz rodzaj paliwa'
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  // Parse gallery and features from textarea
  form.value.gallery = galleryText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10)

  form.value.features = featuresText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  submitting.value = true
  try {
    if (isEditing.value) {
      await carsStore.updateCar(props.car.id, form.value)
    } else {
      await carsStore.createCar(form.value)
    }
    emit('saved')
    emit('update:modelValue', false)
  } catch (err) {
    uiStore.addToast({
      type: 'error',
      message: err.response?.data?.message || 'Wystąpił błąd podczas zapisywania'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.car-form-modal {
  max-width: 780px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-am-title-group {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.modal-am-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-am-icon i {
  color: white;
  font-size: 1.1rem;
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

/* Form Sections */
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
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-5);
}

.form-section-title i {
  color: var(--primary-500);
  font-size: 0.95rem;
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

/* Input with prefix */
.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: var(--space-4);
  color: var(--text-muted);
  font-weight: 500;
  font-size: var(--text-sm);
  pointer-events: none;
  z-index: 1;
}

.form-control-am.with-prefix {
  padding-left: calc(var(--space-4) + 20px);
}

/* Checkbox */
.checkbox-am {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 0.2s;
}

.checkbox-am:hover {
  border-color: var(--primary-500);
}

.checkbox-am input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-500);
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
  color: #f59e0b;
  font-size: 0.85rem;
}

/* Image Preview */
.image-preview {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  max-height: 200px;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.image-preview-error {
  position: absolute;
  inset: 0;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.image-preview-error i {
  color: #f59e0b;
}

/* Form Hints */
.form-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* Form Error */
.form-error {
  font-size: var(--text-xs);
  color: var(--danger-color, #dc3545);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.form-control-am.is-invalid {
  border-color: var(--danger-color, #dc3545);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.12);
}

.required {
  color: var(--danger-color, #dc3545);
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-color);
  margin-top: var(--space-4);
}

/* Modal Transition */
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
  transform: scale(0.95) translateY(-10px);
}

@media (max-width: 768px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .car-form-modal {
    max-height: 95vh;
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    margin-top: auto;
  }
}
</style>
