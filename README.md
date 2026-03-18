<div align="center">

<img src="client/public/favicon.svg" width="80" height="80" alt="TomoShelf Logo" />

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
| ⭐ **Star Ratings** | Quick 1–5 star ratings to track your personal enjoyment |
| 🗂️ **Personal Shelf** | Track books as *Want to Read*, *Reading*, or *Completed* |
| 📊 **Reading Progress** | Update current page, visual progress bar per book |
| 🔮 **Recommendations** | Genre-based suggestions derived from your reading history |
| 🛒 **Buy Links** | Amazon, Goodreads, and local library search links on every book |
| 🔐 **Secure Auth** | JWT-based authentication for private shelves |
| ⚡ **Cold Start UX** | Optimized "Wake-up" screen for free-tier backend hosting |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite (Ultra-fast HMR)
- **Tailwind CSS** — Modern, dark-themed responsive UI
- **React Router v6** — Seamless client-side navigation
- **Context API** — Global state management for Auth
- **Lucide React** — Beautiful, consistent iconography
- **Axios** — Robust HTTP client for API requests

### Backend
- **Node.js** + **Express.js** — Fast, unopinionated web framework
- **MongoDB** + **Mongoose** — Schema-based ODM for data modeling
- **bcryptjs** — Industry-standard password hashing
- **jsonwebtoken** — Secure JWT authentication
- **dotenv** — Confidential environment configuration

---

## 📁 Project Structure

```bash
tomoshelf/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Stars, Modals)
│   │   ├── context/            # AuthContext for global state
│   │   ├── pages/              # Main view entry points
│   │   └── services/           # API interaction layer
├── server/                     # Node.js + Express backend
│   ├── controllers/            # Request handlers
│   ├── models/                 # Mongoose schemas (User, ShelfEntry)
│   ├── routes/                 # API endpoint definitions
│   └── middleware/             # JWT auth validation
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mohitraghav1318/tomoshelf.git
cd tomoshelf

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure Environment

**`server/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_BOOKS_API_KEY=your_google_books_key
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_API_URL_SHELF=http://localhost:5000/api/shelf
```

### 3. Run Development Servers

```bash
# In server directory
npm run dev

# In client directory
npm run dev
```

---

## 🗺️ Roadmap (Upcoming Features)

We are constantly working to make TomoShelf the best personal library manager. Here is what's coming next:

### 🌟 Core Enhancements
- [ ] **Community & Social**: Public user profiles, following friends, and a global "Activity Feed" to see what others are reading.
- [ ] **Detailed Reviews**: Move beyond stars — leave in-depth text reviews and comment on your friends' thoughts.
- [ ] **Custom Collections**: Create your own themed lists like "Summer Beach Reads", "Sci-Fi Hall of Fame", or "To Buy Later".
- [ ] **Reading Analytics**: Visual dashboard with charts for books read per month, favorite genres, and yearly reading goals.
- [ ] **Import/Export Tool**: Easily migrate your data from Goodreads or OpenLibrary via CSV import.

### 🎨 UI/UX Improvements
- [ ] **Dark/Light Mode Toggle**: Choose your preferred viewing experience.
- [ ] **Offline Mode**: Cache your shelf for viewing when you don't have an internet connection (PWA support).
- [ ] **Batch Actions**: Edit multiple books on your shelf at once (move to completed, delete, etc.).

---

## 📸 Screenshots

> *Coming soon*

---

## 🤝 Contributing

We love contributions! Whether it's a bug fix, a new feature, or better documentation:

1. **Fork** the repository
2. **Branch**: `git checkout -b feat/your-awesome-feature`
3. **Commit**: `git commit -m 'feat: add amazing feature'`
4. **Push**: `git push origin feat/your-awesome-feature`
5. **PR**: Open a Pull Request for review

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📸 Screenshots

> Coming soon 

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
