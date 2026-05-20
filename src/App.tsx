/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { DictionaryPage } from './pages/DictionaryPage';
import { DetailSignPage } from './pages/DetailSignPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RequireAuth, RequireRole } from './routes/RequireAuth';

export default function App() {
  useEffect(() => {
    const updateFavicon = () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height) || 128;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            
            // Apply 1.6x scale zoom (matching scale-160)
            const scale = 1.6;
            const drawSize = size * scale;
            const offset = (size - drawSize) / 2;
            ctx.drawImage(img, offset, offset, drawSize, drawSize);
            
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.type = 'image/png';
            link.href = canvas.toDataURL('image/png');
          }
        } catch (canvasError) {
          console.error("Gagal memotong favicon bulat:", canvasError);
        }
      };
      img.src = '/profil.jpg';
    };

    updateFavicon();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="dictionary" element={<DictionaryPage />} />
          <Route path="sign/:id" element={<DetailSignPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard" element={<RequireRole roles={['admin', 'informant']}><DashboardPage /></RequireRole>} />
          <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="profile/:id" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        </Route>
      </Routes>
    </Router>
  );
}

