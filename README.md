# 🚗 AM Automobile

Full-stack car dealership web application built with **Vue 3 + Express + MySQL**.

---

## 📁 Project Structure

```
mk/
├── client/                    # Vue 3 SPA (Vite)
│   ├── src/
│   │   ├── assets/css/        # Design system, layout, components, utilities
│   │   ├── components/
│   │   │   ├── layout/        # AppHeader, AppFooter, ThemeToggle, LangDropdown
│   │   │   ├── ui/            # CarCard, ContactModal, Pagination, LoadingSpinner
│   │   │   └── admin/         # CarForm (admin modal)
│   │   ├── i18n/              # pl, en, lt, ru translations
│   │   ├── router/            # Vue Router with guards
│   │   ├── stores/            # Pinia: auth, cars, ui
│   │   └── views/
│   │       ├── admin/         # Dashboard, Cars, Messages, Users
│   │       └── legal/         # ToS, Privacy, Cookies
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Node.js + Express API
│   ├── config/
│   │   ├── app.js             # Express middleware setup
│   │   └── db.js              # MySQL connection pool
│   ├── database/
│   │   └── schema.sql         # Full schema + seed data
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── adminOnly.js       # Admin role guard
│   ├── routes/
│   │   ├── auth.js            # POST /login, /register, GET /me
│   │   ├── cars.js            # CRUD /cars + filters
│   │   ├── contact.js         # POST /contact (rate limited)
│   │   ├── messages.js        # Admin: GET/PATCH/DELETE /messages
│   │   ├── stats.js           # Admin: GET /stats
│   │   └── users.js           # Admin: CRUD /users
│   ├── package.json
│   └── server.js              # Entry point
│
├── .env.example               # Environment template
├── .gitignore
├── ARCHITECTURE.md            # Full technical spec
├── package.json               # Root monorepo (concurrently)
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites

- **Node.js** 18+
- **MySQL** 8.0+ or **XAMPP** with MySQL
- **npm** 9+

### 1. Clone & Install

```bash
# From the project root (am automobile/)
cd mk
npm install          # installs concurrently at root
npm run install:all  # installs client + server dependencies
```

Or manually:
```bash
cd mk/client && npm install
cd ../server && npm install
```

### 2. Database Setup

```bash
# Start MySQL, then import the schema:
mysql -u root -p < server/database/schema.sql

# Or open phpMyAdmin → Import → select schema.sql
```

### 3. Environment Variables

```bash
cp .env.example server/.env
# Edit server/.env with your DB credentials
```

Minimum required settings in `server/.env`:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=am_automobile
JWT_SECRET=your-64-char-random-string-here
CORS_ORIGIN=http://localhost:5173
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run Development Servers

```bash
# From mk/ directory — starts BOTH client (:5173) and server (:3000)
npm run dev
```

Or separately:
```bash
# Terminal 1 — Vite dev server
cd mk/client && npm run dev

# Terminal 2 — Express with nodemon
cd mk/server && npm run dev
```

Open **http://localhost:5173** in your browser.

**Default admin credentials:**
- Email: `admin@amautomobile.pl`
- Password: `Admin1234!`

> ⚠️ Change the admin password immediately after first login!

---

## 🏗️ Build for Production

```bash
cd mk
npm run build
```

This runs `vite build` which outputs the SPA to `server/public/`. The Express server then serves static files + API from a single process.

---

## 🚀 Deployment to Hostinger

### Option A: Node.js Hosting (Recommended)

1. **Database**: Hostinger cPanel → MySQL Databases
   - Create database: `u123_am_automobile`
   - Create user with ALL PRIVILEGES
   - Import `schema.sql` via phpMyAdmin

2. **Environment**: Create `server/.env` with production values:
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=localhost
   DB_USER=u123_youruser
   DB_PASSWORD=StrongPassword123!
   DB_NAME=u123_am_automobile
   JWT_SECRET=your-64-char-secret
   CORS_ORIGIN=https://yourdomain.pl
   ```

3. **Build & Upload**:
   ```bash
   npm run build          # builds client → server/public/
   ```
   Upload the `server/` folder (including `public/`) to Hostinger via FTP or Git.

4. **Start server**: Hostinger Node.js panel → Entry point: `server.js`

### Option B: Shared Hosting (Static + External API)

