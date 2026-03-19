import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupUser } from '../services/authService';
import { UserPlus, AlertCircle } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await signupUser(username, email, password);
            signup(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-600 p-3 rounded-full shadow-lg shadow-red-600/20">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight italic">Join TomoShelf</h2>
                    <p className="text-slate-500 font-medium text-sm">Start tracking your library today</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="bg-neutral-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-3xl -mr-12 -mt-12 group-hover:bg-red-600/10 transition-all duration-500"></div>
                    
                    <div className="space-y-6 relative z-10">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:border-red-500 transition-all font-medium"
                                placeholder="johndoe"
                            />
                        </div>

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
                            <p className="text-[10px] text-slate-600 font-medium mt-1 ml-1 italic">Security minimum: 6 characters</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Creating account...' : 'Create My Shelf'}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <p className="text-center text-slate-500 mt-8 text-sm font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;