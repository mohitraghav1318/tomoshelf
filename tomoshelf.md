# TomoShelf
## Comprehensive Project Report and Handoff Documentation

Last updated: **2026-03-20**  
Codebase analyzed from: `client/` + `server/` in this repository

---

## 1) Project Summary

TomoShelf is a full-stack web application for book discovery and personal reading tracking.

At a high level, users can:
- Search books via Google Books API
- View detailed metadata for each book
- Add books to a private shelf
- Track status (`want-to-read`, `reading`, `completed`)
- Track progress (current page)
- Rate books (0-5 stars)
- Enable email-based 2FA for login
- Delete account with OTP verification

The project is split into:
- **Frontend**: React + Vite + Tailwind (`client/`)
- **Backend**: Node.js + Express + Mongoose (`server/`)
- **Database**: MongoDB (via Mongoose)
- **Third-party APIs**: Google Books API + Gmail SMTP (Nodemailer)

---

## 2) Business and Product Scope

### Primary Use Cases
1. Discover books by keyword or category.
2. Store selected books in a personal shelf.
3. Monitor reading journey (status + progress + rating).
4. Get lightweight recommendations from completed-reading history.
5. Manage account settings and security.

### Secondary / Supporting Use Cases
1. Cold-start UX for backend wake-up (for free-tier hosting behavior).
2. Static documentation, API guide, and privacy pages.

---

## 3) Tech Stack (Actual From Code)

### Frontend (`client/package.json`)
- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.1`
- Vite `8.0.0`
- Tailwind CSS `3.4.19`
- Lucide React `0.577.0`
- ESLint `9.39.4`

### Backend (`server/package.json`)
- Express `5.2.1`
- Mongoose `9.3.1`
- JSON Web Token `9.0.3`
- bcryptjs `3.0.3`
- Axios `1.13.6`
- Nodemailer `8.0.3`
- CORS `2.8.6`
- dotenv `17.3.1`
- Nodemon `3.1.14` (dev)

### Root
- Root `package.json` only includes `dotenv`; app runtime is managed mainly via `client/` and `server/`.

---

## 4) High-Level Architecture

```text
[React Client]
   |  HTTP (fetch)
   v
[Express API Server]
   |-- Mongoose --> [MongoDB]
   |-- Axios ------> [Google Books API]
   |-- Nodemailer -> [Gmail SMTP]
```

### Architectural Style
- **Frontend**: Route-based SPA with service-layer API calls and context-based auth state.
- **Backend**: Route -> Controller -> Model pattern with JWT middleware for protected endpoints.

---

## 5) Repository Structure and Responsibilities

```text
tomoshelf/
├── README.md
├── tomoshelf.md                        # This report
├── client/
│   ├── index.html                      # SEO/meta tags + app root mount
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   └── images/wakeup_bg.png
│   └── src/
│       ├── main.jsx                    # App bootstrap + AuthProvider
│       ├── App.jsx                     # Router + global layout
│       ├── index.css                   # Global Tailwind + typography
│       ├── App.css                     # Legacy Vite template CSS (currently unused)
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── shelfService.js
│       │   └── settingsService.js
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── BookDetail.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── MyShelf.jsx
│       │   ├── Browse.jsx
│       │   ├── Settings.jsx
│       │   ├── Documentation.jsx
│       │   ├── APIGuide.jsx
│       │   └── PrivacyPolicy.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── Footer.jsx
│           ├── SearchBar.jsx
│           ├── SearchResults.jsx
│           ├── BookCard.jsx
│           ├── SkeletonCard.jsx
│           ├── StarRating.jsx
│           ├── ProgressModal.jsx
│           └── BackendWakeup.jsx
└── server/
    ├── index.js                        # Express app entry
    ├── package.json
    ├── config/
    │   └── db.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── ShelfEntry.js
    ├── controllers/
    │   ├── authController.js
    │   ├── shelfController.js
    │   └── settingsController.js
    ├── routes/
    │   ├── auth.js
    │   ├── books.js
    │   ├── shelf.js
    │   └── settingsRoutes.js
    └── services/
        └── emailService.js
```

---

## 6) Frontend Runtime Flow

## 6.1 App Bootstrap
1. `client/src/main.jsx` mounts React into `#root`.
2. App is wrapped in `AuthProvider`.
3. `AuthProvider` checks `localStorage.token`; if present it calls `/api/auth/me`.
4. `App.jsx` sets up routes and wraps content with `BackendWakeup`.

