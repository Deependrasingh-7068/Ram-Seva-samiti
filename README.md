# Ram Sewa Samiti — Frontend + Auth Backend

Premium, bilingual (Hindi + English) community-organisation website for
**Ram Sewa Samiti** — Seva • Sanskar • Samarpan.

This build covers the frontend (Phase 1) **plus a minimal auth backend**
(Phase 3, scoped to sign up / sign in only). Content — seva, events,
members, gallery, updates, settings — still lives in `src/data/*.js` as
placeholder objects shaped like future API responses; the CMS, Cloudinary,
donations, and payment gateway are still not wired up.

## What's new in this update

- **`/backend`** — a small Express + MongoDB service that handles
  registration and login only (`POST /api/auth/register`,
  `POST /api/auth/login`, `GET /api/auth/me`). Passwords are hashed with
  bcrypt, sessions are JWTs, and the auth routes are rate-limited.
- **Sign up / sign in popup** — `AuthModal` opens automatically ~1 second
  after a first-time, logged-out visitor lands on the site (once per
  browser session, via `sessionStorage`), and can also be opened anytime
  from the "Sign In" button in the navbar or mobile menu. It's dismissible
  — "Continue browsing without an account" — never a hard block.
- **Notification bell** — top-right of the navbar (`NotificationBell.jsx`),
  with a dropdown of recent updates and an unread-style dot. Swap its
  placeholder feed for `GET /api/notifications` later.
- **Lord Ram hero SVG** — `RamSvg.jsx` replaces the old placeholder
  `<img>` with an inline, respectful line-art illustration (crown, halo,
  bow) in gold linework, so there's no external image dependency for the
  hero visual.

---

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — custom design tokens (colors, fonts) in `tailwind.config.js`
- **React Router 6** — client-side routing across all public pages
- **lucide-react** — icon set
- Animation: plain CSS transitions + `IntersectionObserver` (via custom hooks) for
  scroll-reveals, animated counters, and the preloader sequence. No GSAP
  dependency — everything respects `prefers-reduced-motion`.

## Getting started

### 1. Frontend

```bash
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:5000
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

### 2. Backend (auth only)

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, FRONTEND_URL
npm run dev             # node --watch server.js
```

Requires a running MongoDB instance (local `mongod` or an Atlas cluster —
see comments in `backend/.env.example`). The frontend expects this server
at `VITE_API_URL` (default `http://localhost:5000`).

**Auth endpoints:**

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name?, email, password }` | Password ≥ 6 chars; returns `{ token, name, email }` |
| POST | `/api/auth/login` | `{ email, password }` | Returns `{ token, name, email }` |
| GET | `/api/auth/me` | — (Bearer token) | Used by the frontend to restore a session on reload |

Both `register` and `login` are rate-limited (20 requests / 15 min per IP)
to slow down brute-force attempts. Passwords are hashed with bcrypt and
never stored or returned in plaintext.

## Project structure

```
ram-sewa-samiti/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example          # VITE_API_URL
├── backend/               # Auth-only Express + MongoDB service
│   ├── server.js          # app setup: helmet, cors, mongoose connect, routes
│   ├── routes/auth.js     # register / login / me
│   ├── middleware/auth.js # JWT verification (requireAuth)
│   ├── models/User.js     # name, email, hashed password
│   ├── package.json
│   └── .env.example       # PORT, MONGO_URI, JWT_SECRET, FRONTEND_URL
└── src/
    ├── main.jsx            # React root + BrowserRouter
    ├── App.jsx              # Routes, layout shell, preloader/menu/auth-modal state
    ├── index.css            # Tailwind layers, राम watermark, reveal/reduced-motion CSS
    ├── context/
    │   └── AuthContext.jsx  # user/token state, login/register/logout, session restore
    ├── data/                 # Placeholder content — swap for API calls later
    │   ├── settings.js       # site-wide settings (contact, links, quote)
    │   ├── seva.js
    │   ├── events.js
    │   ├── members.js
    │   ├── gallery.js
    │   └── updates.js
    ├── hooks/
    │   ├── useScrollReveal.js   # IntersectionObserver → .is-visible toggle
    │   ├── useCounter.js        # animated stat counters
    │   ├── useReducedMotion.js  # prefers-reduced-motion listener
    │   └── useScrollNav.js      # navbar scrolled/transparent state
    ├── components/
    │   ├── Navbar.jsx           # now includes NotificationBell + Sign In / account menu
    │   ├── MobileMenu.jsx       # now includes Sign In / Sign out
    │   ├── AnnouncementBar.jsx
    │   ├── AuthModal.jsx        # sign in / sign up popup, calls AuthContext
    │   ├── NotificationBell.jsx # top-right bell + dropdown
    │   ├── Preloader.jsx
    │   ├── Hero.jsx
    │   ├── RamSvg.jsx           # inline Lord Ram line-art illustration
    │   ├── RamBackground.jsx    # राम watermark, used behind select sections
    │   ├── StatsCounter.jsx
    │   ├── SevaCard.jsx
    │   ├── EventCard.jsx
    │   ├── MemberCard.jsx
    │   ├── GalleryGrid.jsx      # masonry grid + category filter + lightbox
    │   ├── DonationChips.jsx
    │   ├── WhatsappBand.jsx
    │   └── Footer.jsx
    └── pages/
        ├── Home.jsx
        ├── About.jsx
        ├── Seva.jsx
        ├── Events.jsx
        ├── EventDetails.jsx      # /events/:slug
        ├── Gallery.jsx
        ├── Members.jsx
        ├── Updates.jsx
        ├── UpdateDetails.jsx     # /updates/:slug
        ├── Donate.jsx
        ├── Volunteer.jsx
        ├── Contact.jsx
        ├── PrivacyPolicy.jsx
        ├── Terms.jsx
        └── NotFound.jsx
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/seva` | Seva |
| `/events` | Events |
| `/events/:slug` | Event detail |
| `/gallery` | Gallery |
| `/members` | Members |
| `/updates` | Updates |
| `/updates/:slug` | Update detail |
| `/donate` | Donate |
| `/volunteer` | Volunteer |
| `/contact` | Contact |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms |
| `*` | 404 Not Found |

## Design tokens

Colors (`tailwind.config.js`): `navy #101c30`, `navy-2 #182a45`,
`saffron #df8a3f`, `saffron-deep #c96e26`, `gold #c8a45e`, `cream #f6efe1`,
`ink #1c2333`.

