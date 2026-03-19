import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const active = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-black/95 border-b border-slate-800 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl leading-none">
            T
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Tomo<span className="text-red-500">Shelf</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: '/', label: 'Home' },
            { to: '/browse', label: 'Browse' },
            ...(isAuthenticated ? [{ to: '/shelf', label: 'My Shelf' }] : []),
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-bold tracking-wide transition-colors ${
                active(to) ? 'text-red-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link 
                to="/settings"
                className="flex items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700 group-hover:border-red-500 transition-colors">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  {user?.username}
                </span>
              </Link>
              <button 
                onClick={logout}
                className="text-slate-500 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full inset-x-0 bg-neutral-950 border-b border-slate-800 p-6 md:hidden flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {[
            { to: '/', label: 'Home' },
            { to: '/browse', label: 'Browse' },
            ...(isAuthenticated ? [{ to: '/shelf', label: 'My Shelf' }] : []),
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-lg font-bold ${active(to) ? 'text-red-500' : 'text-slate-300'}`}
            >
              {label}
            </Link>
          ))}
          <div className="h-px bg-slate-800" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-6">
              <Link to="/settings" className="text-slate-300 font-bold">Settings</Link>
              <button onClick={logout} className="text-red-500 font-bold text-left">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login" className="text-slate-300 font-bold">Login</Link>
              <Link to="/signup" className="py-3 rounded-xl bg-red-600 text-white font-bold text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}