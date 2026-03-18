import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, LogOut, ArrowLeft, Camera, Edit3, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Account Identity',
            icon: <User className="w-5 h-5 text-blue-500" />,
            items: [
                { label: 'Display Name', value: user?.username || 'Guest', editable: true },
                { label: 'Email Address', value: user?.email || 'N/A', editable: false }
            ]
        },
        {
            title: 'Security & Access',
            icon: <Shield className="w-5 h-5 text-blue-500" />,
            items: [
                { label: 'Security Password', value: '••••••••', action: 'Update' },
                { label: 'Dual-Factor Authentication', value: 'Inactive', action: 'Setup' }
            ]
        },
        {
            title: 'Preferences',
            icon: <Bell className="w-5 h-5 text-blue-500" />,
            items: [
                { label: 'Discovery Mode', value: 'Publicly Visible', type: 'toggle', active: true },
                { label: 'Annual Reading Goal', value: '12 Volumes', action: 'Modify' }
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-slate-950 font-sans text-slate-200">
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

                <div className="space-y-12">
                    {/* Simple Profile Header */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-lg">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-all">
                                <Camera size={14} />
                            </button>
                        </div>
                        
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
                            <p className="text-slate-500 text-sm">{user?.email}</p>
                        </div>

                        <button className="px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest transition-all">
                            <Edit3 size={14} className="inline mr-2" /> Edit Profile
                        </button>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-10">
                        {sections.map((section) => (
                            <div key={section.title} className="space-y-4">
                                <div className="flex items-center gap-3 px-2">
                                    {section.icon}
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">{section.title}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.items.map((item) => (
                                        <div key={item.label} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                                                <p className="text-slate-300 font-semibold">{item.value}</p>
                                            </div>
                                            {item.action && (
                                                <button className="text-[10px] font-bold text-blue-500 hover:text-white uppercase tracking-widest px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-600 transition-all">
                                                    {item.action}
                                                </button>
                                            )}
                                            {item.editable && (
                                                <ChevronRight className="text-slate-700" size={18} />
                                            )}
                                            {item.type === 'toggle' && (
                                                <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${item.active ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Logout */}
                    <div className="pt-10">
                        <button 
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="flex items-center justify-center gap-3 w-full p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500 transition-all group"
                        >
                            <LogOut className="w-5 h-5 text-red-500" />
                            <span className="font-bold text-red-500">Sign Out from TomoShelf</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
