import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import axios from 'axios'

export const useCarsStore = defineStore('cars', () => {
    // ── State ────────────────────────────────────────────────
    const cars = ref([])
    const featuredCars = ref([])
    const latestCar = ref(null)
    const currentCar = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Pagination
    const pagination = reactive({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1
    })

    // Filters
    const filters = reactive({
        search: '',
        make: '',
        model: '',
        year_min: '',
        year_max: '',
        price_min: '',
        price_max: '',
        fuel_type: '',
        transmission: '',
        body_type: '',
        sort: 'created_at_desc'
    })

    // ── Getters ──────────────────────────────────────────────
    const hasResults = computed(() => cars.value.length > 0)
    const activeFilterCount = computed(() => {
        return Object.entries(filters).filter(([key, val]) =>
            key !== 'sort' && val !== ''
        ).length
    })

    // ── Actions ──────────────────────────────────────────────
    async function fetchCars(extraParams = {}) {
        loading.value = true
        error.value = null
        try {
            // Split combined sort value (e.g. 'created_at_desc') into sort + order params
            let sortParam = 'created_at'
            let orderParam = 'DESC'
            if (filters.sort) {
                const lastUnderscore = filters.sort.lastIndexOf('_')
                if (lastUnderscore !== -1) {
                    const dir = filters.sort.slice(lastUnderscore + 1).toUpperCase()
                    if (dir === 'ASC' || dir === 'DESC') {
                        sortParam = filters.sort.slice(0, lastUnderscore)
                        orderParam = dir
                    } else {
                        sortParam = filters.sort
                    }
                }
            }

            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([key, v]) => key !== 'sort' && v !== '')
            )

            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sort: sortParam,
                order: orderParam,
                ...activeFilters,
                ...extraParams
            }
            const { data } = await axios.get('/api/cars', { params })
            // API returns { success, data: [...], pagination: { page, limit, total, totalPages } }
            cars.value = data.data ?? []
            pagination.total = data.pagination?.total ?? 0
            pagination.totalPages = data.pagination?.totalPages ?? 1
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to load cars'
        } finally {
            loading.value = false
        }
    }

    async function fetchFeatured() {
        try {
            // Run both requests in parallel — no sequential dependency / race condition
            const [featuredRes, latestRes] = await Promise.all([
                axios.get('/api/cars', {
                    params: { featured: 'true', limit: 1 }
                }),
                axios.get('/api/cars', {
                    params: { sort: 'created_at', order: 'DESC', limit: 3, status: 'available' }
                })
            ])

            const newFeatured = featuredRes.data.data ?? []
            const latestArr = latestRes.data.data ?? []

            // Determine featured ID from the fresh response (not stale state)
            const featuredId = newFeatured[0]?.id

            // Pick the most recent car that isn't the featured car
            const newLatest = latestArr.find(c => c.id !== featuredId) ?? null

            // Update state atomically after both calls succeed
            featuredCars.value = newFeatured
            latestCar.value = newLatest
        } catch { /* silent */ }
    }

    async function fetchCarById(id) {
        loading.value = true
        error.value = null
        try {
            const { data } = await axios.get(`/api/cars/${id}`)
            // API returns { success, data: {...car} }
            currentCar.value = data.data
            return data.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Car not found'
            return null
        } finally {
            loading.value = false
        }
    }

    // Admin: Create car
    async function createCar(carData) {
        const { data } = await axios.post('/api/cars', carData)
        return data
    }

    // Admin: Update car
    async function updateCar(id, carData) {
        const { data } = await axios.put(`/api/cars/${id}`, carData)
        return data
    }

    // Admin: Delete car
    async function deleteCar(id) {
        await axios.delete(`/api/cars/${id}`)
        cars.value = cars.value.filter(c => c.id !== id)
    }

    function setPage(page) {
        pagination.page = page
        fetchCars()
    }

    function applyFilters(newFilters) {
        Object.assign(filters, newFilters)
        pagination.page = 1
        fetchCars()
    }

    function resetFilters() {
        Object.keys(filters).forEach(k => {
            filters[k] = k === 'sort' ? 'created_at_desc' : ''
        })
        pagination.page = 1
        fetchCars()
    }

    return {
        cars, featuredCars, latestCar, currentCar, loading, error, pagination, filters,
        hasResults, activeFilterCount,
        fetchCars, fetchFeatured, fetchCarById,
        createCar, updateCar, deleteCar,
        setPage, applyFilters, resetFilters
    }
})
