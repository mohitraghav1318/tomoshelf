<div align="center">

<img src="client/public/favicon.svg" width="64" height="64" alt="TomoShelf Logo" />

# TomoShelf

**Your personal digital bookshelf — discover, track, and rate books you love.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tomoshelf.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://tomoshelf.vercel.app)
[![Made with React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Search & Browse** | Search millions of books via Google Books API, filter by genre |
| 📖 **Book Detail** | Rich book pages with cover, description, series detection, and buy links |
| ⭐ **Star Ratings** | Rate any book on your shelf from 1–5 stars |
| 🗂️ **Personal Shelf** | Track books as *Want to Read*, *Reading*, or *Completed* |
| 📊 **Reading Progress** | Update current page, visual progress bar per book |
| 🔮 **Recommendations** | Genre-based suggestions from your completed books |
| 🛒 **Buy Links** | Amazon, Goodreads, and library search links on every book |
| 🔐 **Auth** | Secure JWT signup & login, protected routes |
| ⚡ **Cold Start UX** | Friendly wake-up screen for Render free-tier backend delay |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** — dark-themed UI
- **React Router v6** — client-side routing
- **Context API** — global auth state
- **Lucide React** — icons

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT auth
- **Axios** — Google Books API calls

### Deployed On
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)
- Database → [MongoDB Atlas](https://mongodb.com/atlas)

---

## 📁 Project Structure

```
tomoshelf/
│
├── client/                        ← React + Vite frontend
│   ├── public/
│   │   └── favicon.svg            ← SVG logo
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx          ← Responsive navbar with glass blur
│       │   ├── BookCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── StarRating.jsx      ← Interactive 1–5 star rating
│       │   ├── ProgressModal.jsx   ← Update reading progress
│       │   └── BackendWakeup.jsx   ← Render cold-start handler
│       ├── pages/
│       │   ├── Home.jsx            ← Search + genre recommendations
│       │   ├── Browse.jsx
│       │   ├── BookDetail.jsx      ← Full book page + buy links + series
│       │   ├── MyShelf.jsx         ← Personal shelf with filters & stats
│       │   ├── Login.jsx
│       │   └── Signup.jsx
│       ├── context/
│       │   └── AuthContext.jsx     ← Global auth state
│       ├── services/
│       │   ├── api.js              ← Google Books API + recommendations
│       │   └── shelfService.js     ← Shelf CRUD API calls
│       └── App.jsx
│
└── server/                        ← Node.js + Express backend
    ├── controllers/
    │   ├── authController.js       ← signup, login, JWT
    │   └── shelfController.js      ← shelf CRUD + rating
    ├── models/
    │   ├── User.js                 ← bcrypt password hash
    │   └── ShelfEntry.js           ← status, progress, rating fields
    ├── routes/
    │   ├── authRoutes.js
    │   ├── shelfRoutes.js
    │   └── bookRoutes.js           ← Google Books proxy + buy links
    ├── middleware/
    │   └── authMiddleware.js       ← JWT verification
    ├── config/
    │   └── db.js                   ← MongoDB Atlas connection
    └── index.js                    ← Entry point + /api/health route
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)
- A [Google Books API key](https://developers.google.com/books/docs/v1/using#APIKey)

### 1. Clone the repo

```bash
git clone https://github.com/mohitraghav1318/tomoshelf.git
cd tomoshelf
```

### 2. Set up the server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_make_it_long_and_random
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

Start the backend:

```bash
npm run dev
# Runs on http://localhost:5000
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_URL_SHELF=http://localhost:5000/api/shelf
```

Start the frontend:

```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Auth | Description          |
|--------|-------------|------|----------------------|
| POST   | `/signup`   | ✗    | Register new user    |
| POST   | `/login`    | ✗    | Login, receive JWT   |
| GET    | `/me`       | ✓    | Get current user     |

### Shelf — `/api/shelf`

| Method | Endpoint          | Auth | Description                      |
|--------|-------------------|------|----------------------------------|
| GET    | `/`               | ✓    | Get shelf (optional `?status=`)  |
| POST   | `/`               | ✓    | Add book to shelf                |
| PUT    | `/:id`            | ✓    | Update status, progress, rating  |
| DELETE | `/:id`            | ✓    | Remove book from shelf           |
| GET    | `/check/:bookId`  | ✓    | Check if book is on shelf        |

### Books — `/api/books`

| Method | Endpoint    | Auth | Description                     |
|--------|-------------|------|---------------------------------|
| GET    | `/search`   | ✗    | Search Google Books by query    |
| GET    | `/:id`      | ✗    | Get single book details         |
| GET    | `/health`   | ✗    | Server health check (cold start)|

---

## 🔒 Environment Variables

> ⚠️ Never commit `.env` files. Both are in `.gitignore`.

**`server/.env`**

| Variable | Description |
|---|---|
| `PORT` | Express server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens — keep it long and random |
| `GOOGLE_BOOKS_API_KEY` | From Google Cloud Console |

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base API URL e.g. `http://localhost:5000/api` |
| `VITE_API_URL_SHELF` | Shelf API URL e.g. `http://localhost:5000/api/shelf` |

---

## 🌐 Deployment

### Frontend → Vercel

```bash
# In Vercel dashboard, set environment variables:
VITE_API_URL=https://your-backend.onrender.com/api
VITE_API_URL_SHELF=https://your-backend.onrender.com/api/shelf
```

### Backend → Render

```bash
# Build command:
npm install

# Start command:
node index.js

# Set environment variables in Render dashboard (same as server/.env)
```

> **Note:** Render's free tier spins down after 15 min of inactivity.
> TomoShelf handles this gracefully with the built-in wake-up screen.

---

## 📸 Screenshots

> Coming soon — add your own by taking a screenshot at 1200×630px
> and saving it as `client/public/og-image.png`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Mohit Raghav** — MIET

[⭐ Star this repo](https://github.com/mohitraghav1318/tomoshelf) if you found it useful!

</div>