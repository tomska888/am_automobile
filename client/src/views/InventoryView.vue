<template>
  <div class="inv-page">
    <AppHeader />

    <!-- Page Hero Banner -->
    <section class="inv-hero">
      <div class="inv-hero-inner">
        <span class="inv-hero-label">
          <i class="fa-solid fa-car me-2"></i>{{ $t('nav.inventory') }}
        </span>
        <h1 class="inv-hero-title">{{ $t('inventory.title') }}</h1>
        <p class="inv-hero-sub">{{ $t('inventory.subtitle') }}</p>
      </div>
    </section>

    <!-- Main Layout -->
    <section class="inv-body">
      <div class="inv-container">

        <!-- ── MOBILE FILTER TOGGLE BAR ───────────────── -->
        <!-- Sentinel: when this scrolls out of view the bar becomes a floating pill -->
        <div ref="mobileBarSentinel" class="inv-mobile-bar-sentinel" aria-hidden="true"></div>

        <!-- Placeholder keeps layout stable when bar goes fixed -->
        <div v-if="isBarFloating" class="inv-mobile-bar-placeholder" :style="{ height: mobileBarHeight + 'px' }" aria-hidden="true"></div>

        <div ref="mobileBarEl" class="inv-mobile-bar" :class="{ floating: isBarFloating }">
          <!-- Left half: Filters -->
          <button class="inv-mobile-filter-btn" @click="toggleMobileSidebar" :aria-expanded="mobileSidebarOpen">
            <i class="fa-solid fa-sliders"></i>
            {{ $t('inventory.filters.title') }}
            <span v-if="carsStore.activeFilterCount > 0" class="inv-mobile-filter-badge">{{ carsStore.activeFilterCount }}</span>
          </button>

          <!-- Divider -->
          <div class="inv-bar-divider" aria-hidden="true"></div>

          <!-- Right half: Sort -->
          <div class="inv-bar-sort-half">
            <div class="cdd-wrap cdd-sort" :class="{ open: openDrop === 'sort' }" v-click-outside="() => closeDrop('sort')">
              <button type="button" class="cdd-trigger" @click="toggleDrop('sort')" :aria-expanded="openDrop === 'sort'">
                <i class="fa-solid fa-arrow-up-wide-short inv-sort-icon"></i>
                <span class="cdd-value">{{ sortOptions.find(s => s.val === carsStore.filters.sort)?.label || $t('inventory.sort.newest') }}</span>
                <i class="fa-solid fa-chevron-down cdd-arrow"></i>
              </button>
              <div class="cdd-menu cdd-menu-right" :class="{ 'cdd-menu-up': isBarFloating }" role="listbox">
                <button
                  type="button"
                  class="cdd-option"
                  v-for="s in sortOptions"
                  :key="s.val"
                  :class="{ selected: carsStore.filters.sort === s.val }"
                  @click="pickSort(s.val)"
                >
                  <span>{{ s.label }}</span>
                  <i v-if="carsStore.filters.sort === s.val" class="fa-solid fa-check cdd-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="inv-layout">

          <!-- ── FILTER SIDEBAR ─────────────────────────── -->
          <aside class="inv-sidebar" :class="{ 'mobile-open': mobileSidebarOpen }">
            <div class="inv-filter-card">
              <div class="inv-filter-header">
                <h2 class="inv-filter-title">
                  <i class="fa-solid fa-sliders"></i>
                  {{ $t('inventory.filters.title') }}
                </h2>
                <div class="inv-filter-header-actions">
                  <button
                    v-if="carsStore.activeFilterCount > 0"
                    class="inv-reset-btn"
                    @click="carsStore.resetFilters()"
                  >
                    <i class="fa-solid fa-times"></i>
                    {{ $t('inventory.filters.reset') }} ({{ carsStore.activeFilterCount }})
                  </button>
                  <button class="inv-sidebar-close" @click="mobileSidebarOpen = false" aria-label="Close filters">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <!-- ── FILTER BODY (padded wrapper) ── -->
              <div class="inv-filter-body">

                <!-- Search -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.searchPlaceholder') }}</label>
                  <div class="inv-search-wrap">
                    <i class="fa-solid fa-magnifying-glass inv-search-icon"></i>
                    <input
                      type="search"
                      class="inv-input inv-search-input"
                      :placeholder="$t('inventory.searchPlaceholder')"
                      v-model="localFilters.search"
                      @input="debouncedSearch"
                    />
                  </div>
                </div>

                <!-- Make -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.filters.make') }}</label>
                  <div class="cdd-wrap" :class="{ open: openDrop === 'make' }" v-click-outside="() => closeDrop('make')">
                    <button type="button" class="cdd-trigger" @click="toggleDrop('make')" :aria-expanded="openDrop === 'make'">
                      <span class="cdd-value">{{ localFilters.make || $t('inventory.filters.make') }}</span>
                      <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                    </button>
                    <div class="cdd-menu" role="listbox">
                      <button type="button" class="cdd-option" :class="{ selected: localFilters.make === '' }" @click="pickDrop('make', '')">
                        <span>{{ $t('inventory.filters.make') }}</span>
                        <i v-if="localFilters.make === ''" class="fa-solid fa-check cdd-check"></i>
                      </button>
                      <button type="button" class="cdd-option" v-for="m in makes" :key="m" :class="{ selected: localFilters.make === m }" @click="pickDrop('make', m)">
                        <span>{{ m }}</span>
                        <i v-if="localFilters.make === m" class="fa-solid fa-check cdd-check"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Year Range -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.filters.year') }}</label>
                  <div class="inv-range-row">

                    <!-- Year FROM picker -->
                    <div class="yr-pick-wrap" :class="{ open: openDrop === 'year_min' }" v-click-outside="() => closeDrop('year_min')">
                      <button type="button" class="cdd-trigger yr-trigger" @click="toggleDrop('year_min')" :aria-expanded="openDrop === 'year_min'">
                        <span class="cdd-value" :class="{ 'yr-placeholder': !localFilters.year_min }">
                          {{ localFilters.year_min || $t('inventory.filters.yearFrom') }}
                        </span>
                        <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                      </button>
                      <div class="yr-panel" role="listbox">
                        <div class="yr-grid">
                          <button
                            v-for="y in availableYears"
                            :key="'min-' + y"
                            type="button"
                            class="yr-btn"
                            :class="getYearClass(y, 'min')"
                            @click="pickYear('year_min', y)"
                          >{{ y }}</button>
                        </div>
                        <div class="yr-panel-footer" v-if="localFilters.year_min">
                          <button class="yr-clear-btn" type="button" @click.stop="clearYear('year_min')">
                            <i class="fa-solid fa-times"></i> {{ $t('inventory.filters.reset') }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <span class="inv-range-sep">—</span>

                    <!-- Year TO picker -->
                    <div class="yr-pick-wrap" :class="{ open: openDrop === 'year_max' }" v-click-outside="() => closeDrop('year_max')">
                      <button type="button" class="cdd-trigger yr-trigger" @click="toggleDrop('year_max')" :aria-expanded="openDrop === 'year_max'">
                        <span class="cdd-value" :class="{ 'yr-placeholder': !localFilters.year_max }">
                          {{ localFilters.year_max || $t('inventory.filters.yearTo') }}
                        </span>
                        <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                      </button>
                      <div class="yr-panel yr-panel-right" role="listbox">
                        <div class="yr-grid">
                          <button
                            v-for="y in availableYears"
                            :key="'max-' + y"
                            type="button"
                            class="yr-btn"
                            :class="getYearClass(y, 'max')"
                            @click="pickYear('year_max', y)"
                          >{{ y }}</button>
                        </div>
                        <div class="yr-panel-footer" v-if="localFilters.year_max">
                          <button class="yr-clear-btn" type="button" @click.stop="clearYear('year_max')">
                            <i class="fa-solid fa-times"></i> {{ $t('inventory.filters.reset') }}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Price Range -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.filters.price') }}</label>
                  <div class="inv-range-row">

                    <!-- Price MIN picker -->
                    <div class="yr-pick-wrap" :class="{ open: openDrop === 'price_min' }" v-click-outside="() => closeDrop('price_min')">
                      <button type="button" class="cdd-trigger yr-trigger" @click="toggleDrop('price_min')" :aria-expanded="openDrop === 'price_min'">
                        <span class="cdd-value" :class="{ 'yr-placeholder': !localFilters.price_min }">
                          {{ localFilters.price_min ? formatPrice(localFilters.price_min) : $t('inventory.filters.priceFrom') }}
                        </span>
                        <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                      </button>
                      <div class="yr-panel pr-panel" role="listbox">
                        <!-- Preset tiles -->
                        <div class="pr-grid">
                          <button
                            v-for="p in pricePresets"
                            :key="'pmin-' + p.val"
                            type="button"
                            class="pr-btn"
                            :class="getPriceClass(p.val, 'min')"
                            :disabled="localFilters.price_max && p.val > Number(localFilters.price_max)"
                            @click="pickPrice('price_min', p.val)"
                          >{{ p.label }}</button>
                        </div>
                        <!-- Custom input -->
                        <div class="pr-custom">
                          <input
                            type="number"
                            class="inv-input pr-custom-input"
                            :placeholder="$t('inventory.filters.priceCustom')"
                            :value="localFilters.price_min"
                            min="0"
                            step="500"
                            @change="pickPrice('price_min', $event.target.value ? Number($event.target.value) : '')"
                          />
                        </div>
                        <div class="yr-panel-footer" v-if="localFilters.price_min">
                          <button class="yr-clear-btn" type="button" @click.stop="pickPrice('price_min', '')">
                            <i class="fa-solid fa-times"></i> {{ $t('inventory.filters.reset') }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <span class="inv-range-sep">—</span>

                    <!-- Price MAX picker -->
                    <div class="yr-pick-wrap" :class="{ open: openDrop === 'price_max' }" v-click-outside="() => closeDrop('price_max')">
                      <button type="button" class="cdd-trigger yr-trigger" @click="toggleDrop('price_max')" :aria-expanded="openDrop === 'price_max'">
                        <span class="cdd-value" :class="{ 'yr-placeholder': !localFilters.price_max }">
                          {{ localFilters.price_max ? formatPrice(localFilters.price_max) : $t('inventory.filters.priceTo') }}
                        </span>
                        <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                      </button>
                      <div class="yr-panel yr-panel-right pr-panel" role="listbox">
                        <!-- Preset tiles -->
                        <div class="pr-grid">
                          <button
                            v-for="p in pricePresets"
                            :key="'pmax-' + p.val"
                            type="button"
                            class="pr-btn"
                            :class="getPriceClass(p.val, 'max')"
                            :disabled="localFilters.price_min && p.val < Number(localFilters.price_min)"
                            @click="pickPrice('price_max', p.val)"
                          >{{ p.label }}</button>
                        </div>
                        <!-- Custom input -->
                        <div class="pr-custom">
                          <input
                            type="number"
                            class="inv-input pr-custom-input"
                            :placeholder="$t('inventory.filters.priceCustom')"
                            :value="localFilters.price_max"
                            min="0"
                            step="500"
                            @change="pickPrice('price_max', $event.target.value ? Number($event.target.value) : '')"
                          />
                        </div>
                        <div class="yr-panel-footer" v-if="localFilters.price_max">
                          <button class="yr-clear-btn" type="button" @click.stop="pickPrice('price_max', '')">
                            <i class="fa-solid fa-times"></i> {{ $t('inventory.filters.reset') }}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Fuel Type -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.filters.fuelType') }}</label>
                  <div class="cdd-wrap" :class="{ open: openDrop === 'fuel' }" v-click-outside="() => closeDrop('fuel')">
                    <button type="button" class="cdd-trigger" @click="toggleDrop('fuel')" :aria-expanded="openDrop === 'fuel'">
                      <span class="cdd-value">{{ localFilters.fuel_type ? $t(`car.fuel.${localFilters.fuel_type}`) : $t('inventory.filters.fuelType') }}</span>
                      <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                    </button>
                    <div class="cdd-menu" role="listbox">
                      <button type="button" class="cdd-option" :class="{ selected: localFilters.fuel_type === '' }" @click="pickDrop('fuel_type', '')">
                        <span>{{ $t('inventory.filters.fuelType') }}</span>
                        <i v-if="localFilters.fuel_type === ''" class="fa-solid fa-check cdd-check"></i>
                      </button>
                      <button type="button" class="cdd-option" v-for="f in fuelTypes" :key="f" :class="{ selected: localFilters.fuel_type === f }" @click="pickDrop('fuel_type', f)">
                        <span>{{ $t(`car.fuel.${f}`) }}</span>
                        <i v-if="localFilters.fuel_type === f" class="fa-solid fa-check cdd-check"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Transmission -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.filters.transmission') }}</label>
                  <div class="cdd-wrap" :class="{ open: openDrop === 'transmission' }" v-click-outside="() => closeDrop('transmission')">
                    <button type="button" class="cdd-trigger" @click="toggleDrop('transmission')" :aria-expanded="openDrop === 'transmission'">
                      <span class="cdd-value">{{ localFilters.transmission ? $t(`car.trans.${localFilters.transmission}`) : $t('inventory.filters.transmission') }}</span>
                      <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                    </button>
                    <div class="cdd-menu" role="listbox">
                      <button type="button" class="cdd-option" :class="{ selected: localFilters.transmission === '' }" @click="pickDrop('transmission', '')">
                        <span>{{ $t('inventory.filters.transmission') }}</span>
                        <i v-if="localFilters.transmission === ''" class="fa-solid fa-check cdd-check"></i>
                      </button>
                      <button type="button" class="cdd-option" v-for="t in transmissions" :key="t" :class="{ selected: localFilters.transmission === t }" @click="pickDrop('transmission', t)">
                        <span>{{ $t(`car.trans.${t}`) }}</span>
                        <i v-if="localFilters.transmission === t" class="fa-solid fa-check cdd-check"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Body Type -->
                <div class="inv-filter-group">
                  <label class="inv-filter-label">{{ $t('inventory.filters.bodyType') }}</label>
                  <div class="cdd-wrap" :class="{ open: openDrop === 'body_type' }" v-click-outside="() => closeDrop('body_type')">
                    <button type="button" class="cdd-trigger" @click="toggleDrop('body_type')" :aria-expanded="openDrop === 'body_type'">
                      <span class="cdd-value">{{ localFilters.body_type ? $t(`car.body.${localFilters.body_type}`) : $t('inventory.filters.bodyType') }}</span>
                      <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                    </button>
                    <div class="cdd-menu" role="listbox">
                      <button type="button" class="cdd-option" :class="{ selected: localFilters.body_type === '' }" @click="pickDrop('body_type', '')">
                        <span>{{ $t('inventory.filters.bodyType') }}</span>
                        <i v-if="localFilters.body_type === ''" class="fa-solid fa-check cdd-check"></i>
                      </button>
                      <button type="button" class="cdd-option" v-for="b in bodyTypes" :key="b.val" :class="{ selected: localFilters.body_type === b.val }" @click="pickDrop('body_type', b.val)">
                        <span>{{ $t(`car.body.${b.val}`) }}</span>
                        <i v-if="localFilters.body_type === b.val" class="fa-solid fa-check cdd-check"></i>
                      </button>
                    </div>
                  </div>
                </div>

              </div><!-- end .inv-filter-body -->
            </div>
          </aside>

          <!-- ── MOBILE SIDEBAR OVERLAY ──────────────────── -->
          <div
            v-if="mobileSidebarOpen"
            class="inv-sidebar-overlay"
            @click="mobileSidebarOpen = false"
            aria-hidden="true"
          ></div>

          <!-- ── RESULTS AREA ─────────────────────────── -->
          <div class="inv-results">

            <!-- Toolbar (desktop only) -->
            <div class="inv-toolbar">
              <p class="inv-count">
                {{ $t('inventory.results', { count: carsStore.pagination.total }) }}
              </p>
              <div class="inv-sort-wrap">
                <label class="inv-sort-label">{{ $t('inventory.sort.label') }}:</label>
                <div class="cdd-wrap cdd-sort" :class="{ open: openDrop === 'sort' }" v-click-outside="() => closeDrop('sort')">
                  <button type="button" class="cdd-trigger" @click="toggleDrop('sort')" :aria-expanded="openDrop === 'sort'">
                    <span class="cdd-value">{{ sortOptions.find(s => s.val === carsStore.filters.sort)?.label || $t('inventory.sort.newest') }}</span>
                    <i class="fa-solid fa-chevron-down cdd-arrow"></i>
                  </button>
                  <div class="cdd-menu cdd-menu-right" role="listbox">
                    <button
                      type="button"
                      class="cdd-option"
                      v-for="s in sortOptions"
                      :key="s.val"
                      :class="{ selected: carsStore.filters.sort === s.val }"
                      @click="pickSort(s.val)"
                    >
                      <span>{{ s.label }}</span>
                      <i v-if="carsStore.filters.sort === s.val" class="fa-solid fa-check cdd-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Filter Chips -->
            <div v-if="carsStore.activeFilterCount > 0" class="inv-chips">
              <span class="inv-chip" v-if="carsStore.filters.search">
                <i class="fa-solid fa-magnifying-glass"></i> {{ carsStore.filters.search }}
                <button class="inv-chip-remove" @click="removeFilter('search')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.make">
                {{ carsStore.filters.make }}
                <button class="inv-chip-remove" @click="removeFilter('make')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.year_min">
                <i class="fa-regular fa-calendar"></i> {{ $t('inventory.filters.yearFrom') }}: {{ carsStore.filters.year_min }}
                <button class="inv-chip-remove" @click="removeFilter('year_min')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.year_max">
                <i class="fa-regular fa-calendar"></i> {{ $t('inventory.filters.yearTo') }}: {{ carsStore.filters.year_max }}
                <button class="inv-chip-remove" @click="removeFilter('year_max')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.price_min">
                <i class="fa-solid fa-euro-sign"></i> {{ $t('inventory.filters.priceFrom') }}: {{ formatPrice(carsStore.filters.price_min) }}
                <button class="inv-chip-remove" @click="removeFilter('price_min')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.price_max">
                <i class="fa-solid fa-euro-sign"></i> {{ $t('inventory.filters.priceTo') }}: {{ formatPrice(carsStore.filters.price_max) }}
                <button class="inv-chip-remove" @click="removeFilter('price_max')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.fuel_type">
                {{ $t(`car.fuel.${carsStore.filters.fuel_type}`) }}
                <button class="inv-chip-remove" @click="removeFilter('fuel_type')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.transmission">
                {{ $t(`car.trans.${carsStore.filters.transmission}`) }}
                <button class="inv-chip-remove" @click="removeFilter('transmission')">×</button>
              </span>
              <span class="inv-chip" v-if="carsStore.filters.body_type">
                {{ $t(`car.body.${carsStore.filters.body_type}`) }}
                <button class="inv-chip-remove" @click="removeFilter('body_type')">×</button>
              </span>
            </div>

            <!-- Loading -->
            <LoadingSpinner v-if="carsStore.loading" :label="$t('inventory.loading')" />

            <!-- No Results -->
            <div v-else-if="!carsStore.hasResults" class="inv-empty">
              <div class="inv-empty-icon">
                <i class="fa-solid fa-car-burst"></i>
              </div>
              <h3 class="inv-empty-title">{{ $t('inventory.noResults') }}</h3>
              <p class="inv-empty-sub">{{ $t('inventory.noResultsDesc') }}</p>
              <button class="inv-apply-btn" style="width:auto; padding: 0.75rem 2rem;" @click="carsStore.resetFilters()">
                {{ $t('inventory.filters.reset') }}
              </button>
            </div>

            <!-- Car Grid -->
            <div v-else class="inv-grid">
              <CarCard
                v-for="car in carsStore.cars"
                :key="car.id"
                :car="car"
                @view="openCarDetail"
              />
            </div>

            <!-- Pagination -->
            <Pagination
              :current-page="carsStore.pagination.page"
              :total-pages="carsStore.pagination.totalPages"
              @page="carsStore.setPage"
            />
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
    <ContactModal />

    <!-- ── DESKTOP COMPARE BAR (bottom pill) ──────────── -->
    <Transition name="compare-bar-slide">
      <div v-if="compareStore.count > 0" class="cmp-bar" role="region" aria-label="Car comparison bar">
        <div class="cmp-bar-inner">
          <!-- Car name pills -->
          <div class="cmp-bar-cars">
            <div
              v-for="(car, idx) in compareStore.cars"
              :key="car.id"
              class="cmp-bar-car"
            >
              <span class="cmp-bar-car-name">{{ car.make }} {{ car.model }}</span>
              <button
                class="cmp-bar-remove"
                @click="compareStore.removeCar(car.id)"
                :aria-label="$t('compare.removeCar')"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
              <span v-if="idx < compareStore.cars.length - 1" class="cmp-bar-sep" aria-hidden="true">|</span>
            </div>
          </div>

          <div class="cmp-bar-actions">
            <button class="cmp-bar-clear" @click="compareStore.clearAll()">
              <i class="fa-solid fa-trash-can"></i>
              {{ $t('compare.clearAll') }}
            </button>
            <button
              class="cmp-bar-btn"
              :disabled="!compareStore.canCompare"
              @click="goToCompare"
            >
              <i class="fa-solid fa-code-compare"></i>
              {{ $t('compare.startCompare', { count: compareStore.count }) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── MOBILE COMPARE CARD (above floating pill) ──── -->
    <Transition name="compare-card-slide">
      <div v-if="compareStore.count > 0" class="cmp-mobile-card" role="region" aria-label="Car comparison">
        <!-- Header row: label + count badge -->
        <div class="cmp-mobile-header">
          <span class="cmp-mobile-label">
            <i class="fa-solid fa-code-compare"></i>
            {{ $t('compare.compareBtn') }}
          </span>
          <span class="cmp-mobile-count">{{ compareStore.count }}</span>
        </div>

        <!-- One row per car with divider -->
        <div class="cmp-mobile-list">
          <div
            v-for="car in compareStore.cars"
            :key="car.id"
            class="cmp-mobile-row"
          >
            <span class="cmp-mobile-car-name">{{ car.make }} {{ car.model }}</span>
            <button
              class="cmp-mobile-remove"
              @click.stop="compareStore.removeCar(car.id)"
              :aria-label="$t('compare.removeCar')"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Compare CTA -->
        <button
          class="cmp-mobile-btn"
          :disabled="!compareStore.canCompare"
          @click="goToCompare"
        >
          <i class="fa-solid fa-arrow-right"></i>
          {{ $t('compare.compareBtn') }}
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCarsStore } from '@/stores/cars.js'
import { useCompareStore } from '@/stores/compare.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CarCard from '@/components/ui/CarCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ContactModal from '@/components/ui/ContactModal.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const carsStore = useCarsStore()
const compareStore = useCompareStore()
const currentYear = new Date().getFullYear()

const localFilters = reactive({ ...carsStore.filters })

// ── Mobile sidebar state ─────────────────────────────────
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

// ── Floating pill: becomes fixed when sentinel scrolls out of view ──
const mobileBarSentinel = ref(null)
const mobileBarEl = ref(null)
const isBarFloating = ref(false)
const mobileBarHeight = ref(0)
let _barObserver = null

// ── Custom dropdown state ────────────────────────────────
const openDrop = ref(null)

function toggleDrop(name) {
  openDrop.value = openDrop.value === name ? null : name
}

function closeDrop(name) {
  if (openDrop.value === name) openDrop.value = null
}

function pickDrop(field, value) {
  localFilters[field] = value
  openDrop.value = null
  applyFilters()
}

function pickSort(value) {
  carsStore.filters.sort = value
  openDrop.value = null
  carsStore.fetchCars()
}

// ── Click-outside directive ──────────────────────────────
// Uses pointerup (not pointerdown) so touch-scroll inside dropdown
// doesn't accidentally close the menu before the gesture completes.
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('pointerup', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('pointerup', el._clickOutsideHandler)
  }
}

// ── Filter helpers ───────────────────────────────────────
let searchTimer = null
function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(applyFilters, 400)
}

function applyFilters() {
  carsStore.applyFilters({ ...localFilters })
}

function removeFilter(key) {
  localFilters[key] = ''
  carsStore.applyFilters({ ...localFilters })
}

function openCarDetail(car) {
  router.push({ name: 'car-detail', params: { id: car.id } })
}

function goToCompare() {
  if (compareStore.canCompare) {
    router.push({ name: 'compare' })
  }
}

// ── Year picker helpers ──────────────────────────────────
const availableYears = computed(() => {
  const years = []
  for (let y = currentYear; y >= 1990; y--) years.push(y)
  return years
})

function getYearClass(year, side) {
  const min = localFilters.year_min ? Number(localFilters.year_min) : null
  const max = localFilters.year_max ? Number(localFilters.year_max) : null
  if (side === 'min' && min === year) return 'yr-btn-selected yr-btn-selected-start'
  if (side === 'max' && max === year) return 'yr-btn-selected yr-btn-selected-end'
  if (min && max && year > min && year < max) return 'yr-btn-in-range'
  if (side === 'min' && max && year === max) return 'yr-btn-in-range'
  if (side === 'max' && min && year === min) return 'yr-btn-in-range'
  return ''
}

function pickYear(field, year) {
  localFilters[field] = year
  openDrop.value = null
  applyFilters()
}

function clearYear(field) {
  localFilters[field] = ''
  openDrop.value = null
  applyFilters()
}

// ── Static data ──────────────────────────────────────────
const makes = ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Nissan', 'Opel', 'Renault', 'Skoda', 'Toyota', 'Volkswagen', 'Volvo']
const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid', 'lpg']
const transmissions = ['manual', 'automatic', 'semiAuto']
const bodyTypes = [
  { val: 'sedan' }, { val: 'suv' }, { val: 'hatchback' },
  { val: 'combi' }, { val: 'coupe' }, { val: 'cabrio' },
  { val: 'van' },   { val: 'pickup' }
]

const sortOptions = computed(() => [
  { val: 'created_at_desc', label: t('inventory.sort.newest') },
  { val: 'created_at_asc',  label: t('inventory.sort.oldest') },
  { val: 'price_asc',       label: t('inventory.sort.priceAsc') },
  { val: 'price_desc',      label: t('inventory.sort.priceDesc') },
  { val: 'year_desc',       label: t('inventory.sort.yearDesc') },
  { val: 'year_asc',        label: t('inventory.sort.yearAsc') },
])

onMounted(() => {
  // ── Apply filters from home page hero search query params ──
  const q = route.query
  let hasQueryFilters = false
  if (q.make) {
    localFilters.make = q.make
    hasQueryFilters = true
  }
  // year_from maps to year_min (single year "from" selection on home page)
  if (q.year_from) {
    localFilters.year_min = String(q.year_from)
    hasQueryFilters = true
  }
  if (hasQueryFilters) {
    carsStore.applyFilters({ ...localFilters })
  } else {
    carsStore.fetchCars()
  }

  // Only activate on mobile widths
  const setupObserver = () => {
    if (window.innerWidth > 768) return
    if (_barObserver) _barObserver.disconnect()
    if (!mobileBarSentinel.value) return
    _barObserver = new IntersectionObserver(
      ([entry]) => { isBarFloating.value = !entry.isIntersecting },
      { threshold: 0, rootMargin: '0px' }
    )
    _barObserver.observe(mobileBarSentinel.value)
  }

  // Measure the bar height before it leaves the flow
  const measureBar = () => {
    if (mobileBarEl.value) {
      mobileBarHeight.value = mobileBarEl.value.offsetHeight
        + parseInt(getComputedStyle(mobileBarEl.value).marginBottom || 0)
    }
  }

  measureBar()
  setupObserver()

  const handleResize = () => {
    measureBar()
    setupObserver()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (_barObserver) _barObserver.disconnect()
  window.removeEventListener('resize', () => {})
})

// ── Price picker helpers ─────────────────────────────────
const pricePresets = [
  { val: 8000,  label: '€8k'  },
  { val: 10000, label: '€10k' },
  { val: 12000, label: '€12k' },
  { val: 15000, label: '€15k' },
  { val: 18000, label: '€18k' },
  { val: 20000, label: '€20k' },
  { val: 25000, label: '€25k' },
  { val: 30000, label: '€30k' },
]

function formatPrice(val) {
  if (!val && val !== 0) return ''
  const n = Number(val)
  if (n >= 1000) return '€' + (n / 1000).toLocaleString('en', { maximumFractionDigits: 1 }) + 'k'
  return '€' + n.toLocaleString('en')
}

function getPriceClass(val, side) {
  const min = localFilters.price_min ? Number(localFilters.price_min) : null
  const max = localFilters.price_max ? Number(localFilters.price_max) : null
  if (side === 'min' && min === val) return 'pr-btn-selected'
  if (side === 'max' && max === val) return 'pr-btn-selected'
  if (min && max && val > min && val < max) return 'pr-btn-in-range'
  return ''
}

function pickPrice(field, val) {
  localFilters[field] = val
  openDrop.value = null
  applyFilters()
}
</script>

<style scoped>
/* ── PAGE WRAPPER ──────────────────────────────────── */
.inv-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* ── HERO BANNER ───────────────────────────────────── */
.inv-hero {
  background: linear-gradient(135deg, #0A4B8C 0%, #0066CC 60%, #1a7fd4 100%);
  padding: calc(var(--nav-height, 72px) + 3.5rem) 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.inv-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.inv-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.inv-hero-label {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.inv-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.inv-hero-sub {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

/* ── BODY SECTION ──────────────────────────────────── */
.inv-body {
  padding: 2.5rem 0 4rem;
  background: var(--bg-secondary);
}

.inv-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── MOBILE FILTER BAR ─────────────────────────────── */

/* Sentinel: zero-height element that triggers the floating state */
.inv-mobile-bar-sentinel {
  display: none;
  height: 0;
  margin: 0;
  padding: 0;
}

.inv-mobile-bar {
  display: none;
  align-items: stretch;
  gap: 0;
  margin-bottom: 1rem;
  padding: 0;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  /* No overflow:hidden — that would clip the sort dropdown menu */
  transition: box-shadow 0.25s ease;
  position: relative;
}

/* ── FLOATING STATE ────────────────────────────────── */
.inv-mobile-bar.floating {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 590;
  width: calc(100% - 2.5rem);
  max-width: 420px;
  margin-bottom: 0;
  border-radius: 999px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: pillRise 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes pillRise {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* ── PILL LEFT HALF: Filters (accent colored) ──────── */
.inv-mobile-filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex: 1;
  padding: 0.7rem 1rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
  /* Round only the left side to match pill shape */
  border-radius: 999px 0 0 999px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;
}

.inv-mobile-filter-btn:hover {
  opacity: 0.9;
}

.inv-mobile-filter-btn[aria-expanded="true"] {
  opacity: 0.85;
}

.inv-mobile-filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* ── DIVIDER ───────────────────────────────────────── */
.inv-bar-divider {
  width: 1.5px;
  align-self: stretch;
  background: var(--border-color);
  flex-shrink: 0;
}

/* ── PILL RIGHT HALF: Sort ─────────────────────────── */
.inv-bar-sort-half {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}

.inv-bar-sort-half .cdd-wrap {
  flex: 1;
}

/* Sort icon */
.inv-sort-icon {
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

/* ── LAYOUT ────────────────────────────────────────── */
.inv-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .inv-layout {
    grid-template-columns: 240px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .inv-layout {
    grid-template-columns: 1fr;
  }
}

/* ── SIDEBAR ───────────────────────────────────────── */
.inv-sidebar {
  position: sticky;
  top: calc(var(--nav-height, 72px) + 1.5rem);
  max-height: calc(100vh - var(--nav-height, 72px) - 3rem);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 16px;
  /* Thin scrollbar for sidebar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.inv-sidebar::-webkit-scrollbar { width: 4px; }
.inv-sidebar::-webkit-scrollbar-track { background: transparent; }
.inv-sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 99px;
}
.inv-sidebar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

.inv-filter-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.inv-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.inv-filter-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-sidebar-close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.inv-sidebar-close:hover {
  background: var(--danger-light, #fee2e2);
  color: var(--danger);
}

.inv-filter-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-filter-title i {
  color: var(--accent);
}

.inv-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: none;
  color: var(--danger);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.inv-reset-btn:hover { opacity: 0.75; }

/* ── FILTER GROUPS ─────────────────────────────────── */
.inv-filter-group {
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.inv-filter-group:last-of-type {
  border-bottom: none;
  margin-bottom: 1rem;
}

.inv-filter-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
}

/* ── FORM INPUTS ───────────────────────────────────── */
.inv-input {
  display: block;
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.inv-input::placeholder { color: var(--text-muted); }

.inv-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--bg-primary);
}

.inv-select {
  display: block;
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2357606a' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 14px 10px;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.inv-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background-color: var(--bg-primary);
}

/* ── SEARCH INPUT ──────────────────────────────────── */
.inv-search-wrap {
  position: relative;
}

.inv-search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.8rem;
  pointer-events: none;
}

.inv-search-input {
  padding-left: 2.25rem;
}

/* ── RANGE ROW ─────────────────────────────────────── */
.inv-range-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-range-row .inv-input {
  flex: 1;
  min-width: 0;
}

.inv-range-sep {
  color: var(--text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* ── YEAR PICKER ────────────────────────────────────────── */
.yr-pick-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.yr-trigger {
  width: 100%;
}

/* Dropdown panel */
.yr-panel {
  display: none;
  position: absolute;
  z-index: 220;
  top: calc(100% + 6px);
  left: 0;
  width: 220px;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 14px;
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  animation: cddFadeIn 0.18s ease;
}

.yr-panel-right {
  left: auto;
  right: 0;
}

.yr-pick-wrap.open .yr-panel {
  display: block;
}

/* Grid: 4 columns of year buttons */
.yr-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  padding: 0.55rem;
  max-height: 224px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.yr-grid::-webkit-scrollbar { width: 4px; }
.yr-grid::-webkit-scrollbar-track { background: transparent; }
.yr-grid::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 99px; }

/* Individual year button */
.yr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  transition: background 0.13s, color 0.13s, transform 0.1s;
  user-select: none;
}

.yr-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--accent);
  transform: scale(1.08);
}

.yr-btn:disabled {
  opacity: 0.28;
  cursor: not-allowed;
  transform: none;
}

/* In-range highlight */
.yr-btn-in-range {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
}

/* Selected (range boundary) */
.yr-btn-selected {
  background: var(--accent) !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 2px 8px var(--accent-glow);
}

/* Placeholder text color in trigger */
.yr-placeholder {
  color: var(--text-muted) !important;
  font-weight: 400 !important;
}

/* Footer with clear link */
.yr-panel-footer {
  border-top: 1px solid var(--border-color);
  padding: 0.4rem 0.55rem;
}

.yr-clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: none;
  color: var(--danger, #ef4444);
  font-size: 0.73rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  border-radius: 6px;
  transition: background 0.15s;
}

.yr-clear-btn:hover {
  background: rgba(239, 68, 68, 0.08);
}

/* ── PRICE PICKER ───────────────────────────────────────── */
/* Wider panel — needs more room for the custom input */
.pr-panel {
  width: 240px;
}

/* 4-column preset grid */
.pr-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  padding: 0.55rem 0.55rem 0.3rem;
}

/* Preset tile */
.pr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  transition: background 0.13s, color 0.13s, transform 0.1s;
  user-select: none;
  white-space: nowrap;
  padding: 0 2px;
}

.pr-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--accent);
  transform: scale(1.06);
}

.pr-btn:disabled {
  opacity: 0.28;
  cursor: not-allowed;
  transform: none;
}

/* In-range highlight */
.pr-btn-in-range {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
}

/* Selected boundary */
.pr-btn-selected {
  background: var(--accent) !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 2px 8px var(--accent-glow);
}

/* Custom value input area */
.pr-custom {
  padding: 0.3rem 0.55rem 0.45rem;
  border-top: 1px solid var(--border-color);
}

.pr-custom-input {
  font-size: 0.8rem;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
}

/* ── APPLY BUTTON ──────────────────────────────────── */
.inv-apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.inv-apply-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--accent-glow);
}

