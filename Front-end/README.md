# Frontend Backend Configuration (API Guide Sync)

This frontend is configured to match the backend API contract documented for auth, admin dashboard, uploads, courses, signed video URLs, and progression.

## 1) Base URL Configuration

Edit `Front-end/.env`:

```env
BACK_URL=
BACK_URL_LOCAL=
BACK_URL_PROD=
BACK_URL_FALLBACK=
URL=
COURSE_SLUG=
```

Behavior in `Services/env-config.js`:

- `BACK_URL` has highest priority (works for local or production).
- If `BACK_URL` is absent:
- local host uses `BACK_URL_LOCAL`.
- non-local host uses `BACK_URL_PROD`.
- if none found, falls back to `BACK_URL_FALLBACK` (or `FALLBACK_URL`).
- legacy `URL` is used only if other keys are empty.

## 2) Shared API Client

`Services/env-config.js` now exposes:

- `window.ENV_CONFIG`
- `load()`
- `getApiBaseUrl()`
- `getCourseSlug()`
- `getRoutePrefixes()`
- `window.API_CLIENT`
- `authHeaders()`
- `api(path, options)`

Example:

```js
await window.ENV_CONFIG.load();
const data = await window.API_CLIENT.api('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

The helper automatically:

- adds `Authorization: Bearer <token>` when `localStorage.token` exists
- sets `Content-Type: application/json` for JSON requests
- keeps `FormData` requests unchanged (required for upload)
- throws backend message on non-OK HTTP status

## 3) Admin Upload Flow (Required)

Implemented route usage in admin dashboard:

- Step 1 upload raw video file with multipart form-data:
- `POST /api/dashboardinformation/upload`

- Step 2 create video metadata:
- `POST /api/admin/videos`
- map response fields as:
- `fileId -> b2FileId`
- `publicId -> b2FileName`

## 4) Current Route Prefixes

Exposed from `ENV_CONFIG.getRoutePrefixes()`:

- `/api/auth`
- `/api/username`
- `/api/userpassword`
- `/api/password`
- `/api/changestatusclient`
- `/api/dashboardinformation`
- `/api/courses`
- `/api/videos`
- `/api/admin`

## 5) Notes

- Signed video URLs (`GET /api/videos/:videoId/url`) are temporary; frontend must request a fresh URL on expiration.
- `POST /api/videos/:videoId/mark-watched` should be called periodically and on pause/end.
- `GET /api/courses/:courseSlug` supports optional auth token and can include user progression when token is valid.
- Backend currently does not enforce strict per-chapter video filtering by `chapterId` in all responses; frontend should rely on ordering and available chapter metadata until backend adds explicit `chapterId` support.