## 6.2 Backend Wake-Up Guard (`BackendWakeup.jsx`)
Purpose:
- Ping `/api/health`
- Show waiting/progress screen if backend is sleeping
- Poll every 3 seconds
- Auto-continue after 60 seconds max

This is a UX wrapper and does not block app code permanently.

## 6.3 Routing Map (Client)
Defined in `App.jsx`:
- `/` -> `Home`
- `/book/:id` -> `BookDetail`
- `/login` -> `Login`
- `/signup` -> `Signup`
- `/shelf` -> `MyShelf`
- `/browse` -> `Browse`
- `/settings` -> `Settings`
- `/privacy` -> `PrivacyPolicy`
- `/docs` -> `Documentation`
- `/api-guide` -> `APIGuide`

## 6.4 Authentication State Flow
Managed by `AuthContext.jsx`:
- Stores `user`, `token`, `loading`
- Persists token in `localStorage`
- `login()` and `signup()` both persist token + set user
- `logout()` clears token and user
- `isAuthenticated` is derived (`!!user`)

Important behavior:
- If `/me` fails (invalid token/network issue), context calls `logout()`.

---

## 7) Core User Flows (End-to-End)

## 7.1 Signup Flow
1. User submits username/email/password on `Signup.jsx`.
2. Frontend calls `authService.signupUser`.
3. Backend `POST /api/auth/signup`:
   - Validates required fields
   - Rejects duplicate username/email
   - Creates user (password hashed via pre-save hook)
   - Returns JWT + user payload
4. Frontend stores token and user in `AuthContext`, then navigates to `/`.

## 7.2 Login + Optional 2FA Flow
1. User submits email/password on `Login.jsx`.
2. Backend `POST /api/auth/login`:
   - Validates credentials
   - If `twoFactorEnabled = false`: returns token + user
   - If `twoFactorEnabled = true`: generates OTP, emails code, returns `twoFactorRequired: true` + `userId`
3. Frontend opens OTP modal when 2FA is required.
4. Frontend calls `POST /api/auth/verify-2fa` with `{ userId, otp }`.
5. Backend verifies OTP + expiry, clears OTP fields, returns token + user.
6. Frontend logs user in.

## 7.3 Search and Browse Flow
- `Home.jsx` uses `SearchBar` -> `searchBooks(query)` -> `/api/books/search`.
- `Browse.jsx` uses category chips and sends category label as search query.
- Search results displayed via `SearchResults` + `BookCard`.

## 7.4 Book Detail + Shelf Interaction Flow
1. Route `/book/:id` loads `BookDetail`.
2. Page fetches `/api/books/:id`.
3. If logged in, page calls `/api/shelf/check/:bookId`.
4. User can:
   - Add to shelf (`POST /api/shelf`)
   - Remove from shelf (`DELETE /api/shelf/:id`)
   - Rate (`PUT /api/shelf/:id` with `rating`)
5. Book detail page also offers external links (Amazon/Goodreads/WorldCat).

## 7.5 Shelf Management Flow (`MyShelf`)
1. Requires auth; redirects to `/login` if not authenticated.
2. Fetches shelf (`GET /api/shelf`), optional status filter.
3. Supports:
   - Status changes (`PUT /api/shelf/:id`)
   - Progress updates (`PUT /api/shelf/:id`)
   - Rating updates (`PUT /api/shelf/:id`)
   - Deletion (`DELETE /api/shelf/:id`)
4. Computes lightweight shelf stats client-side.

## 7.6 Recommendation Flow
Implemented in `client/src/services/api.js`:
1. Take completed shelf entries.
2. Count category frequency from `entry.bookData.categories`.
3. Pick top category.
4. Search Google books with that category.
5. Remove books already on user shelf.
6. Return top 6 recommendations.

This logic runs client-side in `Home.jsx`.

## 7.7 Settings Flow
`Settings.jsx` uses `settingsService.js` and supports:
- Profile update (`PUT /api/settings/profile`)
- 2FA setup (`POST /api/settings/2fa/setup`)
- 2FA verify (`POST /api/settings/2fa/verify`)
- 2FA disable (`POST /api/settings/2fa/disable`)
- Delete account request (`POST /api/settings/delete-account/request`)
- Delete account confirm (`DELETE /api/settings/delete-account/confirm`)

Delete account flow deletes:
1. User’s shelf entries
2. User record itself

---

