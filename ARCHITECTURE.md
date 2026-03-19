# AM Automobile — Monorepo Architecture Specification

**Version**: 1.0  
**Architect**: ArchitectUX  
**Date**: 2026-03-18  
**Stack**: Vue.js 3 + Bootstrap 5.3 + FontAwesome 6 + Node.js + Express + MySQL  
**Deployment**: Hostinger (Node.js hosting) + MySQL via phpMyAdmin  

---

## 📁 Monorepo Structure

```
mk/
├── package.json              # Root monorepo — scripts for dev/build/start
├── .env.example              # Environment variable template
├── .gitignore
├── README.md
├── ARCHITECTURE.md           # This file
│
├── client/                   # Vue.js 3 SPA Frontend
│   ├── package.json          # Vite + Vue 3 + Vue Router + Vue i18n + Pinia
│   ├── vite.config.js        # Vite config with proxy to server:3000
│   ├── index.html            # SPA entry point
│   └── src/
│       ├── main.js           # App bootstrap: Vue + Router + Pinia + i18n
│       ├── App.vue           # Root component with router-view
│       ├── router/
│       │   └── index.js      # Vue Router routes definition
│       ├── stores/           # Pinia state management
│       │   ├── auth.js       # Auth state (user, token, login/logout)
│       │   ├── cars.js       # Cars list, filters, pagination
│       │   └── ui.js         # Theme, language, loading states
│       ├── i18n/             # Internationalisation
│       │   ├── index.js      # Vue i18n setup
│       │   ├── pl.js         # Polish translations (default)
│       │   ├── en.js         # English translations
│       │   ├── lt.js         # Lithuanian translations
│       │   └── ru.js         # Russian translations
│       ├── assets/
│       │   ├── css/
│       │   │   ├── design-system.css   # CSS variables, tokens, theme system
│       │   │   ├── layout.css          # Container, grid, section patterns
│       │   │   ├── components.css      # Cards, modals, badges, buttons
│       │   │   ├── utilities.css       # Helper classes
│       │   │   └── main.css            # Global imports + base styles
│       │   └── img/
│       │       └── logo.svg
│       ├── components/       # Reusable Vue components
│       │   ├── layout/
│       │   │   ├── AppHeader.vue       # NordVPN-style navbar
│       │   │   ├── AppFooter.vue       # Dark multi-column footer
│       │   │   └── ThemeToggle.vue     # Light/Dark/System toggle
│       │   ├── ui/
│       │   │   ├── CarCard.vue         # Car listing card
│       │   │   ├── CarModal.vue        # Car detail modal
│       │   │   ├── ContactModal.vue    # Contact form modal
│       │   │   ├── ConfirmModal.vue    # Delete confirmation modal
│       │   │   ├── LangDropdown.vue    # Language selector
│       │   │   ├── Pagination.vue      # Page navigation
│       │   │   └── LoadingSpinner.vue  # Loading state
│       │   └── admin/
│       │       ├── AdminSidebar.vue    # Admin navigation sidebar
│       │       ├── StatsCard.vue       # Dashboard metric card
│       │       └── CarForm.vue         # Add/Edit car form
│       └── views/            # Page-level Vue components
│           ├── HomeView.vue            # Main landing page
│           ├── InventoryView.vue       # Car inventory + filters
│           ├── AboutView.vue           # About company
│           ├── ContactView.vue         # Contact + map + modal
│           ├── LoginView.vue           # Login form
│           ├── RegisterView.vue        # Register form
│           ├── AdminView.vue           # Admin panel wrapper
│           ├── admin/
│           │   ├── AdminDashboard.vue  # Stats overview
│           │   ├── AdminCars.vue       # Car CRUD management
│           │   ├── AdminMessages.vue   # Contact inbox
│           │   └── AdminUsers.vue      # User management
│           └── legal/
│               ├── TosView.vue         # Terms of Service
│               ├── PrivacyView.vue     # Privacy Policy
│               └── CookiesView.vue     # Cookie Policy
│
└── server/                   # Node.js + Express Backend API
    ├── package.json          # Express + mysql2 + bcrypt + jsonwebtoken + cors
    ├── server.js             # Express app entry point
    ├── .env                  # DB credentials (gitignored)
    ├── config/
    │   ├── db.js             # MySQL connection pool (mysql2/promise)
    │   └── app.js            # Express config, CORS, middleware
    ├── middleware/
    │   ├── auth.js           # JWT verification middleware
    │   └── adminOnly.js      # Admin role guard
    ├── routes/
    │   ├── auth.js           # POST /api/auth/login|register|logout|me
    │   ├── cars.js           # GET/POST/PUT/DELETE /api/cars
    │   ├── contact.js        # POST /api/contact
    │   ├── messages.js       # GET/PUT /api/messages (admin)
    │   └── stats.js          # GET /api/stats (admin)
    └── database/
        └── schema.sql        # Full MySQL schema + seed data
```

