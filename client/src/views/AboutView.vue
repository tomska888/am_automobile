<template>
  <div class="about-page">
    <AppHeader />

    <!-- Hero Banner -->
    <section class="about-hero">
      <div class="about-hero-inner">
        <span class="about-hero-label">
          <i class="fa-solid fa-building me-2"></i>{{ $t('about.story.label') }}
        </span>
        <h1 class="about-hero-title">{{ $t('about.title') }}</h1>
        <p class="about-hero-sub">{{ $t('about.subtitle') }}</p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="about-section about-section-primary">
      <div class="about-container">
        <div class="about-story-grid">

          <!-- Text -->
          <div class="about-story-text">
            <span class="about-section-label">{{ $t('about.story.label') }}</span>
            <h2 class="about-section-title">{{ $t('about.story.title') }}</h2>
            <p class="about-body-text">{{ $t('about.story.text1') }}</p>
            <p class="about-body-text">{{ $t('about.story.text2') }}</p>

            <div class="about-stats-row">
              <div class="about-stat-item">
                <span class="about-stat-num">10+</span>
                <span class="about-stat-lbl">{{ $t('home.hero.stats.years') }}</span>
              </div>
              <div class="about-stat-divider"></div>
              <div class="about-stat-item">
                <span class="about-stat-num">1200+</span>
                <span class="about-stat-lbl">{{ $t('home.hero.stats.customers') }}</span>
              </div>
              <div class="about-stat-divider"></div>
              <div class="about-stat-item">
                <span class="about-stat-num">250+</span>
                <span class="about-stat-lbl">{{ $t('home.hero.stats.cars') }}</span>
              </div>
            </div>
          </div>

          <!-- Visual Card -->
          <div class="about-visual-card">
            <div class="about-visual-inner">
              <div class="about-visual-icon">
                <i class="fa-solid fa-car-side"></i>
              </div>
              <div class="about-visual-stars">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p class="about-visual-caption">Trusted by 1200+ customers</p>
              <div class="about-visual-badges">
                <span class="about-vbadge"><i class="fa-solid fa-shield-halved"></i> Certified</span>
                <span class="about-vbadge"><i class="fa-solid fa-award"></i> Top Rated</span>
                <span class="about-vbadge"><i class="fa-solid fa-leaf"></i> Eco-friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="about-section about-section-secondary">
      <div class="about-container">
        <div class="about-section-head">
          <span class="about-section-label">{{ $t('about.values.label') }}</span>
          <h2 class="about-section-title centered">{{ $t('about.values.title') }}</h2>
        </div>

        <div class="about-values-grid">
          <div v-for="val in values" :key="val.icon" class="about-value-card">
            <div class="about-value-icon">
              <i :class="val.icon"></i>
            </div>
            <h3 class="about-value-title">{{ val.title }}</h3>
            <p class="about-value-desc">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="about-section about-section-primary">
      <div class="about-container">
        <div class="about-section-head">
          <span class="about-section-label">{{ $t('about.team.label') }}</span>
          <h2 class="about-section-title centered">{{ $t('about.team.title') }}</h2>
        </div>

        <div class="about-team-grid">
          <div v-for="member in team" :key="member.name" class="about-team-card">
            <div class="about-team-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3 class="about-team-name">{{ member.name }}</h3>
            <p class="about-team-role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="about-cta">
      <div class="about-container">
        <div class="about-cta-inner">
          <h2 class="about-cta-title">Ready to find your car?</h2>
          <p class="about-cta-sub">Browse our full inventory or get in touch with our team.</p>
          <div class="about-cta-buttons">
            <RouterLink :to="{ name: 'inventory' }" class="about-btn-primary">
              <i class="fa-solid fa-car"></i>
              {{ $t('nav.browseCars') }}
            </RouterLink>
            <RouterLink :to="{ name: 'contact' }" class="about-btn-ghost">
              <i class="fa-solid fa-envelope"></i>
              {{ $t('nav.contact') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const values = [
  { icon: 'fa-solid fa-magnifying-glass-chart', title: 'Quality Assurance',  desc: 'Every vehicle is thoroughly inspected before listing.' },
  { icon: 'fa-solid fa-handshake',              title: 'Honest Dealings',     desc: 'No hidden fees. Transparent pricing always.' },
  { icon: 'fa-solid fa-users',                  title: 'Customer First',      desc: 'Your satisfaction is our top priority.' },
  { icon: 'fa-solid fa-leaf',                   title: 'Sustainability',       desc: 'We actively promote eco-friendly vehicle options.' }
]

const team = [
  { name: 'Andrzej Malinowski', role: 'Founder & CEO' },
  { name: 'Monika Kowalska',    role: 'Sales Manager' },
  { name: 'Piotr Wiśniewski',  role: 'Finance Specialist' },
  { name: 'Anna Nowak',         role: 'Customer Relations' }
]
</script>

<style scoped>
/* ── PAGE ──────────────────────────────────────────── */
.about-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* ── HERO ──────────────────────────────────────────── */
.about-hero {
  background: linear-gradient(135deg, #0A4B8C 0%, #0066CC 60%, #1a7fd4 100%);
  padding: calc(var(--nav-height, 72px) + 3.5rem) 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.about-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.about-hero-label {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.about-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.about-hero-sub {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.78);
  margin: 0;
}

/* ── SECTIONS ──────────────────────────────────────── */
.about-section {
  padding: 5rem 1.5rem;
}

.about-section-primary {
  background: var(--bg-primary);
}

.about-section-secondary {
  background: var(--bg-secondary);
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
}

.about-section-head {
  text-align: center;
  margin-bottom: 3.5rem;
}

.about-section-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-light);
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 0.85rem;
}

.about-section-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.about-section-title.centered {
  text-align: center;
}

/* ── STORY GRID ────────────────────────────────────── */
.about-story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 900px) {
  .about-story-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.about-body-text {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0 0 1.25rem;
}

/* ── STATS ROW ─────────────────────────────────────── */
.about-stats-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.about-stat-item {
  display: flex;
  flex-direction: column;
}

.about-stat-num {
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
}

.about-stat-lbl {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 0.3rem;
}

.about-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
  flex-shrink: 0;
}

/* ── VISUAL CARD ───────────────────────────────────── */
.about-visual-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.about-visual-inner {
  padding: 3rem 2rem;
  text-align: center;
}

.about-visual-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: var(--accent);
  margin: 0 auto 1.5rem;
}