If Hostinger plan doesn't support Node.js:
- Deploy `client/dist/` as static files
- Host the Express API on Railway, Render, or Fly.io (free tier)
- Update `CORS_ORIGIN` and API base URL accordingly

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | User | Get current user |
| PUT | `/api/auth/me` | User | Update profile |
| POST | `/api/auth/change-password` | User | Change password |
| GET | `/api/cars` | — | List cars (filterable) |
| GET | `/api/cars/makes` | — | Distinct makes list |
| GET | `/api/cars/:id` | — | Single car detail |
| POST | `/api/cars` | Admin | Add new car |
| PUT | `/api/cars/:id` | Admin | Update car |
| DELETE | `/api/cars/:id` | Admin | Delete car |
| POST | `/api/contact` | — | Submit contact form |
| GET | `/api/messages` | Admin | List messages |
| PATCH | `/api/messages/:id/read` | Admin | Mark read |
| DELETE | `/api/messages/:id` | Admin | Delete message |
| GET | `/api/stats` | Admin | Dashboard stats |
| GET | `/api/stats/monthly` | Admin | Monthly chart data |
| GET | `/api/users` | Admin | List users |
| PUT | `/api/users/:id` | Admin | Update user |
| PATCH | `/api/users/:id/toggle-active` | Admin | Toggle active status |
| DELETE | `/api/users/:id` | Admin | Delete user |
| GET | `/api/health` | — | Health check |

### Car Filters (GET `/api/cars`)

| Param | Type | Example |
|-------|------|---------|
| `search` | string | `BMW` |
| `make` | string | `Toyota` |
| `fuel_type` | string | `electric` |
| `body_type` | string | `suv` |
| `transmission` | string | `automatic` |
| `year_min` | number | `2020` |
| `year_max` | number | `2024` |
| `price_min` | number | `50000` |
| `price_max` | number | `200000` |
| `mileage_max` | number | `100000` |
| `status` | string | `available` |
| `featured` | boolean | `true` |
| `sort` | string | `price` |
| `order` | string | `ASC` |
| `page` | number | `1` |
| `limit` | number | `12` |

---

## 🌍 Supported Languages

| Code | Language |
|------|----------|
| `pl` | Polski (default) |
| `en` | English |
| `lt` | Lietuvių |
| `ru` | Русский |

Language selection is persisted in `localStorage`.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary color | `#007BFF` |
| Border radius (modals) | `24px` |
| Border radius (inputs) | `12px` |
| Border radius (buttons) | `50px` (pill) |
| Spacing unit | 8pt grid |
| Themes | Light / Dark / System |

CSS architecture:
- [`design-system.css`](client/src/assets/css/design-system.css) — variables & tokens
- [`layout.css`](client/src/assets/css/layout.css) — grid & container system
- [`components.css`](client/src/assets/css/components.css) — all component styles
- [`utilities.css`](client/src/assets/css/utilities.css) — helper classes

---

## 🔒 Security Features

- JWT tokens with configurable expiry
- bcrypt password hashing (rounds: 12)
- Rate limiting on all API endpoints (stricter on auth + contact)
- Helmet.js security headers
- CORS origin whitelist
- SQL injection prevention via parameterised queries
- Input validation via express-validator
- Admin cannot deactivate/delete their own account
- Email enumeration protection on login

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, Vite 5, Vue Router 4, Pinia, Vue i18n |
| Styling | Custom CSS design system + Bootstrap 5.3 (CDN) |
| Icons | FontAwesome 6 Free (CDN) |
| Backend | Node.js 18+, Express 4 |
| Database | MySQL 8 / MariaDB 10.3+ |
| Auth | JWT + bcryptjs |
| Dev | concurrently, nodemon, Vite HMR |

---

## 🐛 Troubleshooting

**`Cannot connect to MySQL`**
- Check `DB_*` values in `server/.env`
- Ensure MySQL service is running
- Try `mysql -u root -p` to verify credentials

**`CORS error` in browser**
- Check `CORS_ORIGIN` matches exactly what the browser shows (no trailing slash)

**`Token expired` on reload**
- Normal after 7 days. Re-login or increase `JWT_EXPIRES_IN` in `.env`

**Vite proxy 502 Bad Gateway**
- Ensure the Express server is running on port 3000
- Check `vite.config.js` proxy target matches `PORT` in `.env`

---

*AM Automobile — Built with ❤️ using Vue 3 + Express + MySQL*
