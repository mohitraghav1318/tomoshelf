# 📚 TomoShelf

TomoShelf is a digital library platform where users can upload and share books in PDF format.
Readers can browse the library, view book details, and read books uploaded by other users.

The project is inspired by platforms like Wattpad but focuses on sharing and reading uploaded PDF books.

---

# 🚀 Current Progress (v1 Development)

The first version of TomoShelf focuses on building a **functional full-stack MVP** with the following features:

### Backend (Node.js + Express)

* User authentication using **JWT**
* Secure password hashing using **bcrypt**
* **Book upload system** using multer
* Upload **PDF files and cover images**
* Store book metadata in **MongoDB**
* Public API to fetch library books
* Authorization system so users can only modify their own books
* Static file serving for uploaded PDFs and images

### Implemented API Routes

#### Authentication

```
POST /api/auth/signup
POST /api/auth/login
```

#### Books

```
GET    /api/books        → Get all books in the library
GET    /api/books/:id    → Get a single book
POST   /api/books        → Upload a new book
PUT    /api/books/:id    → Update book details
DELETE /api/books/:id    → Delete a book (owner only)
```

#### Static Files

```
GET /uploads/:filename
```

Used to serve uploaded PDF files and cover images.

---

# 🖥 Frontend (React + Vite)

Frontend development has started with the following progress:

### Implemented

* React project setup using **Vite**
* Axios API connection to backend
* **Home / Library page**
* BookCard component for displaying books
* Display book title, description, uploader, and cover
* "Read Book" button that opens the uploaded PDF

### UI Structure

```
client/src
 ├ api
 │   axios.js
 │
 ├ components
 │   BookCard.jsx
 │   BookCard.css
 │
 ├ pages
 │   Home.jsx
 │   Home.css
 │
 ├ App.jsx
 └ main.jsx
```

---

# 📂 Project Structure

```
tomoshelf
 ├ client        → React frontend
 └ server        → Express backend
```

### Backend Structure

```
server
 ├ controllers
 ├ middleware
 ├ models
 ├ routes
 ├ uploads
 └ server.js
```

---

# 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* JWT Authentication
* Bcrypt

### Frontend

* React
* Vite
* Axios

---

# 🔜 Planned Features (Upcoming)

For future versions of TomoShelf:

* Book detail page
* Upload books from the frontend UI
* Login / Signup UI
* Navigation bar
* Categories and subcategories
* Pagination for large libraries
* Book search
* User profiles
* Comments and ratings
* Chapter-based publishing (long-term goal)

---

# 🎯 Goal

The goal of TomoShelf is to create an open digital platform where users can **share and read books freely**, similar to community publishing platforms.

Version 1 focuses on delivering a working **MVP digital library** that allows users to upload and read books.

---

# 📅 Current Development Status

TomoShelf **v1 is currently under development** with the goal of deploying the first working version soon.
