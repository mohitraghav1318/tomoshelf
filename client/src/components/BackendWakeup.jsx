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
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">

                {/* Logo */}
                <div className="mb-8">
                    <span className="text-5xl">📚</span>
                    <h1 className="text-2xl font-bold text-white mt-3">
                        Tomo<span className="text-purple-400">Shelf</span>
                    </h1>
                </div>

                {status === 'waiting' && (
                    <>
                        {/* Status message — cycles through MESSAGES array */}
                        <p className="text-gray-300 text-sm mb-6 h-5 transition-all duration-500">
                            {MESSAGES[msgIndex]}
                        </p>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3 overflow-hidden">
                            <div
                                className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Elapsed time — reassures user something is happening */}
                        <p className="text-gray-600 text-xs">
                            {elapsed}s Server is waking up..
                        </p>
                    </>
                )}

                {status === 'ready' && (
                    <div className="flex flex-col items-center gap-3">
                        {/* Full progress bar */}
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full w-full transition-all duration-300" />
                        </div>
                        <p className="text-green-400 text-sm font-medium">
                            ✓ Server ready
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BackendWakeup;