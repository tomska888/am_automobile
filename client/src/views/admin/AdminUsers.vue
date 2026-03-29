<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace({ name: 'admin-dashboard' })
})
</script>

<template>
  <div></div>
</template>
