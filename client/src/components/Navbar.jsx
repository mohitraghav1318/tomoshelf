import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">📚</span>
        <span className="text-white text-xl font-bold tracking-wide">
          Tomo<span className="text-purple-400">Shelf</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Home
        </Link>
        <Link
          to="/browse"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Browse
        </Link>
        {isAuthenticated && (
          <Link
            to="/shelf"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            My Shelf
          </Link>
        )}
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;