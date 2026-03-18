import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bell, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Profile',
            icon: <User className="w-5 h-5 text-purple-400" />,
            items: [
                { label: 'Username', value: user?.username || 'Guest' },
                { label: 'Email', value: user?.email || 'N/A' }
            ]
        },
        {
            title: 'Account',
            icon: <Shield className="w-5 h-5 text-blue-400" />,
            items: [
                { label: 'Password', value: '••••••••', action: 'Change' },
                { label: 'Two-Factor Authentication', value: 'Disabled', action: 'Enable' }
            ]
        },
        {
            title: 'Preferences',
            icon: <Bell className="w-5 h-5 text-indigo-400" />,
            items: [
                { label: 'Public Profile', value: 'Enabled', type: 'toggle' },
                { label: 'Reading Goal', value: '12 books / year', action: 'Edit' }
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-950">
            <div className="max-w-3xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-2 leading-tight">Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your account preferences and profile</p>
                </header>

                <div className="space-y-6">
                    {/* User Hero Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-white/10 rounded-3xl p-8 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-purple-900/40 border-4 border-white/10">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
                            <p className="text-purple-300/70 text-sm font-medium">TomoShelf Member since 2024</p>
                        </div>
                        {/* Background glass effect blob */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />
                    </div>

                    <div className="grid gap-6">
                        {sections.map((section) => (
                            <div key={section.title} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                                    {section.icon}
                                    <h3 className="font-bold text-white">{section.title}</h3>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {section.items.map((item) => (
                                        <div key={item.label} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                                <p className="text-white font-medium">{item.value}</p>
                                            </div>
                                            {item.action && (
                                                <button className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors px-4 py-2 rounded-lg hover:bg-purple-500/10">
                                                    {item.action}
                                                </button>
                                            )}
                                            {item.type === 'toggle' && (
                                                <div className="w-10 h-6 bg-purple-600 rounded-full relative">
                                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <button 
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-bold w-full justify-center"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out of TomoShelf
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