.inv-apply-btn:active { transform: translateY(0); }

/* ── TOOLBAR ───────────────────────────────────────── */
.inv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.inv-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.inv-sort-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-sort-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.inv-sort-select {
  width: auto;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  font-size: 0.82rem;
}

/* ── CUSTOM DROPDOWN ───────────────────────────────── */
.cdd-wrap {
  position: relative;
  width: 100%;
}

/* Trigger button — looks like an input field */
.cdd-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary) !important;
  background: var(--bg-secondary) !important;
  border: 1.5px solid var(--border-color) !important;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  gap: 0.5rem;
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.cdd-trigger:hover {
  border-color: var(--accent) !important;
  background: var(--bg-primary) !important;
}

.cdd-wrap.open .cdd-trigger {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--bg-primary) !important;
}

/* Value text */
.cdd-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary) !important;
  font-weight: 500;
}

.cdd-value.placeholder {
  color: var(--text-secondary) !important;
  font-weight: 400;
}

/* Chevron arrow */
.cdd-arrow {
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.22s ease;
}

.cdd-wrap.open .cdd-arrow {
  transform: rotate(180deg);
  color: var(--accent);
}

/* Dropdown panel */
.cdd-menu {
  display: none;
  position: absolute;
  z-index: 200;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  max-height: 260px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS momentum scroll */
  overscroll-behavior: contain;      /* prevent page scroll bleed */
  touch-action: pan-y;               /* allow vertical swipe inside */
  padding: 0.35rem;
  animation: cddFadeIn 0.18s ease;
}

