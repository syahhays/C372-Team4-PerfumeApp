### Purpose
This file helps AI coding agents quickly become productive in this repo by outlining the app structure, runtime commands, coding patterns, and important files to inspect.

### Big picture
- **Framework:** Small Express (v5) MVC-style app using EJS views. Entry point: [app.js](app.js).
- **Routing & controllers:** Routes are defined in [app.js](app.js) and delegate to controller modules in `controllers/` (e.g., [controllers/PerfumeController.js](controllers/PerfumeController.js)).
- **Data layer:** Simple callback-based DAO pattern using `mysql2` in [db.js](db.js). Models under `models/` call `db.query(...)` and accept callbacks (no promises).
- **Views/static:** Server-side rendered EJS templates in `views/`; static assets under `public/` (images uploaded to `public/images` via `multer`).

### Key runtime & developer workflows
- Required env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (loaded via `.env` in [db.js](db.js)).
- Typical dev run (no `start` script present):
  - Install: `npm install`
  - Run: `node app.js` or `npx nodemon app.js`
- Server default port: `3000` (see [app.js](app.js)).

### Coding conventions & patterns to follow
- Controllers return HTTP responses directly (use `res.render`, `res.redirect`, or flash+redirect). Mirror this style when adding features.
- Authentication state is kept on `req.session.user` and shaped as `{ userId, name, email, contact, role }` (see [controllers/UserController.js](controllers/UserController.js)). Always guard routes using `checkAuthenticated` and `checkAuthorised` from [middleware.js](middleware.js) where appropriate.
- Models use callbacks: implement new model functions using `db.query(sql, params, callback)` and follow existing parameter/return patterns (see [models/Perfume.js](models/Perfume.js)).
- Flash messages: use `req.flash('success'|'error', message)` and views expect `messages`/`errors` via `res.locals` (set up in [app.js](app.js)).
- File uploads: `multer` stores uploads to `public/images` and uses `file.originalname` (see [app.js](app.js)). Be cautious about filename collisions and sanitize names if adding features.

### Tests, build, and CI
- There are no tests or CI config currently. Keep changes small and manual-run locally. If adding CI, ensure `npm test` is defined in `package.json` and DB environment is stubbed or uses a test DB.

### Integration & important cross-cutting details
- Sessions use `express-session` with an in-memory store; not production-ready. Note session cookie TTL in [app.js](app.js).
- DB connection is created in [db.js](db.js) and logs connection success/failure on startup. Any code that runs before DB connection should handle `db` errors.
- Routes sometimes accept both `GET` and `POST` variants (see `/addPerfume`, `/cart/add/:id`) — keep parameter handling consistent across both.

### What to inspect first when making changes
- [app.js](app.js) — routing, middleware wiring, uploads, session/flash setup.
- [db.js](db.js) and `.env` — DB connectivity.
- `controllers/` — controller patterns (error handling, redirects, flash messages).
- `models/` — SQL patterns and callback signatures.
- `views/partials/` — common UI pieces (`adminNavbar.ejs`, `customerNavbar.ejs`) to update when UI changes.

### Example tasks & how to approach them
- Add a new route with DB-backed model:
  1. Add model method in `models/` using `db.query(sql, params, callback)`.
  2. Add controller method in `controllers/` that calls the model and uses `req.flash` + `res.redirect` or `res.render`.
  3. Register route in [app.js](app.js) and protect with `checkAuthenticated`/`checkAuthorised` if needed.

If anything here is unclear or you want the file to emphasize other areas (e.g., tests, CI, or security hardening), tell me which parts to expand and I'll iterate.