.about-visual-stars {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  color: #ffc107;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.about-visual-caption {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 2rem;
}

.about-visual-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
}

.about-vbadge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
}

.about-vbadge i { color: var(--accent); }

/* ── VALUES GRID ───────────────────────────────────── */
.about-values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.about-value-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  transition: transform 0.25s, box-shadow 0.25s;
}

.about-value-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.about-value-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--accent);
  margin-bottom: 1.25rem;
}

.about-value-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.6rem;
}

.about-value-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* ── TEAM GRID ─────────────────────────────────────── */
.about-team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.about-team-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.25s, box-shadow 0.25s;
}

.about-team-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.about-team-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--accent);
  margin: 0 auto 1rem;
  border: 2px solid var(--border-color);
}

.about-team-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.3rem;
}

.about-team-role {
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  margin: 0;
}

/* ── CTA SECTION ───────────────────────────────────── */
.about-cta {
  background: linear-gradient(135deg, #0A4B8C 0%, #0066CC 100%);
  padding: 5rem 1.5rem;
}

.about-cta-inner {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.about-cta-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.75rem;
}

.about-cta-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.78);
  margin: 0 0 2.5rem;
}

.about-cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.about-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: #ffffff;
  color: var(--primary-dark);
  border: none;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.about-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  color: var(--primary-dark);
}

.about-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}

.about-btn-ghost:hover {
  border-color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.1);
  color: #ffffff;
}
</style>
