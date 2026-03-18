import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

/* ── Inline SVG logo — Option A (stacked books + gold bookmark) ── */
const TomoLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="11" fill="#09090b" />
    <rect width="44" height="44" rx="11" fill="#7c3aed" fillOpacity="0.18" />
    <rect x="0.5" y="0.5" width="43" height="43" rx="10.5" stroke="#7c3aed" strokeOpacity="0.55" strokeWidth="1" />
    {/* bottom book — deep purple */}
    <rect x="6" y="26" width="32" height="10" rx="2.5" fill="#6d28d9" />
    <rect x="6" y="26" width="5" height="10" rx="1.5" fill="#5b21b6" />
    {/* top book — light purple */}
    <rect x="9" y="14" width="26" height="10" rx="2.5" fill="#a78bfa" />
    <rect x="9" y="14" width="5" height="10" rx="1.5" fill="#7c3aed" />
    {/* page lines */}
    <line x1="18" y1="15.5" x2="18" y2="22.5" stroke="#ede9fe" strokeWidth="0.9" strokeOpacity="0.65" />
    <line x1="22" y1="15.5" x2="22" y2="22.5" stroke="#ede9fe" strokeWidth="0.9" strokeOpacity="0.65" />
    <line x1="26" y1="15.5" x2="26" y2="22.5" stroke="#ede9fe" strokeWidth="0.9" strokeOpacity="0.65" />
    {/* gold bookmark ribbon */}
    <path d="M31 5 L31 16 L28 13 L25 16 L25 5 Z" fill="#f59e0b" />
    <line x1="25" y1="5" x2="31" y2="5" stroke="#fbbf24" strokeWidth="0.8" />
  </svg>
);

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

  // close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  const active = (path) => location.pathname === path;

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━ NAV BAR ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className={[
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/40'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[68px] flex items-center justify-between gap-6">

          {/* ── Logo + Wordmark ─────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
              <TomoLogo size={38} />
            </div>
            <span className="text-[1.25rem] font-bold tracking-tight leading-none">
              <span className="text-white">Tomo</span>
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' }}
              >
                Shelf
              </span>
            </span>
          </Link>

          {/* ── Desktop centre links ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {[
              { to: '/', label: 'Home' },
              { to: '/browse', label: 'Browse' },
              ...(isAuthenticated ? [{ to: '/shelf', label: 'My Shelf' }] : []),
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={[
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  active(to)
                    ? 'text-white bg-white/8'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                {label}
                {/* active underline pill */}
                {active(to) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-400" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop right auth ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* avatar pill */}
                <Link 
                  to="/settings"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-600/60 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-purple-200 group-hover:scale-110 transition-transform">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                    {user?.username}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-200 group"
                >
                  <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="relative px-5 py-2 rounded-lg text-sm font-semibold text-white overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    boxShadow: '0 0 20px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ────────────────────────────────── */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            {open
              ? <X className="w-4.5 h-4.5" />
              : <Menu className="w-4.5 h-4.5" />
            }
          </button>

        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━ MOBILE MENU OVERLAY ━━━━━━━━━━━━━━━━━━━━━ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile slide panel ──────────────────────────────────── */}
      <div className={[
        'fixed top-[68px] inset-x-0 z-50 md:hidden',
        'transition-all duration-300 ease-in-out overflow-hidden',
        open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
      ].join(' ')}>

        <div
          className="mx-3 mt-2 mb-3 rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: 'rgba(9,9,11,0.97)', backdropFilter: 'blur(24px)' }}
        >
          <div className="p-3 flex flex-col gap-1">

            {/* nav links */}
            {[
              { to: '/', label: 'Home' },
              { to: '/browse', label: 'Browse' },
              ...(isAuthenticated ? [{ to: '/shelf', label: 'My Shelf' }] : []),
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={[
                  'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  active(to)
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {label}
                {active(to) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </Link>
            ))}

            {/* divider */}
            <div className="h-px bg-white/6 my-1 mx-1" />

            {/* auth section */}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/3 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-600/50 border border-purple-400/30 flex items-center justify-center text-xs font-bold text-purple-200 flex-shrink-0">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 leading-none mb-0.5">Signed in as</p>
                    <p className="text-sm text-gray-200 font-medium">{user?.username}</p>
                  </div>
                  <div className="ml-auto text-gray-500 text-xs">Settings →</div>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-white text-center transition-all hover:opacity-90 active:scale-98"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}