## 8) Backend Runtime Flow

## 8.1 Server Startup
`server/index.js`:
1. Load env (`dotenv`)
2. Create Express app
3. Apply middleware (`cors`, `express.json`)
4. Register health and root routes
5. Mount route modules:
   - `/api/books`
   - `/api/auth`
   - `/api/shelf`
   - `/api/settings`
6. Connect MongoDB using `connectDB()`
7. Start listening on `PORT` (default `5000`)

## 8.2 Database Connection
`server/config/db.js`:
- Uses `process.env.MONGODB_URI`
- Terminates process on connection failure

## 8.3 Auth Middleware
`server/middleware/authMiddleware.js` (`protect`):
- Expects `Authorization: Bearer <token>`
- Verifies JWT with `JWT_SECRET`
- Injects `req.user = { id: decoded.id }`
- Sends 401 if missing/invalid token

---

## 9) API Surface (Complete Route Map)

## 9.1 Public Routes
| Method | Path | Description |
|---|---|---|
| GET | `/` | Basic API status response |
| GET | `/api/health` | Health check for wake-up UI |
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user (may trigger 2FA) |
| POST | `/api/auth/verify-2fa` | Verify login OTP |
| GET | `/api/books/search?query=...` | Search books from Google API |
| GET | `/api/books/:id` | Get detailed book payload |

## 9.2 Protected Routes (JWT Required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/me` | Get current authenticated user |
| GET | `/api/shelf` | Get shelf entries (optional `?status=`) |
| POST | `/api/shelf` | Add book to shelf |
| PUT | `/api/shelf/:id` | Update shelf entry status/progress/rating |
| DELETE | `/api/shelf/:id` | Remove shelf entry |
| GET | `/api/shelf/check/:bookId` | Check if book already in shelf |
| PUT | `/api/settings/profile` | Update username/email |
| POST | `/api/settings/2fa/setup` | Send 2FA OTP |
| POST | `/api/settings/2fa/verify` | Enable 2FA after OTP |
| POST | `/api/settings/2fa/disable` | Disable 2FA |
| POST | `/api/settings/delete-account/request` | Send delete-account OTP |
| DELETE | `/api/settings/delete-account/confirm` | Delete account + data |

---

## 10) Data Models

## 10.1 `User` Model (`server/models/User.js`)

Fields:
- `username` (String, required, unique, min 3)
- `email` (String, required, unique, lowercase+trimmed)
- `password` (String, required, min 6)
- `createdAt` (Date, default now)
- `twoFactorEnabled` (Boolean, default false)
- `twoFactorOTP` (String | null)
- `twoFactorOTPExpires` (Date | null)
- `deleteAccountOTP` (String | null)
- `deleteAccountOTPExpires` (Date | null)

Hooks and methods:
- Pre-save hook hashes password with bcrypt (salt rounds 10) when password changed.
- Instance method `comparePassword(candidatePassword)`.

## 10.2 `ShelfEntry` Model (`server/models/ShelfEntry.js`)

Fields:
- `user` (ObjectId -> User, required)
- `bookId` (String, required)
- `bookData` object:
  - `title`, `authors[]`, `thumbnail`, `publishedDate`, `pageCount`, `categories[]`, `description`
- `status` enum: `reading`, `completed`, `want-to-read` (default `want-to-read`)
- `currentPage` (Number, default 0)
- `addedAt` (Date, default now)
- `completedAt` (Date)
- `rating` (Number 0-5, default 0)

Indexes:
- Unique compound index on `{ user: 1, bookId: 1 }` to prevent duplicate shelf entries per user.

---

## 11) API Contract Details (Payload Examples)

## 11.1 Signup
`POST /api/auth/signup`

Request:
```json
{
  "username": "reader01",
  "email": "reader@example.com",
  "password": "secret123"
}
```

Success response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "reader01",
    "email": "reader@example.com",
    "twoFactorEnabled": false
  }
}
```

## 11.2 Login (Without 2FA)
`POST /api/auth/login`

Request:
```json
{
  "email": "reader@example.com",
  "password": "secret123"
}
```

Success response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "reader01",
    "email": "reader@example.com",
    "twoFactorEnabled": false
  }
}
```

## 11.3 Login (With 2FA Enabled)
Success response:
```json
{
  "success": true,
  "twoFactorRequired": true,
  "userId": "user_id",
  "message": "Two-factor authentication code sent to email"
}
```