---

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (local) or use XAMPP/WAMP
- npm 9+

### Quick Start
```bash
cd mk
npm install          # install root deps (concurrently)
npm run setup        # install client + server deps
npm run dev          # starts both client (Vite :5173) and server (:3000)
```

### Scripts (root package.json)
| Script | Description |
|---|---|
| `npm run dev` | Runs client (Vite) + server (nodemon) concurrently |
| `npm run setup` | Installs deps in client/ and server/ |
| `npm run build` | Builds Vue.js SPA to client/dist/ |
| `npm run start` | Production: starts server only (serves built client) |

---

## 🌐 API Architecture

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

### Vite Proxy (dev only)
```js
// vite.config.js — proxies /api to Express server
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### Authentication Flow
1. User POSTs credentials to `/api/auth/login`
2. Server validates, returns `{ user, token }` (JWT, 7d expiry)
3. Token stored in `localStorage` via Pinia `auth` store
4. All protected requests: `Authorization: Bearer <token>` header
5. Server middleware verifies JWT on protected routes
6. Admin routes additionally check `user.role === 'admin'`

---

## 🎨 Design System

### Color Palette
| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--bg-primary` | `#FFFFFF` | `#0d1117` | Page background |
| `--bg-secondary` | `#F8FAFC` | `#161b22` | Card/section bg |
| `--bg-tertiary` | `#E8F4FD` | `#1c2128` | Subtle highlights |
| `--text-primary` | `#0d1117` | `#E6EDF3` | Body text |
| `--text-secondary` | `#57606a` | `#8b949e` | Muted/labels |
| `--primary-dark` | `#0A4B8C` | `#1d6fa8` | Nav, primary buttons |
| `--primary` | `#0066CC` | `#2188ff` | Brand blue |
| `--accent` | `#007BFF` | `#58a6ff` | CTAs, links, focus |
| `--accent-hover` | `#0056B3` | `#1f6feb` | Hover states |
| `--border-color` | `#E1E8F0` | `#30363d` | Borders, dividers |
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,0.08)` | `0 1px 4px rgba(0,0,0,0.3)` | Subtle shadow |
| `--shadow-md` | `0 4px 16px rgba(0,102,204,0.12)` | `0 4px 16px rgba(0,0,0,0.4)` | Card shadow |
| `--shadow-lg` | `0 8px 32px rgba(0,102,204,0.18)` | `0 8px 32px rgba(0,0,0,0.5)` | Hover/modal shadow |

### Border Radius Scale
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Inputs, small elements |
| `--radius-md` | `12px` | Form inputs, chips |
| `--radius-lg` | `16px` | Cards |
| `--radius-xl` | `24px` | Modals, large cards |
| `--radius-pill` | `50px` | CTA buttons |

### Typography Scale (Inter font)
| Token | Size | Usage |
|---|---|---|
| `--text-xs` | `0.75rem / 12px` | Labels, captions |
| `--text-sm` | `0.875rem / 14px` | Secondary text |
| `--text-base` | `1rem / 16px` | Body text |
| `--text-lg` | `1.125rem / 18px` | Lead text |
| `--text-xl` | `1.25rem / 20px` | H4, card titles |
| `--text-2xl` | `1.5rem / 24px` | H3, section subtitles |
| `--text-3xl` | `1.875rem / 30px` | H2 section headings |
| `--text-4xl` | `2.25rem / 36px` | H1 page titles |
| `--text-hero` | `3.5rem / 56px` | Hero headlines |

### Spacing System (8pt grid)
| Token | Value |
|---|---|
| `--space-1` | `0.25rem / 4px` |
| `--space-2` | `0.5rem / 8px` |
| `--space-3` | `0.75rem / 12px` |
| `--space-4` | `1rem / 16px` |
| `--space-6` | `1.5rem / 24px` |
| `--space-8` | `2rem / 32px` |
| `--space-12` | `3rem / 48px` |
| `--space-16` | `4rem / 64px` |
| `--space-20` | `5rem / 80px` |
| `--space-24` | `6rem / 96px` |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Strategy |
|---|---|---|
| Mobile | `< 576px` | Single column, full-width cards |
| Tablet | `576px – 991px` | 2-column grid, collapsible nav |
| Desktop | `992px – 1279px` | 3-column grid, full nav |
| Large | `≥ 1280px` | 4-column grid, max-width container |

### Container Max-Widths
- `--container-sm`: `540px`
- `--container-md`: `720px`
- `--container-lg`: `960px`
- `--container-xl`: `1140px`
- `--container-2xl`: `1320px`

---

## 🧩 Component Specifications

### AppHeader (NordVPN-style)
- Fixed top, `height: 72px`, `z-index: 1000`
- **Hero pages** (Home): transparent → solid `#0A4B8C` at 80px scroll
- **Non-hero pages**: always solid `#0A4B8C`
- Logo: FontAwesome `fa-car` + "AM Automobile" wordmark
- Nav links: Home, Inventory, About, Contact
- Right cluster: LangDropdown + ThemeToggle + Sign In (ghost) + Browse Cars (pill CTA)
- Mobile: hamburger collapse, full-width dropdown menu

