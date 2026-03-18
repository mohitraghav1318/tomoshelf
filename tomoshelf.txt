# TomoShelf - Comprehensive Project Report & Documentation

## 1. Overview
TomoShelf is a full-stack personalized book tracking and discovery platform. It integrates with the Google Books API to provide a seamless experience for users to search, organize, and receive recommendations based on their reading habits.

## 2. Tech Stack Detail
### Frontend
- **React (Vite 6.0)**: Modern React framework for high-performance builds.
- **Tailwind CSS (3.4)**: Utility-first CSS for premium, responsive design.
- **Lucide React**: Clean, consistent icon set.
- **React Router Dom (7.13)**: Client-side routing for seamless navigation.

### Backend
- **Node.js & Express (5.2)**: Robust server infrastructure.
- **MongoDB & Mongoose (9.3)**: NoSQL database for flexible shelf entries and user data.
- **JWT (9.0)**: Secure JSON Web Token authentication.
- **BcryptJS (3.0)**: Industry-standard password hashing.
- **Axios (1.13)**: Promise-based HTTP client for external API requests.

---

## 3. Detailed Project Structure
### Root Folder
- `.env`: Contains critical configuration keys (DB, JWT, Google Books API).
- `package.json`: Main project configuration and workspace definitions.
- `client/`: React frontend application.
- `server/`: Express backend API.

### Server Breakdown (`server/`)
- `config/db.js`: MongoDB connection synchronization.
- `models/`:
    - `User.js`: Schema for usernames, emails, and hashed passwords.
    - `ShelfEntry.js`: Stores user-specific book data, status, progress, and ratings.
- `controllers/`:
    - `authController.js`: Logic for registration, login, and profile retrieval.
    - `shelfController.js`: CRUD operations for user shelves and status checks.
- `routes/`:
    - `auth.js`: Auth endpoints mapping.
    - `books.js`: Google Books proxy routes.
    - `shelf.js`: Shelf management endpoints.
- `middleware/authMiddleware.js`: Protects routes by verifying JWT tokens in headers.

### Client Breakdown (`client/src/`)
- `context/AuthContext.jsx`: Manages login/logout state and token persistence.
- `services/`:
    - `api.js`: Handles book searches and recommendation logic.
    - `authService.js`: API wrappers for login/signup.
    - `shelfService.js`: API wrappers for CRUD shelf actions.
- `components/`:
    - `Navbar`: Responsive navigation with auth-aware links and premium logo.
    - `SearchBar`: Debounced or form-based search input.
    - `BookCard`: Individual book display with cover art and basic info.
    - `BackendWakeup`: Silently pings the server to reduce cold-start latency.

---

## 4. API Documentation (Endpoints)
### Authentication (`/api/auth`)
- `POST /signup`: payload `{username, email, password}` -> Returns `{user, token}`.
- `POST /login`: payload `{email, password}` -> Returns `{user, token}`.
- `GET /me`: Returns current user info (requires Bearer token).

### Books (`/api/books`)
- `GET /search?query=...`: Proxies Google Books API, returns sanitized items.
- `GET /:id`: Fetches detailed metadata for a specific Google Book ID.

### Shelf (`/api/shelf`)
- `GET /`: Retrieves user's shelf (supports `?status=...` filtering).
- `POST /`: Adds a book to the shelf. Required: `bookId`, `bookData`, `status`.
- `PUT /:id`: Updates status (e.g., 'completed'), `currentPage`, or `rating`.
- `DELETE /:id`: Removes a book entry from the database.
- `GET /check/:bookId`: Quickly verifies if a book is already tracked by the user.

---

## 5. Core System Logic
### Authentication Middleware
The `protect` middleware extracts the token from the `Authorization` header (`Bearer <token>`). It uses `jwt.verify` with `JWT_SECRET`. On success, it attaches the `user.id` to the request object (`req.user`), allowing downstream controllers to identify the user.

### Recommendation Engine Logic
Implemented in `services/api.js`, the engine follows these steps:
1. **Genre Analysis**: Scans all 'completed' books in the user's shelf.
2. **Top Genre Selection**: Counts category occurrences and picks the most frequent.
3. **External Fetch**: Queries Google Books using the Top Genre as a search term.
4. **Refined Filtering**: Strips out any books that already exist in the user's total shelf (read or unread).
5. **Display**: Returns the top matching results to the `Home` page.

### Environment Configuration
- `MONGODB_URI`: Connection string for the database.
- `JWT_SECRET`: Secret key for signing and verifying tokens.
- `GOOGLE_BOOKS_API_KEY`: API key for Google Books Volume services.
- `VITE_API_URL`: Base URL for the backend API from the client side.

---
Report Last Updated: 2026-03-18
Generation: Antigravity AI
