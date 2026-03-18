import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto pt-20 pb-10 px-6 overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black text-white tracking-tighter">
              Tomo<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Shelf</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Elevate your reading journey. Track your collection, discover new worlds, and organize your literary universe with style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white/50 inline-block">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2 group">Search <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link to="/shelf" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2 group">My Shelf <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link to="/settings" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Settings</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white/50 inline-block">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">API Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors text-xs inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">v2.0 Beta</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white/50 inline-block">Get In Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hello@tomoshelf.com" className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <Mail size={16} />
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">hello@tomoshelf.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-xs font-medium">
            © {currentYear} TomoShelf. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            Built with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> by 
            <span className="text-gray-300 font-bold hover:text-purple-400 cursor-pointer transition-colors">TomoTeam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
