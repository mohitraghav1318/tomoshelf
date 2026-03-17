# 📚 Tomoshelf

> Your personal digital bookshelf — browse, organize, and rate books you love.

Tomoshelf is a full-stack web application that lets readers manage their personal book collections. Search and browse books by genre, add them to your shelf, rate them with stars, and track your reading journey — all in one place.

---

## ✨ Features

- 🔍 **Browse & Search** — Explore books and filter by genre
- 📖 **Book Details** — View in-depth information for any book
- ⭐ **Star Ratings** — Rate books on your shelf
- 🗂️ **My Shelf** — A personal space to track your reading collection
- 🔐 **Authentication** — Secure signup and login with JWT

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React (Vite), JSX, Context API    |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (Mongoose)                |
| Auth       | JSON Web Tokens (JWT)             |

---

## 📁 Project Structure

```
tomoshelf/
│
├── client/                        ← React frontend
│   └── src/
│       ├── components/            ← Reusable UI (Navbar, BookCard, StarRating, etc.)
│       ├── pages/                 ← Full pages (Home, Browse, BookDetail, MyShelf, Login, Signup)
│       ├── context/               ← Global auth state (AuthContext)
│       ├── hooks/                 ← Custom hooks (useBooks)
│       └── services/              ← API call functions (bookService, userService)
│
└── server/                        ← Node.js backend
    ├── controllers/               ← Business logic (auth, shelf)
    ├── models/                    ← MongoDB schemas (User, ShelfEntry)
    ├── routes/                    ← REST API endpoints
    ├── middleware/                 ← JWT verification
    └── config/                    ← Database connection
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tomoshelf.git
cd tomoshelf
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Set Up the Client

```bash
cd ../client
npm install
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint    | Description         |
|--------|-------------|---------------------|
| POST   | `/register` | Create a new user   |
| POST   | `/login`    | Login & receive JWT |

### Shelf Routes (`/api/shelf`) *(Protected)*

| Method | Endpoint    | Description                  |
|--------|-------------|------------------------------|
| GET    | `/`         | Get current user's shelf     |
| POST   | `/`         | Add a book to shelf          |
| PUT    | `/:id`      | Update rating or status      |
| DELETE | `/:id`      | Remove a book from shelf     |

---

## 🔒 Environment Variables

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

| Variable    | Description                        |
|-------------|------------------------------------|
| `PORT`      | Port for the Express server        |
| `MONGO_URI` | MongoDB connection string          |
| `JWT_SECRET`| Secret key for signing JWT tokens  |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for book lovers</p>
