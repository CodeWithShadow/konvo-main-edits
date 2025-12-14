# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview
Konvo is a single-page, static frontend (no bundler) for an anonymous chat + confessions app.

Key characteristics:
- Static entrypoint: `index.html` loads `dist/style.css` and `app.js` (as an ES module).
- Tailwind CSS is compiled locally via the Tailwind CLI from `src/input.css` → `dist/style.css`.
- Runtime backend is Firebase (loaded via ESM CDN imports in `app.js`): anonymous auth + Firestore.
- PWA support via `manifest.json` and a service worker (`sw.js`).
- Deployment configuration is oriented around Vercel via `vercel.json` (includes strict security headers/CSP).

## Common commands
Node requirement is declared in `package.json` (`>=18`).

Install dependencies:
- `npm install`

Build (CSS):
- `npm run build` (runs `tailwindcss -i ./src/input.css -o ./dist/style.css --minify`)

Dev (watch Tailwind output):
- `npm run dev` (runs `tailwindcss ... --watch`)

No repo-provided lint/test commands:
- There is no `lint`, `test`, or `typecheck` script in `package.json`.
- There is no “run a single test” workflow configured.

## High-level architecture
### Frontend structure (no bundler)
- `index.html` is the main document and contains almost all UI markup (header/nav, feed container, forms, modals, context menu).
- `app.js` is the primary application module and owns:
  - app bootstrapping (viewport height fix, Firebase init, auth lifecycle)
  - global state + DOM element registry
  - Firestore reads/writes and realtime listeners
  - UI rendering and interaction logic (chat/confessions view, selection mode, context menu)
  - moderation/admin features (pin/unpin, ban/unban)
- `src/input.css` is the Tailwind entrypoint.
- `dist/style.css` is generated output (Tailwind + custom CSS).

### Firebase / Firestore integration
The app uses Firebase via ESM imports from `https://www.gstatic.com/firebasejs/...` inside `app.js` (no local Firebase SDK dependency).

Conceptual Firestore collections used by the client:
- `chat`: chat messages
- `confessions`: confession posts
- `users`: per-UID user profile (username, profilePhotoURL, lastMessageAt, and possibly admin-controlled fields)
- `typingStatus`: per-UID typing indicator documents
- `pinned_messages`: pinned message metadata (admin only)
- `banned_users`: ban records (admin only)
- `admins`: admin membership list (client checks existence; writes should be locked)

Reference Firestore security rules:
- `firebase-rules.txt` (v2.0 “Hardened”)
- `firebase-databseV2.txt` (v2.2 “Final - All Fixes Applied”)

When changing the Firestore data model or client-side write shapes in `app.js`, verify the corresponding rule expectations (field allowlists, timestamp rules, edit windows, reaction formats, etc.).

### PWA / service worker
- `sw.js` registers a “network-first, fallback-to-cache” strategy for same-origin GET requests.
- `STATIC_ASSETS` and `NO_CACHE_PATTERNS` in `sw.js` control what gets cached (Firebase/network APIs are explicitly excluded).
- `manifest.json` defines basic PWA metadata and uses `icon.jpg` for icons.

### Styling pipeline
- Tailwind config: `tailwind.config.js`.
  - The `content` list is intentionally small (`index.html`, `app.js`), so if you add new HTML/JS files that use Tailwind classes, they must be added there or Tailwind will purge those styles.
- PostCSS config: `postcss.config.js` (Tailwind + autoprefixer; cssnano is conditionally enabled via `NODE_ENV` but the main build currently uses Tailwind’s `--minify`).

## Deployment / security headers (Vercel)
- `vercel.json` defines `buildCommand: "npm run build"` and sets `outputDirectory` to the repo root.
- `vercel.json` also sets multiple security headers, including a strict `Content-Security-Policy`.
  - If you add new external scripts/fonts/endpoints, the CSP `script-src`, `style-src`, `connect-src`, and/or `frame-src` entries may need to be updated accordingly.