Then:
`POST /api/auth/verify-2fa`
```json
{
  "userId": "user_id",
  "otp": "123456"
}
```

## 11.4 Add Shelf Entry
`POST /api/shelf`
```json
{
  "bookId": "google_book_id",
  "status": "want-to-read",
  "bookData": {
    "title": "Book Title",
    "authors": ["Author A"],
    "thumbnail": "https://...",
    "publishedDate": "2020",
    "pageCount": 320,
    "categories": ["Fiction"],
    "description": "..."
  }
}
```

## 11.5 Update Shelf Entry
`PUT /api/shelf/:id`
```json
{
  "status": "reading",
  "currentPage": 42,
  "rating": 4
}
```

## 11.6 Check Book in Shelf
`GET /api/shelf/check/:bookId`

Response:
```json
{
  "success": true,
  "inShelf": true,
  "entry": {
    "_id": "...",
    "bookId": "...",
    "status": "reading"
  }
}
```

---

## 12) Environment Variables

## 12.1 Backend (`server/.env`)
Required/used in code:
- `PORT` (optional, defaults to `5000`)
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_BOOKS_API_KEY`
- `EMAIL_APP_PASS` (required for Gmail SMTP auth)
- `EMAIL_USER` (optional in code; fallback hardcoded email exists)

## 12.2 Frontend (`client/.env`)
Used in code:
- `VITE_API_URL`  
  Example: `http://localhost:5000/api`
- `VITE_API_URL_AUTH`  
  Example: `http://localhost:5000/api/auth`
- `VITE_API_URL_SHELF`  
  Example: `http://localhost:5000/api/shelf`

---

## 13) Setup and Local Development

## 13.1 Prerequisites
- Node.js 18+ recommended
- npm
- MongoDB connection string (Atlas or local)
- Google Books API key
- Gmail app password (for OTP emails)

## 13.2 Install
```bash
cd server
npm install

cd ../client
npm install
```

## 13.3 Run
Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

---

## 14) Frontend Component Responsibility Map

### Layout and Navigation
- `Navbar.jsx`: top navigation; auth-aware links; mobile menu
- `Footer.jsx`: static links and social section

### Search and Discovery
- `SearchBar.jsx`: controlled query input
- `SearchResults.jsx`: result grid and loading/empty behavior
- `BookCard.jsx`: reusable book tile
- `SkeletonCard.jsx`: loading placeholder visuals

### Shelf and Book Interaction
- `StarRating.jsx`: interactive/display rating widget
- `ProgressModal.jsx`: modal to update reading page progress

### System UX
- `BackendWakeup.jsx`: health polling + progress screen before app display

---

## 15) Backend Responsibility Map

### Route Layer
- Maps URLs and HTTP methods to controller functions.
- Applies auth middleware for protected routes.

### Controller Layer
- Validates inputs
- Executes business logic
- Interacts with Mongoose models
- Returns JSON success/error payloads

### Model Layer
- Defines schema constraints
- Handles hooks (password hashing)
- Maintains indexes for data integrity

### Service Layer
- `emailService.js` isolates SMTP/HTML email generation logic

---

## 16) Security Model

Current protections:
1. Password hashing with bcrypt pre-save hook.
2. JWT-based route protection for sensitive endpoints.
3. OTP-based second factor (email) for login.
4. OTP-based confirmation for destructive account deletion.
5. User-scoped shelf queries (`user: req.user.id`) to prevent cross-user access.

Current limitations to be aware of:
1. CORS is globally open with default `cors()` settings.
2. No explicit rate limiting or brute-force protection on auth endpoints.
3. JWT rotation/blacklisting is not implemented.
4. OTP send frequency throttling is not currently implemented.

---

## 17) Error Handling Pattern

Across frontend services:
- Parse JSON response
- Throw `Error` with backend `error` message if `!response.ok`

Across backend controllers:
- `try/catch`
- Return `4xx` for validation/authorization issues
- Return `500` for server errors with concise error messages

Note:
- Error payload style is mostly `{ error: "..." }`, while some success payloads use `{ message: "..." }` and some include `success: true`.

---

## 18) Styling and UI System

Core styling approach:
- Tailwind utility classes
- Global font set to Montserrat in `index.css`
- Dark theme baseline (`bg-black`, slate neutral palette, red accent)

Files:
- `index.css` holds global base styles and utility helper classes.
- Tailwind config is minimal (`extend: {}` currently empty).

