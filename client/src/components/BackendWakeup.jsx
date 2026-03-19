import { useState, useEffect, useRef } from 'react';

const MESSAGES = [
    'Warming up the server…',
    'Preparing your shelf…',
    'Loading your reading world…',
    'Almost there…',
];

const API_URL = import.meta.env.VITE_API_URL;
const MAX_WAIT_MS = 60000; 
const POLL_MS = 3000;

const BackendWakeup = ({ children }) => {
    const [status, setStatus] = useState('checking');
    const [progress, setProgress] = useState(0);
    const [msgIndex, setMsgIndex] = useState(0);
    const [showApp, setShowApp] = useState(false);

    const startTime = useRef(Date.now());
    const timers = useRef([]);

    const ping = async () => {
        try {
            const res = await fetch(`${API_URL}/health`);
            if (res.ok) {
                handleReady();
                return true;
            }
        } catch (e) {}
        return false;
    };

    const handleReady = () => {
        timers.current.forEach(timer => clearInterval(timer));
        setProgress(100);
        setStatus('ready');
        setTimeout(() => setShowApp(true), 500);
    };

    useEffect(() => {
        ping().then(awake => {
            if (awake) return;
            setStatus('waiting');

            const poll = setInterval(() => {
                if (Date.now() - startTime.current > MAX_WAIT_MS) {
                    handleReady();
                } else {
                    ping();
                }
            }, POLL_MS);

            const prog = setInterval(() => {
                setProgress(p => p < 90 ? p + 2 : p + 0.1);
            }, 500);

            const msg = setInterval(() => {
                setMsgIndex(i => (i + 1) % MESSAGES.length);
            }, 3000);

            timers.current = [poll, prog, msg];
        });

        return () => timers.current.forEach(timer => clearInterval(timer));
    }, []);

    if (showApp) return <div className="animate-in fade-in duration-500">{children}</div>;
    if (status === 'checking') return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md text-center space-y-8">
                <div className="text-5xl mb-4">📚</div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                    Tomo<span className="text-red-500">Shelf</span>
                </h1>
                
                <div className="space-y-4">
                    <p className="text-slate-400 font-medium h-6">{MESSAGES[msgIndex]}</p>
                    <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-red-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>Status: {status === 'ready' ? 'Ready' : 'Waking up'}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackendWakeup;