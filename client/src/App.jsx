import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Navbar from "./components/Navbar";
import Reader from "./pages/Reader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";

import Library from "./pages/Library";
import Publisher from "./pages/Publisher";
import ProfileSettings from "./pages/ProfileSettings";
import Achievements from "./pages/Achievements";
import CollectionBooks from "./pages/CollectionBooks";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
          },
        }}
      />

      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}

        <Route
          path="/read/:id"
          element={
            <ProtectedRoute>
              <Reader />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library/:collection"
          element={
            <ProtectedRoute>
              <CollectionBooks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/publisher"
          element={
            <ProtectedRoute>
              <Publisher />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;