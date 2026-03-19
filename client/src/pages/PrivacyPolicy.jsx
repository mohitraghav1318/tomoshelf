import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Lock size={12} />
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                        At TomoShelf, your privacy is our priority. We are committed to protecting your literary data.
                    </p>
                </header>

                <div className="space-y-10 bg-neutral-950 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-xl">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-white mb-2">
                            <Eye className="text-red-500" size={20} />
                            <h2 className="text-xl font-bold">Information Collection</h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            We collect minimal data necessary to provide a personalized reading experience. This includes your account name, email for authentication, and your curated reading lists.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-white mb-2">
                            <Shield className="text-red-500" size={20} />
                            <h2 className="text-xl font-bold">Data Security</h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            Your shelf data is encrypted and stored securely. We do not sell your personal reading habits to third parties. Your library is yours alone.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-white mb-2">
                            <FileText className="text-red-500" size={20} />
                            <h2 className="text-xl font-bold">Your Rights</h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            You have the right to export or delete your account at any time. We believe in data portability and user control over personal information.
                        </p>
                    </section>
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-900 text-center">
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Last Updated: March 2024</p>
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
