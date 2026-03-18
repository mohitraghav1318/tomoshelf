import { useState, useEffect, useRef } from 'react';

// Messages that cycle during the wait — keeps it friendly, not alarming
const MESSAGES = [
    'Warming up the server…',
    'Brewing some coffee ☕',
    'Dusting off the bookshelves…',
    'Loading your reading world…',
    'Almost there, hang tight…',
    'Waking up from a nap 😴',
    'Good things take a moment…',
];

const API_URL = import.meta.env.VITE_API_URL;
const MAX_WAIT_MS = 70000; // 70s — Render can take up to 60s, give extra buffer
const POLL_MS = 3000;  // check every 3 seconds
const PROGRESS_INC = 1.2;   // how fast the bar creeps (%) per tick

const BackendWakeup = ({ children }) => {
    const [status, setStatus] = useState('checking'); // 'checking' | 'waiting' | 'ready'
    const [progress, setProgress] = useState(0);          // 0–100 for the progress bar
    const [msgIndex, setMsgIndex] = useState(0);          // which message to show
    const [elapsed, setElapsed] = useState(0);          // seconds since we started
    const [showApp, setShowApp] = useState(false);      // controls fade-in of real app

    const startTime = useRef(Date.now());
    const pollTimer = useRef(null);
    const progTimer = useRef(null);
    const msgTimer = useRef(null);
    const elapsedTimer = useRef(null);

    // ── ping the health endpoint ─────────────────────────────────────
    const ping = async () => {
        try {
            const res = await fetch(`${API_URL}/health`, {
                signal: AbortSignal.timeout(4000), // don't hang forever per request
            });
            if (res.ok) {
                handleReady();
                return true;
            }
        } catch {
            // server still sleeping — keep polling
        }
        return false;
    };

    // ── called when backend finally responds ─────────────────────────
    const handleReady = () => {
        // clear all timers
        clearInterval(pollTimer.current);
        clearInterval(progTimer.current);
        clearInterval(msgTimer.current);
        clearInterval(elapsedTimer.current);

        setProgress(100);
        setStatus('ready');

        // short pause so user sees the "Ready!" state, then fade in the app
        setTimeout(() => setShowApp(true), 800);
    };

    // ── start everything on mount ────────────────────────────────────
    useEffect(() => {
        // First ping — if backend is already awake (e.g. user refreshes mid-session)
        // this resolves immediately and users see zero loading screen
        ping().then((awake) => {
            if (awake) return;

            // Backend is sleeping — switch to waiting UI
            setStatus('waiting');

            // Poll every 3s
            pollTimer.current = setInterval(async () => {
                const now = Date.now();
                if (now - startTime.current > MAX_WAIT_MS) {
                    // Timeout — show error state but still let them in
                    clearInterval(pollTimer.current);
                    handleReady(); // let app render even if backend seems stuck
                }
                await ping();
            }, POLL_MS);

            // Crawl the progress bar — moves fast at first, slows near 90%
            // Never reaches 100% on its own — that only happens in handleReady
            progTimer.current = setInterval(() => {
                setProgress((p) => {
                    if (p >= 90) return p + 0.1;  // barely moves near the end
                    return Math.min(p + PROGRESS_INC, 90);
                });
            }, 400);

            // Cycle through messages every 4 seconds
            msgTimer.current = setInterval(() => {
                setMsgIndex((i) => (i + 1) % MESSAGES.length);
            }, 4000);

            // Tick the elapsed seconds counter
            elapsedTimer.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
            }, 1000);
        });

        return () => {
            // Cleanup on unmount
            clearInterval(pollTimer.current);
            clearInterval(progTimer.current);
            clearInterval(msgTimer.current);
            clearInterval(elapsedTimer.current);
        };
    }, []);

    // ── if backend was already awake, render children instantly ──────
    if (showApp) {
        return (
            <div
                style={{
                    animation: 'fadeIn 0.4s ease-in',
                }}
            >
                <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
                {children}
            </div>
        );
    }

    // ── still checking (first ping in flight) — blank screen ─────────
    if (status === 'checking') return null;

    // ── wake-up screen ────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/wakeup_bg.png" 
                    alt="Loading Background" 
                    className="w-full h-full object-cover opacity-40 mix-blend-lighten"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-gray-950/80 to-gray-950" />
            </div>

            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.33); opacity: 0; }
                    80%, 100% { transform: scale(1); opacity: 0; }
                }
                .animate-pulse-ring {
                    animation: pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }
                @keyframes shimmer-fast {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .shimmer-premium {
                    background: linear-gradient(90deg, rgba(168,85,247,0) 0%, rgba(168,85,247,0.5) 50%, rgba(168,85,247,0) 100%);
                    background-size: 200% auto;
                    animation: shimmer-fast 2s linear infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s ease-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>

            <div className="w-full max-w-xl text-center z-10 space-y-12">
                {/* Visual Anchor */}
                <div className="relative inline-flex flex-col items-center">
                    <div className="relative z-10 w-32 h-32 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-6xl shadow-2xl animate-float">
                        📚
                        {/* Recursive rings */}
                        <div className="absolute inset-0 rounded-[2rem] border-2 border-purple-500/30 animate-pulse-ring" />
                        <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-500/20 animate-pulse-ring [animation-delay:1s]" />
                    </div>
                </div>

                <div className="space-y-8 backdrop-blur-md bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <header>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
                            Tomo<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">Shelf</span>
                        </h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.4em] opacity-60">
                            Synchronizing your universe
                        </p>
                    </header>

                    {status === 'waiting' && (
                        <div className="space-y-10">
                            <div className="h-8 flex items-center justify-center">
                                <p className="text-xl font-medium text-white/90 animate-fade-in px-4">
                                    {MESSAGES[msgIndex]}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    {/* Shimmering layer */}
                                    <div className="absolute inset-0 shimmer-premium opacity-30" />
                                    {/* Main progress bar */}
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(124,58,237,0.6)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
                                        Backend Awakening
                                    </span>
                                    <span className="text-purple-400">{Math.round(progress)}%</span>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-4 py-2.5 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                                </div>
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                    Live Ping: {elapsed}s
                                </span>
                            </div>
                        </div>
                    )}

                    {status === 'ready' && (
                        <div className="animate-scale-in space-y-6">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 text-3xl shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce">
                                    ✓
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-black text-2xl tracking-tight">Access Granted</p>
                                    <p className="text-gray-500 text-sm font-medium">Entering your personal reading sanctuary...</p>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full w-full transition-all duration-700 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer subtle text */}
            <div className="absolute bottom-12 text-gray-600/50 text-[10px] font-black tracking-[0.6em] uppercase z-10 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5">
                Tomoshelf • Advanced Reading Experience
            </div>
        </div>
    );
};

export default BackendWakeup;