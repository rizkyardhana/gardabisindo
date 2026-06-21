/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './views/LandingPage';
import { DictionaryPage } from './views/DictionaryPage';
import { DetailSignPage } from './views/DetailSignPage';
import { DashboardPage } from './views/DashboardPage';
import { ProfilePage } from './views/ProfilePage';
import { LoginPage } from './views/LoginPage';
import { RequireAuth, RequireRole } from './routes/RequireAuth';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  useEffect(() => {
    const applyAccessibility = () => {
      try {
        const saved = localStorage.getItem('user_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          // High Contrast
          if (parsed.highContrast) {
            document.documentElement.classList.add('high-contrast');
          } else {
            document.documentElement.classList.remove('high-contrast');
          }
          
          // Text Size
          document.documentElement.classList.remove('text-size-large', 'text-size-xlarge');
          if (parsed.textSize === 'large') {
            document.documentElement.classList.add('text-size-large');
          } else if (parsed.textSize === 'xlarge') {
            document.documentElement.classList.add('text-size-xlarge');
          }
        }
      } catch (e) {
        console.error('Failed to apply accessibility settings:', e);
      }
    };

    applyAccessibility();

    window.addEventListener('accessibilityUpdate', applyAccessibility);
    window.addEventListener('storage', applyAccessibility);

    return () => {
      window.removeEventListener('accessibilityUpdate', applyAccessibility);
      window.removeEventListener('storage', applyAccessibility);
    };
  }, []);

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
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

