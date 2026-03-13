# 📚 TomoShelf

<p align="center">
  A modern digital library to organize, track, and review books.
</p>

<p align="center">

<img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-Database-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white">

</p>

<p align="center">

<a href="https://tomoshelf.vercel.app">
  <img src="https://img.shields.io/badge/🚀 Live Demo-Visit Website-black?style=for-the-badge">
</a>

<a href="https://github.com/mohitraghav1318/tomoshelf">
  <img src="https://img.shields.io/github/stars/mohitraghav1318/tomoshelf?style=for-the-badge">
</a>

<a href="https://github.com/mohitraghav1318/tomoshelf">
  <img src="https://img.shields.io/github/forks/mohitraghav1318/tomoshelf?style=for-the-badge">
</a>

</p>

---

# ✨ About TomoShelf

**TomoShelf** is a full-stack MERN web application designed for readers who want to **organize their books, track reading progress, and share reviews**.

It provides a clean dashboard where users can manage their personal digital bookshelf and keep track of books they want to read or have completed.

The goal of TomoShelf is to create a **simple but powerful reading management system** with a modern UI and scalable architecture.

---

# 🚀 Features

### 📚 Personal Library

Organize books into structured reading collections:

* 📖 Continue Reading
* 🗓 Plan to Read
* ✅ Completed

Move books between categories as your reading progresses.

---

### ⭐ Book Reviews & Ratings

Users can:

* Write reviews
* Rate books
* Share opinions about their reading experience

---

### 🖼 Book Cover Upload

Upload and manage custom book covers using **Cloudinary cloud storage**.

---

### 🔐 Authentication System

Secure authentication with:

* User login & signup
* Token-based authentication
* Protected routes

---

### 📊 Dashboard Overview

A centralized dashboard where users can:

* Access their collections
* Navigate their library
* Manage books easily

---

# 🧰 Tech Stack

### Frontend

* React
* React Router
* Axios
* TailwindCSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Cloud Services

* Cloudinary (Image Hosting)

### Deployment

* Vercel (Frontend)
* Node Server Hosting (Backend)

---

# 📂 Project Structure

```
TomoShelf
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── api
│   │   └── App.jsx
│   │
│   └── vite.config.js
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```
git clone https://github.com/mohitraghav1318/tomoshelf.git
```

Move into the project directory

```
cd tomoshelf
```

---

# 🖥 Backend Setup

```
cd server
npm install
```

Create a `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run the backend server

```
npm run dev
```

---

# 🌐 Frontend Setup

```
cd client
npm install
npm run dev
```

---

# 🔑 Environment Variables

### Server `.env`

```
PORT=
MONGO_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Client `.env`

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# 🛣 Future Improvements

Planned improvements for TomoShelf:

* 📊 Reading analytics dashboard
* 🔎 Book search & discovery
* 🧠 Smart recommendations
* 👥 Community reviews
* 📱 Improved mobile responsiveness
* 🔔 Reading reminders

---

# 🤝 Contributing

Contributions are welcome!

Steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Mohit Raghav aka Mr Zero**

Engineering student passionate about building full-stack applications and experimenting with modern web technologies.

If you like this project, consider ⭐ **starring the repository**.
