import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { searchBooks, getRecommendations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getShelf } from '../services/shelfService';
import SkeletonCard from "../components/SkeletonCard";

/* ─── Particle Canvas Background ─────────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 90;
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particlesRef.current;
      const mouse = mouseRef.current;

      pts.forEach(p => {
        // mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += (dx / dist) * 0.15;
          p.vy += (dy / dist) * 0.15;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,140,255,${p.opacity})`;
        ctx.fill();
      });

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
};

/* ─── 3D Tilt Book Card ───────────────────────────────────────────────────── */
const TiltCard = ({ book, idx, onClick }) => {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 12;
    const rotX = -((y - cy) / cy) * 12;
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.04)`;
    el.style.filter = `drop-shadow(0 20px 30px rgba(139,92,246,0.35))`;
  };
  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    el.style.filter = 'none';
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(book.id)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="cursor-pointer"
      style={{
        transition: 'transform 0.15s ease, filter 0.3s ease',
        animationDelay: `${idx * 80}ms`,
        animation: 'cardReveal 0.6s ease-out forwards',
        opacity: 0,
      }}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 ring-1 ring-white/10">
        {book.thumbnail ? (
          <img
            src={book.thumbnail.replace('http://', 'https://')}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900 to-slate-900 text-4xl">📖</div>
        )}
        {/* Holographic sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        {/* Bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white px-2 py-1 rounded-md">View</span>
        </div>
        {/* Glow border on hover is handled by parent filter */}
      </div>
      <p className="text-white/90 font-bold text-xs line-clamp-1 hover:text-violet-300 transition-colors">{book.title}</p>
      <p className="text-white/30 text-[10px] mt-0.5 line-clamp-1">{book.authors?.[0] || 'Unknown'}</p>
    </div>
  );
};

/* ─── Animated counter ────────────────────────────────────────────────────── */
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-black text-white tracking-tight">{value}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recGenre, setRecGenre] = useState('');
  const [recLoading, setRecLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);
  const heroRef = useRef(null);

  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const results = await searchBooks(query);
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchRecommendations();
  }, [isAuthenticated, token]);

  const fetchRecommendations = async () => {
    setRecLoading(true);
    try {
      const shelf = await getShelf(token, null);
      const completed = shelf.filter((e) => e.status === 'completed');
      const allIds = shelf.map((e) => e.bookId);
      if (completed.length === 0) return;
      const { books, genre } = await getRecommendations(completed, allIds);
      setRecommendations(books);
      setRecGenre(genre);
    } catch (error) {
      console.error('Recommendations failed:', error);
    } finally {
      setRecLoading(false);
    }
  };

  const handleBookClick = (bookId) => navigate(`/book/${bookId}`);

  const genres = ['Manga', 'Fantasy', 'Self-Help', 'Sci-Fi', 'Romance', 'Classic'];

  const handleGenreClick = (genre) => {
    setActiveGenre(genre);
    handleSearch(genre);
  };

  /* parallax on hero orbs */
  useEffect(() => {
    const handleMouse = (e) => {
      const hero = heroRef.current;
      if (!hero) return;
      const { innerWidth: W, innerHeight: H } = window;
      const xPct = (e.clientX / W - 0.5) * 30;
      const yPct = (e.clientY / H - 0.5) * 30;
      hero.style.setProperty('--mx', `${xPct}px`);
      hero.style.setProperty('--my', `${yPct}px`);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 mt-24">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <>
      {/* ── Global keyframes injected once ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@700;800;900&display=swap');

        :root { --mx: 0px; --my: 0px; }

        .font-syne { font-family: 'Syne', sans-serif; }
        .font-serif-italic { font-family: 'Instrument Serif', serif; font-style: italic; }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(var(--mx), var(--my)) scale(1); }
          50%      { transform: translate(calc(var(--mx) + 20px), calc(var(--my) - 20px)) scale(1.07); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(calc(var(--mx)*-1), calc(var(--my)*-1)) scale(1); }
          50%      { transform: translate(calc(var(--mx)*-1 - 25px), calc(var(--my)*-1 + 15px)) scale(1.1); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 20px rgba(167,139,250,0.4), 0 0 60px rgba(167,139,250,0.2); }
          50%      { text-shadow: 0 0 40px rgba(167,139,250,0.7), 0 0 100px rgba(167,139,250,0.35); }
        }
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.8) translateY(-4px); }
          60%  { transform: scale(1.05) translateY(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes heroWords {
          from { opacity: 0; transform: translateY(32px) skewY(2deg); }
          to   { opacity: 1; transform: translateY(0) skewY(0); }
        }
        @keyframes subFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes genrePop {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanBar {
          0%,100% { transform: scaleX(0); transform-origin: left; }
          50%      { transform: scaleX(1); transform-origin: left; }
          50.001%  { transform-origin: right; }
        }
        @keyframes recTitle {
          from { opacity:0; transform: translateX(-20px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%     { transform: translateY(-14px) rotate(1.5deg); }
          66%     { transform: translateY(8px) rotate(-1deg); }
        }

        .animate-orb1 { animation: orb1 8s ease-in-out infinite; }
        .animate-orb2 { animation: orb2 10s ease-in-out infinite; }
        .animate-glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .animate-badge-pop { animation: badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .animate-hero-words { animation: heroWords 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .animate-sub-fade { animation: subFade 0.8s ease-out 0.7s both; }
        .animate-rec-title { animation: recTitle 0.7s ease-out both; }

        .shimmer-text {
          background: linear-gradient(90deg, #c4b5fd 0%, #f0e6ff 40%, #a78bfa 60%, #c4b5fd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .glass-search {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .genre-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .genre-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .genre-btn:hover::before, .genre-btn.active::before { opacity: 1; }
        .genre-btn:hover { transform: translateY(-3px) scale(1.05); border-color: rgba(139,92,246,0.6) !important; }

        .rec-card-wrap:hover .rec-glow { opacity: 1; }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          mix-blend-mode: overlay;
        }

        .hero-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(139,92,246,0.02) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.4;
        }

        .float-deco { animation: float 7s ease-in-out infinite; }
        .float-deco-2 { animation: float 9s ease-in-out infinite reverse; animation-delay: -3s; }
      `}</style>

      <div className="min-h-screen pt-24 px-4" style={{ background: '#07060f' }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative min-h-[72vh] flex flex-col items-center justify-center mb-24 rounded-[2.5rem] overflow-hidden"
        >
          {/* Deep space background */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #120b2e 0%, #07060f 70%)' }} />

          {/* Particle canvas */}
          <ParticleCanvas />

          {/* Scanlines texture */}
          <div className="hero-scanline" />
          <div className="absolute inset-0 noise-overlay pointer-events-none" style={{ zIndex: 2 }} />

          {/* Parallax orbs */}
          <div className="animate-orb1 absolute top-[-80px] left-[-80px] w-[550px] h-[550px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)', zIndex: 1, filter: 'blur(10px)' }} />
          <div className="animate-orb2 absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)', zIndex: 1, filter: 'blur(10px)' }} />

          {/* Floating decorative glyphs */}
          <div className="float-deco absolute top-16 right-16 text-6xl pointer-events-none select-none" style={{ opacity: 0.07, zIndex: 2 }}>⟁</div>
          <div className="float-deco-2 absolute bottom-24 left-16 text-5xl pointer-events-none select-none" style={{ opacity: 0.06, zIndex: 2 }}>◈</div>

          {/* CONTENT */}
          <div className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6" style={{ zIndex: 10 }}>

            {/* Badge */}
            <div className="animate-badge-pop inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/50 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
              </span>
              <span className="font-syne text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300">Next-Gen Reading Tracker</span>
            </div>

            {/* Hero headline */}
            <div className="overflow-hidden mb-3">
              <h1 className="animate-hero-words font-syne text-[clamp(3rem,10vw,7.5rem)] font-black leading-[1.0] tracking-tight text-white">
                Your Books.
              </h1>
            </div>
            <div className="overflow-hidden mb-10">
              <h1 className="animate-hero-words font-serif-italic shimmer-text text-[clamp(3rem,10vw,7.5rem)] leading-[1.1] tracking-tight" style={{ animationDelay: '0.15s' }}>
                Perfectly Shelved.
              </h1>
            </div>

            <p className="animate-sub-fade font-syne text-white/50 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed tracking-wide">
              Discover, organize, and track your literary universe—with the elegance it deserves.
            </p>

            {/* Search */}
            <div className="relative w-full max-w-2xl mb-12 group">
              <div className="glass-search rounded-[2rem] p-2 transition-all duration-500 group-hover:border-violet-500/30 group-hover:shadow-[0_0_60px_rgba(139,92,246,0.15)]">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Genre pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {genres.map((genre, i) => (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`genre-btn px-5 py-2 rounded-xl border font-syne text-xs font-bold uppercase tracking-widest ${activeGenre === genre ? 'active border-violet-500/60 text-violet-300 bg-violet-900/30' : 'border-white/8 text-white/40 bg-white/3 hover:text-violet-300'}`}
                  style={{ animation: `genrePop 0.5s ease-out ${0.8 + i * 0.07}s both` }}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-14 pt-10 border-t border-white/5 animate-sub-fade" style={{ animationDelay: '1.2s' }}>
              <StatPill value="2M+" label="Books Indexed" />
              <div className="w-px h-8 bg-white/10" />
              <StatPill value="50K+" label="Active Readers" />
              <div className="w-px h-8 bg-white/10" />
              <StatPill value="∞" label="Shelves Created" />
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto pb-24">
          <SearchResults books={books} loading={loading} onBookClick={handleBookClick} />

          {/* ── Recommendations ─────────────────────────────────────────────── */}
          {isAuthenticated && books.length === 0 && (
            <div className="mt-4">
              {recLoading ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="relative w-14 h-14 mb-5">
                    <div className="absolute inset-0 rounded-full border border-violet-500/20" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-violet-500" style={{ animation: 'spinSlow 1s linear infinite' }} />
                    <div className="absolute inset-2 rounded-full border-t border-indigo-400/50" style={{ animation: 'spinSlow 1.5s linear infinite reverse' }} />
                  </div>
                  <p className="font-syne text-sm font-bold uppercase tracking-widest text-white/30">Curating your universe…</p>
                </div>
              ) : recommendations.length > 0 ? (
                <div>
                  {/* Section header */}
                  <div className="flex items-end justify-between mb-10 px-1">
                    <div className="animate-rec-title">
                      <p className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-2">— Handpicked for You</p>
                      <h2 className="font-syne text-3xl md:text-4xl font-black text-white leading-tight">
                        Reads that <span className="shimmer-text">resonate</span>
                      </h2>
                      <p className="text-white/30 text-sm mt-2 font-medium">
                        From your love of <span className="text-violet-400">{recGenre}</span>
                      </p>
                    </div>
                    <button
                      onClick={fetchRecommendations}
                      className="font-syne text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-violet-400 transition-colors border border-white/8 hover:border-violet-500/40 px-4 py-2 rounded-xl"
                    >
                      Refresh ↺
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {recommendations.map((book, idx) => (
                      <TiltCard key={book.id} book={book} idx={idx} onClick={handleBookClick} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ── Auth CTA ─────────────────────────────────────────────────────── */}
          {!isAuthenticated && books.length === 0 && (
            <div
              className="mt-12 relative overflow-hidden rounded-[2rem] p-16 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(67,56,202,0.1) 50%, rgba(109,40,217,0.08) 100%)',
                border: '1px solid rgba(139,92,246,0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* BG glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />

              <div className="relative z-10">
                <div className="inline-block mb-6 text-5xl" style={{ filter: 'drop-shadow(0 0 24px rgba(167,139,250,0.5))' }}>📚</div>
                <h3 className="font-syne text-3xl md:text-4xl font-black text-white mb-4">
                  Your reading legacy<br /><span className="shimmer-text">starts today.</span>
                </h3>
                <p className="text-white/40 text-base mb-10 max-w-sm mx-auto leading-relaxed">
                  Join thousands of readers tracking their literary journey — one shelf at a time.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="font-syne px-10 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }}
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="font-syne px-10 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white/60 hover:text-white transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/20"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;