/* Right-aligned variant — for sort dropdown in toolbar */
.cdd-menu.cdd-menu-right {
  left: auto;
  right: 0;
  min-width: 200px;
}

/* Upward-opening variant — used in floating pill bar */
.cdd-menu.cdd-menu-up {
  top: auto;
  bottom: calc(100% + 6px);
  animation: cddFadeUp 0.18s ease;
}

@keyframes cddFadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cdd-wrap.open .cdd-menu {
  display: block;
}

/* Option rows */
.cdd-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
  padding: 0.5rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  gap: 0.5rem;
  transition: background 0.15s, color 0.15s;
}

.cdd-option:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.cdd-option.selected {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
}

.cdd-option.selected:hover {
  background: var(--accent-light);
}

/* Checkmark icon */
.cdd-check {
  font-size: 0.75rem;
  color: var(--accent);
  flex-shrink: 0;
}

/* Sort dropdown in toolbar — compact width, auto-size */
.cdd-sort {
  width: auto;
  min-width: 180px;
}

.cdd-sort .cdd-trigger {
  min-height: 38px;
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
  border-radius: 8px;
}

/* Sort trigger inside the floating pill — fills the right half */
.inv-mobile-bar .cdd-sort {
  width: 100%;
  min-width: unset;
}

.inv-mobile-bar .cdd-sort .cdd-trigger {
  background: var(--bg-primary) !important;
  border: none !important;
  box-shadow: none !important;
  /* Round only the right side to match pill shape */
  border-radius: 0 999px 999px 0;
  padding: 0.7rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  min-height: unset;
  width: 100%;
  color: var(--text-primary) !important;
}

