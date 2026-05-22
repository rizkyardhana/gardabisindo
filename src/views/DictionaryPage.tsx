import { useState } from 'react';
import { Search, Grid, List as ListIcon, Bookmark, Heart, ChevronDown, SlidersHorizontal, RotateCcw, Sparkles, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignCard } from '@/src/components/SignCard';
import { CATEGORIES, REGIONS } from '@/src/constants';
import type { Sign } from '@/src/types';
import { cn } from '@/src/lib/utils';

const HANDSHAPES = [
  'Telapak Terbuka',
  'Kepalan',
  'Jari Menunjuk',
  'Dua Jari / V',
  'Kuncup Jari',
  'Ibu Jari & Kelingking'
];

const LOCATIONS = [
  'Kepala / Wajah',
  'Dada / Badan',
  'Tangan / Lengan',
  'Ruang Netral'
];

export function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedRegion, setSelectedRegion] = useState('Nasional');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Visual filter state
  const [selectedHandshape, setSelectedHandshape] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showVisualFilter, setShowVisualFilter] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

  // Helper to map default handshape and location based on the sign's word (for localSigns)
  const getInitialParameters = (word: string) => {
    const w = word.toLowerCase();
    if (w.includes('terima kasih')) {
      return { handshape: 'Telapak Terbuka', location: 'Kepala / Wajah' };
    } else if (w.includes('rumah')) {
      return { handshape: 'Telapak Terbuka', location: 'Kepala / Wajah' };
    } else if (w.includes('makan')) {
      return { handshape: 'Kuncup Jari', location: 'Kepala / Wajah' };
    } else if (w.includes('belajar')) {
      return { handshape: 'Telapak Terbuka', location: 'Ruang Netral' };
    } else if (w.includes('telepon')) {
      return { handshape: 'Ibu Jari & Kelingking', location: 'Kepala / Wajah' };
    } else if (w.includes('dokter')) {
      return { handshape: 'Dua Jari / V', location: 'Tangan / Lengan' };
    }
    return { handshape: 'Telapak Terbuka', location: 'Ruang Netral' };
  };

  // Map to Sign interface and filter only Approved ones
  const mappedSigns: Sign[] = localSigns
    .filter((s: any) => !s.status || s.status === 'Approved')
    .map((s: any) => {
      const defaults = getInitialParameters(s.word);
      return {
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
        createdAt: s.date || s.createdAt || new Date().toISOString().split('T')[0],
        handshape: s.handshape || defaults.handshape,
        location: s.location || defaults.location
      };
    });

  // Voice Search / Speech to text handler
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung fitur Pencarian Suara.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const cleanedQuery = transcript.replace(/\.$/, '');
      setSearchQuery(cleanedQuery);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const filteredSigns = mappedSigns.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || sign.category === selectedCategory;
    const matchesRegion = selectedRegion === 'Nasional' || sign.region === selectedRegion;
    const matchesHandshape = !selectedHandshape || sign.handshape === selectedHandshape;
    const matchesLocation = !selectedLocation || sign.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesRegion && matchesHandshape && matchesLocation;
  });

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      {/* Header & Search */}
      <section className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2 font-display">Kamus Digital <span className="text-garda-red font-bold">BISINDO</span></h1>
              <p className="text-slate-500">Jelajahi ribuan arsip kosa isyarat dari berbagai daerah di Indonesia.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={cn("p-2 rounded-lg transition-all cursor-pointer", viewMode === 'grid' ? "bg-white shadow-sm text-garda-red" : "text-slate-400")}
               >
                 <Grid className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={cn("p-2 rounded-lg transition-all cursor-pointer", viewMode === 'list' ? "bg-white shadow-sm text-garda-red" : "text-slate-400")}
               >
                 <ListIcon className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder={isListening ? "Mendengarkan..." : "Cari kata (contoh: Terima Kasih, Rumah, Makan...)"}
                    className={cn(
                      "w-full pl-12 pr-12 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-garda-red/20 transition-all outline-none text-lg",
                      isListening && "ring-2 ring-garda-red/40 bg-red-50/20"
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={cn(
                      "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-garda-red hover:bg-slate-200/50 transition-all cursor-pointer",
                      isListening && "text-garda-red bg-red-50 animate-pulse"
                    )}
                    title="Cari dengan Suara (Speech-to-Sign)"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => setShowVisualFilter(!showVisualFilter)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all cursor-pointer border border-transparent shadow-sm",
                      showVisualFilter 
                        ? "bg-garda-red text-white hover:brightness-110 shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                    )}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter Visual</span>
                    {(selectedHandshape || selectedLocation) && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </button>

                  <div className="relative group">
                    <select 
                      className="appearance-none bg-slate-100 px-6 py-4 pr-12 rounded-2xl font-semibold border-none outline-none focus:ring-2 focus:ring-garda-red/20 cursor-pointer text-slate-700"
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
                      className="appearance-none bg-slate-100 px-6 py-4 pr-12 rounded-2xl font-semibold border-none outline-none focus:ring-2 focus:ring-garda-red/20 cursor-pointer text-slate-700"
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

            {/* Visual Parameter Filter Panel */}
            <AnimatePresence>
              {showVisualFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Sparkles className="w-5 h-5 text-garda-red" />
                        <h4 className="font-bold text-base">Pencarian Parameter Visual (Leksikografis)</h4>
                      </div>
                      {(selectedHandshape || selectedLocation) && (
                        <button
                          onClick={() => {
                            setSelectedHandshape(null);
                            setSelectedLocation(null);
                          }}
                          className="text-xs font-bold text-garda-red hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset Filter Visual
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Handshapes */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bentuk Tangan (Handshape)</h5>
                        <div className="flex flex-wrap gap-2">
                          {HANDSHAPES.map((shape) => {
                            const isSelected = selectedHandshape === shape;
                            return (
                              <button
                                key={shape}
                                onClick={() => setSelectedHandshape(isSelected ? null : shape)}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer",
                                  isSelected
                                    ? "bg-garda-red/10 border-garda-red/30 text-garda-red shadow-sm font-bold"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                )}
                              >
                                {shape}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Locations */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lokasi Gerakan (Location)</h5>
                        <div className="flex flex-wrap gap-2">
                          {LOCATIONS.map((loc) => {
                            const isSelected = selectedLocation === loc;
                            return (
                              <button
                                key={loc}
                                onClick={() => setSelectedLocation(isSelected ? null : loc)}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer",
                                  isSelected
                                    ? "bg-garda-red/10 border-garda-red/30 text-garda-red shadow-sm font-bold"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                )}
                              >
                                {loc}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 italic">
                      * Pencarian visual mencocokkan isyarat berdasarkan cara mempraktikkannya. Sangat berguna untuk Tuli dan penerjemah.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