Fonts (loaded from Google Fonts in `index.html`):
- Hindi display — `Tiro Devanagari Hindi` (`font-hindi`)
- English display — `Cormorant Garamond` (`font-display`, applied to all headings)
- Body — `Work Sans` (`font-body`, default)

## Behavior notes

- **Preloader** — `ॐ → श्री राम → RAM SEWA SAMITI → सेवा • संस्कार • समर्पण`, four
  ~480ms beats, then fades out. Skipped instantly if reduced motion is on.
- **राम watermark** — `RamBackground.jsx` tiles the word at ~3.5% opacity
  behind the Hero and a few section backgrounds; `aria-hidden` so it's
  invisible to assistive tech.
- **Scroll reveals** — `useScrollReveal` toggles an `is-visible` class read
  by the `.reveal` / `.reveal-stagger` CSS in `index.css`.
- **Stat counters** — `useCounter` animates 0 → target once the element
  scrolls into view; jumps straight to the target if reduced motion is on.
  Values in `Home.jsx` are marked as demo figures in the UI itself.
- **Donation chips** — preset ₹101 / ₹501 / ₹1100 / ₹2100 plus a custom
  amount field; fully controlled, ready to feed into a payment-order call.
- **Gallery** — CSS-columns masonry, category filter, and a lightweight
  lightbox with keyboard-free prev/next controls.

## Images

Components reference images under `/assets/...` (e.g.
`/assets/hero/lord-ram-illustration.png`, `/assets/members/president.jpg`,
`/assets/gallery/*.jpg`) which don't exist yet — drop real files into
`public/assets/...` matching those paths, or update the `src` values in
`src/data/*.js` and the relevant components once real photography/
illustration is available.

## What's intentionally NOT in this phase

- Content APIs / Mongoose models for seva, events, members, gallery,
  updates, settings, donations — those still live in `src/data/*.js`
  as placeholders
- Roles (SUPER_ADMIN / ADMIN / EDITOR / etc.) and protected admin routes
- Admin panel (`/admin/*`) and CMS behavior
- Cloudinary upload/media library
- Razorpay/Cashfree payment flow and receipt generation
- Real SEO metadata per route, sitemap, robots.txt

The `Donate`, `Volunteer`, and `Contact` forms still show local UI
feedback on submit only — no network request is made for those yet. Only
sign up / sign in hit a real backend in this build. The `data/` folder's
shape is the contract the future content backend should match.

## Next steps (later phases)

1. Stand up the Express/MongoDB backend and models described in the
   original brief.
2. Replace each `src/data/*.js` import with a `fetch`/`axios` call to the
   matching endpoint (same shape, so components need no changes).
3. Add the admin panel, authentication, and role-based authorization.
4. Wire Cloudinary for the media library and image uploads.
5. Wire Razorpay/Cashfree for donations, with backend-verified payment
   confirmation and receipt generation.