.inv-mobile-bar .cdd-sort .cdd-trigger:hover {
  background: var(--bg-secondary) !important;
}

.inv-mobile-bar .cdd-sort.open .cdd-trigger {
  background: var(--bg-secondary) !important;
}

/* Scrollbar styling for the dropdown list */
.cdd-menu::-webkit-scrollbar { width: 4px; }
.cdd-menu::-webkit-scrollbar-track { background: transparent; }
.cdd-menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 99px;
}
.cdd-menu::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* Open animation */
@keyframes cddFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .cdd-menu {
    max-height: 220px;
  }

  .cdd-option {
    min-height: 44px;
    font-size: 0.9rem;
  }

  .cdd-sort {
    min-width: 140px;
  }

  /* Show sentinel + mobile filter bar, hide desktop toolbar */
  .inv-mobile-bar-sentinel {
    display: block;
  }

  .inv-mobile-bar {
    display: flex;
  }

  .inv-toolbar {
    display: none;
  }

  /* Add bottom padding to results so floating pill doesn't cover last card */
  .inv-results {
    padding-bottom: 5rem;
  }

  /* Sidebar — bottom-sheet drawer on mobile */
  .inv-sidebar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    z-index: 600;
    max-height: none;
    overflow: visible;
    border-radius: 0;
    /* Hidden state: slid off-screen downward */
    transform: translateY(100%);
    transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
    /* Remove sticky scrollbar styles */
    scrollbar-width: unset;
  }

  .inv-sidebar.mobile-open {
    transform: translateY(0);
  }

  .inv-filter-card {
    border-radius: 20px 20px 0 0;
    max-height: 82svh;
    overflow-y: auto;
    transform: none;
    transition: none;
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.18);
    border-bottom: none;
    padding: 0;
  }

  /* Accent header strip inside the mobile drawer */
  .inv-filter-card .inv-filter-header {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
    border-radius: 20px 20px 0 0;
    padding: 1rem 1.25rem;
    margin-bottom: 0;
    border-bottom: none;
  }

  .inv-filter-card .inv-filter-title {
    color: #ffffff;
  }

  .inv-filter-card .inv-filter-title i {
    color: rgba(255, 255, 255, 0.8);
  }

  .inv-filter-card .inv-reset-btn {
    color: rgba(255, 255, 255, 0.9);
  }

  .inv-filter-card .inv-reset-btn:hover {
    color: #ffffff;
    opacity: 1;
  }

  .inv-sidebar-close {
    display: inline-flex;
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    color: #ffffff !important;
  }

  .inv-sidebar-close:hover {
    background: rgba(255, 255, 255, 0.35) !important;
    color: #ffffff !important;
  }

  /* Filter body — single padded wrapper replaces per-element margins */
  .inv-filter-body {
    padding: 1.25rem 1.25rem 1.5rem;
  }

  .inv-filter-body .inv-apply-btn {
    width: 100%;
    margin-top: 0.25rem;
  }

  /* Overlay background */
  .inv-sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: 599;
    background: rgba(0, 0, 0, 0.5);
    animation: overlayIn 0.25s ease forwards;
  }

  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}

