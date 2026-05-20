import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { motion } from 'motion/react';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-garda-red rounded-full flex items-center justify-center overflow-hidden ring-1 ring-white/20">
                <img
                  src="/profil.jpg"
                  alt="Logo profil"
                  className="w-full h-full object-cover scale-160"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl uppercase tracking-wider leading-none">
                  GARDA <span className="text-garda-red">BISINDO</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-medium opacity-60 mt-1">
                  Arsip &amp; Dokumentasi
                </span>
              </div>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Platform digital kolaboratif untuk pelestarian Bahasa Isyarat Indonesia (BISINDO) dan arsip dokumentasi kosa isyarat daerah di seluruh penjuru nusantara.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">
              Tautan Cepat
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kamus Digital
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Informan Kontributor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Badan Arsip Nasional
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">
              Hubungi Kami
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>Jakarta, Indonesia</li>
              <li>kontak@gardabisindo.org</li>
              <li>+62 812-3456-7890</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2026 GARDA BISINDO. “Save BISINDO, Save Our Culture”</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-white">
              Syarat &amp; Ketentuan
            </a>
            <a href="#" className="hover:text-white">
              Aksesibilitas
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