Observation:
- `App.css` appears to be leftover Vite template styling and is not imported by `App.jsx`.

---

## 19) SEO and Metadata

`client/index.html` contains:
- Standard metadata (`title`, description, keywords, canonical)
- Open Graph + Twitter card tags
- Theme color and Apple mobile tags
- JSON-LD structured data (`WebApplication`)

This is good for preview cards and baseline discoverability.

---

## 20) Operational and Deployment Notes

### Backend Hosting Considerations
- `BackendWakeup` assumes backend may sleep; this pattern is common for free-tier hosting.
- `/api/health` endpoint exists specifically for wake-up checks.

### Email Infrastructure
- Uses Gmail transporter via Nodemailer.
- Requires Gmail app password, not normal account password.

### API Dependency
- Search and detail pages rely on Google Books API being reachable and key being valid.

---

## 21) Gaps and Improvement Backlog (From Current Code)

These are practical improvements for future iterations:

1. Add input validation library (e.g., Zod/Joi/express-validator) for all request bodies.
2. Add rate limiting to auth + OTP endpoints.
3. Restrict CORS to known frontend origins.
4. Add pagination for search and shelf lists.
5. Add server-side recommendation endpoint (move logic from frontend to backend).
6. Add automated tests (currently no test suite in repo).
7. Standardize API response envelope (`success`, `data`, `error`).
8. Replace placeholder contact email in footer.
9. Remove unused imports/components and stale template CSS.
10. Add centralized logging and production error telemetry.
11. Avoid hardcoded email fallback in email service for cleaner production security posture.

---

## 22) Developer Handoff: How to Extend Safely

## 22.1 Add a New Protected Backend Feature
1. Create controller function in `server/controllers/`.
2. Add route in `server/routes/` and apply `protect`.
3. If needed, add or modify model schema in `server/models/`.
4. Expose endpoint through frontend `services/`.
5. Consume service in page/component with loading/error state.

## 22.2 Add a New Frontend Page
1. Create page in `client/src/pages/`.
2. Register route in `App.jsx`.
3. If page requires auth, check `isAuthenticated` and redirect to `/login`.
4. Add navigation entry in `Navbar`/`Footer` if needed.

## 22.3 Add New Shelf Field
1. Update `ShelfEntry` schema.
2. Update create/update controller logic.
3. Update frontend service payload typing assumptions.
4. Update UI forms/cards displaying the field.

---

## 23) Quick Onboarding Checklist for New Developers

1. Read this file end to end once.
2. Start backend and frontend locally.
3. Create a test user and run through:
   - signup
   - login
   - search
   - book detail
   - add to shelf
   - update status/progress/rating
   - settings + 2FA setup
4. Verify environment variables are correctly loaded.
5. Review route/controller/model correspondence for the endpoints you plan to modify.

---

## 24) Appendix: File-by-File Notes (Critical Files)

### Backend Critical Files
- `server/index.js`: server bootstrap, route mounting
- `server/config/db.js`: MongoDB connection
- `server/middleware/authMiddleware.js`: JWT protection
- `server/controllers/authController.js`: auth + login 2FA handshake
- `server/controllers/shelfController.js`: shelf CRUD + status/progress/rating updates
- `server/controllers/settingsController.js`: profile, 2FA, account deletion
- `server/services/emailService.js`: OTP email transport and templates
- `server/models/User.js`: account schema + password hashing
- `server/models/ShelfEntry.js`: shelf schema + duplicate guard index

### Frontend Critical Files
- `client/src/main.jsx`: app entry
- `client/src/App.jsx`: route map and shared layout
- `client/src/context/AuthContext.jsx`: auth state lifecycle
- `client/src/services/*.js`: API communication layer
- `client/src/pages/Home.jsx`: search + recommendations
- `client/src/pages/BookDetail.jsx`: add/remove/rate shelf interactions
- `client/src/pages/MyShelf.jsx`: shelf management UI
- `client/src/pages/Settings.jsx`: profile/security/destructive operations
- `client/src/components/BackendWakeup.jsx`: cold-start UX management

---

## 25) Final Summary

TomoShelf is a cleanly separated full-stack project with a clear MVC-style backend and a route-driven React frontend.  
Core functionality (auth, shelf CRUD, progress/rating, search, basic recommendations, settings security flows) is already implemented and usable.  
The codebase is straightforward to onboard into, and the next major maturity step is improving validation, security hardening, and automated testing.
