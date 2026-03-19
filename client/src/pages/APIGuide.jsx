import { Code2, Cpu, Globe, Key, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const APIGuide = () => {
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

                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Code2 size={12} />
                        Developer API
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Power your Apps</h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
                        Integrate TomoShelf's powerful book tracking engine into your own projects.
                    </p>
                </header>

                <div className="bg-neutral-950 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                        {[
                            { icon: <Key size={20} />, title: 'Auth', desc: 'Secure JWT authentication.' },
                            { icon: <Globe size={20} />, title: 'RESTful', desc: 'Clean JSON-based API.' },
                            { icon: <Cpu size={20} />, title: 'Real-time', desc: 'Instant data sync.' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-4">
                                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 w-fit">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-10 border-t border-slate-800">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Sample Request</h4>
                        <div className="bg-black rounded-xl p-6 font-mono text-sm border border-slate-800">
                            <pre className="text-red-400 overflow-x-auto">
{`curl -X GET "https://api.tomoshelf.com/v1/shelf" \\
     -H "Authorization: Bearer YOUR_TOKEN"`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APIGuide;
