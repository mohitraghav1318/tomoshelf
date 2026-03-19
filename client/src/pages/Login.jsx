import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, verify2FALogin } from '../services/authService';
import { LogIn, AlertCircle, X } from 'lucide-react';

/* ─── Modal Component for OTP ───────────────────────────────────────────── */
const OTPModal = ({ isOpen, onClose, onVerify, loading, error }) => {
    const [otp, setOtp] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-950 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Two-Factor Authentication</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    A 6-digit verification code has been sent to your email. Please enter it below to continue.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-xs font-medium justify-center">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <input
                            type="text"
                            maxLength={6}
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="000000"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-red-500 focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-800 placeholder:tracking-normal placeholder:text-sm"
                        />
                    </div>

                    <button
                        onClick={() => onVerify(otp)}
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs"
                    >
                        {loading ? 'Verifying...' : 'Complete Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2FA State
    const [show2FA, setShow2FA] = useState(false);
    const [tempUserId, setTempUserId] = useState(null);
    const [faLoading, setFaLoading] = useState(false);
    const [faError, setFaError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser(email, password);
            
            if (data.twoFactorRequired) {
                setTempUserId(data.userId);
                setShow2FA(true);
                setLoading(false);
                return;
            }

            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async (otp) => {
        setFaLoading(true);
        setFaError('');
        try {
            const data = await verify2FALogin(tempUserId, otp);
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setFaError(err.message);
        } finally {
            setFaLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-600 p-3 rounded-full shadow-lg shadow-red-600/20">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight italic">Welcome Back</h2>
                    <p className="text-slate-500 font-medium text-sm">Continue your reading journey</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-neutral-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-3xl -mr-12 -mt-12 group-hover:bg-red-600/10 transition-all duration-500"></div>
                    
                    <div className="space-y-6 relative z-10">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:border-red-500 transition-all font-medium"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:border-red-500 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Authenticating...' : 'Login to Shelf'}
                        </button>
                    </div>
                </form>

                {/* Signup Link */}
                <p className="text-center text-slate-500 mt-8 text-sm font-medium">
                    New to TomoShelf?{' '}
                    <Link to="/signup" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                        Create Account
                    </Link>
                </p>
            </div>

            {/* 2FA Modal */}
            <OTPModal
                isOpen={show2FA}
                onClose={() => setShow2FA(false)}
                onVerify={handleVerify2FA}
                loading={faLoading}
                error={faError}
            />
        </div>
    );
};

export default Login;