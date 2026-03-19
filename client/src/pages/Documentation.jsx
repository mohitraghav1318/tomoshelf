import { BookOpen, Map, Zap, Terminal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-black font-sans text-slate-200">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12"
                >
                    <ArrowLeft size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                </button>

                <header className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Documentation</h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
                        Everything you need to master your TomoShelf experience.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: <Zap size={24} />, title: 'Quick Start', desc: 'Learn how to import your existing book collections and set up your first virtual shelf.' },
                        { icon: <BookOpen size={24} />, title: 'Shelf Management', desc: 'Master the art of organizing with custom categories, status tracking, and filtering.' },
                        { icon: <Map size={24} />, title: 'Roadmap', desc: "See what's coming next, from social sharing to AI recommendations." },
                        { icon: <Terminal size={24} />, title: 'Keyboard Shortcuts', desc: 'Navigate your library like a pro with our productivity-focused hotkeys.' }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-neutral-950 border border-slate-800 hover:border-red-500 transition-all shadow-lg group">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Documentation;