/* ── CHIPS ─────────────────────────────────────────── */
.inv-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.inv-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.inv-chip-remove {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.1rem;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.inv-chip-remove:hover { opacity: 1; }

/* ── EMPTY STATE ───────────────────────────────────── */
.inv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 2rem;
}

.inv-empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--accent);
  margin-bottom: 1.5rem;
}

.inv-empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.inv-empty-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem;
}

/* ── CAR GRID ──────────────────────────────────────── */
.inv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .inv-grid {
    grid-template-columns: 1fr;
  }
}

/* ══════════════════════════════════════════════════════
   DESKTOP COMPARE BAR
   ══════════════════════════════════════════════════════ */
.cmp-bar {
  display: none; /* shown on ≥769px via media query below */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 580;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.10);
  padding: 0.75rem 1.5rem;
}

.cmp-bar-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.cmp-bar-cars {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.cmp-bar-car {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.cmp-bar-car-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.cmp-bar-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 0.65rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.cmp-bar-remove:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.cmp-bar-sep {
  font-size: 0.75rem;
  color: var(--border-color);
  padding: 0 0.4rem;
  user-select: none;
}

.cmp-bar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.cmp-bar-clear {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}

.cmp-bar-clear:hover {
  background: var(--bg-secondary);
  color: var(--danger);
}

.cmp-bar-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
  white-space: nowrap;
}

.cmp-bar-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px var(--accent-glow);
}