### AppFooter (NordVPN dark)
- Background: `#0d1117`, text: `#8b949e`
- **5 columns**:
  1. Logo + tagline + social icons (FA)
  2. Company (About, Team, Careers, Blog)
  3. Inventory (All Cars, By Make, By Type, Featured)
  4. Support (Contact, FAQ, Financing, Test Drive)
  5. Legal (ToS, Privacy, Cookies) + Newsletter signup
- Bottom bar: `©2025 AM Automobile` + language links + tagline

### CarCard
- `border-radius: var(--radius-lg)` (16px)
- Image top (aspect-ratio 16:9), badge overlay (Featured/New Arrival/Best Deal)
- Body: Make/Model/Year, price (large, blue), key specs row (FA icons)
- CTA: "View Details" pill button → opens CarModal

### CarModal
- `border-radius: var(--radius-xl)` (24px)
- Backdrop: `rgba(0,0,0,0.6) + blur(8px)`
- Image gallery (main + thumbnails), full specs table, contact CTA

### ContactModal
- Same modal styling
- Form: Name, Email, Phone, Subject, Message
- Submit → POST /api/contact → success toast

### ThemeToggle
- 3-option pill: ☀️ Light | 💻 System | 🌙 Dark
- Active option: filled blue background
- Persisted to `localStorage`

### LangDropdown
- Flag emoji + language code
- Dropdown: 🇵🇱 Polski | 🇬🇧 English | 🇱🇹 Lietuvių | 🇷🇺 Русский
- Persisted to `localStorage`, updates `vue-i18n` locale

---

## 🛡️ Admin Panel Structure

### Layout
- Sidebar navigation (desktop) / top tabs (mobile)
- Protected route: redirects to /login if not authenticated + admin role

### Sections
1. **Dashboard** — stat cards: Total Cars, Available, Sold, Users, Messages
2. **Car Management** — sortable table, add/edit modal (CarForm), delete confirm
3. **Messages** — inbox table, mark read/replied, view full message
4. **User Management** — table, toggle active/inactive, role display

---

## 🌍 i18n Structure

### Supported Locales
| Code | Language | Flag | Default |
|---|---|---|---|
| `pl` | Polish | 🇵🇱 | ✅ Yes |
| `en` | English | 🇬🇧 | No |
| `lt` | Lithuanian | 🇱🇹 | No |
| `ru` | Russian | 🇷🇺 | No |

### Key Translation Namespaces
- `nav.*` — Navigation labels
- `home.*` — Landing page content
- `inventory.*` — Car listing labels, filter labels
- `car.*` — Car detail fields
- `contact.*` — Contact page + form labels
- `about.*` — About page content
- `auth.*` — Login/Register form labels + validation
- `admin.*` — Admin panel labels
- `footer.*` — Footer column headings + links
- `legal.*` — ToS, Privacy, Cookies page titles
- `common.*` — Shared: buttons, errors, success messages

---

## 🚀 Deployment — Hostinger Production

### Build Process
```bash
cd mk
npm run build   # Vite builds client/src → client/dist/
```

### Server Setup (Hostinger Node.js)
1. Upload `server/` and `client/dist/` via FTP or Git
2. Set Node.js version to 18+ in Hostinger panel
3. Set environment variables in Hostinger panel (or `.env` file)
4. Server serves `client/dist/` as static + `/api` routes
5. MySQL: create DB in cPanel → import `server/database/schema.sql`

### Environment Variables
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=am_automobile
DB_USER=db_user
DB_PASSWORD=db_password
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://yourdomain.com
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@amautomobile.com
SMTP_PASS=email_password
```

---

## 📋 Implementation Priority Order

1. **Foundation**: `design-system.css`, `layout.css`, `main.css`
2. **App Shell**: `App.vue`, `router/index.js`, `main.js`
3. **Stores**: `auth.js`, `cars.js`, `ui.js`
4. **i18n**: All 4 locale files
5. **Layout Components**: `AppHeader.vue`, `AppFooter.vue`, `ThemeToggle.vue`
6. **Views**: Home → Inventory → About → Contact → Login → Register → Admin
7. **Backend**: `server.js`, DB config, all routes
8. **Database**: Schema + seed data
9. **Build Config**: `vite.config.js`, root `package.json`
10. **Deployment Docs**: README, .env.example

---

*Foundation established by ArchitectUX — ready for Frontend Developer and Backend Architect implementation.*
