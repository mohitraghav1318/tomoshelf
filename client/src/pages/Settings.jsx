import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, LogOut, ArrowLeft, Camera, Edit3, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as settingsService from '../services/settingsService';

/* ─── Modal Component for OTP ───────────────────────────────────────────── */
const OTPModal = ({ isOpen, onClose, onVerify, title, description, loading, error, otpLength = 6 }) => {
    const [otp, setOtp] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-950 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">{description}</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-xs font-medium">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <input
                            type="text"
                            maxLength={otpLength}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder={`${otpLength} digit code`}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-red-500 focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-800 placeholder:tracking-normal placeholder:text-sm"
                        />
                    </div>

                    <button
                        onClick={() => onVerify(otp)}
                        disabled={loading || otp.length !== otpLength}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20"
                    >
                        {loading ? 'Verifying...' : 'Confirm Verification'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Settings = () => {
    const { user, token, logout, setUser } = useAuth();
    const navigate = useNavigate();

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // 2FA State
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [faLoading, setFaLoading] = useState(false);
    const [faError, setFaError] = useState('');

    // Delete State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [delError, setDelError] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            const data = await settingsService.updateProfile(token, { username, email });
            setUser({ ...user, username: data.user.username, email: data.user.email });
            setIsEditing(false);
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSetup2FA = async () => {
        setFaLoading(true);
        setFaError('');
        try {
            await settingsService.setup2FA(token);
            setShow2FAModal(true);
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setFaLoading(false);
        }
    };

    const handleVerify2FA = async (otp) => {
        setFaLoading(true);
        setFaError('');
        try {
            const data = await settingsService.verify2FA(token, otp);
            setUser({ ...user, twoFactorEnabled: true });
            setShow2FAModal(false);
            setMsg({ type: 'success', text: 'Two-Factor Authentication enabled!' });
        } catch (err) {
            setFaError(err.message);
        } finally {
            setFaLoading(false);
        }
    };

    const handleToggle2FA = async () => {
        if (user.twoFactorEnabled) {
            try {
                await settingsService.disable2FA(token);
                setUser({ ...user, twoFactorEnabled: false });
                setMsg({ type: 'success', text: '2FA has been disabled.' });
            } catch (err) {
                setMsg({ type: 'error', text: err.message });
            }
        } else {
            handleSetup2FA();
        }
    };

    const handleDeleteRequest = async () => {
        setDelLoading(true);
        setDelError('');
        try {
            await settingsService.requestDeleteAccount(token);
            setShowDeleteModal(true);
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setDelLoading(false);
        }
    };

    const handleConfirmDelete = async (otp) => {
        setDelLoading(true);
        setDelError('');
        try {
            await settingsService.confirmDeleteAccount(token, otp);
            logout();
            navigate('/');
        } catch (err) {
            setDelError(err.message);
        } finally {
            setDelLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-black font-sans text-slate-200">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12"
                >
                    <ArrowLeft size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                </button>

                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Settings</h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide">Manage your account and preferences</p>
                </header>

                {msg.text && (
                    <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                        msg.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                        {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-semibold">{msg.text}</span>
                    </div>
                )}

                <div className="space-y-12">
                    {/* Profile Header */}
                    <div className="bg-neutral-950 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-4xl font-black text-white shadow-lg overflow-hidden">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
                            <p className="text-slate-500 text-sm">{user?.email}</p>
                        </div>

                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                <Edit3 size={14} className="inline mr-2" /> Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Edit Profile Form */}
                    {isEditing && (
                        <div className="bg-neutral-950 border border-red-500/30 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Account Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Security */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <Shield className="w-5 h-5 text-red-500" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Security & Access</h3>
                            </div>
                            
                            <div className="p-6 rounded-2xl bg-neutral-950 border border-slate-800 hover:border-red-500/20 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Dual-Factor Verification</p>
                                        <p className="text-slate-300 font-semibold">{user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                    <div 
                                        onClick={handleToggle2FA}
                                        className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${user?.twoFactorEnabled ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-800'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${user?.twoFactorEnabled ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Extra security for your library. Requires an email OTP every time you log in from a new device.</p>
                            </div>
                        </div>

                        {/* Dangerous Zone */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2 text-red-500">
                                <AlertCircle className="w-5 h-5" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Danger Zone</h3>
                            </div>
                            
                            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-all space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest mb-1">Permanent Removal</p>
                                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Once you delete your account, there is no going back. All your data will be permanently wiped.</p>
                                </div>
                                <button 
                                    onClick={handleDeleteRequest}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={14} /> Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Simple Logout */}
                    <div className="pt-10">
                        <button 
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="flex items-center justify-center gap-3 w-full p-6 rounded-2xl bg-neutral-950 border border-slate-800 hover:bg-red-500/5 hover:border-red-500/30 transition-all group"
                        >
                            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" />
                            <span className="font-bold text-slate-400 group-hover:text-red-500 transition-colors">Sign Out from TomoShelf</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Modals */}
            <OTPModal
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onVerify={handleVerify2FA}
                title="Enable 2FA"
                description={`Verification code sent to ${user?.email}. Enter the 6-digit code to enable extra security.`}
                loading={faLoading}
                error={faError}
                otpLength={6}
            />

            <OTPModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onVerify={handleConfirmDelete}
                title="Confirm Account Deletion"
                description="Final step. Enter the 4-digit security code sent to your email to permanently delete your account. This action is irreversible."
                loading={delLoading}
                error={delError}
                otpLength={4}
            />
        </div>
    );
};

export default Settings;
