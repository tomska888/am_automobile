<template>
  <div class="nf-page">
    <div class="nf-content">
      <div class="nf-big-number">404</div>
      <i class="fa-solid fa-car-burst nf-icon"></i>
      <h1 class="nf-title">Page Not Found</h1>
      <p class="nf-subtitle">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="nf-actions">
        <RouterLink to="/" class="btn-am btn-am-primary btn-am-lg">
          <i class="fa-solid fa-house"></i>
          Go Home
        </RouterLink>
        <RouterLink to="/inventory" class="btn-am btn-am-ghost btn-am-lg">
          <i class="fa-solid fa-car"></i>
          Browse Cars
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-dark) 0%, #0a2d6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
}

.nf-content {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nf-big-number {
  font-size: clamp(5rem, 18vw, 8rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1rem;
  color: white;
  opacity: 0.12;
  letter-spacing: -0.05em;
}

.nf-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: var(--accent);
}

.nf-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: white;
  margin: 0 0 1rem;
}

.nf-subtitle {
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.65;
  margin: 0 0 2.5rem;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
</style>
