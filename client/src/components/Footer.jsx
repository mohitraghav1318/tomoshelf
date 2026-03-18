import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-black text-white tracking-tight">
              Tomo<span className="text-blue-500">Shelf</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Your personal library, simplified. Track your collection and discover new worlds.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-all"><Github size={18} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">Search</Link></li>
              <li><Link to="/browse" className="hover:text-blue-500 transition-colors">Browse</Link></li>
              <li><Link to="/shelf" className="hover:text-blue-500 transition-colors">My Shelf</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/docs" className="hover:text-blue-500 transition-colors">Documentation</Link></li>
              <li><Link to="/api-guide" className="hover:text-blue-500 transition-colors">API Guide</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Contact</h4>
            <p className="text-sm text-slate-500 mb-4 font-medium">Have questions? Reach out to us.</p>
            <a href="mailto:hello@tomoshelf.com" className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">
              hello@tomoshelf.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <p>© {currentYear} TomoShelf. All rights reserved.</p>
          <div className="flex items-center gap-2">
            Built with <Heart size={10} className="text-red-500 fill-red-500" /> by TomoTeam
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