.cmp-bar-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* Compare bar slide transition */
.compare-bar-slide-enter-active,
.compare-bar-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.compare-bar-slide-enter-from,
.compare-bar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Show desktop compare bar on large screens */
@media (min-width: 769px) {
  .cmp-bar {
    display: block;
  }

  /* Push page content up so bar doesn't cover last card */
  .inv-results {
    padding-bottom: 5.5rem;
  }
}

/* ══════════════════════════════════════════════════════
   MOBILE COMPARE CARD
   ══════════════════════════════════════════════════════ */
.cmp-mobile-card {
  display: none; /* shown on ≤768px via media query */
  position: fixed;
  bottom: 5.5rem; /* above the floating filter/sort pill */
  right: 1rem;
  z-index: 589;
  background: var(--bg-primary);
  border: 1.5px solid var(--accent);
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  width: 210px;
  flex-direction: column;
  overflow: hidden;
}

/* ── Card header ──────────────────────────────────────── */
.cmp-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  background: var(--accent);
  gap: 0.4rem;
}

.cmp-mobile-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #fff;
}

.cmp-mobile-label i {
  font-size: 0.65rem;
}

.cmp-mobile-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  border-radius: 99px;
}

/* ── Car list ─────────────────────────────────────────── */
.cmp-mobile-list {
  display: flex;
  flex-direction: column;
}

.cmp-mobile-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.cmp-mobile-row:last-child {
  border-bottom: none;
}

.cmp-mobile-car-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.cmp-mobile-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 0.6rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.cmp-mobile-remove:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

/* ── Compare CTA button ───────────────────────────────── */
.cmp-mobile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--accent-light);
  color: var(--accent);
  border: none;
  border-top: 1px solid var(--border-color);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.cmp-mobile-btn:hover:not(:disabled) {
  background: var(--accent);
  color: #fff;
}

.cmp-mobile-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Compare card slide transition */
.compare-card-slide-enter-active,
.compare-card-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.compare-card-slide-enter-from,
.compare-card-slide-leave-to {
  transform: translateY(12px) scale(0.95);
  opacity: 0;
}

/* Show mobile compare card only on small screens */
@media (max-width: 768px) {
  .cmp-mobile-card {
    display: flex;
  }
}
</style>

