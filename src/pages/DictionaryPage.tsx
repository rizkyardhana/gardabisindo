import { useState } from 'react';
import { Search, Filter, Grid, List as ListIcon, MapPin, Hash, Bookmark, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignCard } from '@/src/components/SignCard';
import { CATEGORIES, REGIONS } from '@/src/constants';
import type { Sign } from '@/src/types';
import { cn } from '@/src/lib/utils';

export function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedRegion, setSelectedRegion] = useState('Nasional');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load signs from localStorage, fallback to default signs if empty
  const [localSigns] = useState<any[]>(() => {
    const saved = localStorage.getItem('garda_signs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const initialSigns = [
      { 
        id: 1, 
        word: 'Terima Kasih', 
        category: 'Harian', 
        region: 'Jakarta', 
        status: 'Approved', 
        informant: 'Rizki Ardhana', 
        date: '2024-01-10',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: '/bisindo_gesture_placeholder.png',
        description: 'Gerakan telapak tangan kanan menempel di dagu lalu diayunkan ke depan sebagai simbol penghormatan dan terima kasih.',
        likes: 124,
        bookmarks: 45
      },
      { 
        id: 2, 
        word: 'Rumah', 
        category: 'Harian', 
        region: 'Yogyakarta', 
        status: 'Approved', 
        informant: 'Ahmad Hadi', 
        date: '2024-01-12',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: '/bisindo_gesture_placeholder.png',
        description: 'Ujung-ujung jari kedua tangan dipertemukan di atas kepala membentuk sudut segitiga menyerupai atap rumah.',
        likes: 89,
        bookmarks: 23
      },
      { 
        id: 3, 
        word: 'Makan', 
        category: 'Harian', 
        region: 'Bali', 
        status: 'Approved', 
        informant: 'Ni Wayan', 
        date: '2024-01-15',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: '/bisindo_gesture_placeholder.png',
        description: 'Jari-jari tangan dominan dikuncupkan lalu diarahkan ke depan mulut berulang-ulang seperti menyuap makanan.',
        likes: 210,
        bookmarks: 78
      },
      { 
        id: 4, 
        word: 'Belajar', 
        category: 'Pendidikan', 
        region: 'Nasional', 
        status: 'Approved', 
        informant: 'Budi Santoso', 
        date: '2024-01-20',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: '/bisindo_gesture_placeholder.png',
        description: 'Kedua telapak tangan menghadap ke atas dan digerakkan seperti membaca buku.',
        likes: 340,
        bookmarks: 120
      },
      { 
        id: 5, 
        word: 'Telepon', 
        category: 'Teknologi', 
        region: 'Nasional', 
        status: 'Approved', 
        informant: 'Siti Aminah', 
        date: '2024-01-22',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: '/bisindo_gesture_placeholder.png',
        description: 'Ibu jari dan kelingking menempel di telinga dan mulut melambangkan gagang telepon.',
        likes: 156,
        bookmarks: 32
      },
      { 
        id: 6, 
        word: 'Dokter', 
        category: 'Medis', 
        region: 'Sumatera Barat', 
        status: 'Approved', 
        informant: 'Dewi Lestari', 
        date: '2024-01-25',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: '/bisindo_gesture_placeholder.png',
        description: 'Tangan menempel di pergelangan tangan seolah mengecek denyut nadi.',
        likes: 198,
        bookmarks: 56
      }
    ];
    localStorage.setItem('garda_signs', JSON.stringify(initialSigns));
    return initialSigns;
  });

  // Map to Sign interface and filter only Approved ones
  const mappedSigns: Sign[] = localSigns
    .filter((s: any) => !s.status || s.status === 'Approved')
    .map((s: any) => ({
      id: String(s.id),
      word: s.word,
      category: s.category,
      region: s.region,
      videoUrl: s.videoUrl || '#',
      thumbnailUrl: s.thumbnailUrl || '/bisindo_gesture_placeholder.png',
      description: s.description || '',
      informantId: s.informantId || 'inf-default',
      likes: s.likes || 0,
      bookmarks: s.bookmarks || 0,
      createdAt: s.date || s.createdAt || new Date().toISOString().split('T')[0]
    }));

  const filteredSigns = mappedSigns.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || sign.category === selectedCategory;
    const matchesRegion = selectedRegion === 'Nasional' || sign.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      {/* Header & Search */}
      <section className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Kamus Digital <span className="text-garda-red">BISINDO</span></h1>
              <p className="text-slate-500">Jelajahi ribuan arsip kosa isyarat dari berbagai daerah di Indonesia.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-garda-red" : "text-slate-400")}
               >
                 <Grid className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white shadow-sm text-garda-red" : "text-slate-400")}
               >
                 <ListIcon className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Cari kata (contoh: Terima Kasih, Rumah, Makan...)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-garda-red/20 transition-all outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="flex gap-4">
                <div className="relative group">
                  <select 
                    className="appearance-none bg-slate-100 px-6 py-4 pr-12 rounded-2xl font-semibold border-none outline-none focus:ring-2 focus:ring-garda-red/20 cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="Semua">Semua Kategori</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative group">
                  <select 
                    className="appearance-none bg-slate-100 px-6 py-4 pr-12 rounded-2xl font-semibold border-none outline-none focus:ring-2 focus:ring-garda-red/20 cursor-pointer"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="Nasional">Semua Wilayah</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredSigns.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className={cn(
                  "grid gap-8",
                  viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredSigns.map((sign) => (
                  <SignCard 
                    key={sign.id} 
                    sign={sign} 
                    className={viewMode === 'list' ? "flex flex-row aspect-auto h-48" : ""} 
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold mb-2">Tidak ditemukan kosa isyarat</h3>
               <p className="text-slate-500">Coba gunakan kata kunci lain atau ubah filter pencarian.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
