import { Menu, X, Book, Home, LayoutDashboard, User, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('auth_token'));
  }, [pathname]);

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Kamus', path: '/dictionary', icon: Book },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3',
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-garda-red rounded-full flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform overflow-hidden ring-1 ring-white/20">
            <img
              src="/profil.jpg"
              alt="Logo profil"
              className="w-full h-full object-cover scale-160"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight">
              GARDA <span className="text-garda-red">BISINDO</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">
              Arsip &amp; Dokumentasi
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                pathname === link.path
                  ? 'bg-white text-garda-red shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="hidden sm:flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white text-garda-red border border-slate-200 hover:bg-red-50 transition-all"
            >
              Masuk
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_role');
                setIsAuthenticated(false);
                window.location.href = '/';
              }}
              className="hidden sm:flex items-center px-4 py-2 text-sm font-medium bg-white text-garda-red border border-slate-200 hover:bg-red-50 transition-all cursor-pointer"
            >
              Keluar
            </button>
          )}

          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl transition-all',
                    pathname === link.path
                      ? 'bg-garda-red/5 text-garda-red font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <hr className="my-2 border-slate-100" />

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-slate-200 text-garda-red rounded-xl font-bold hover:bg-red-50 transition-all"
                >
                  Masuk
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_role');
                    setIsAuthenticated(false);
                    setIsMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-slate-200 text-garda-red rounded-xl font-bold hover:bg-red-50 transition-all cursor-pointer"
                >
                  Keluar
                </button>
              )}

              <Link
                to="/dictionary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-garda-red text-white rounded-xl font-bold mt-2"
              >
                Jelajahi Kamus
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
