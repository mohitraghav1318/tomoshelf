# TomoShelf - Comprehensive Project Report & Documentation

## 1. Overview
TomoShelf is a full-stack personalized book tracking and discovery platform. It integrates with the Google Books API to provide a seamless experience for users to search, organize, and receive recommendations based on their reading habits.

## 2. Tech Stack Detail
### Frontend
- **React (Vite 6.0)**: Modern React framework for high-performance builds.
- **Tailwind CSS (3.4)**: Utility-first CSS for clean, responsive design.
- **Montserrat**: Global font for a clean and modern aesthetic.
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
    - `Navbar`: Responsive navigation with Montserrat typography and clean UI.
    - `SearchBar`: Debounced search input for book discovery.
    - `SimpleBookCard`: Clean, minimalist book display.
    - `BackendWakeup`: Silently pings the server to reduce cold-start latency.
    - `Footer`: Clean site footer with links to all resources.

---

## 4. API Documentation (Endpoints)
### Authentication (`/api/auth`)
- `POST /signup`: `{username, email, password}` -> `{user, token}`.
- `POST /login`: `{email, password}` -> `{user, token}`.
- `GET /me`: Returns current user info (requires Bearer token).

### Books (`/api/books`)
- `GET /search?query=...`: Google Books API proxy.
- `GET /:id`: Detailed book metadata.

### Shelf (`/api/shelf`)
- `GET /`: Retrieves user's shelf (supports status filtering).
- `POST /`: Adds a book to the shelf.
- `PUT /:id`: Updates status, progress, or rating.
- `DELETE /:id`: Removes a book entry.

---

## 5. Core System Logic
### Authentication Middleware
The `protect` middleware verifies JWT tokens in the `Authorization` header, identifying users for secure data access.

### Recommendation Engine Logic
1. **Genre Analysis**: Scans 'completed' books in the user shelf.
2. **Top Genre Selection**: Identifies the most frequent category.
3. **External Fetch**: Queries Google Books using the Top Genre.
4. **Refined Filtering**: Excludes books already in the user's shelf.

---

## 6. UI & Design Philosophy
### Minimalist Aesthetics
- **Montserrat Typography**: Primary font used globally for a modern, clean look.
- **Solid Colors**: Replaced complex gradients and glassmorphism with solid color palettes (Slate, Blue).
- **Clean Components**: Simplified `Navbar`, `Home`, and `Settings` for better readability and performance.
- **Responsive Layouts**: Fully responsive experience across all device sizes.

---

## 7. Global Routing
All links in the `Navbar` and `Footer` are fully functional:
- `/`: Home / Discovery
- `/browse`: Book Exploration
- `/shelf`: Personal Reading Tracker
- `/settings`: Account Preferences
- `/docs`: Documentation Hub
- `/api-guide`: API Reference
- `/privacy`: Privacy Policy

---
Report Last Updated: 2026-03-18 (V3.0)
Author: Antigravity AI
Project: TomoShelf
